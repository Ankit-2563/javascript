// Core idea: A function is a reusable block of code

// Simple function with no parameters
function greet() {
  console.log("Hello!");
}

// Call (invoke) the function
greet();
greet(); // You can reuse it as many times as you want

// Function that returns a value
function getWelcomeMessage() {
  return "Welcome to JavaScript functions!";
}

const message = getWelcomeMessage();
console.log(message);

// Function that takes input (parameters) and returns output
function add(a, b) {
  // a and b are parameters (placeholders)
  return a + b;
}

const sum = add(5, 10); // 5 and 10 are arguments (real values)
console.log("5 + 10 =", sum);
