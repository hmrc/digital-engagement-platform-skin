'use strict';

const gulp = require('gulp');
const del = require('del');
const jest = require('gulp-jest').default;
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const wrap = require('gulp-wrap');
const buffer = require('vinyl-buffer');
const babel = require('gulp-babel');
const browserify = require('browserify');
const tsify = require('tsify');

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
        .bundle()
        .pipe(source('hmrcChatSkin.js'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();')) // IIFE
        .pipe(buffer())
        .pipe(
            babel({
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            targets: 'ie >= 10',
                        },
                    ],
                ],
            })
        )
        .pipe(uglify())
        .pipe(gulp.dest('./app/assets/javascripts/bundle'));

    done();
});

