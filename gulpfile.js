const gulp = require('gulp');
const tar = require('gulp-tar');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('dist', function() {
    gulp.src(['ws.js', 'fileservice.js', 'dataservice.js'])
      .pipe(gulp.dest('dist/'));
    gulp.src(['app/**'])
        .pipe(gulp.dest('dist/app'));
    gulp.src(['node_modules/**'])
      .pipe(gulp.dest('dist/node_modules'));
});

gulp.task('tar', function () {
  gulp.src('dist/**')
  .pipe(tar(`photosCloud-${new Date().toLocaleString()}.tar`))
  .pipe(gulp.dest('binaries/'));
})