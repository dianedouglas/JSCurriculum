node js by example
fundamentals

node is a framework, a command line tool. installation makes the 'node' command available in commandline. node comes with 2 executables - node and npm.
npm = package manager to download modules (also called packages. modules = packages)
npm is a commandline tool too that downloads and uploads node packages

high performance servers work with nonblocking input/output operations to handle simultaneous requests
processing activities continue while an ongoing task is being finished
Most servers in Java or C use multithreading for this - each request is a new thread.

Node uses a single-threaded architecture
we run different node.js processes and use a load balancer to distribute requests between them.
node is event-loop-based.

Node.js is made of 3 things:

- V8 = google's JS engine used in chrome.
- A thread pool handles file in/out operations and any blocking system calls.
- event loop library.

On top of these three blocks, we have several bindings that expose low-level
interfaces. The rest of Node.js is written in JavaScript.
Almost all the APIs that we see as built-in modules are written in JS

/////////////////////////////
Installation
nodejs.org, download osx/windows installers
Linux:  Node.js is available in the APT
package manager. The following commands will set up Node.js and Node Package
Manager (NPM):

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
/////////////////////////////

use built in module 'http' to create a server in `server.js`
then run it with node command
`node server.js`

var http = require('http');
http.createServer(function (req, res) {
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.end('Hello World\n');
}).listen(9000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:9000/');

/////////////////////////////
Node has a global function called 'require' which lets us pull in and use external modules.
createServer and listen are methods defined on the built in http module.
createServer returns a new web server object. then we can run the listen method on that, or the close method to stop the server from accepting new connections.
callback function always accepts the request and response objects.
the first one holds info about the incoming request such as if it is a get or post.
/////////////////////////////
Callbacks
the createServer method is defined to accept a function as an argument called a callback.
There is some code inside of the 'createServer' method which says the callback function should be triggered every time a new request comes to the server.
This idea is common in node.js and other advanced javascript programs: we pass a function into another function as an argument so that it can be executed later, or repeatedly every time an event happens, or to be triggered when a process finishes.
This is similar to the click event listeners you have already used - when we attach a click event handler we define a function that we want to run every time the user clicks on something. When we pass a callback function into a function like createServer, we are lining up some tasks to do at a particular time. In this case, whenever a server request comes in, our callback function formats a response which prints 'hello world' on the screen.

Then, we assign a port number to listen on by calling the listen method, chaining it onto the createServer call.
////////////////////////////
???
JS language does not let you define real classes. Everything in JS is an object.
We inherit properties and functions from one object to another, not from a class definition. But node takes concepts from commonjs.
???

encapsulate logic in modules.
every module defined in its own file. Think of this as a class definition.
//book.js
exports.name = 'Node.js by example';
exports.read = function() {
  console.log('I am reading ' + exports.name);
}

Then, we could use this module in another module by requireing it.

//script.js
var book = require('./book.js');
book.read();


Then run it with:
node script.js
///////////////
Using module.exports
our file is turned into a module object with a property called exports.
Exports has all of our functions and properties defined on it.
Careful not to overwrite the entire module.
exports.thing = 'blah';
module.exports = function() {};
This overwrites the thing property.
if you try to access the thing property, you get 'TypeError: undefined is not a function'
just use 'exports' - best practice. you can use module.exports too, but the most important thing is to not combine them.
///////////////

if you need more than one instance of a module then export a function that produces a different object every time. like a factory.

module.exports = function() {
  var ratePoints; //property
  return {
    rate: function(points) { //setter
      ratePoints = points;
    },
    getPoints: function() { //getter
      return ratePoints
    }
  } //end of object.
}

//////////////////

group our logic into building blocks. creating a module
every module in its own directory with a metadata file called package.json.
at least 2 properties in this file: name and version.
place all your code in the same directory. if you were to publish it to the NPM registry all the files in your folder will go with it.
create an index.js file (entry point default?)

if you were to publish your module you'd go to the directory containing package.json and run 'npm publish'
This lists your module in the npm site so anyone can download it!
'
//////////////////
using modules

 - you can install manually with 'npm install my-awesome-module'
 downloads module and puts it in node_modules folder
 --save if you have a project manifest file.
 --save-dev if it is for dev only.

 - you can install it globally with -g flag. then to use it in a project add it to package.json.

 - module dependencies are other modules. list the ones you need in the package.json file for your project

 npm install to install your dependencies. this lets you install several dependencies at once and it makes your module self documented and transferable.
 other programmers immediately know what you project uses.
/////////////////
make a module into a command line tool.
add the 'bin' property to your package.json to point to the entry point of our app.

{
 "name": "my-awesome-nodejs-module",
 "version": "0.0.2",
 "bin": "index.js"
}

incidentally if you have "main" : "entrypoint.js" then you can run "npm start" to have node run the entrypoint.js file.
also

"scripts": {
       "start": "node server.js"
     },

this means that "npm start" will run the command "node server.js" just like in the terminal.

we also update the version property. that's important if you're registering.
MAJOR.MINOR.PATCH. So, we as developers should increment the following:
• MAJOR number if we make incompatible API changes
• MINOR number if we add new functions/features in a
backwards-compatible manner
• PATCH number if we have bug fixes

in your package.json manifest file you may see versions like  2.12.*.
this means we want exactly the major version 2, the minor version 12, and any bug fixes added in the future.
>=1.2.6 means match any equal or greater version. then gets most recent.

After updating this, you send changes to the registry with `npm publish`

By adding the 'bin' property we now have a command available in the terminal which runs our program from the entry point file.
```
$ my-awesome-nodejs-module
```
now npm install will get the new one.
/////////////////
node also has built in modules to help with writing backend applications.
for ex: http module, 'fs' from file system is the module for read/write files.

var fs = require('fs');
fs.writeFile('data.txt', 'Hello world!', function (err) {
 if(err) { throw err; }
 console.log('It is saved!');
});

most api functions have synchronous versions. so you could do this
fs.writeFileSync('data.txt', 'Hello world!');
without the callback function. but this synchronous version "blocks the event loop". means that while saving the file, all our JS is paused. Best practice to use asynchronous versions. for example: to read a file.

fs.readFile('data.txt', function(err, data) {
 if (err) throw err;
 console.log(data.toString());
});
////////////////////
events module built into node

//load module
var events = require('events');
//create an eventEmitter object by calling the eventEmitter (constructor?) function built into the events module.
var eventEmitter = events.eventEmitter();
//define function to trigger when a particular event happens.
var somethingHappen = function() {
  console.log('whatev');
}
//set the 'something-happen' event to trigger the 'somethingHappen' function by calling the 'on' method on our eventEmitter object. Then we actually call it by emitting the 'something-happen' event with the 'emit' method. also part of eventEmitter object.
//observer design pattern. we are 'subscribed' to the eventEmitter object because of the 'on' method. emit function 'fires' the event and the 'somethingHappen' 'handler' is executed.

dispatch an event from our book module when someone rates it.

// book.js
//load utilities module - includes the 'inherits' method. load events too.
var util = require("util");
var events = require("events");
// create a variable called 'Class' equal to an empty function.
var Class = function() { };

//call the inherits method and pass in the class variable as well as the events.EventEmitter property (which is a function to create EventEmitter objects)
//this lets Class inherit properties from the events.EventEmitter.
util.inherits(Class, events.EventEmitter);
//then we add our properties (functions and variables that belong to the class) as part of the Class prototype. This way it inherits methods from EventEmitter but includes our functionality too.
Class.prototype.ratePoints = 0;
Class.prototype.rate = function(points) {
 ratePoints = points;
 this.emit('rated');
};
Class.prototype.getPoints = function() {
 return ratePoints;
}
//finally we export our class
module.exports = Class;


Now to use this

//load our class definition
var BookClass = require('./book.js');
// make a new instance of it int he variable 'book'
var book = new BookClass();
//then use the 'on' method to subscribe to the 'rated' event - print out the points when the book has been rated.
book.on('Rated', function(){
  console.log("rated: " + book.getPoints);
});
book.rate(10); // trigger it by rating. even though this line is last, the function listed above doesn't occur until you've rated a book.

////////////////////////////////////
child processes
you can execute shell commands from a node script.
// exec.js
var exec = require('child_process').exec;
exec('ls -l', function(error, stdout, stderr) {
 console.log('stdout: ' + stdout);
 console.log('stderr: ' + stderr);
 if (error !== null) {
 console.log('exec error: ' + error);
 }
});

// or use spawn for streams.
var spawn = require('child_process').spawn;
var command = spawn('git', ['push', 'origin', 'master']);
command.stdout.on('data', function (data) {
 console.log('stdout: ' + data);
});
command.stderr.on('data', function (data) {
 console.log('stderr: ' + data);
});
command.on('close', function (code) {
 console.log('child process exited with code ' + code);
});
instead of a single callback to run when its done, this sends you the printout and errors as they happen. streams dispatch events and if we subscribe to the events we will get the output of the command as it is produced.

///////////////////////////////////////

PHP needs a server that accepts the requests and passes them to the PHP interpreter. Then, the PHP code is processed and the response is delivered to the user again by the server.  In the Node.js world, we do not have a
separate external server. Node.js itself plays that role. It is up to the developer to
handle the incoming requests and decide what to do with them.

The first layer of every node server usually deals with routing. it parse's the request's url and decides what to do.
server can also act as an api and perform actions related to business logic. for example, storing a new user in the database.

incoming request -> URL parsed -> either serve files or run business logic. files get served to browser, business logic interacts with the database.

////////////////////

task runner and building system.

- increase performance of our website we need to merge all js into a single file and compress it. css too. faster causde the browser makes fewer requests to the server.
- grunt and gulp are both task runners and build systems.
- gulp uses a config file called gulpfile.js while grunt has a different name.
- gulp is streaming based. does not store anything on the disk when it is working. grunt creates temp files.
- gulp lets you write your tasks like a regular nodejs script.

npm install -g gulp
plugins to use: gulp-concat, gulp-uglify, gulp-rename

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
gulp.task('js', function() {
 gulp.src('./src/**/*.js')
 .pipe(concat('scripts.js'))
 .pipe(gulp.dest('./build/'))
 .pipe(rename({suffix: '.min'}))
 .pipe(uglify())
 .pipe(gulp.dest('./build/'))
});
gulp.task('watchers', function() {
 gulp.watch('src/**/*.js', ['js']);
});
gulp.task('default', ['js', 'watchers']);

***js task

gulp.src('./src/**/*.js')
- get all .js files inside of any folders inside of the 'src' folder, in top level of project directory.

.pipe(concat('scripts.js'))
- the concat method takes all the code and puts it into 'scripts.js'

.pipe(gulp.dest('./build/'))
- save the file into a 'build' folder, also in top level of project directory.

.pipe(rename({suffix: '.min'}))
- add the .min suffix to the file

.pipe(uglify())
- uglify module minifies our code.

.pipe(gulp.dest('./build/'))
- put the completed code in the build folder.



***watchers task
gulp.watch('src/**/*.js', ['js']);

monitor all js for changes and run the 'js' task if any of them change.

***default task runs 'js' and 'watchers' when you type 'gulp'
///////////////////////////
GULP TASKS:

JS TASKS
automatically concat and minify js

TESTING TASKS
automatically run tests when either js or specs are changed
///////////////////////////
npm install mocha -g

(says in an empty folder, make the test.js file:)
var assert = require('assert');
describe('Testing JSON reader', function() {
  it('should get json', function(done) {
    var reader = require('./JSONReader');
    assert.equal(typeof reader, 'object');
    assert.equal(typeof reader.read, 'function');
    done();
  });
});

// this says there should be a file called JSONReader.js in the current directory.
// we check that by saying the typeof the reader variable is an object.
// the second assert says that there should be a function in it called read.
// this fails until we create the file with a read function in it:

JSONReader.js

module.exports = {
  read: function() {
    // get JSON
    return {};
  }
}

Now we have a JSONReader module. it exports an object with the read method.
u can also run your tests with 'mocha ./test.js'


//side notes on MVC
Model triggers the rendering of the view. It is important to mention here
that the Model should not know about the representation of its data in the view
layer. All it has to do is send a signal to the view to notify that it is updated.

• Model: The Model is the part that stores the data or the state. It triggers an
update on the View once there is a change.

• View: The View is usually the part that the user can see. It is a direct
representation of the data or the state of the Model.

• Controller: The user interacts with the help of the Controller (sometimes
through the View). It can send commands to the Model to update its state.
In some cases, it can also notify the View so that the user can see another
representation of the Model.
However, in web development (especially the code that runs in the browser), the
View and the Controller share the same functions. Very often, there is no strict
distinction between the two. In this book, the controllers will also deal with UI
elements.
///////////////////////////////////////////////

CSS preprocessing

css preprocessors are tools that accept source and output css
Less and Sass are the two main ones.
should happen automatically with your task runner
• Gulp itself
• gulp-less: This is a plugin that wraps the Less preprocessor
• gulp-rename: This changes the name of the produced file
• gulp-minify-css: This compresses our CSS

var path = require('path');
var gulp = require('gulp');
var less = require('gulp-less');
var rename = require("gulp-rename");
var minifyCSS = require('gulp-minify-css');
gulp.task('css', function() {
  gulp.src('./less/styles.less')
  .pipe(less({
    paths: [ path.join(__dirname, 'less', 'includes') ]
  }))
  .pipe(gulp.dest('./static/css'))
  .pipe(minifyCSS({keepBreaks:true}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./static/css'));
});
gulp.task('watchers', function() {
  gulp.watch('less/**/*.less', ['css']);
});
gulp.task('default', ['css', 'watchers']);

/////////////////////////////////////////////
Concatenating your javascript reduces the number of requests by combining (?concatenating?) multiple JS files into as few files as possible.
Minifying your javascript reduces the sizes of JavaScript files by eliminating the wasted space that tends to be in most files created by a developer.

Separate JS processing for client side v server side javascript
client = run on browser, server = run on server
we want to keep our system split up into modules for encapsulation and easier debugging.
node has a built-in system for modules. encapsulate code in a file and use module.exports to create the public API
for client side js there is no such system. we need another library to allow us to make modules.

Browserify is a module that brings the require module of Node.js to the browser.


   var browserify = require('gulp-browserify');
   var uglify = require('gulp-uglify');
   gulp.task('js', function() {
     gulp.src('./js/app.js')
     .pipe(browserify())
     .pipe(gulp.dest('./static/js'))
     .pipe(uglify())
     .pipe(rename({suffix: '.min'}))
     .pipe(gulp.dest('./static/js'))
});
The src method accepts only one file.
It is our entry point.
This is the place where Browserify starts resolving dependencies.
The rest is the same.
We still use uglify for minification and rename to change the file name.

browserifying our client side js allows us to use the require function.
This lets us use backend modules and make calls to their functions based on client side interactions.
////////////////////////
adding bower with jquery and bootstrap.
npm install bower --save
bower init
npm install jquery --save
npm install bootstrap --save

<script src="bower_components/jquery/dist/jquery.min.js"></script>
<script src="bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
<link rel="stylesheet" href="bower_components/bootstrap/dist/css/bootstrap.min.css">
