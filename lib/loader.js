const { Canvg, presets } = require('canvg');
const { DOMParser } = require('xmldom');
const canvas = require('./code-canvas');

const preset=presets.node({
    DOMParser,
    canvas
});

module.exports=function canvgLoader(source) {
    const options=this.getOptions();
    //const callback=this.async();
    this.cacheable();

    let c=canvas.createCanvas(100, 100);
    // console.log("Source:", source);
    c.code.push('module.exports=function(ctx) {\n');

    const v=Canvg.fromString(c.getContext('2d'), source, preset);
    v.render({
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: true,
        ignoreClear: true,
        // enableRedraw: false,
    });
    c.code.push('};');
    const code=c.code.join('');
    // console.log("Code: ", code);

    return code;
}