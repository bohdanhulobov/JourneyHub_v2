const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const babel = require("gulp-babel");
const browserSync = require("browser-sync").create();
const replace = require("gulp-replace");
const { exec } = require("child_process");

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
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      }),
    )
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
    .pipe(replace('href="dist/css/', 'href="css/'))
    .pipe(replace('src="dist/images/', 'src="images/'))
    .pipe(replace('src="dist/js/', 'src="js/'))
    .pipe(gulp.dest(DIST_DIR))
    .on("end", () => console.log("HTML files copied"));
}

function copyImages(done) {
  console.log("Copying images...");
  exec("node scripts/copyImages.js", (err, stdout, stderr) => {
    if (err) {
      console.error(`Error copying images: ${stderr}`);
      done(err);
    } else {
      console.log(stdout);
      done();
    }
  });
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
      baseDir: "./dist",
    },
  });
  gulp.watch(SCSS_DIR, compileSass);
  gulp.watch(JS_DIR, minifyJs);
  gulp.watch("./*.html", copyHtml).on("change", browserSync.reload);
}

const build = gulp.series(
  compileSass,
  minifyJs,
  copyHtml,
  copyImages,
  copyFonts,
);

exports.default = gulp.series(build, watchFiles);
exports.build = build;
