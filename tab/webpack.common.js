var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './app/index.js',
    output : {
        path : path.resolve(__dirname , 'app'),
        filename: 'slinky_bundle.js'
    },
    module : {
        rules : [
            {test : /\.(js|jsx)$/, use:'babel-loader'},
            {test : /\.css$/, use:['style-loader', 'css-loader']},
            {test : /\.(jpe?g|gif|png|svg)$/i, use: [{loader: 'url-loader',options: { limit: 10000 }}]}      
        ]
    },
    plugins : [
        new HtmlWebpackPlugin ({
            template : 'app/index.html'
        }),
    ],
    

}