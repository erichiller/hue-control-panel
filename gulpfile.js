// gulp //
// http://gulpjs.com/
// npm install --global gulp-cli
var gulp = require('gulp');

// default task // this is what occurs when run without any flags or other commands // `gulp` //
gulp.task('default',["build-dev"]);
// memory buffer //
var memory = {}; // we'll keep our assets in memory


////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////// SVG //////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// gulp-inject-svg // svg injection into html //
// https://www.npmjs.com/package/gulp-inject-svg
var injectSvg = require('gulp-inject-svg');
gulp.task('svg-html-inject', function () {
	return gulp.src('src/**/*.html')
		.pipe(injectSvg())
		.pipe(gulp.dest('dist/'));
});
// remove-svg-properties //
// https://www.npmjs.com/package/remove-svg-properties
var rsp = require('remove-svg-properties').stream;
gulp.task('svg-remove-properties', function () {
	gulp.src('./dep/svg/*.svg')
		.pipe(rsp.remove({
			properties: [rsp.PROPS_FILL]
		}))
		.pipe(gulp.dest('./dist/svg'));
});




















// changing gulp working directory for glob
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/specifying-a-cwd.md
// .pipe(inject(gulp.src(['*.svg'], { cwd: path.join(__dirname, "dep/svg/") }), {


var inject = require('gulp-inject');
const path = require('path');
const flatmap = require('gulp-flatmap');
// var source = require('vinyl-source-stream');

gulp.task('2svg-inject', function () {

	var memory = {};

	

	gulp.src('./src/**/*.html')
		.pipe(inject(flatmap( function(stream, file){
			console.log('in flatmap');
			console.log(file);
			return gulp.src('dep/svg/')
				.pipe(rsp.remove({
					properties: [rsp.PROPS_FILL]
				}))
				// .pipe(tap(function (file) {
				// 	// save the file contents in memory
				// 	memory[path.basename(file.path)] = file.contents.toString();
				// }));
		} ), {
			// ignorePath: ['dep','svg', "dep/svg"],
			// ignorePath: "dep"
			// relative: true,
			addRootSlash: false,
			starttag: '<!-- inject:{{path}} -->',
			transform: function (filePath, file) {
				// return file contents as string 
				console.log(__dirname);
				console.log(filePath);
				return file.contents.toString('utf8');
			}
		}))
		.pipe(gulp.dest('./dist'));
	console.log(__dirname);
});































////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////// WebPack ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
// webpack //
// http://webpack.github.io/docs/usage-with-gulp.html
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
var webpack = require("webpack");
var gutil = require("gulp-util");
var webpackConfig = require("./webpack.config.js");
gulp.task("build-dev", ["webpack:build-dev", "svg-html-inject", "build-scss", "copy-resources"], function () {
	gulp.watch(["src/**/*.ts", "src/**/*.js"], ["webpack:build-dev"]);
	gulp.watch(["dep/svg/**/*", "src/**/*.html"], ["svg-html-inject"]);
	gulp.watch(["src/scss/**/*.scss"], ["build-scss"]);
	gulp.watch(["dep/resource/**"], ["copy-resources"]);
});

gulp.task("webpack:build-dev", function (callback) {
	// modify some webpack config options
	var myConfig = Object.create(webpackConfig);
	myConfig.plugins = myConfig.plugins.concat(
		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				"NODE_ENV": JSON.stringify("dev")
			}
		})
	);
	// npm-run webpack --verbose --progress --colors --profile --env=dev --debug --watch

	// run webpack
	webpack(myConfig, function (err, stats) {
		if (err) throw new gutil.PluginError("webpack:build", err);
		gutil.log("[webpack:build]", stats.toString({
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
// https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md
gulp.task('build-scss', function () {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist'));
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



// many of good examples
// https://github.com/gulpjs/gulp/tree/master/docs/recipes
