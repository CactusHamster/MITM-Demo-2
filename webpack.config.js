const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    entry: './src/public/index.ts',
    entry: {
        app: [path.resolve(__dirname, "src", "public", "app", "index.ts")],
        login: [path.resolve(__dirname, "src", "public", "login", "index.ts")],
      },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist/public/',
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
                use: [ { loader: 'file-loader', options: { name: '[name].[ext]', outputPath: 'fonts/' } } ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: { loader: [ 'file-loader' ], outputPath: 'img/', name: '[name].[ext]' },
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist', 'public'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Log in',
            filename: 'login.html',
            template: "./src/public/login/index.html",
            chunks: ["login"]
        }),
        new HtmlWebpackPlugin({
            title: 'MITM Proxy',
            filename: 'app.html',
            template: "./src/public/app/index.html",
            chunks: ["app"]
        }),
        new HtmlWebpackPlugin({
            template: "./src/public/index.html",
            "filename": "index.html",
            chunks: []
        })
    ]
};