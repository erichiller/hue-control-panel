var gulp = require('gulp');

var sass = require('gulp-sass');

var injectSvg = require('gulp-inject-svg');

// http://webpack.github.io/docs/usage-with-gulp.html
// https://github.com/webpack/webpack-with-common-libs/blob/master/gulpfile.js
var webpack = require("webpack");
var gutil = require("gulp-util");
var webpackConfig = require("./webpack.config.js");

// http://gulpjs.com/
// npm install --global gulp-cli

// gulp-inject-svg
// https://www.npmjs.com/package/gulp-inject-svg
gulp.task('inject-svg', function () {
	return gulp.src('src/**/*.html')
		.pipe(injectSvg())
		.pipe(gulp.dest('dist/'));

});

gulp.task("build-dev", ["webpack:build-dev", "inject-svg", "build-scss"], function () {
	gulp.watch(["src/**/*.ts", "src/**/*.js"], ["webpack:build-dev"]);
	gulp.watch(["resource/**/*.svg", "src/**/*.html"], ["inject-svg"]);
	gulp.watch(["src/scss/**/*.scss"], ["build-scss"]);
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

// https://github.com/gulpjs/gulp/blob/master/docs/recipes/rebuild-only-files-that-change.md
gulp.task('build-scss', function () {
	return gulp.src('src/scss/**/*.scss')
		.pipe(sass())
		.pipe(gulp.dest('dist'));
});



// many of good examples
// https://github.com/gulpjs/gulp/tree/master/docs/recipes
