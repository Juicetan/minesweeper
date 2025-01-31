const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-dart-sass');

function serve(){
  browserSync.init({
    port: 3989,
    server: {
      baseDir: "./"
    }
  });

  watch('*.scss').on('change', buildSass);
  watch(['*.html', 'app/**/*.mjs']).on('change', browserSync.reload);
}

function buildSass(){
  return src("*.scss")
    .pipe(sass())
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

exports.serve = series(buildSass, serve);