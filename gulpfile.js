'use strict';

var gulp = require('gulp');
const del = require('del');
var jest = require('gulp-jest').default;
const babel = require('gulp-babel');
const rollup = require('rollup-stream');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');

gulp.task('jest', function () {
  return gulp.src('./test/uk/gov/hmrc/digitalengagementplatformskin/javascripts/').pipe(jest({
    "testRegex": "((\\.|/*.)(spec))\\.js?$",
    "automock": false,
    "verbose": true
  }));
});

gulp.task('clean:node_modules', function () {
  return del(['node_modules'], {force: true});
});

gulp.task('bundle', (done) => {
    return rollup({
      input: './app/assets/javascripts/hmrcChatSkin.js',
      format: 'iife',
      sourcemap: false
    })
    .pipe(source('hmrcChatSkin.js', './app/assets/javascripts/'))
    .pipe(buffer())
    .pipe(babel({
       "presets": [
         [
           "@babel/preset-env",
           {
            "targets": "ie >= 11"
           }
         ]
       ]
	}))
    .pipe(gulp.dest('./app/assets/javascripts/bundle'));
    done();
});
