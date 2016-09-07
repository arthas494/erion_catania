var gulp = require('gulp'),
    del = require('del'),
    changed = require('gulp-changed'),
    browserSync = require('browser-sync'),
    concat = require('gulp-concat'),
    htmlmin = require('gulp-htmlmin'),
    cssmin = require('gulp-cssmin'),
    // sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    gutil = require('gulp-util'),
    imagemin = require('gulp-imagemin'),
    filesize = require('gulp-filesize'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    revdel = require('gulp-rev-delete-original'),
    uncss = require('gulp-uncss'),
    plumber = require('gulp-plumber'),
    pump = require('pump'),
    flatten = require('gulp-flatten');


//-----------------------------------------
gulp.task('clean', function() {
    return del('build');
});

//-----------------------------------------
gulp.task('rev', ['css', 'js'], function() {
    return gulp.src(['build/css/*.css', 'build/js/*.js'], {base: 'build'})
        .pipe(rev())
        .pipe(revdel())
        .pipe(gulp.dest('build'))
        .pipe(rev.manifest())
        .pipe(gulp.dest('build'));
});

//-----------------------------------------
gulp.task('revreplace', ['rev'], function(){
  var manifest = gulp.src('build/rev-manifest.json');
  return gulp.src('src/*.html')//index.html
    .pipe(revReplace({manifest: manifest}))
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('build'))
    .pipe(filesize());
});

//-----------------------------------------
gulp.task('css', function() {
    del(['build/css/*.css']);
    return gulp.src('src/**/*.css')
        // .pipe(sourcemaps.init())
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        // .pipe(uncss({html: ['src/*.html']}))
        .pipe(cssmin())
        .pipe(filesize())
        // .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'))
});

//-----------------------------------------
gulp.task('js', function(cb) {
    del(['build/js/*.js']);
pump([
        gulp.src('src/**/*.js'),
        //.on('end', function(){ gutil.log('START...'); })
        //sourcemaps.init(),
        concat('main.js'),
        uglify(),
        filesize(),
        //sourcemaps.write('.'),
        gulp.dest('build/js')],
        cb
        );
});

//-----------------------------------------
gulp.task('html', ['revreplace']);

//-----------------------------------------
gulp.task('img', function() {
    return gulp.src(['src/images/**/*.*','src/components/**/images/*.*'])
        .pipe(flatten())
        .pipe(changed('build/images'))
        .pipe(imagemin())
        .pipe(gulp.dest('build/images'))
        .pipe(filesize())
});

//-----------------------------------------
gulp.task('font', function() {
    return gulp.src('src/fonts/**/*.*')
        .pipe(changed('build/fonts'))
        .pipe(plumber())
        .pipe(gulp.dest('build/fonts'))
});

//-----------------------------------------
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

//-----------------------------------------
gulp.task('html-watch', ['html'], browserSync.reload);
gulp.task('img-watch', ['img'], browserSync.reload);
gulp.task('font-watch', ['font'], browserSync.reload);
gulp.task('rev-watch', ['revreplace'], browserSync.reload);

//-----------------------------------------
gulp.task('watch', ['browser-sync', 'revreplace', 'img', 'font'], function() {
    gulp.watch(['src/images/**/*.*','src/components/**/images/*.*'], ['img-watch']);
    gulp.watch('src/*.html', ['html-watch']);
    gulp.watch(['src/**/*.css','src/**/*.js' ], ['rev-watch']);
    gulp.watch('src/fonts/**/*.*', ['font-watch']);
});

