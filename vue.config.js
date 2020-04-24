const webpack = require('webpack');
const path = require('path');
module.exports = {
    
    configureWebpack: {
      plugins: [
        new webpack.ProvidePlugin({
            // jquery
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            semantic: 'fomantic-ui',
            Semantic: 'fomantic-ui',
            'semantic-ui': 'fomantic-ui',
        })
      ]
      // resolve: {
      //   extensions: [ '.js', '.vue'],
      //   alias: {
      //     'src': path.resolve(__dirname, '../src'),
      //     'assets': path.resolve(__dirname, '../src/assets'),
      //     'components': path.resolve(__dirname, '../src/components'),
      //     // adding our externals libs
      //     'semantic': path.resolve(__dirname, '../node_modules/fomantic-ui/dist/semantic.min.js')
      //   }
      // }
    }
  }