const { Canvg, presets } = require('canvg');
const { DOMParser } = require('xmldom');
// const canvas = require('./code-canvas');
const canvas=require('./fake-canvas');
const CodeGenerator=require('./code-generator');

const preset=presets.node({
    DOMParser,
    canvas
});

module.exports=function canvgLoader(source) {
    const options=this.getOptions();
    //const callback=this.async();
    this.cacheable();

    const gen=new CodeGenerator();

    let c=canvas.createCanvas(0, 0);
    // console.log("Source:", source);
    // c.code.push("module.exports=function(ctx) {\n");
    gen.append("module.exports=function(ctx) {");

    /**
     * @type {CodeCanvasRenderingContext2D}
     */
    const ctx=c.getContext('2d');
    const v=Canvg.fromString(ctx, source, preset);

    v.render({
        ignoreMouse: true,
        ignoreAnimation: true,
        ignoreDimensions: false,
        ignoreClear: true,
        enableRedraw: false,
    });
    ctx.generate(gen);

    gen.append("};");
    // c.code.push('};\n\n');

    let width=v.document.documentElement.getAttribute('width');
    let height=v.document.documentElement.getAttribute('height');
    let viewBox=v.document.documentElement.getAttribute('viewBox');
    // console.log("Size: ", viewBox.value, typeof(width.value), typeof(height.value));

    if(width && width.value) width=parseFloat(width.value);
    else width=null;

    if(height && height.value) height=parseFloat(height.value);
    else height=null;
    // console.log("Size: ", typeof(width), width, typeof(height), height);

    if(viewBox && viewBox.value) viewBox=viewBox.value.split(" ").map((v) => parseFloat(v));
    else viewBox=null;
    // console.log("ViewBox: ", typeof(viewBox), viewBox);

    if(viewBox && Array.isArray(viewBox) && viewBox.length===4) {
        // c.code.push("module.exports.viewBox=[" + viewBox.join(', ') + "];\n");
        gen.append("module.exports.viewBox=[" + viewBox.join(', ') + "];");
        if(typeof(width)!=='number') width=viewBox[2];
        if(typeof(height)!=='number') height=viewBox[3];
    }

    if(typeof(width)==='number') gen.append("module.exports.width=" + width + ";\n");
    if(typeof(height)==='number') gen.append("module.exports.height=" + height + ";\n");
    // if(typeof(width)==='number') c.code.push("module.exports.width=" + width + ";\n");
    // if(typeof(height)==='number') c.code.push("module.exports.height=" + height + ";\n");

    // const code=c.code.join('');
    const code=gen.toCode();
    console.log("Emitted:\n", code);
    return code;
}