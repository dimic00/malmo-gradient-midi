// MISC
const gulp = require('gulp');
const config = require('../../.gulprc.json');
const isDev = config.env === 'dev';
const sourcemaps = require('gulp-sourcemaps');

// JS
const uglify = require('gulp-uglify');

// BROWSERIFY
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

// BABEL
const babelify = require('babelify');
const babelCore = require('babel-core');
const babelPresetEnv = require('babel-preset-env');
const babelPresetReact = require('babel-preset-react');

module.exports = () => {
    const bundler = browserify({
        entries: config.paths.jsSrc
    });

    return bundler
        .transform(babelify, { presets: [babelPresetEnv, babelPresetReact] })
        .bundle()
        .pipe(source('app.bundle.js'))
        .pipe(buffer())
        .pipe(isDev ? sourcemaps.init({ loadMaps: true }) : uglify())
        .pipe(gulp.dest(config.paths.jsDest));
};
