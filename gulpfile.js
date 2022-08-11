'use strict';

var gulp = require('gulp');
const del = require('del');
var jest = require('gulp-jest').default;
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
var wrap = require('gulp-wrap');
var buffer = require('vinyl-buffer');

var browserify = require('browserify');
var tsify = require('tsify');

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

gulp.task('bundle', (done) => {
    return browserify({
        basedir: '.',
        debug: true,
        entries: ['./app/assets/javascripts/hmrcChatSkin.js'],
        cache: {},
        packageCache: {},
    })
        .plugin(tsify)
        .transform('babelify', {
            presets: ['@babel/preset-env'],
            extensions: ['.ts'],
        })
        .bundle()
        .pipe(source('hmrcChatSkin.js'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets/javascripts/bundle'));

    done();
});

