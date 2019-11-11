import React from 'react';
import { render } from 'react-dom';

import Carousel from '../src';
import './index.scss';

const images = [
    {
        src:
            'https://sf6-ttcdn-tos.pstatp.com/obj/temai/b3c4a37417f8cbc12c229991093cd2bd4a1d2c14www800-800'
    },
    { src: 'https://sf1-ttcdn-tos.pstatp.com/obj/temai/FtbjzBpdTKIhoYBA3qD0typJQa4xwww650-650' },
    {
        src:
            'https://sf3-ttcdn-tos.pstatp.com/img/temai/FsWGOgRYLdI7bXQhKapda_PGgmjtwww800-800~400x0.png'
    }
];

const Demo = () => (
    <Carousel>
        {images.map((image, index) => (
            <div
                key={index}
                className="demo-item"
                style={{ backgroundImage: 'url(' + image.src + ')' }}
            />
        ))}
    </Carousel>
)

render(<Demo />, document.getElementById('app'));
