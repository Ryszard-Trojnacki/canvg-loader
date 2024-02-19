const CodeGenerator = require('./code-generator');

/**
 * @typedef {Object} CanvasState
 * @property {"ltr"|"rtl"|"inherit"} direction - The direction of the text. Default is ltr.
 * @property {string|CanvasGradient|CanvasPattern} fillStyle - The fillStyle property of the Canvas 2D API specifies
 *              the color, gradient, or pattern to use inside shapes. The default is #000 (black).
 * @property {string} filter - The filter property of the Canvas 2D API specifies the filter to apply to the drawing
 *              context. The default is none.
 * @property {string} font - The font property of the Canvas 2D API specifies the current text style to use when drawing text.
 * @property {"auto"|"normal"|"none"} fontKerning - The font-kerning property of the Canvas 2D API specifies the desired
 *              amount of kerning between characters. The default is auto.
 * @property {"normal"|"ultra-condensed"|"extra-condensed"|"condensed"|"semi-condensed"|"semi-expanded"|"expanded"|"extra-expanded"|"ultra-expanded"} fontStretch - The font-stretch property
 *              of the Canvas 2D API specifies the current text width to use when drawing text.
 * @property {"normal"|"small-caps"|"all-small-caps"|"petite-caps"|"all-petite-caps"|"unicase"|"titling-caps"} fontVariantCaps - The font-variant-caps
 *              property of the Canvas 2D API specifies the use of small capitals for lower case text.
 * @property {number} globalAlpha - The globalAlpha property of the Canvas 2D API specifies the current alpha or transparency
 *              value that is applied to global composite operations. The default is 1.0 (opaque).
 * @property {string} globalCompositeOperation - The globalCompositeOperation property of the Canvas 2D API specifies how
 *              shapes and images are drawn onto the canvas. The default is source-over.
 * @property {boolean} imageSmoothingEnabled - The imageSmoothingEnabled property of the Canvas 2D API specifies whether
 *              scaled images are smoothed (true) or not (false). The default is true.
 * @property {"low"|"medium"|"high"} imageSmoothingQuality - The imageSmoothingQuality property of the Canvas 2D API
 *              specifies the quality of image smoothing. The default is low.
 * @property {string} letterSpacing - The letterSpacing property of the Canvas 2D API specifies the spacing behavior between
 *              text characters. The default is 0px.
 * @property {"butt"|"round"|"square"} lineCap - The lineCap property of the Canvas 2D API specifies the type of endings
 *              on the end of lines. The default is butt.
 * @property {number} lineDashOffset - The lineDashOffset property of the Canvas 2D API specifies where to start a dash array
 *              on a line. The default is 0.
 * @property {"bevel"|"round"|"miter"} lineJoin - The lineJoin property of the Canvas 2D API specifies the type of corners
 *              where two lines meet. The default is miter.
 * @property {number} lineWidth - The lineWidth property of the Canvas 2D API specifies the thickness of lines in
 *              space units.
 * @property {number} miterLimit - The miterLimit property of the Canvas 2D API specifies the maximum miter length.
 *              The default is 10.
 * @property {number} shadowBlur - The shadowBlur property of the Canvas 2D API specifies the amount of blur applied
 *              to shadows.
 * @property {string} shadowColor - The shadowColor property of the Canvas 2D API specifies the color of the shadow.
 * @property {number} shadowOffsetX - The shadowOffsetX property of the Canvas 2D API specifies the horizontal
 *              distance of the shadow from the shape.
 * @property {number} shadowOffsetY - The shadowOffsetY property of the Canvas 2D API specifies the vertical
 *              distance of the shadow from the shape.
 * @property {string|CanvasGradient|CanvasPattern} strokeStyle - The strokeStyle property of the Canvas 2D API
 *              specifies the color, gradient, or pattern to use for the strokes (outlines) around shapes. The default is #000 (black).
 * @property {"left"|"right"|"center"|"start"|"end"} textAlign - The textAlign property of the Canvas 2D API specifies
 *              the current text alignment used when drawing text. The default is start.
 * @property {"top"|"hanging"|"middle"|"alphabetic"|"ideographic"|"bottom"} textBaseline - The textBaseline property
 *              of the Canvas 2D API specifies the current text baseline used when drawing text. The default is alphabetic.
 * @property {"auto"|"optimizeSpeed"|"optimizeLegibility"|"geometricPrecision"} textRendering - The textRendering
 *              property of the Canvas 2D API specifies the quality of text rendering. The default is auto.
 * @property {string} wordSpacing - The wordSpacing property of the Canvas 2D API specifies the spacing behavior
 *              between text words. The default is 0px.
 */

/**
 * Default state of the canvas.
 * @type {CanvasState}
 */
const defaultCanvasState = Object.freeze({
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
});

/**
 * Properties of the canvas state.
 * @type {Array<string>}
 */
const canvasStateProperties = Object.keys(defaultCanvasState);

