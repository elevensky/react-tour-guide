import gulp        from 'gulp';
import babel       from 'gulp-babel';
import del         from 'del';
import react       from 'gulp-react';
import runSequence from 'run-sequence';
import stripDebug  from 'gulp-strip-debug';
import gulpif      from 'gulp-if';

gulp.task('clean', function(cb) {

  return del(['./dist/css/*', './dist/js/*'], cb);

});

gulp.task('styles', function() {

  return gulp.src('./lib/styles/**/*.css')
  .pipe(gulp.dest('./dist/css/'));

});

gulp.task('scripts', function() {

  return gulp.src('./lib/js/**/*.js')
  .pipe(babel({
      presets: ['es2015', 'stage-1']
  }))
  .pipe(react())
  .pipe(gulpif(global.isProd, stripDebug()))
  .pipe(gulp.dest('./dist/js/'));

});

gulp.task('dev', function() {

  global.isProd = false;

  runSequence(['styles', 'scripts']);

  gulp.watch('./lib/js/**/*.js',      ['scripts']);
  gulp.watch('./lib/styles/**/*.css', ['styles']);

});

gulp.task('prod', ['clean'], function() {

  global.isProd = true;

  return runSequence(['styles', 'scripts']);

});