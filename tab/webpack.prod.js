const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'production',
   optimization: {
    // minimize: false //Default is true set to false for debugging
},
 });