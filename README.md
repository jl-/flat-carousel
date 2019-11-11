
## FlatCarousel
> a tiny carousel component for react.

## Demo
```
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
