const gulp = require('gulp');
const { parallel } = require('gulp');

// Create empty dirs...
const copyPublic = function () {
    return gulp.src(['public/**/*']).pipe(gulp.dest('dist/public'));
};

const copyViews = function () {
    return gulp.src(['views/**/*']).pipe(gulp.dest('dist/views'));
};

exports.copy = parallel(copyViews, copyPublic);