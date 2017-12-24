const gulp = require('gulp');
const zip = require('gulp-zip');
var sass = require('gulp-sass');

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
});

gulp.task('sass', function () {
  return gulp.src('client/sass/**/*.scss')
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('client/styles'));
});
 
gulp.task('sass:watch', function () {
  gulp.watch('client/sass/**/*.scss', ['sass']);
});
