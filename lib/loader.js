const { svgToCode } = require('./index');

module.exports=function canvgLoader(source) {
    // const options=this.getOptions();
    this.cacheable();

    const res=svgToCode(this?._module?.resourceResolveData?.relativePath, source);

    res.code.unshift("module.exports=function(ctx) {");
    res.code.push("};");

    if (res.viewBox) res.code.push(`module.exports.viewBox=[ ${res.viewBox.x}, ${res.viewBox.y}, ${res.viewBox.width}, ${res.viewBox.height} ];`);
    if (!isNaN(res.width)) res.code.push(`module.exports.width=${res.width};`);
    if (!isNaN(res.height)) res.code.push(`module.exports.height=${res.height};`);

    return res.code.join("\n");
}