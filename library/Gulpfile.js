const config = require('./.gulprc.json');
const isDev = config.env === 'dev';
const isProd = config.env === 'prod';
const livereload = require('gulp-livereload');

const gulp = require('./gulp')(['css', 'jsFrontBundle', 'jsFrontLint']);

gulp.task('default', () => {
	gulp.watch(config.paths.cssAll, ['css']);
	gulp.watch(config.paths.cssSubFold, ['css']);
	gulp.watch(config.paths.jsSrc, ['jsFrontLint', 'jsFrontBundle']);
});
