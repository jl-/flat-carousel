enum Status {
    IDLE = 1,
    EASING = 2
}

type Easing = (n: number) => number;

interface Options {
    easing?: Easing;
    duration?: number;
}

/* eslint no-return-assign: 0, no-sequences: 0, no-param-reassign: 0 */
const outQunit = (n: number) => --n * n * n * n * n + 1;

export default class Tween {
    private _to: number = 0;

    private _from: number = 0;

    private _easing: Easing;

    private _duration: number;

    private status = Status.IDLE;

    private _raf: number | undefined;

    public constructor(options: Options = {}) {
        this.tick = this.tick.bind(this);

        this._easing = options.easing || outQunit;
        this._duration = options.duration || 300;
    }

    public from(value: number) {
        return (this._from = value), this;
    }

    public to(value: number) {
        return (this._to = value), this;
    }

    public duration(ms = 300) {
        return (this._duration = ms), this;
    }

    public stop(cb?: Function) {
        if (this._raf) {
            cancelAnimationFrame(this._raf);
            this._raf = undefined;
        }
        this.status = Status.IDLE;
        if (typeof cb === 'function') {
            cb(this._to, this._from);
        }
        return this;
    }

    public tick(iterate: Function, done?: Function) {
        let startTime: number;
        const { _from, _to, _easing, _duration } = this;
        const tick = (now: number) => {
            startTime = startTime || now;
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / _duration, 1);
            if (progress <= 1) {
                iterate(_from + (_to - _from) * _easing(progress));
            }
            if (this.status === Status.EASING) {
                if (progress >= 1) {
                    this.stop(done);
                } else {
                    this._raf = requestAnimationFrame(tick);
                }
            }
        };
        this.stop();
        this.status = Status.EASING;
        this._raf = requestAnimationFrame(tick);
    }
}
