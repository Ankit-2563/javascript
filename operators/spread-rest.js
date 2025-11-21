// 06_spread_rest.js
console.log("=== Spread with arrays ===");

const arr = [1, 2, 3];
const newArr = [...arr, 4];

console.log("arr =", arr);
console.log("newArr =", newArr);

console.log("\n=== Spread with objects ===");

const obj = { a: 1 };
const newObj = { ...obj, b: 2 };

console.log("obj =", obj);
console.log("newObj =", newObj);

console.log("\n=== Spread in function arguments ===");

const nums = [10, 20, 5];
console.log("Math.max(...nums) =", Math.max(...nums));

console.log("\n=== Rest parameters ===");

function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
console.log("sum(1, 2, 3, 4) =", sum(1, 2, 3, 4));

console.log("\n=== Rest in objects ===");

const fullUser = { id: 1, name: "Ankit", age: 20 };
const { name, ...rest } = fullUser;

console.log("name =", name);
console.log("rest =", rest);
