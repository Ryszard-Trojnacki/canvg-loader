const compiler=require('./compiler.js');

test('AndroidSVG', async () => {
    const stats = await compiler('./files/android.svg');
    const output = stats.toJson({ source: true }).modules[0].source;

    expect(output).toContain('ctx.bezierCurveTo(22, 2, 73, 2, 73, 33);');
});