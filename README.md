# SVG to Canvas draw function loader for Webpack
Webpack plugin to load SVG files as CanvasRenderingContext2D draw function.

It uses [canvg](https://github.com/canvg/canvg) library for loading/parsing SVG files
but instead of rendering it to HTML5 canvas it returns a function with draw 
calls to [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

Exported function can be used to draw SVG on any canvas.

# Usage

Add loader to your project
```bash
npm install --save-dev @rtprog/canvg-loader
```

Configure webpack to use canvg-loader for SVG files
```javascript
export default {
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: '@rtprog/canvg-loader',
            },
        ],
    },
}
```

Import SVG file and use it as draw function
```javascript
import image from './image.svg';

function drawImage(canvas) {
    const ctx = canvas.getContext('2d');
    image(ctx);
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    drawImage(canvas);
});
```
 