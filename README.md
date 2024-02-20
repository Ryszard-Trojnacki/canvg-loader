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

# Usage in Gatsby
In order to use this loader in [Gatsby](https://www.gatsbyjs.com/) application You need to install is as
development dependency
```shell
npm install --save-dev @rtprog/canvg-loader
```
and configure Webpack. Configuring Webpack in Gatsby that is file `gatsby-node.js`:
```javascript
exports.onCreateWebpackConfig = ({ actions, getConfig, rules }) => {
    // Add canvg-loader
    actions.setWebpackConfig({
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    use: '@rtprog/canvg-loader',
                },
            ],
        },
    })
    // Remove existing/default svg loader
    const cfg=getConfig();
    const imgsRule = rules.images()
    const newUrlLoaderRule = {
        ...imgsRule,
        test: new RegExp(imgsRule.test.toString().replace('svg|', '').slice(1, -1))
    }

    cfg.module.rules = [
        // Remove the base url-loader images rule entirely
        ...cfg.module.rules.filter(rule => {
            if (rule.test) {
                return rule.test.toString() !== imgsRule.test.toString()
            }
            return true
        }),
        // Put it back without SVG loading
        newUrlLoaderRule
    ]
    actions.replaceWebpackConfig(cfg)
}
```
 