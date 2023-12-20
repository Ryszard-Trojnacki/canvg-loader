# SVG to Canvas draw function loader for Webpack
Webpack plugin to load SVG files as CanvasRenderingContext2D draw function.
It uses [canvg](https://github.com/canvg/canvg) library for loading/parsing SVG files
but instead of rendering it to HTML5 canvas it returns a function with draw 
calls to [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).
Exported function can be used to draw SVG on any canvas.

