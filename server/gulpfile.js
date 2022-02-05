import gulp from 'gulp'
const { parallel } = gulp

// Create empty dirs...
const copyPublic = () => gulp.src(['public/**/*']).pipe(gulp.dest('dist/public'))

const copyViews = () => gulp.src(['views/**/*']).pipe(gulp.dest('dist/views'))

const copy = parallel(copyViews, copyPublic)

export {copy}
