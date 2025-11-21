// Function Expression: function stored in a variable
// NOT hoisted (cannot call before the line where it is defined)

// Function expression
const multiply = function (a, b) {
  return a * b;
};

console.log("2 * 3 =", multiply(2, 3));

// Arrow Function: shorter syntax, especially for small functions

// Basic arrow function with explicit return
const subtract = (a, b) => {
  return a - b;
};

console.log("10 - 4 =", subtract(10, 4));

// Arrow function with implicit return (one-line)
const square = (n) => n * n;

console.log("square(5) =", square(5));

// Arrow function with no parameters
const sayHi = (name) => console.log("Hi from arrow function", (name = "Ankit"));

sayHi();
