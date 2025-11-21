// Dynamic Typing in JavaScript - Clean & Simple Examples

// 1. A variable changing types
let value = 10; // number
console.log(value); // 10

value = "Hello"; // string
console.log(value); // "Hello"

value = true; // boolean
console.log(value); // true

value = [1, 2, 3]; // array
console.log(value); // [1, 2, 3]

value = { name: "Ankit" }; // object
console.log(value); // { name: "Ankit" }

// -------------------------------------------------------------

// 2. Type is associated with the VALUE, not the variable
let a = 20;
console.log(typeof a); // "number"

a = "Exodus";
console.log(typeof a); // "string"

a = false;
console.log(typeof a); // "boolean"

// -------------------------------------------------------------

// 3. Errors appear at RUNTIME (not before)
let x = 10;

x = "hello";
console.log(x.toUpperCase()); // Works (hello -> HELLO)

x = 100;
// console.log(x.toUpperCase()); // ❌ Runtime Error: toUpperCase is not a function

// -------------------------------------------------------------

// 4. JavaScript auto-converts values (sometimes incorrectly)
function add(a, b) {
  return a + b; // '+' can be math OR string concatenation
}

console.log(add(10, 5)); // 15 (number)
console.log(add(10, "5")); // "105" (string concatenation)
console.log(add("10", 5)); // "105"

// -------------------------------------------------------------

// 5. Same function accepting ANY type
function printValue(v) {
  console.log(v);
}

printValue(100); // number
printValue("hello"); // string
printValue(true); // boolean
printValue([1, 2, 3]); // array
printValue({ a: 1 }); // object
printValue(null); // null
printValue(undefined); // undefined
