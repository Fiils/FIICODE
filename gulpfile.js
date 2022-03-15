const gulp = require('gulp')
const postcss = require('gulp-postcss')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

gulp.task('sass', function() {
    const processors = [
        autoprefixer,
        cssnano
    ]
    return gulp
        .src('./src/styles/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(gulp.dest('./src/styles/css'))
})

gulp.task('watch', function() {
    gulp.watch('./src/styles/scss/**/*.scss', gulp.series('sass'))
})

gulp.task('default', gulp.series('sass', 'watch'))

