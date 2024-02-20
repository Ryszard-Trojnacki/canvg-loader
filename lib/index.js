/**
 * @file Function to process SVG files
 * @author Ryszard Trojnacki
 */
const { Canvg, presets, Parser } = require('canvg');
const { DOMParser } = require('xmldom');
const canvas=require('./code-canvas');
const CodeGenerator=require('./code-generator');
const { parseSvgViewBox } = require('./svg-utils');
const {CodeCanvas} = require("./code-canvas");

const preset=presets.node({
    DOMParser,
    canvas
});

/**
 * @typedef {Object} SvgResult
 * @property {string[]} code
 * @property {number[]} viewBox
 * @property {number} width
 * @property {number} height
 */

/**
 * Function to process SVG file
 * @param {string} filename name of the file
 * @param {string} source content of svg file
 * @return {SvgResult} result of processing
 */
function svgToCode(filename, source) {
    const parser=new Parser(preset);
    const svgDocument=parser.parseFromString(source);
    const viewBox=parseSvgViewBox(svgDocument?.documentElement?.getAttribute('viewBox'));
    let width=parseFloat(svgDocument?.documentElement?.getAttribute('width'));
    let height=parseFloat(svgDocument?.documentElement?.getAttribute('height'));
    if(isNaN(width)) width=viewBox?.width;
    if(isNaN(height)) height=viewBox?.height;

    const gen=new CodeGenerator();

    let c=canvas.createCanvas(width || 100, height || 100);
    CodeCanvas.parent=c;
    try {
        c.filename = filename;
        c.installParameterResolver(gen);

        gen.incIdent();

        const ctx = c.getContext('2d');
        const v = new Canvg(ctx, svgDocument, preset);

        v.render({
            ignoreMouse: true,
            ignoreAnimation: true,
            ignoreDimensions: true,
            ignoreClear: true,
            enableRedraw: false,
        });
        c.generate(gen);

        gen.decIdent();

        return {
            code: gen.lines,
            height,
            width,
            viewBox,
        }
    }finally {
        CodeCanvas.parent=null;
    }
}

module.exports={
    svgToCode
}