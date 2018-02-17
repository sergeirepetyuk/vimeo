var gulp = require('gulp');
var fs = require("fs");
var {promisify} = require("util");
var browserSync = require('browser-sync').create();
const readFile = promisify(fs.readFile);

gulp.task('default', ['less', "mustache"], function() {
  gulp.watch('./src/styles/**/*.less', ['less']);
  gulp.watch("./src/images/*.*", ["copy"]);
  gulp.watch([
    './src/data/data.json',
    './src/**/*.html'
  ], ['mustache']);
});

var less = require('gulp-less');
var path = require('path');

gulp.task('less', function () {
  return gulp.src('./src/styles/**/*.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(gulp.dest('./docs/styles'));
});

var mustache = require("gulp-mustache");
gulp.task("mustache", async () => {
  const data = JSON.parse(await readFile("./src/data/data.json", "utf-8"));

  return gulp.src("./src/**/*.html")
  .pipe(mustache(data))
  .pipe(gulp.dest("./docs"));
})

gulp.task('copy', function () {
    gulp.src('./src/images/*.*')
        .pipe(gulp.dest('./docs/images/'));
});
gulp.task('server', function(){
    browserSync.init({
        server:{
            baseDir: "docs/"
        },
        files: ['docs/*.html','docs/*.styles','docs/images/*.*']
    });
});