/**
 * Set of properties of the canvas state.
 * @type {Set<string>}
 */
const canvasStatesSet=new Set(canvasStateProperties);

/**
 * This function copies only the properties of the canvas state. No other properties are copied.
 * @param {CanvasState} dst object to which the properties are copied.
 * @param {CanvasState} src object from which the properties are copied.
 * @return {CanvasState} The object to which the properties are copied.
 */
function assignCanvasState(dst, src) {
    for (const prop of canvasStateProperties) dst[prop] = src[prop];
    return dst;
}

/**
 * @typedef {(c: import("./code-generator").CodeGenerator) => void} CodeGeneratorFunction
 */


/**
 * @typedef {Object} ContextState
 * @property {ContextState} stack - The stack of the states.
 * @property {CanvasState} state - The state of the canvas.
 * @property {number} varGen - The variable id generator.
 * @property {{ [string]: any }} vars - The variables.
 * @property {Array<CodeGeneratorFunction>} code - Current code.
 * @property {Array<CodeGeneratorFunction>} path - Current path operations
 * @property {Array<CodeGeneratorFunction>} stateCode - Operations that change the state of the canvas.
 */

/**
 * Definition of the canvas context methods. What they change.
 * - `draw` - for operations that draw something on the canvas,
 * - `state` - for operations that change the state of the canvas,
 * - `none` - for operations that do not change the state of the canvas and do not draw anything,
 * - `path` - for operations that change the path,
 * - `drawPath` - for operations that draw something on the canvas from the path,
 * - `create` - for operations that create a new object.
 * @typedef {"draw"|"state"|"none"|"path"|"drawPath"|"create"} OperationType
 */

/**
 * @typedef {function} ContextFunction
 * @this {CanvasRenderingContext2D}
 */

/**
 * @typedef {Object} CanvasOperation
 * @property {OperationType} type - Type of the operation.
 * @property {ContextFunction} [ignore] - If true, the operation is ignored.
 * @property {ContextFunction} [call] - Function that is called when the operation is executed. It overrides the default behavior.
 * @property {ContextFunction} [create] - Function that is called when the operation is executed. It creates a new object.
 */

/**
 * Method names and their operation type.
 * @type {Object<string,OperationType|CanvasOperation>}
 */
const canvasContextMethods=Object.freeze({
    arc: "path",
    arcTo: "path",
    beginPath: "none",
    bezierCurveTo: "path",
    clearRect: "draw",
    clip: "state",
    closePath: "path",
    createConicGradient: {
        type: "create",
        create: () => new CodeCanvasGradient(),
    },
    createImageData: {
        type: "create",
        create: (...params) => new CodeImageData(...params),
    },
    createLinearGradient: {
        type: "create",
        create: (...params) => new CodeCanvasGradient(...params),
    },
    createPattern: {
        type: "create",
        create: (...params) => new CodeCanvasPattern(...params),
    },
    createRadialGradient: {
        type: "create",
        create: (...params) => new CodeCanvasGradient(...params),
    },
    drawFocusIfNeeded: "none",
    drawImage: "draw",
    ellipse: "path",
    fill: "drawPath",
    fillRect: "draw",
    fillText: "draw",
    getContextAttributes: "none",
    getImageData: "none",
    getLineDash: "none",
    getTransform: "none",
    isPointInPath: "none",
    isPointInStroke: "none",
    lineTo: "path",
    measureText: "none",
    moveTo: "path",
    putImageData: "draw",
    quadraticCurveTo: "path",
    rect: "path",
    reset: "state",
    resetTransform: "state",
    restore: "state",
    rotate: "state",
    roundRect: "path",
    save: "state",
    scale: {
        type: 'state',
        ignore: (x,y) => x===1 && y===1
    },
    setLineDash: "state",
    setTransform: "state",
    stroke: "draw",
    strokeRect: "draw",
    strokeText: "draw",
    transform: "state",
    translate: {
        type: "state",
        ignore: (x,y) => x===0 && y===0
    },
})


/**
 * @typedef {Object} CreateClass
 */

/**
 * Base class for creating new objects.
 * @property {boolean} created - If true, the object is created.
 * @property {string} name - The name of the variable.
 * @property {string} func - The name of the function.
 * @property {ContextState} state - The state of the canvas.
 * @property {function} require - The function that is called when the operation is executed. It creates a new object.
 * */
class CodeCreateClass {
    constructor() {
        this.created=false;
    }
}

/**
 * Fake class for CanvasGradient it registers the color stops.
 * @class
 * @externs CanvasGradient
 */
class CodeCanvasGradient extends CodeCreateClass {
    constructor() {
        super();
        /**
         * @type {Array<Array<number, string>>}
         * @private
         */
        this._stops=[];
    }

    addColorStop(...params) {
        this._stops.push(params);
    }

