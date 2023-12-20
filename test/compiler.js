const path = require('path');
const webpack = require('webpack');
const { createFsFromVolume, Volume } =require('memfs');

module.exports =  (fixture, options = {}) => {
    const compiler = webpack({
        context: __dirname,
        entry: `./${fixture}`,
        output: {
            path: path.resolve(__dirname),
            filename: 'bundle.js',
        },
        module: {
            rules: [
                {
                    test: /\.svg$/,
                    loader: path.resolve(__dirname, '..', 'lib', 'loader.js'),
                }
            ],
        },
    });

    compiler.outputFileSystem = createFsFromVolume(new Volume());
    compiler.outputFileSystem.join = path.join.bind(path);

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) reject(err);
            if (stats.hasErrors()) reject(stats.toJson().errors);

            resolve(stats);
        });
    });
};
