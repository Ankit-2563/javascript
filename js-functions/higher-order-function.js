// Higher-Order Function (HOF)
// 1. Takes a function as an argument OR
// 2. Returns a function

// HOF that takes a function
function repeat(times, action) {
  for (let i = 0; i < times; i++) {
    action(i); // call the function passed in
  }
}

// Use repeat with different callbacks
repeat(3, (index) => {
  console.log("Running action, index:", index);
});

repeat(2, () => {
  console.log("Another action");
});

// HOF that returns a function
function createMultiplier(factor) {
  // This inner function "remembers" factor (closure)
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("double(5) =", double(5));
console.log("triple(5) =", triple(5));
