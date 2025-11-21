// JavaScript Equality Comparison Examples
// Demonstrating the differences between == (loose) and === (strict)

// -------------------------------------------------------------
// 1. STRICT EQUALITY (===)
// No type coercion. Types must match.
// Coercion is JavaScript automatically converting one data type into another so an operation can be performed.

console.log(10 === 10); // true
console.log(10 === "10"); // false
console.log(false === 0); // false
console.log(null === undefined); // false

// Objects: reference comparison
const objA = { x: 1 };
const objB = { x: 1 };
const objC = objA;

console.log(objA === objB); // false (different objects)
console.log(objA === objC); // true (same reference)

// -------------------------------------------------------------
// 2. LOOSE EQUALITY (==)
// Type coercion happens if types differ.

console.log("5" == 5); // true
console.log(true == 1); // true
console.log(false == 0); // true
console.log("" == 0); // true
console.log("0" == 0); // true

// Special rule: null and undefined
console.log(null == undefined); // true
console.log(null == 0); // false
console.log(undefined == 0); // false

// -------------------------------------------------------------
// 3. WEIRD / CURSED COERCION CASES

console.log(0 == false); // true
console.log("" == false); // true
console.log("" == 0); // true

// Arrays convert to strings
console.log([] == ""); // true
console.log([] == 0); // true
console.log([0] == 0); // true
console.log([1] == "1"); // true

// -------------------------------------------------------------
// 4. LOOSE COMPARISON WITH OBJECT -> PRIMITIVE CONVERSION
// Arrays use toString() when being compared

console.log([1, 2] == "1,2"); // true

// -------------------------------------------------------------
// 5. NaN BEHAVIOR

console.log(NaN == NaN); // false
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN)); // true (correct check)

// -------------------------------------------------------------
// 6. WHERE == IS ACTUALLY USEFUL
// Checking both null AND undefined at once

let v1 = null;
let v2 = undefined;
let v3 = 10;

if (v1 == null) console.log("v1 is null or undefined");
if (v2 == null) console.log("v2 is null or undefined");
if (v3 == null) console.log("v3 is null or undefined"); // won't run

// Equivalent to:
// v === null || v === undefined

// -------------------------------------------------------------
// 7. != vs !==

console.log(5 != "5"); // false (loose)
console.log(5 !== "5"); // true (strict)

// -------------------------------------------------------------
// 8. BEST PRACTICES
// Use === by default

let count = 0;
if (count === 0) console.log("Count is zero");

let user = null;
if (user === null) console.log("User is null");

let isAdmin = true;
if (isAdmin === true) console.log("Admin access granted");
