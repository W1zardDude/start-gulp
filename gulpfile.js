const gulp = require("gulp");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const sass = require("gulp-sass");
const sourcemaps = require("gulp-sourcemaps");
const browserSync = require("browser-sync").create();

const cssFiles = ["./src/css/main.css", "./src/css/media.css"];
const jsFiles = ["./src/js/xhr.js", './src/js/joke.js', './src/js/favourite.js'];

function styles() {
  return gulp
    .src(cssFiles)
    .pipe(concat("style.css"))
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp
    .src(jsFiles)
    .pipe(concat("script.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch("./src/css/**/*.css", styles);
  gulp.watch("./src/js/**/*.js", scripts);
  gulp.watch("./src/scss/**/*.scss", gulp.series("sass-compile"));
  gulp.watch("./*.html").on("change", browserSync.reload);
}

gulp.task("styles", styles);
gulp.task("scripts", scripts);
gulp.task("watch", watch);
gulp.task("build", gulp.series(gulp.parallel(styles, scripts)));
gulp.task("dev", gulp.series("build", "watch"));

gulp.task("sass-compile", function () {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./src/css"));
});