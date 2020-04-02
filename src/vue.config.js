// const path = require('path');

// const resolve = dir => {
//     return path.join(__dirname,dir);
// }


module.exports = {
    configureWebpack: {
      devtool: 'source-map',
      test: /\.(ttf|otf|eot|woff|woff2)$/,
      use: {
      loader: "file-loader",
      options: {
        name: "fonts/[name].[ext]",
      },
  },
    }
  }
