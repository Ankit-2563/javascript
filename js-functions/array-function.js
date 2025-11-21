// Built-in higher-order functions: forEach, map, filter, reduce

const numbers = [1, 2, 3, 4, 5];

// forEach: run a function for each item (usually for side effects like logging)
console.log("forEach example:");
numbers.forEach((num) => {
  console.log("Number:", num);
});

// map: transform each item, returns a new array
const doubled = numbers.map((num) => num * 2);
console.log("original numbers:", numbers);
console.log("doubled:", doubled);

// filter: keep only items that satisfy a condition
const even = numbers.filter((num) => num % 2 === 0);
console.log("even numbers:", even);

// reduce: combine array into a single value
const sum = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0);

console.log("sum =", sum);
