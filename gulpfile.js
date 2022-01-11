const gulp = require("gulp");
const uglify = require("gulp-uglify");
const livereload = require("gulp-livereload");
const concat = require("gulp-concat");
const autoprefixer = require("gulp-autoprefixer");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const minify = require("gulp-minify-css");
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel"); 

// paths ________________________________________________________________________________
const PATH_DIST = "public/dist"
const PATH_SCRIPT = "public/scripts/**/*.js";
const PATH_SCSS = "public/scss/*.scss";
const PATH_HTML = "public/index.html"


// script ________________________________________________________________________________
gulp.task("script", () =>
    gulp.src(PATH_SCRIPT)
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH_DIST))
        .pipe(livereload())
);

// watch ________________________________________________________________________________
gulp.task("watch", () => {
    require("./server"); // live server
    gulp.watch(PATH_SCRIPT, gulp.series("script"));
    gulp.watch(PATH_SCSS, gulp.series("styles"))
})


// styles ________________________________________________________________________________
gulp.task("styles", () =>
    gulp.src(PATH_SCSS)
        .pipe(plumber()) // error handling
        .pipe(sourcemaps.init()) // source map
        .pipe(sass({ outputStyle: "compressed" }).on('error', sass.logError)) // scss 
        .pipe(autoprefixer())
        .pipe(sourcemaps.write()) // source map
        .pipe(gulp.dest(PATH_DIST))
        .pipe(livereload())
    // .pipe(concat("style.css"))
    // .pipe(minify())
)