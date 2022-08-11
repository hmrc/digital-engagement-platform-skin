'use strict';

var gulp = require('gulp');
const del = require('del');
var jest = require('gulp-jest').default;
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');

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

gulp.task('compile_all', function () {
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
        .pipe(gulp.dest('./app/assets/javascripts/bundle'));
});

gulp.task('delete_bundle', function () {
    return del('./app/assets/javascripts/bundle/*.js');
});

gulp.task(
    'bundle',
    gulp.series('delete_bundle', 'compile_all', (done) => {
        done();
    })
);