    require() {
        if(!this.created) {
            this.state.code.push(c => c.func(`${this.name}=ctx.${this.func}`));
            this.created=true;
        }
        this._stops.forEach(params => {
            this.state.code.push(c => c.func(`${this.name}.addColorStop`, ...params));
        });
        this._stops=[];
    }
}

/**
 * Fake class for CanvasPattern.
 * @class
 * @externs CanvasPattern
 */
class CodeCanvasPattern extends CodeCreateClass {
    constructor(...params) {
        super();
        this._create=[...params]
    }

    setTransform(matrix) {
        this._matrix=matrix;
    }

    require() {
        if(!this._create) {
            this.state.code.push(g => g.func(`${this.name}=ctx.${this.func}`, ...this.created));
            this.created=true;
        }

        if(this._matrix) {
            this.state.code.push(g => g.func(`${this.name}.setTransform`, this._matrix));
            this._matrix=null;
        }
    }
}

class CodeImageData extends CodeCreateClass {
    constructor(data, width, height) {
        super()
    }

    require() {
        if(!this.created) {
            this.state.code.push(g => g.func(`${this.name}=ctx.${this.func}`, ...this.created));
            this.created=true;
        }
    }
}


/**
 * Fake OffscreenCanvas
 *
 * @class
 * @extends {OffscreenCanvas}
 */
class CodeCanvas {
    constructor(width, height) {
        /**
         * @type {number}
         */
        this.width=width;
        /**
         * @type {number}
         */
        this.height=height;

        /**
         * @type {ContextState}
         **/
        this.root = {
            stack: [],
            state: {...defaultCanvasState},
            stateCode: [],
            code: [],
            path: [],
            varGen: 0,
            vars: {},
        }
        /**
         * @type {string}
         */
        this.filename='';

        try {
            throw new Error();
        } catch (e) {
            console.log("Created canvas");
            console.log(e.stack);
        }
    }

    generate(c) {
        this.root.code.forEach(f => f(c));
    }

    log(msgs, ...params) {
        if(this.filename) console.log(`[${this.filename}]:`, msgs, ...params);
        else console.log(msgs, ...params);
    }

    /**
     * @param {string} type
     * @return {OffscreenCanvasRenderingContext2D}
     */
    getContext(type) {
        if(type!=='2d') throw new Error("Not supported");

        return new Proxy(this.root, {
            get: (target, name)  => {
                if(name==='canvas') return this;    // property returns the canvas
                if(canvasStatesSet.has(name)) { // state properties
                    return target.state[name];
                }
                let method=canvasContextMethods[name];
                if(!method) return;
                if(typeof(method)==='string') method={ type: method };
                return (...params) => {
                    // if(method.type==='none') return;
                    if(name==='beginPath') target.path=[];

                    if(typeof(method.ignore)==='function' && method.ignore.apply(target, params)) return;  // check if this operation should be ignored
                    if(typeof(method.call)==='function') return method.call.apply(target, params);  // call the method

                    if(method.type==='state') {
                        target.code.push((c) => c.func('ctx.'+name, ...params));
                    } else if(method.type==='draw') {
                        target.code.push((c) => c.func('ctx.'+name, ...params));
                    } else if(method.type==='path') {
                        target.path.push((c) => c.func('ctx.'+name, ...params));
                    } else if(method.type==='drawPath') {
                        const path = [...target.path];
                        if (path.length === 0) return;  // brak operacji rysowania
                        target.code.push(c => path.forEach(f => f(c)));
                        target.code.push((c) => c.func('ctx.' + name, ...params));
                    } else if(method.type==='create') {
                        const vn='_v'+(++target.varGen);
                        // target.code.push((c) => c.func(vn+'=ctx.'+name, ...params));
                        const r=target.vars[vn]=method.create.call(target, ...params);
                        r.name=vn;
                        r.func=name;
                        r.state=target;
                        this.log("Create: ", vn, r.name, r.func, target.varGen);
                        if(!this.filename) {
                            try {
                                throw new Error()
                            } catch (e) {
                                console.log(e.stack);
                            }
                        }
                        return r;
                    } else {
                        target.code.push((c) => c.func('ctx.'+name, ...params));
                    }
                }
            },
            set: (target, name, value) => {
                if(canvasStatesSet.has(name)) {
                    if(typeof(value)==='object' && value.require && value.name) {
                        value.require();
                        // target.state[name] = value.name;
                        target.code.push((c) => c.assign('ctx.' + name, value.name));
                    } else {
                        target.state[name] = value;
                        target.code.push((c) => c.set('ctx.' + name, value));
                    }
                    return true;
                }
            }
        })
    }

    /**
     * @return {Blob}
     */
    convertToBlob(options) {
        throw new Error("Not supported");
    }

    transferToImageBitmap() {
        throw new Error("Not supported");
    }
}


module.exports = {
    CodeCanvas,
    createCanvas: (width, height) => new CodeCanvas(width, height),
}