// Define plugins
const gulp = require("gulp");
const babel = require("gulp-babel");
const fileinclude = require("gulp-file-include");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const browserSync = require("browser-sync").create();

// Define source and destination directories
const srcDir = "src";
const destDir = "public";

// Define gulp const
const { src, series, parallel, dest, watch } = require("gulp");

// Copy PHP files
function php() {
    return src(`${srcDir}/*.php`).pipe(gulp.dest(destDir));
}

// Include HTML partials
function html() {
    return src([`${srcDir}/**/*.html`, `!${srcDir}/includes/**`])
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest(destDir));
}

// Compile (and minify) SASS
let sassOptions = {
    errLogToConsole: true,
    outputStyle: "expanded", // ['compressed','expanded']
};

function style() {
    return src(`${srcDir}/sass/style.scss`)
        .pipe(sass(sassOptions).on("error", sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest(destDir + "/css"));
}

// Compile and Minify JS
function js() {
    return src([
        `${srcDir}/js/jquery-3.5.1.js`,
        `${srcDir}/js/!(index)*.js`,
        `${srcDir}/js/index.js`,
    ])
        .pipe(
            babel({
                presets: ["@babel/env"],
                compact: false,
            })
        )
        .pipe(concat("index.js"))
        .pipe(uglify())
        .pipe(gulp.dest(destDir + "/js"));
}

// Minify Images
function image() {
    return src(`${srcDir}/images/*`)
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 65, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{ removeViewBox: true }, { cleanupIDs: true }],
                }),
            ])
        )
        .pipe(gulp.dest(destDir + "/images"));
}

function browser() {
    return browserSync.init({
        notify: false,
        // open: false,
        server: {
            baseDir: destDir,
        },
    });
}

// Watch files
function serve() {
    browser();
    watch(`${srcDir}/sass/*`).on("change", series(style, browserSync.reload));
    watch(`${srcDir}/*.php`).on("change", series(php, browserSync.reload));
    watch(`${srcDir}/js/*`).on("change", series(js, browserSync.reload));
    watch(`${srcDir}/includes/*`).on(
        "change",
        series(html, browserSync.reload)
    );
    watch(`${srcDir}/*.html`).on("change", series(html, browserSync.reload));
    watch(`${srcDir}/images/*`).on("change", series(image, browserSync.reload));
}

// Export tasks
exports.html = html;
exports.php = php;
exports.style = style;
exports.image = image;
exports.js = js;
exports.serve = serve;
exports.browser = browser;
exports.build = series(php, html, style, js, image);
