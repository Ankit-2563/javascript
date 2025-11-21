// Pure function: same input -> same output, no side effects
// Impure function: modifies external state or relies on it

// Pure function example
function add(a, b) {
  return a + b;
}

console.log("add(2, 3) =", add(2, 3));
console.log("add(2, 3) again =", add(2, 3)); // always same output

// Impure function example: modifies external variable
let counter = 0;

function increaseCounter() {
  counter++; // changes variable outside the function
}

console.log("counter before:", counter);
increaseCounter();
console.log("counter after increaseCounter():", counter);

// Impure function example: modifies array argument
const numbers = [1, 2, 3];

function addNumberToArray(arr, number) {
  arr.push(number); // modifies original array
}

console.log("numbers before:", numbers);
addNumberToArray(numbers, 4);
console.log("numbers after:", numbers);
