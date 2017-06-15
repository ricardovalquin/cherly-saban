var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var friendlyFormatter = require("eslint-friendly-formatter");
var reload = browserSync.reload;
var eslintErrorOccured   = false;
var htmlTagInclude = require('gulp-html-tag-include');

gulp.task('bower', function () {
  gulp.src('app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest('app/'));
});

gulp.task('injectFiles', function() {
  var target = gulp.src('app/index.html');
  return target.pipe($.inject(gulp.src(['!app/bower_components/**/*.js', 'app/**/*.js', 'app/assets/css/**/*.css'], {read: false}), {ignorePath: 'app', addRootSlash: false}))
    .pipe(gulp.dest('app/'));
});

gulp.task('html-include', function() {
  return gulp.src(['app/**/*.html', '!app/components/**/*.html'])
    .pipe($.plumber())
    .pipe(htmlTagInclude())
    .pipe(gulp.dest('./tmp/'))//.tmp/
    .pipe(reload({stream: true}));
});

gulp.task('injectCssFiles', function(){
  var target = gulp.src('app/index.html');

  return target.pipe($.inject(gulp.src(['app/assets/css/**/*.css'], {read: false}), {ignorePath: 'app', addRootSlash: false}))
    .pipe(gulp.dest('./tmp/'));
});

gulp.task('styles', function(){
  gulp.src('app/assets/css/**/*.scss')
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }))
    //.pipe($.shorthand)
    .pipe($.autoprefixer('last 2 versions', 'safari 5', 'ie6', 'ie7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    //.pipe($.cssmin)
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('tmp/assets/css/'))
    .pipe(browserSync.stream({match: '**/*.css'}));
  //notify
});

gulp.task('images', function () {
  return gulp.src(['app/assets/img/**/*.*'])
    .pipe(gulp.dest('tmp/assets/img/'))
});

gulp.task('move-js-files', function () {
  return gulp.src(['app/assets/**/*.js'])
    .pipe(gulp.dest('tmp/assets/'))
});

gulp.task('move-fonts-files', function () {
  return gulp.src(['app/assets/fonts/**/*.*'])
    .pipe(gulp.dest('tmp/assets/fonts/'))
});

var jsCustomSRC = ['app/**/*.js', '!node_modules/**/*.js'];

gulp.task('lint', function () {
  return gulp.src(jsCustomSRC)
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
    .pipe(eslint())
    .pipe($.plumber({
      errorHandler: function (err) {
        eslintErrorOccured = true;
        $.notify.onError({
          title:    "Eslint Error",
          message:  "Error: <%= error.message %>"
        })(err);
        this.emit('end');
      }
    }))
    .pipe(eslint.results(function (results) {
      // Called once for all ESLint results.
      console.log('Total Results: ' + results.length);
      console.log('Total Warnings: ' + results.warningCount);
      console.log('Total Errors: ' + results.errorCount);

      if(results.errorCount){
        throw new gutil.PluginError({
          plugin: eslint,
          message: 'Error: Please check your js files!'
        });
      }

    }))

    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format(friendlyFormatter))
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    .pipe(eslint.failAfterError());
});

gulp.task('js-watch', ['lint'], browserSync.reload);

gulp.task('serve', ['move-fonts-files', 'move-js-files', 'images', 'html-include', 'styles', 'injectCssFiles', 'injectFiles'], function(){
  gulp.watch('app/assets/css/**/*.scss', ['styles']);
  gulp.watch("app/**/*.js", ['js-watch', 'move-js-files']);
  gulp.watch('app/**/*.html', ['html-include']);
  gulp.watch('app/**/*.html').on('change', reload);
  browserSync.init({
    server: './tmp/'
  });
});
