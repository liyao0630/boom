const gulp = require('gulp'),
  clean = require('gulp-clean'),
  nodemon = require('gulp-nodemon'),
  bs = require('browser-sync').create(),
  tslint = require('gulp-tslint'),
  ts = require('gulp-typescript'),
  tsProject = ts.createProject("tsconfig.json"),
  sourcemaps = require('gulp-sourcemaps'),
  proxy = require('http-proxy-middleware');

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
  return gulp.src('build', {
    read: false
  })
    .pipe(clean());
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src('src/**/*.ts')
    .pipe(tslint({
      formatter: 'prose'
    }))
    .pipe(tslint.report());
});


gulp.task('compile', () => {
  return gulp.src('src/**/*.ts')
    // .pipe(sourcemaps.init())
    .pipe(tsProject())
    // .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('build/src/'));
})

/**
 * Copy config files
 */
gulp.task('configs', (cb) => {
  return gulp.src(['src/config/**/*.yml', 'src/config/**/*.json'])
    .pipe(gulp.dest('./build/src/config'));
});

/**
 * Copy view files
 */
gulp.task('view', () => {
  return gulp.src('src/view/**/*.*')
    .pipe(gulp.dest('./build/src/view'));
});

/**
 * Copy assets files
 */
gulp.task('assets', () => {
  return gulp.src('assets/**/*.*')
    .pipe(gulp.dest('./build/assets'));
});

/**
 * Build the project.
 */
gulp.task('build', gulp.series('tslint', 'compile', 'configs', 'view', 'assets', function build(done) {
  console.log('Building the project ...');
  done();
}));

/**
 * Run nodemon.
 */
gulp.task('nodemon', function nodemonCreate(done) {
  nodemon().on('start', function () {
    bs.reload();
    done()
  }).on('quit', function () {
  }).on('restart', function (files) {
  });
})

/**
 * When started, delay refresh
 */
gulp.task('bs', function bsDelay(done) {
  bs.reload();
  done()
});

gulp.task('watch', function watch(done) {
  gulp.watch('src/**/*.ts', gulp.series('tslint', 'compile'))
  gulp.watch('assets/**/*.*', gulp.series('assets'))
  gulp.watch('src/view/**/*.*', gulp.series('view'))
  gulp.watch(['src/config/**/*.yml', 'src/config/**/*.json'], gulp.series('configs'))
  done()
})

/**
 * Start the service
 */
gulp.task('server', gulp.series('nodemon', function browserSync(done) {
  bs.init({
    proxy: {
      target: 'http://localhost:9530'
      /* ,
            middleware: [proxy(['/user/*'], {
              target: 'http://h5.7k7k.com',
              changeOrigin: true
            })] */
    },
    port: 3010,
    notify: false // 更新提示关闭
  }, () => {
    console.log(234)
    done()
  })
  done()
}))

gulp.task('dev', gulp.series('build', 'server', 'watch', function (done) {
  done()
}))