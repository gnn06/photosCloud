const gulp = require('gulp');
const zip = require('gulp-zip');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('dist', function() {
    gulp.src(['src/*'])
      .pipe(gulp.dest('dist/'));
    gulp.src(['src/app/**'])
        .pipe(gulp.dest('dist/app'));
    gulp.src(['node_modules/**'])
      .pipe(gulp.dest('dist/node_modules'));
});

gulp.task('zip', function () {
  gulp.src('dist/**')
  .pipe(zip(`photosCloud-${new Date().toLocaleString().substr(0,9)}.zip`))
  .pipe(gulp.dest('binaries/'));
})