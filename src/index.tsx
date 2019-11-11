import Swiper, { SwipeOptions } from './swiper';
import React, { useRef, useEffect, useState } from 'react';
import './index.scss';

interface CarouselMainProps {
    children: React.ReactNode;
}

interface CarouselProps extends Partial<SwipeOptions>, CarouselMainProps {}

const cx = (...s: string[]) => s.filter(Boolean).join(' ');

const CarouselMain = React.memo(
    React.forwardRef<HTMLDivElement, CarouselMainProps>((props, ref) => {
        const { children } = props;
        return (
            <div ref={ref} className="carousel__main">
                {React.Children.map(children, (item, index) => {
                    if (!React.isValidElement(item)) {
                        return null;
                    }
                    return React.cloneElement(item, {
                        key: index,
                        className: cx(item.props.className, 'carousel__item')
                    });
                })}
            </div>
        );
    })
);

export default React.memo((props: CarouselProps) => {
    const { children, ...swipeOptions } = props;

    const swiper = useRef<Swiper | null>(null);
    const swiperRoot = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(swipeOptions.initialIndex);

    useEffect(() => {
        if (!swiper.current && swiperRoot.current) {
            swiper.current = new Swiper(swiperRoot.current, {
                ...swipeOptions,
                onPageChange: setCurrentIndex
            });
        }
    }, []);

    return (
        <div className="carousel">
            <CarouselMain ref={swiperRoot}>{children}</CarouselMain>
            <div className="carousel__dots">
                {React.Children.map(children, (_, index) => (
                    <span
                        className={cx(
                            'carousel__dot',
                            index === currentIndex ? 'carousel__dot--active' : ''
                        )}
                    />
                ))}
            </div>
        </div>
    );
});
