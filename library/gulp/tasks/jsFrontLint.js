// MISC
const gulp    = require('gulp');
const config  = require('../../.gulprc.json');
const plumber = require('gulp-plumber');

// JS
const eslint  = require('gulp-eslint');

module.exports = () => {
    return gulp.src(config.paths.jsSrc)
        .pipe(plumber())
        .pipe(eslint())
        .pipe(eslint.format());
};
