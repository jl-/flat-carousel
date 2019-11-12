import Tween from './tween';
import { on, off } from './utils';

export interface SwipeOptions {
    initialIndex: number;
    transitionDuration: number;
    autoplay: boolean;
    autoplayInterval: number;
    infiniteLoop: boolean;
    onPageChange?(index: number): void;
}

interface TouchPoint {
    pageX: number;
    pageY: number;
    identifier?: number;
}

interface SwipeState {
    dx: number;
    _dx: number;
    x: number;
    y: number;
    touchId?: number;
    isScrolling?: boolean;
}

const swipeOptions: SwipeOptions = {
    initialIndex: 0,
    transitionDuration: 400,
    infiniteLoop: true,
    autoplay: true,
    autoplayInterval: 3000
};

const pristineSwipeState: SwipeState = {
    dx: 0,
    _dx: 0,
    x: 0,
    y: 0,
    touchId: undefined,
    isScrolling: undefined
};

export default class Swiper {
    public currentIndex: number;

    private root: HTMLElement;

    private slides: HTMLElement[];

    private options: SwipeOptions;

    private tween: Tween;

    private width: number;

    private positions: number[];

    private state: SwipeState;

    private autoplayTimer: NodeJS.Timeout | undefined;

    public constructor(root: HTMLElement, options?: Partial<SwipeOptions>) {
        this.root = root;
        this.width = root.offsetWidth;
        this.options = { ...swipeOptions, ...options };
        this.slides = Array.from(root.children) as HTMLElement[];
        this.positions = new Array(this.slides.length);
        this.currentIndex = this.getIndex(this.options.initialIndex);
        this.tween = new Tween({ duration: this.options.transitionDuration });
        this.state = { ...pristineSwipeState };

        if (this.slides.length < 2) {
            this.options.infiniteLoop = false;
        }

        if (!this.options.infiniteLoop) {
            this.options.autoplay = false;
        }

        for (let i = 0; i < this.slides.length; i++) {
            const slide = this.slides[i] as HTMLElement;
            slide.style.left = '0px';
            slide.style.width = `${this.width}px`;
            this.moveSlide(i, this.width);
        }

        if (this.slides.length > 1) {
            this.startAutoplay();
            on(root, 'touchstart', this.handleStart);
            on(root, 'mousedown', this.handleStart);
        }

        this.moveSlide(this.currentIndex, 0);
    }

    private getIndex(index: number) {
        const slides = this.root.children;
        return (index + slides.length) % slides.length;
    }

    private getNextIndex(dx: number) {
        const index = this.currentIndex + (dx > 0 ? -1 : dx < 0 ? 1 : 0);
        return this.options.infiniteLoop ? this.getIndex(index) : index;
    }

    private findTouch(event: Event, changed: boolean = false, touchId?: number): TouchPoint {
        const e = event as TouchEvent;
        if (!Boolean(e.touches || e.changedTouches)) {
            return {
                pageX: (event as MouseEvent).pageX,
                pageY: (event as MouseEvent).pageY,
                identifier: undefined
            };
        }
        const touches = changed ? e.changedTouches : e.touches;
        if (!touchId) {
            return touches[0];
        }
        return Array.from(touches).find(touch => touch.identifier === touchId) as TouchPoint;
    }

    private handleStart = (event: Event) => {
        const state = this.state;
        const touch = this.findTouch(event);
        this.state = {
            ...state,
            x: touch.pageX - state.dx,
            y: touch.pageY,
            touchId: touch.identifier
        };

        this.tween.stop();
        this.stopAutoplay();
        on(this.root, 'touchmove', this.handleMove, { passive: false });
        on(this.root, 'touchend', this.handleEnd);
        on(this.root, 'mousemove', this.handleMove, { passive: false });
        on(this.root, 'mouseup', this.handleEnd);
    };

    private handleMove = (event: Event) => {
        const touch = this.findTouch(event, false, this.state.touchId)
        if (!touch) {
            this.handleEnd(event);
            return;
        }

        const dx = touch.pageX - this.state.x;
        if (typeof this.state.isScrolling === 'undefined') {
            const dy = touch.pageY - this.state.y;
            this.state.isScrolling = Math.abs(dx) < Math.abs(dy);
        }

        if (!this.state.isScrolling) {
            event.preventDefault();
            this.translate(dx);
        }
    };

    private handleEnd = (event: Event) => {
        off(this.root, 'touchmove', this.handleMove);
        off(this.root, 'touchend', this.handleEnd);
        off(this.root, 'mousemove', this.handleMove);
        off(this.root, 'mouseup', this.handleEnd);

        const touch = this.findTouch(event, true, this.state.touchId);
        if (!touch) {
            return;
        }

        let dx = 0;
        const state = this.state;
        const nextIndex = this.getNextIndex(state.dx);

        if (this.slides[nextIndex] && state.dx * state._dx >= 0 && Math.abs(state.dx) >= 36) {
            dx = state.dx > 0 ? this.width : -this.width;
        }

        // prettier-ignore
        this.tween.from(this.state.dx).to(dx).tick(this.translate, this.onTweenEnd);
    };

    private moveSlide(idx: number, offset: number) {
        const index = this.getIndex(idx);
        const slide = this.slides[index] as HTMLElement;
        if (this.positions[index] !== offset) {
            this.positions[index] = offset;
            slide.style.webkitTransform = `translateX(${offset}px)`;
        }
    }

    private translate = (dx: number) => {
        this.state._dx = dx - this.state.dx;
        this.state.dx = dx;

        if (Math.abs(this.state.dx) > this.width) {
            const nextIndex = this.getNextIndex(this.state.dx);
            if (this.slides[nextIndex]) {
                this.changeCurrentIndex(nextIndex);
                this.state.dx = this.state.dx % this.width;
                this.state.x = (this.state.x + this.width) % this.width;
            }
        }

        const nextIndex = this.getNextIndex(this.state.dx);

        if (!this.slides[nextIndex]) {
            this.moveSlide(this.currentIndex, this.state.dx * 0.2);
            return;
        }

        this.moveSlide(this.currentIndex, this.state.dx);
        if (nextIndex !== this.currentIndex) {
            this.moveSlide(
                nextIndex,
                this.state.dx + (this.state.dx > 0 ? -this.width : this.width)
            );
        }

        for (let i = this.slides.length - 1; i >= 0; i--) {
            if (i !== nextIndex && i !== this.currentIndex) {
                this.moveSlide(i, this.width);
            }
        }
    };

    private changeCurrentIndex(index: number) {
        this.currentIndex = index;
        if (typeof this.options.onPageChange === 'function') {
            this.options.onPageChange(this.currentIndex);
        }
    }

    private onTweenEnd = (to: number) => {
        this.translate(to);
        this.state = { ...pristineSwipeState };
        this.changeCurrentIndex(this.getNextIndex(to));
        this.startAutoplay();
    };

    private startAutoplay() {
        if (!this.options.autoplay) {
            return;
        }

        this.autoplayTimer = setTimeout(() => {
            this.stopAutoplay();
            // prettier-ignore
            this.tween.from(0).to(-this.width).tick(this.translate, this.onTweenEnd);
        }, this.options.autoplayInterval);
    }

    private stopAutoplay() {
        if (this.autoplayTimer) {
            clearTimeout(this.autoplayTimer);
            this.autoplayTimer = undefined;
        }
    }
}
