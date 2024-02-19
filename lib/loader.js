const { Canvg, presets, Parser, SVGElement } = require('canvg');
const { DOMParser } = require('xmldom');
// const canvas = require('./code-canvas');
const canvas=require('./fake-canvas');
const CodeGenerator=require('./code-generator');
const { parseSvgViewBox } = require('./svg-utils');

const preset=presets.node({
    DOMParser,
    canvas
});

module.exports=function canvgLoader(source) {
    const options=this.getOptions();
    this.cacheable();

    const parser=new Parser(preset);
    const svgDocument=parser.parseFromString(source);
    const viewBox=parseSvgViewBox(svgDocument?.documentElement?.getAttribute('viewBox'));
    let width=parseFloat(svgDocument?.documentElement?.getAttribute('width'));
    let height=parseFloat(svgDocument?.documentElement?.getAttribute('height'));
    if(isNaN(width)) width=viewBox?.width;
    if(isNaN(height)) height=viewBox?.height;

    const gen=new CodeGenerator();

    let c=canvas.createCanvas(width || 100, height || 100);
    c.filename=this?._module?.resourceResolveData?.relativePath;
    console.log("Generate for: ", c.filename);
    gen.append("module.exports=function(ctx) {");

    const ctx=c.getContext('2d');
    const v=new Canvg(ctx, svgDocument, preset);

    v.render({
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        enableRedraw: false,
    });
    c.generate(gen);

    gen.append("};");

    if(viewBox) gen.append(`module.exports.viewBox=[ ${viewBox.x}, ${viewBox.y}, ${viewBox.width}, ${viewBox.height} ];`);
    if(!isNaN(width)) gen.append(`module.exports.width=${width};`);
    if(!isNaN(height)) gen.append(`module.exports.height=${height};`);

    // const code=c.code.join('');
    const code=gen.toCode();
    // console.log("Emitted:\n", code);
    return code;
}