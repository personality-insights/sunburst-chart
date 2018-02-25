const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
  entry: './lib/index.js',
  output: {
    filename: 'dist/index.js',
    library: 'PersonalitySunburstChart',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['babel-preset-env'],
          },
        },
      },
    ],
  },
  stats: {
    colors: true,
  },
  plugins: [
    new MinifyPlugin({}, {}),
  ],
};
