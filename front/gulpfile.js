"use strict";

require('dotenv').config()

global.$ = {
  gulp: require('gulp'),
  gp: require('gulp-load-plugins')(),
  browserSync: require('browser-sync').create(),
  autoprefixer: require('autoprefixer'),
  uglify: require('gulp-uglify-es').default,
  fs: require('fs'),
  del: require('del'),

  config: {
    src: require('./gulp/config'),

    toggle: {
      minHtml: false, // true / false
      fullCss: false, // true / false
      fullJs: false, // true / false
      resizeImg: false, // true / false
      mediaEndFile: false, // true / false
    },

    paths: {
      pug: 'src/*.pug',
      css: 'src/assets/sass/*.scss',
      js: 'src/assets/js/*.js',
      images: {
        img: 'src/assets/img/',
        webp: 'src/assets/img/webp/',
        svg: 'src/assets/img/sprite/**/*.svg'
      },
      fonts: 'src/assets/fonts/',
      other: 'src/other/'
    },
    output: {
      path: 'dist',
      pathCss: 'dist/assets/css/',
      pathJs: 'dist/assets/js/',
      pathImg: 'dist/assets/img/',
      pathFonts: 'dist/assets/fonts/'
    },
    watch: {
      pug: 'src/**/*.pug',
      css: 'src/assets/sass/**/*.scss',
      js: 'src/assets/js/**/*.js',
      images: {
        img: 'src/assets/img/*.{jpg,png,gif,svg,ico,webp}',
        webp: 'src/assets/img/webp/*.{jpg,png,gif}',
        svg: 'src/assets/img/sprite/**/*.svg'
      },
      fonts: 'src/assets/fonts/',
      other: 'src/other/'
    }
  }
}

$.config.src.forEach(function (path) {
  require(path)();
});

const build = $.gulp.series('clean', $.gulp.parallel('pug','styles','scripts','fonts','images','sprite','copy'));
const watch = $.gulp.series($.gulp.parallel('serve', 'watcher'));

exports.build = build;
exports.watch = watch;

exports.default = watch;
