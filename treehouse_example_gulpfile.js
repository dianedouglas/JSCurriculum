'use strict';

var gulp = require('gulp');
//can't use a dash because subtraction.
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var maps = require('gulp-sourcemaps');
var del = require('del');

gulp.task("hello", function() {
  console.log("Hellos!")
});

// gulp.task("default", ["hello"], function(){
//   console.log("This is the default task.");
// });

gulp.task("concatScripts", function(){
  //takes an array of file names or string of single file.
  //careful of load order.
  return gulp.src([
    'js/jquery',
    'js/sticky/jquery.sticky.js',
    'js/main.js'])
  .pipe(maps.init())
  .pipe(concat('app.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest('js'));
});


gulp.task("minifyScripts", ["concatScripts"], function(){
  return gulp.src("js/app.js")
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest("js"));
});

gulp.task('compileSass', function() {
  return gulp.src("scss/application.scss")
    .pipe(maps.init())
    .pipe(sass())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('css'));
  //this is the master file with import directives pulling in other source files.
  //then pipe the sass source to the sass method. no parameters = compile into css
});

// gulp.task("build", ['concatScripts', 'minifyScripts', 'compileSass']);
//remove dependencies that already have been listed as dependencies in their tasks.
//add return statements to all tasks.
// gulp.task("build", ['minifyScripts', 'compileSass']);
//now add in a function body to create a production folder for all the compiled code.
gulp.task("build", ['minifyScripts', 'compileSass'], function(){
  return gulp.src(["css/application.css", "js/app.min.js", "index.html", "img/**", "fonts/**"], {base: './'}).pipe(gulp.dest('dist'));
});
//add clean task to remove dist folder before building a new one.
gulp.task("clean", function(){
  del('dist');
})


//use default task to run first clean, then build app for production.
// gulp.task('default', ['clean'], function(){
//   gulp.start('build'); //runs after the clean task dependency has finished.
// });

//rename default to full task for watchSass experiment. 
gulp.task('full', ['clean'], function(){
  gulp.start('build'); //runs after the clean task dependency has finished.
});

//watch method used to run tasks automatically based on file changes.
gulp.task('watchSass', function(){
  //no need for return since other tasks don't depend on this one.
  //no need for require since watch is built into gulp.
  //first param is names of files to watch.
  //need to remember to include subfiles. for ex: dont watch the compiled application.css, watch all sass files and the sass files they import.
  //you can use a globbing pattern to list a bunch of files, or an array including paths.
  // gulp.watch('scss/**/*.scss', ['compileSass']);
  //look in scss folder, all its subdirectories, find all files with a scss extension.
  //don't forget to wrap tasks to trigger in an array even if only one. if not using a globbing pattern then remember to put those in an array too.
  //you can use multiple globbing patterns in an array too just like multiple file names.
  //now if we change any sass file compileSass will automatically be run. you'll see it in the terminal.
  gulp.watch('scss/**/*.scss', ['full']);//try running the full clean/build automatitically as you develop.
});
