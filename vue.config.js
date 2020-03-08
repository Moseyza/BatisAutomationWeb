const path = require('path');

const resolve = dir => {
    return path.join(__dirname,dir);
}


module.exports = {
    configureWebpack: {
      devtool: 'source-map'
    },
    baseUrl:'/',
    productionSourceMap:false
  }