/**
 * Gulp Plugins
 *
 */
var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rimraf = require('gulp-rimraf');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var tslint = require('gulp-tslint');
var webpack = require('webpack-stream');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var cleanCss = require('gulp-clean-css');
var googleWebFonts = require('gulp-google-webfonts');
var modifyCssUrls = require('gulp-modify-css-urls');
var gutil = require('gulp-util');
var named = require('vinyl-named');

/**
 *  Gulp config
 */

var path = require('./gulp.config').path;
var fileName = require('./gulp.config').fileName;
var webpackConfig = require('./webpack.config.js');
var googleFontsConfig = require('./gulp.config').googleFontsConfig;

/**
 * Gulp Task
 *
 * Copy index.html to dist folder
 */
gulp.task('html', function() {
    gulp.src('./src/view/index.html')
        .pipe(gulp.dest('./dist'));
});

/**
 * Gulp Task
 *
 * Check syntax for correctness
 */
gulp.task('tslint', function() {
    return gulp.src('app/**/*.ts')
        .pipe(tslint({formatter: "verbose"}))
        .pipe(tslint.report());
});


/**
 * Gulp Task
 *
 * Compile app.scss to app.css
 */
gulp.task('scss', function() {
    return gulp.src(path.scss.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(cleanCss())
        .pipe(rename(fileName.scss))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(path.scss.dest))
        .pipe(connect.reload());
});


/**
 * Gulp Task
 *
 * Download and create css for google fonts
 *
 */

gulp.task('fonts-clear',function () {
   return gulp.src(path.googleFonts.rm, {read: false})
       .pipe(rimraf());
});

gulp.task('google-fonts',['fonts-clear'], function () {
    return gulp.src(path.googleFonts.src)
        .pipe(googleWebFonts(googleFontsConfig))
        .pipe(gulp.dest(path.googleFonts.dest));
});

gulp.task('fonts-url-fix',['google-fonts'],function () {
    return gulp.src('./src/scss/base/_fonts.scss')
        .pipe(modifyCssUrls({
            modify: function (url, filePath) {
                return url;
            },
            prepend: '../'
        }))
        .pipe(gulp.dest('./src/scss/base/'));
});

gulp.task('fonts',['fonts-url-fix']);

/**
 * Gulp Task
 *
 * Generate app.min.js, vendor.min.js, polyfills.min.js
 */
gulp.task('webpack', function () {
    return gulp.src([
            path.webpack.polyfills,
            path.webpack.vendor,
            path.webpack.boot])
        .pipe(named())
        .pipe(webpack(webpackConfig))
        .pipe(gulp.dest(path.webpack.dest));
});

/**
 * Gulp Tasks
 *
 * Remove images from dist
 * Optimize images and copy them to dist
 */
gulp.task('images-optimize', function () {
    return gulp.src(path.image.src)
        .pipe(imagemin())
        .pipe(gulp.dest(path.image.dest));
});

gulp.task('images-remove', function () {
    return gulp.src(path.image.rm, {read: false})
        .pipe(rimraf());
});

gulp.task('images', ['images-remove', 'images-optimize']);

/**
 * Gulp Server
 *
 * Start a server for testing your app.
 */
gulp.task('webserver', function() {
    connect.server({
        root: path.webserver.root,
        livereload: true,
        port: 8001,
        fallback: "src/view/index.html"
    });
});

/**
 *  Gulp watch
 *
 *  Watch all gulp tasks.
 */
gulp.task('watch', function () {
    gulp.watch(path.watch.view, ['html']);
    gulp.watch(path.watch.webpack, ['webpack']);
    gulp.watch(path.watch.scss, ['scss']);
    gulp.watch(path.watch.images, ['images']);
});

/**
 * Gulp Init
 *
 * Initialize all tasks and watchers.
 */
gulp.task('init', ['tslint', 'scss', 'html', 'webpack', 'images', 'watch', 'webserver']);

gulp.task('build',['html','scss','webpack']);
