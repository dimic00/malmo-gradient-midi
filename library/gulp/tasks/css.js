// MISC
const gulp = require('gulp');
const config = require('../../.gulprc.json');
var gulpif = require('gulp-if');
const isDev = config.env === 'dev';
const isProd = config.env === 'prod';
const sourcemaps = require('gulp-sourcemaps');
const livereload = require('gulp-livereload');

// CSS
const postcss = require('gulp-postcss');
const cssimport = require('postcss-import');
const url = require('postcss-url');
const postcssPresetEnv = require('postcss-preset-env');
const assets = require('postcss-assets');
const flexibility = require('postcss-flexibility');
//const stylelint = require('stylelint');
const cssnano = require('cssnano');
//const reporter = require('postcss-reporter');

module.exports = () => {
	const processors = [
		cssimport(),
		url(),
		flexibility(),
		postcssPresetEnv({
			stage: 0,
			browsers: ['> 5%', 'last 2 versions', 'IE > 10', 'iOS 8']
		}),
		assets({ loadPaths: [config.paths.bmpDest, config.paths.svgDest] })
		//stylelint(),
		//reporter({ clearMessages: true })
	];
	const prod = [cssnano()];
	return gulp
		.src(config.paths.cssSrc)
		.pipe(sourcemaps.init())
		.pipe(postcss(processors))
		.pipe(gulpif(isProd, postcss(prod)))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(config.paths.cssDest))
		.pipe(gulpif(isDev, livereload()));
};
