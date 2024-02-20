import HtmlWebpackPlugin from 'html-webpack-plugin';
import path from 'path';

export default {
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.svg$/,
                use: '@rtprog/canvg-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Development',
        }),
    ],
    devServer: {
        static: {
            directory: path.join('src'),
        },
    }
}