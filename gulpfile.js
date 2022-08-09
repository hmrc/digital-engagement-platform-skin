'use strict';

var gulp = require('gulp');
const del = require('del');
var jest = require('gulp-jest').default;
const babel = require('gulp-babel');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
var ts = require('gulp-typescript');

gulp.task('jest', function () {
  return gulp
    .src('./test/uk/gov/hmrc/digitalengagementplatformskin/javascripts/')
    .pipe(
      jest({
        testRegex: '((\\.|/*.)(spec))\\.js?$',
        automock: false,
        verbose: true,
      })
    );
});

gulp.task('clean:node_modules', function () {
  return del(['node_modules'], { force: true });
});

gulp.task('transpile_typescript', function () {
  return gulp
    .src('./app/assets/typescripts/*.ts')
    .pipe(
      ts({
        moduleResolution: 'node',
        target: 'ES6',
      })
    )
    .pipe(gulp.dest('./app/assets/typescripts/'));
});

gulp.task('combine_js', (done) => {
  return rollup({
    input: './app/assets/javascripts/hmrcChatSkin.js',
    format: 'iife',
    sourcemap: false,
  })
    .pipe(
      source(
        'hmrcChatSkin.js',
        './app/assets/javascripts/',
        './app/assets/typescripts/'
      )
    )
    .pipe(buffer())
    .pipe(
      babel({
        presets: [
          [
            '@babel/preset-env',
            {
              targets: 'ie >= 11',
            },
          ],
        ],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest('./app/assets/javascripts/bundle'));
});

gulp.task(
  'bundle',
  gulp.series('transpile_typescript', 'combine_js', (done) => {
    return del('./app/assets/typescripts/*.js');
    done();
  })
);

