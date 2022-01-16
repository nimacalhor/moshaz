const gulp = require("gulp");
const uglify = require("gulp-uglify");
const livereload = require("gulp-livereload");
const concat = require("gulp-concat");
const autoprefixer = require("autoprefixer");
const plumber = require("gulp-plumber");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require('gulp-postcss');
const minify = require("gulp-minify-css");
const sass = require('gulp-sass')(require('sass'));
const babel = require("gulp-babel");
const mqpacker = require("css-mqpacker");
const mergeRules = require("postcss-merge-rules");
const discardDuplicates = require("postcss-discard-duplicates");
const rtlcss = require("gulp-rtlcss");
const rename = require("gulp-rename");


// paths ________________________________________________________________________________
const PATH_DIST = "public/dist"
const PATH_SCRIPT = "public/scripts/**/*.js";
const PATH_SCSS = "public/scss/*.scss";
const PATH_HTML = "public/index.html"


// script ________________________________________________________________________________
gulp.task("script", () =>
    gulp.src(PATH_SCRIPT)
        .pipe(babel({ presets: ['@babel/env'] }))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATH_DIST))
        .pipe(livereload())
);

// watch ________________________________________________________________________________
gulp.task("watch", () => {
    require("./server"); // live server
    livereload.listen()
    gulp.watch(PATH_SCRIPT, gulp.series("script"));
    gulp.watch(PATH_SCSS, gulp.series("styles"))
})


// styles ________________________________________________________________________________

function styles() {
    return (
        gulp.src(PATH_SCSS)
            .pipe(sourcemaps.init()) // source map
            .pipe(plumber()) // error handling
            .pipe(sass().on('error', sass.logError)) // scss 
            .pipe(postcss([
                autoprefixer({
                    cascade: false
                }),
                mqpacker({
                    sort: true
                }),
                mergeRules(),
                discardDuplicates()
            ]))
            .pipe(sourcemaps.write()) // source map
            .pipe(minify())
            .pipe(gulp.dest(PATH_DIST))
            .pipe(rtlcss()) // Convert to RTL.
            .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename.
            .pipe(sourcemaps.write()) // Output source maps.
            .pipe(gulp.dest(PATH_DIST)) // Output RTL stylesheets.
    )
}

exports.styles = styles;
