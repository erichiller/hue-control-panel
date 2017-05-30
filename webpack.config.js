module.exports ={
    entry: "./src/",
    output: {
        filename: "./bin/bundle.js"
	},
    resolve: {
		// Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [
			"",
			".webpack.js",
			".web.js",
			".ts",
			".tsx",
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
				loader: "ts-loader"
			}
		]
	}
}



