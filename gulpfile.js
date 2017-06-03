////////////////////////////////////////
///////////////// gulp /////////////////
////////////////////////////////////////
// http://gulpjs.com/
// npm install --global gulp-cli
var gulp = require('gulp');

////////////////////////////////////////
///////////// default task /////////////
////////////////////////////////////////
// run without any flags or other commands // `gulp` //
gulp.task('default', ["build-dev"]);

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// SVG //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// remove-svg-properties //
// https://www.npmjs.com/package/remove-svg-properties
var rsp = require('remove-svg-properties').stream;
var inject = require('gulp-inject');
const path = require('path');

gulp.task('svg-html-inject', function () {
	gulp.src('./src/**/*.html')
		.pipe(
		inject(
			gulp.src('./dep/svg/*.svg')
				.pipe(
				rsp.remove({
					properties: ['style'],
				})
				)
			, {
				ignorePath: ["dep/svg"],
				addRootSlash: false,
				starttag: '<!-- inject:{{path}} -->',
				transform: function (filePath, file) {
					// return file contents as string 
					console.log(`internal_dirname=${__dirname}`);
					console.log(`internal_filePath=${filePath}`);
					return file.contents.toString('utf8');
				}
			}
		)
		)
		.pipe(gulp.dest('./dist'));
});

////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// WebPack ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// webpack //
// http://webpack.github.io/docs/usage-with-gulp.html
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
var webpack = require("webpack");
var gutil = require("gulp-util");
gulp.task("build-dev", ["webpack-build-dev", "svg-html-inject", "build-scss", "copy-resources"], function () {
	gulp.watch(["src/**/*.ts", "src/**/*.js", "dep/lib/**/*.js", "dep/lib/**/*.ts"], ["webpack-build-dev"]);
	gulp.watch(["dep/svg/**/*", "src/**/*.html"], ["svg-html-inject"]);
	gulp.watch(["src/scss/**/*.scss"], ["build-scss"]);
	gulp.watch(["dep/resource/**"], ["copy-resources"]);
});

gulp.task("webpack-build-dev", function (callback) {
	var myConfig = Object.create({
		entry: [
			"./src/hue.ts",
			// "./dep/lib/palette.js",
		],
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname, 'dist')
		},
		devtool: "source-map",
		resolve: {
			// Add '.ts' and '.tsx' as a resolvable extension.
			extensions: [ ".tsx", ".ts", ".js" ]
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
		},
		plugins: [
			new webpack.DefinePlugin({
				"process.env": {
					// This has effect on the react lib size
					"NODE_ENV": JSON.stringify("dev")
				}
			}),
		]
	});
	// npm-run webpack --verbose --progress --colors --profile --env=dev --debug --watch

	// run webpack
	webpack(myConfig, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack-build-dev", err);
		gutil.log("[webpack-build-dev]", stats.toString({
			colors: true
		}));
		callback();
	});
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// SASS /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// sass // scss //
var sass = require('gulp-sass');
const plumber = require('gulp-plumber');
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md
gulp.task('build-scss', function () {
	return gulp.src('src/scss/**/*.scss')
		.pipe(plumber(function (error) {
			gutil.log(gutil.colors.red(error.message));
			this.emit('end');
		}))
		.pipe(sass())
		.pipe(gulp.dest('dist'));
		// .pipe(reload({ stream: true })); /// this is for BrowserSync
});

////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// File /////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// copy resources //
gulp.task('copy-resources', function () {
	gulp.src('./dep/resource/**')
		.pipe(gulp.dest('./dist/resource/'));
});

// clean up prior builds //
gulp.task('clean', function () {
	// You can use multiple globbing patterns as you would with `gulp.src`
	return del(['dist']);
});

////////////////////////////////////////
//////////////// NOTES /////////////////
////////////////////////////////////////
// many of good examples
// https://github.com/gulpjs/gulp/tree/master/docs/recipes
