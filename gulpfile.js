const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();

const SCSS_DIR = "./css/**/*.scss";
const JS_DIR = "./js/**/*.js";
const DIST_DIR = "./dist";

function compileSass() {
  console.log("Compiling SCSS...");
  return gulp
    .src(SCSS_DIR)
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${DIST_DIR}/css`))
    .pipe(browserSync.stream())
    .on("end", () => console.log("SCSS Compiled"));
}

function minifyJs() {
  console.log("Minifying JavaScript...");
  return gulp
    .src(JS_DIR)
    .pipe(sourcemaps.init())
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${DIST_DIR}/js`))
    .on("end", () => console.log("JavaScript Minified"));
}

function copyHtml() {
  console.log("Copying HTML files...");
  return gulp
    .src("./index.html")
    .pipe(gulp.dest(DIST_DIR))
    .on("end", () => console.log("HTML files copied"));
}

function copyImages() {
  console.log("Copying images...");
  return gulp
    .src("./images/**/*")
    .pipe(gulp.dest(`${DIST_DIR}/images`))
    .on("end", () => console.log("Images copied"));
}

function copyFonts() {
  console.log("Copying fonts...");
  return gulp
    .src("./fonts/**/*")
    .pipe(gulp.dest(`${DIST_DIR}/fonts`))
    .on("end", () => console.log("Fonts copied"));
}

function watchFiles() {
  console.log("Watching files...");
  browserSync.init({
    server: {
      baseDir: "./",
    },
  });
  gulp.watch(SCSS_DIR, compileSass);
  gulp.watch(JS_DIR, minifyJs);
  gulp.watch("./*.html").on("change", browserSync.reload);
}

const build = gulp.series(
  compileSass,
  minifyJs,
  copyHtml,
  copyImages,
  copyFonts,
);

exports.default = gulp.series(compileSass, minifyJs, watchFiles);
exports.build = build;
