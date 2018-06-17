const gulp   = require('gulp');
const config = require('../.gulprc.json');

module.exports = (tasks) => {
    tasks.forEach((name) => {
        gulp.task(name, require('./tasks/' + name));
    });

    return gulp;
};
