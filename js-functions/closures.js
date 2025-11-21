// Closure: a function that remembers variables from its parent scope
// even after the parent function has finished

function outer() {
  let count = 0; // this variable is inside outer

  function inner() {
    // inner can still access count even after outer finishes
    count++;
    console.log("count =", count);
  }

  return inner;
}

const increment = outer(); // outer() returns inner function

increment(); // count = 1
increment(); // count = 2
increment(); // count = 3

// Another closure example: configurable greeter
function createGreeter(greeting) {
  return function (name) {
    console.log(greeting + ", " + name + "!");
  };
}

const sayHello = createGreeter("Hello");
const sayNamaste = createGreeter("Namaste");

sayHello("Ankit");
sayNamaste("Ankit");
