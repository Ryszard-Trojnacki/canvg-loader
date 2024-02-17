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
export function assignCanvasState(dst, src) {
    for (const prop of canvasStateProperties) dst[prop] = src[prop];
    return dst;
}


/**
 * Fake OffscreenCanvas
 *
 * @type {OffscreenCanvas}
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
    }

    /**
     * @param {string} type
     * @return {CodeCanvasRenderingContext2D}
     */
    getContext(type) {
        if(type==='2d') return new CodeCanvasRenderingContext2D(this);
        throw new Error("Not supported");
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

/**
 * Fake class for CanvasGradient it registers the color stops.
 * @externs {CanvasGradient}
 */
class CodeCanvasGradient {
    constructor() {
    }

    addColorStop(offset, color) {
        if(!this._stops) this._stops=[];
        this._stops.push({offset, color});
    }

    /**
     * @param {CodeGenerator} g
     */
    generate(g) {

    }
}

/**
 * Fake class for CanvasPattern.
 * @externs {CanvasPattern}
 */
class CodeCanvasPattern {
    constructor(image, repetition) {
        this._create=[...arguments]
    }

    setTransform(matrix) {
        this._matrix=matrix;
    }

    generate(g) {

    }
}

class CodeImageData {
    constructor(data, width, height) {
    }
}

class FunctionCall {
    constructor(name, params) {
        this.name = name;
        this.params = params;
    }
}

/**
 * Class that emulates the CanvasRenderingContext2D.
 * @externs {CanvasState}
 */
class CodeCanvasRenderingContext2D {
    constructor(canvas) {
        /**
         * The CanvasRenderingContext2D.canvas property, part of the Canvas API, is a read-only reference
         * to the HTMLCanvasElement object that is associated with a given context. It might be null
         * if there is no associated <canvas> element.
         * @type {CodeCanvas & OffscreenCanvas}
         */
        this.canvas = canvas;

        /**
         *
         * @type {CanvasState[]}
         * @private
         */
        this._state_stack = [];

        /**
         * Code calls
         * @type {FunctionCall[]}
         * @private
         */
        this._code=[];

        /**
         * If true, the canvas is disabled and all calls are ignored.
         */
        this._disabled=false;

        assignCanvasState(this, defaultCanvasState);
    }

    _addFunctionCall(name, params) {
        this._code.push(new FunctionCall(name, params));
    }

    /**
     * The CanvasRenderingContext2D.arc() method of the Canvas 2D API adds a circular arc to the current sub-path.
     */
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
        this._addFunctionCall('arc', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.arcTo() method of the Canvas 2D API adds a circular arc to the current sub-path.
     */
    arcTo(x1, y1, x2, y2, radius) {
        this._addFunctionCall('arcTo', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.beginPath() method of the Canvas 2D API starts a new path by emptying the
     * list of sub-paths.
     */
    beginPath() {
        this._addFunctionCall('beginPath', []);
    }

    /**
     * The CanvasRenderingContext2D.bezierCurveTo() method of the Canvas 2D API adds a cubic Bézier curve to
     * the current sub-path.
     */
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._addFunctionCall('bezierCurveTo', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.clearRect() method of the Canvas 2D API erases the pixels in a rectangular
     * area by setting them to transparent black.
     */
    clearRect(x, y, width, height) {
        this._addFunctionCall('clearRect', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.clip() method of the Canvas 2D API turns the current or given path into the
     * current clipping region.
     */
    clip(path, fillRule) {
        this._addFunctionCall('clip', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.closePath() method of the Canvas 2D API adds a straight line to the path going
     * to the start of the current sub-path.
     */
    closePath() {
        this._addFunctionCall('closePath', []);
    }

    /**
     * The CanvasRenderingContext2D.createConicGradient() method of the Canvas 2D API creates a gradient around a point with given coordinates.
     */
    createConicGradient(startAngle, x, y) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.createImageData() method of the Canvas 2D API creates a new, blank ImageData object.
     */
    createImageData(sw, sh, settings) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.createLinearGradient() method of the Canvas 2D API creates a gradient along the line given by the coordinates represented by the parameters.
     */
    createLinearGradient(x0, y0, x1, y1) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.createPattern() method of the Canvas 2D API creates a pattern using the specified image (a CanvasImageSource).
     */
    createPattern(image, repetition) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.createRadialGradient() method of the Canvas 2D API creates a radial gradient using the size and coordinates of two circles.
     */
    createRadialGradient(x0, y0, r0, x1, y1, r1) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.drawFocusIfNeeded() method of the Canvas 2D API draws a focus ring around the current path.
     */
    drawFocusIfNeeded(path, element) {
        this._addFunctionCall('drawFocusIfNeeded', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.drawImage() method of the Canvas 2D API provides a way to draw an image onto the canvas.
     */
    drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.ellipse() method of the Canvas 2D API adds an elliptical arc to the current sub-path.
     */
    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise) {
        this._addFunctionCall('ellipse', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.fill() method of the Canvas 2D API fills the current or given path with the current fill style using the non-zero or even-odd winding rule.
     */
    fill(path, fillRule) {
        this._addFunctionCall('fill', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.fillRect() method of the Canvas 2D API draws a filled rectangle at (x, y) position
     * whose size is determined by width and height.
     */
    fillRect(x, y, width, height) {
        this._addFunctionCall('fillRect', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.fillText() method of the Canvas 2D API draws a text string at the specified coordinates,
     * filling the string's characters with the current fill style.
     */
    fillText(text, x, y, maxWidth) {
        this._addFunctionCall('fillText', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.getContextAttributes() method returns
     * an object that contains attributes used by the context.
     */
    getContextAttributes() {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.getImageData() method of the Canvas 2D API returns an ImageData object representing the underlying pixel data for the area of the canvas denoted by the rectangle which starts at (sx, sy) and has an sw width and sh height.
     */
    getImageData(sx, sy, sw, sh) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.getLineDash() method of the Canvas 2D API returns the current line dash pattern.
     */
    getLineDash() {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.isPointInPath() method of the Canvas 2D API returns true if the specified
     * point is in the current path, otherwise false.
     */
    getTransform() {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.isPointInPath() method of the Canvas 2D API returns true if the specified point is in the current path, otherwise false.
     */
    isPointInPath(x, y, fillRule) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.isPointInStroke() method of the Canvas 2D API returns true if the specified point is in the current path, otherwise false.
     */
    isPointInStroke(x, y) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.lineTo() method of the Canvas 2D API adds a straight line to the current sub-path by connecting the sub-path's last point to the specified (x, y) coordinates.
     */
    lineTo(x, y) {
        this._addFunctionCall('lineTo', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.measureText() method of the Canvas 2D API returns a TextMetrics object that contains information about the measured text.
     */
    measureText(text) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.moveTo() method of the Canvas 2D API moves the starting point of a new sub-path to the (x, y) coordinates.
     */
    moveTo(x, y) {
        this._addFunctionCall('moveTo', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.putImageData() method of the Canvas 2D API paints data from the given ImageData object onto the bitmap.
     */
    putImageData(imageData, dx, dy, dirtyX, dirtyY, dirtyWidth, dirtyHeight) {
        throw new Error("Not supported");
    }

    /**
     * The CanvasRenderingContext2D.quadraticCurveTo() method of the Canvas 2D API adds a quadratic Bézier curve to the current sub-path.
     */
    quadraticCurveTo(cpx, cpy, x, y) {
        this._addFunctionCall('quadraticCurveTo', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.rect() method of the Canvas 2D API adds a rectangle to the current path.
     */
    rect(x, y, width, height) {
        this._addFunctionCall('rect', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.reset() method of the Canvas 2D API resets the rendering context
     * to its default state, allowing it to be reused for drawing something else without having to explicitly
     * reset all the properties.
     */
    reset() {
        this._addFunctionCall('reset', []);
    }

    /**
     * The CanvasRenderingContext2D.resetTransform() method of the Canvas 2D API resets the current transformation to the identity matrix, and then runs transform() with the same arguments.
     */
    resetTransform() {
        this._addFunctionCall('resetTransform', []);
    }

    /**
     * The CanvasRenderingContext2D.restore() method of the Canvas 2D API restores the most recently saved canvas state by popping the top entry in the drawing state stack.
     */
    restore() {
        this._addFunctionCall('restore', []);
    }

    /**
     * The CanvasRenderingContext2D.rotate() method of the Canvas 2D API adds a rotation to the transformation matrix.
     */
    rotate(angle) {
        this._addFunctionCall('rotate', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.roundRect() method of the Canvas 2D API adds a rounded rectangle to the current path.
     */
    roundRect(x, y, width, height, radii) {
        this._addFunctionCall('roundRect', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.save() method of the Canvas 2D API saves the entire state of the canvas by pushing the current state onto a stack.
     */
    save() {
        this._addFunctionCall('save', []);
    }

    /**
     * The CanvasRenderingContext2D.scale() method of the Canvas 2D API adds a scaling transformation to the canvas units by x horizontally and by y vertically.
     */
    scale(x, y) {
        if(x===0 || y===0) {    // Makes no sense

        }
        this._addFunctionCall('scale', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.setLineDash() method of the Canvas 2D API sets the line dash pattern used when stroking lines.
     */
    setLineDash(segments) {
        this._addFunctionCall('setLineDash', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.setTransform() method of the Canvas 2D API resets the current transform to the identity matrix, and then runs transform() with the same arguments.
     */
    setTransform(a, b, c, d, e, f) {
        this._addFunctionCall('setTransform', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.stroke() method of the Canvas 2D API strokes the current or given path with the current stroke style using the non-zero winding rule.
     */
    stroke(path) {
        this._addFunctionCall('stroke', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.strokeRect() method of the Canvas 2D API draws a rectangle that is stroked (outlined) according to the current strokeStyle and other context settings.
     */
    strokeRect(x, y, width, height) {
        this._addFunctionCall('strokeRect', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.strokeText() method of the Canvas 2D API strokes (outlines) the current or given text at the given (x, y) position.
     */
    strokeText(text, x, y, maxWidth) {
        this._addFunctionCall('strokeText', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.transform() method of the Canvas 2D API multiplies the current transformation
     * with the matrix described by the arguments of this method.
     */
    transform(a, b, c, d, e, f) {
        this._addFunctionCall('transform', [...arguments]);
    }

    /**
     * The CanvasRenderingContext2D.translate() method of the Canvas 2D API adds a translation transformation to the current matrix.
     */
    translate(x, y) {
        if(x===0 && y===0) return;  // Does nothing
        this._addFunctionCall('translate', [...arguments]);
    }

    /**
     * @param {CodeGenerator} g
     */
    generate(g) {
        for(const c of this._code) {
            g.func(c.name, ...c.params);
        }
    }

}


module.exports = {
    CodeCanvas,
    createCanvas: (width, height) => new CodeCanvas(width, height),
    CodeCanvasRenderingContext2D,
}