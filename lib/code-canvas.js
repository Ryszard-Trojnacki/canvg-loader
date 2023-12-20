/**
 * @file Fake OffscreenCanvas and CanvasRenderingContext2D objects for generating JavaScript code calls
 * @author Ryszard Trojnacki
 */

/**
 * @typedef {OffscreenCanvas & { code: string[] }} CodeCanvas
 */

/**
 * Const with all properties of CanvasRenderingContext2D.
 */
const contextProperties = {
    direction: "ltr",
    fillStyle: "#000000",
    filter: "none",
    font: "10px sans-serif",
    fontKerning: "auto",
    fontStretch: "normal",
    fontVariantCaps: "normal",
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    letterSpacing: "0px",
    lineCap: "butt",
    lineDashOffset: 0,
    lineJoin: "miter",
    lineWidth: 1,
    miterLimit: 10,
    shadowBlur: 0,
    shadowColor: "rgba(0, 0, 0, 0)",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    strokeStyle: "#000000",
    textAlign: "start",
    textBaseline: "alphabetic",
    textRendering: "auto",
    wordSpacing: "0px",
}

/**
 * @typedef {(string) => void} AppenderFunction
 */

/**
 * Convert params to string.
 * @param {Array<any>} params
 */
function convertParams(params) {
    return params.map(p => JSON.stringify(p)).join(", ");
}


function isNumber(n) {
    return typeof(n)==='number' && !isNaN(n);
}

/**
 * Function creates fake context for fake canvas.
 * @param {CodeCanvas} canvas
 * @param {AppenderFunction} appender
 * @return {CanvasRenderingContext2D}
 */
function createCodeContext(canvas, appender) {
    let state={
        ...contextProperties,
    }

    return new Proxy(state, {
        get: (target, name) => {
            // console.log("#Get: ", name, ...params);
            if (name === 'canvas') return canvas;
            if (name === 'createLinearGradient' || name === 'createRadialGradient' || name === 'createConicGradient') {
                return (...params) => {
                    let gradient = {
                        name: 'g',
                        code: `\t{\n\t\tlet g=ctx.${name}(${convertParams(params)});\n`,
                    };
                    gradient.addColorStop = (...params) => gradient.code+=`\t\tg.addColorStop(${convertParams(params)});\n`;
                    return gradient;
                }
            }
            if (name === 'createPattern') {
                return (...params) => {
                    let pattern = {
                        name: 'p',
                        code: `\t{\n\t\tlet p=ctx.${name}(${convertParams(params)});\n`,
                    }
                    pattern.setTransform = (...params) => pattern.code += `\t\tp.setTransform(${convertParams(params)});\n`;
                    return pattern;
                }
            }

            if (typeof(contextProperties[name])!=='undefined') {
                const v = target[name];
                // console.log("#Get Prop: ", name, '=>', v);
                return v;
            }
            if(name==='translate') {
                return (x, y) => (x!==0 || y!==0) && appender("\tctx.translate(" + x + ", " + y + ");\n");
            }
            if(name==='scale') {
                return (x, y) => isNumber(x) && isNumber(y) && (x!==1 || y!==1) && appender("\tctx.scale(" + x + ", " + y + ");\n");
            }

            return (...params) => appender("\tctx." + name + "(" + convertParams(params) + ");\n");
        },
        set: (target, name, value) => {
            // console.log("#Set: ", name, value);
            if (typeof (value) === 'object' && value.code) {
                appender(value.code);
                appender("\t\tctx." + name + "=" + value.name + ";\n\t}\n");
                return true;
            }
            appender("\tctx." + name + "=" + JSON.stringify(value) + ";\n");
            target[name] = value;
            return true;
        }
    })
}

/**
 * Create a fake HTMLCanvas object.
 * @param {number} width
 * @param {number} height
 * @return {CodeCanvas}
 */
function createCanvas(width, height) {
    let c = {
        width,
        height,
        code: [],
    };

    c.getContext = (type) => {
        if (type === '2d') {
            return createCodeContext(this, (code) => c.code.push(code));
        }
    }
    return c;
}

module.exports = {
    createCanvas
}