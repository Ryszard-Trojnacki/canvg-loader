/**
 * @file Helper functions for SVG manipulation
 * @author Ryszard Trojnacki
 */


/**
 * @typedef {Object} SVGViewBox
 * @property {number} x - X coordinate of the top-left corner of the view box
 * @property {number} y - Y coordinate of the top-left corner of the view box
 * @property {number} width - Width of the view box
 * @property {number} height - Height of the view box
 */

/**
 * @typedef {Object} SVGInfo
 * @property {number} width - Width of the SVG
 * @property {number} height - Height of the SVG
 * @property {SVGViewBox} viewBox - View box of the SVG
 */

/**
 * Function for parsing viewBox attribute of an SVG element
 * @param {string} viewBox - viewBox attribute of an SVG element
 * @return {SVGViewBox|null}
 */
function parseSvgViewBox(viewBox) {
    if(typeof viewBox!=='string') return null;
    const parts=viewBox.split(/,? +/).map(parseFloat);
    if(parts.length!==4 || parts.some(isNaN)) return null;
    return {
        x: parts[0],
        y: parts[1],
        width: parts[2],
        height: parts[3]
    };
}

module.exports = {
    parseSvgViewBox
}