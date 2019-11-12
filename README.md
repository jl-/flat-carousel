
## FlatCarousel
> a tiny carousel component for react.


## [Demo](https://codesandbox.io/s/jolly-fog-671g5?fontsize=14)

## Features
- no dependency
- support autoplay
- support touch and mouse device
- transition done with raf and tweening.
- infinite loop without duplicating the first&last item

## Demo
```javascript
import Carousel from 'flat-carousel';

const images = [
    { src: 'some image' }
];

const MyCarousel = () => (
    <Carousel>
        {images.map((image, index) => (
            <div
                key={index}
                className="demo-item"
                style={{ backgroundImage: 'url(' + image.src + ')' }}
            />
        ))}
    </Carousel>
);
```

## Props
- `initialIndex?`: number, defaults to 0
- `transitionDuration?`: number, defaults to 400ms
- `autoplay?`: boolean, defaults to true
- `autoplayInterval?`: number, defaults to 3000ms
- `infiniteLoop?`: boolean, defaults to true
- `onPageChange?(index: number)`: void;
