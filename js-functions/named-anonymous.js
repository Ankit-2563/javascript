// Named function vs anonymous function

// Named function declaration
function sayHello() {
  console.log("Hello from named function");
}

sayHello();

// Anonymous function stored in a variable
const sayBye = function () {
  console.log("Bye from anonymous function");
};

sayBye();

// Anonymous function as argument (inline)
setTimeout(function () {
  console.log("This runs after 500ms (anonymous function)");
}, 500);

// Named function expression (less common but useful for debugging)
const doSomething = function doSomethingName() {
  console.log("I have an internal name 'doSomethingName'");
};

doSomething();
