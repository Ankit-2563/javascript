// Parameters are placeholders
// Arguments are actual values you pass

function greet(name) {
  // name is a parameter
  console.log("Hello", name);
}

greet("Ankit"); // "Ankit" is an argument
greet("Exodus");

// Default parameter (used when no argument is given)
function greetWithDefault(name = "Guest") {
  console.log("Hello", name);
}

greetWithDefault("Alice");
greetWithDefault(); // Uses "Guest"

// Function that returns a value
function square(num) {
  return num * num;
}

const result = square(6);
console.log("square(6) =", result);

// If you don't return anything, function returns undefined
function logOnly() {
  console.log("I do not return a value");
}

const value = logOnly();
console.log("Return of logOnly() is:", value); // undefined
