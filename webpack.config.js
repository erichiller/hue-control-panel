// path required to resolve destination path for `bundle`
var path = require('path');

// svgstore - https://github.com/mrsum/webpack-svgstore-plugin
var SvgStore = require('webpack-svgstore-plugin');
// var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: [
		"./src/hue.ts",
		"./resource/jscolor.js",
	],
    output: {
        filename: "bundle.js",
		path: path.resolve(__dirname, 'bin')
	},
	devtool: "source-map",
    resolve: {
		// Add '.ts' and '.tsx' as a resolvable extension.
		extensions: [
			".tsx", 
			".ts", 
			".js"
		]
	},
    module: {
        loaders: [
			{
				// all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
				// see ts-loader config details
				// https://www.npmjs.com/package/ts-loader
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: "ts-loader"
			}
		],
		// rules: [
		// 	{
		// 		test: /\.scss$/,
		// 		use: ExtractTextPlugin.extract({
		// 			fallback: 'style-loader',
		// 			//resolve-url-loader may be chained before sass-loader if necessary
		// 			use: ['css-loader', 'sass-loader']
		// 		})
		// 	}
		//  ]
	},
	plugins: [
		// create svgStore instance object 
		new SvgStore({
			prefix: `svg-`
		}),
		// new ExtractTextPlugin({
		// 	filename: 'src/scss/**',
		// 	allChunks: true
		// }),

	]
}


// docs

// https://webpack.js.org/guides/production-build/
// --watch -->  https://webpack.js.org/guides/development/
// hot module replacement (refresh code, without page refresh) --> https://survivejs.com/webpack/developing/automatic-browser-refresh/



