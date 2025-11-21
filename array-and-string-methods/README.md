# JavaScript Array & String Methods Complete Guide

A comprehensive guide to mastering array and string manipulation in JavaScript with practical examples and real-world patterns.

---

## Table of Contents

### Part 1: Array Methods

1. [Array Basics Recap](#array-basics-recap)
2. [Finding Elements](#finding-elements)
3. [Testing Elements](#testing-elements)
4. [Transforming Arrays](#transforming-arrays)
5. [Flattening Arrays](#flattening-arrays)
6. [Adding and Removing Elements](#adding-and-removing-elements)
7. [slice() vs splice()](#slice-vs-splice)
8. [Sorting Arrays](#sorting-arrays)
9. [Other Useful Array Methods](#other-useful-array-methods)
10. [Method Chaining](#method-chaining)

### Part 2: String Methods

11. [String Basics Recap](#string-basics-recap)
12. [Searching in Strings](#searching-in-strings)
13. [Extracting Substrings](#extracting-substrings)
14. [Modifying Strings](#modifying-strings)
15. [Trimming and Padding](#trimming-and-padding)
16. [Splitting and Joining](#splitting-and-joining)
17. [Case Conversion](#case-conversion)
18. [String Method Chaining](#string-method-chaining)

### Part 3: Practical Applications

19. [Real-World Examples](#real-world-examples)
20. [Quick Reference](#quick-reference)

---

# Part 1: Array Methods

## Array Basics Recap

Arrays are ordered collections that can hold any type of value.

```javascript
// Creating arrays
const numbers = [1, 2, 3, 4, 5];
const mixed = [1, "hello", true, { name: "John" }, [1, 2]];
const empty = [];
const fromConstructor = new Array(5); // [empty × 5]

// Accessing elements
console.log(numbers[0]); // 1 (first element)
console.log(numbers[numbers.length - 1]); // 5 (last element)
console.log(numbers.at(-1)); // 5 (last element - modern syntax)
console.log(numbers.at(-2)); // 4 (second to last)

// Array properties
console.log(numbers.length); // 5
console.log(Array.isArray(numbers)); // true
```

### Mutating vs Non-Mutating Methods

**This is critical to understand:**

```javascript
// MUTATING - Changes the original array
const arr = [3, 1, 2];
arr.sort(); // arr is now [1, 2, 3]
arr.reverse(); // arr is now [3, 2, 1]
arr.push(4); // arr is now [3, 2, 1, 4]
arr.pop(); // arr is now [3, 2, 1]
arr.splice(0, 1); // arr is now [2, 1]

// NON-MUTATING - Returns new array, original unchanged
const arr2 = [1, 2, 3];
const mapped = arr2.map((x) => x * 2); // [2, 4, 6]
const filtered = arr2.filter((x) => x > 1); // [2, 3]
const sliced = arr2.slice(0, 2); // [1, 2]
console.log(arr2); // Still [1, 2, 3]
```

---

## Finding Elements

### find() - Get First Matching Element

Returns the **first element** that satisfies the condition, or `undefined` if none found.

```javascript
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 25 },
];

// Find first user aged 25
const user = users.find((user) => user.age === 25);
console.log(user); // { id: 1, name: 'Alice', age: 25 }

// Find user by id
const bob = users.find((user) => user.id === 2);
console.log(bob); // { id: 2, name: 'Bob', age: 30 }

// Not found returns undefined
const notFound = users.find((user) => user.age === 100);
console.log(notFound); // undefined

// With index and array parameters
const result = users.find((user, index, array) => {
  console.log(`Checking index ${index} of ${array.length}`);
  return user.name === "Bob";
});
```

### findIndex() - Get Index of First Match

Returns the **index** of the first matching element, or `-1` if none found.

```javascript
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
];

// Find index of Bob
const index = users.findIndex((user) => user.name === "Bob");
console.log(index); // 1

// Not found returns -1
const notFoundIndex = users.findIndex((user) => user.name === "Dave");
console.log(notFoundIndex); // -1

// Common pattern: Update item in array
const indexToUpdate = users.findIndex((u) => u.id === 2);
if (indexToUpdate !== -1) {
  users[indexToUpdate] = { ...users[indexToUpdate], name: "Bobby" };
}
```

### findLast() and findLastIndex() - Search from End

```javascript
const numbers = [1, 2, 3, 4, 3, 2, 1];

// Find last element greater than 2
const lastBig = numbers.findLast((n) => n > 2);
console.log(lastBig); // 3 (the second 3, at index 4)

// Find last index
const lastIndex = numbers.findLastIndex((n) => n > 2);
console.log(lastIndex); // 4
```

### indexOf() and lastIndexOf() - For Primitives

Use these for simple values (not objects).

```javascript
const fruits = ["apple", "banana", "cherry", "banana"];

// Find first occurrence
console.log(fruits.indexOf("banana")); // 1
console.log(fruits.indexOf("grape")); // -1 (not found)

// Find last occurrence
console.log(fruits.lastIndexOf("banana")); // 3

// Start searching from index
console.log(fruits.indexOf("banana", 2)); // 3 (starts from index 2)

// Check if exists
if (fruits.indexOf("apple") !== -1) {
  console.log("Apple exists!");
}
```

### includes() - Check if Element Exists

Returns `true` or `false`. Simpler than `indexOf() !== -1`.

```javascript
const numbers = [1, 2, 3, NaN];

// Basic check
console.log(numbers.includes(2)); // true
console.log(numbers.includes(5)); // false

// includes() handles NaN correctly!
console.log(numbers.includes(NaN)); // true
console.log(numbers.indexOf(NaN)); // -1 (indexOf fails with NaN)

// Start from index
console.log(numbers.includes(1, 1)); // false (starts from index 1)

// Common patterns
const allowedRoles = ["admin", "editor", "viewer"];

function checkAccess(role) {
  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid role");
  }
}
```

---

## Testing Elements

### some() - At Least One Matches

Returns `true` if **at least one** element passes the test.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Is there any number greater than 3?
console.log(numbers.some((n) => n > 3)); // true

// Is there any number greater than 10?
console.log(numbers.some((n) => n > 10)); // false

// Practical: Check if any user is admin
const users = [
  { name: "Alice", role: "user" },
  { name: "Bob", role: "admin" },
  { name: "Charlie", role: "user" },
];

const hasAdmin = users.some((user) => user.role === "admin");
console.log(hasAdmin); // true

// Short-circuits on first true
const result = numbers.some((n) => {
  console.log("Checking:", n);
  return n > 2;
});
// Logs: Checking: 1, Checking: 2, Checking: 3
// Stops at 3 because it found a match
```

### every() - All Must Match

Returns `true` only if **all** elements pass the test.

```javascript
const numbers = [2, 4, 6, 8];

// Are all numbers even?
console.log(numbers.every((n) => n % 2 === 0)); // true

// Are all numbers greater than 5?
console.log(numbers.every((n) => n > 5)); // false

// Practical: Form validation
const formFields = [
  { name: "email", valid: true },
  { name: "password", valid: true },
  { name: "phone", valid: false },
];

const isFormValid = formFields.every((field) => field.valid);
console.log(isFormValid); // false

// Short-circuits on first false
const result = numbers.every((n) => {
  console.log("Checking:", n);
  return n < 5;
});
// Logs: Checking: 2, Checking: 4, Checking: 6
// Stops at 6 because it fails the test

// Empty array returns true for every()
console.log([].every((n) => n > 0)); // true (vacuous truth)
```

### Comparison: some() vs every()

```javascript
const numbers = [1, 2, 3, 4, 5];

// some = OR logic (at least one)
numbers.some((n) => n > 3); // true (4 and 5 pass)

// every = AND logic (all must pass)
numbers.every((n) => n > 3); // false (1, 2, 3 fail)

// Think of it like:
// some() → "Is there ANY element that...?"
// every() → "Do ALL elements...?"
```

---

## Transforming Arrays

### map() - Transform Each Element

Creates a **new array** with transformed elements.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Double each number
const doubled = numbers.map((n) => n * 2);
console.log(doubled); // [2, 4, 6, 8, 10]
console.log(numbers); // [1, 2, 3, 4, 5] (unchanged)

// Extract property from objects
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
];

const names = users.map((user) => user.name);
console.log(names); // ['Alice', 'Bob']

const ids = users.map((user) => user.id);
console.log(ids); // [1, 2]

// Transform objects
const publicUsers = users.map((user) => ({
  id: user.id,
  displayName: user.name.toUpperCase(),
}));
// [{ id: 1, displayName: 'ALICE' }, { id: 2, displayName: 'BOB' }]

// With index
const indexed = numbers.map((num, index) => `${index}: ${num}`);
console.log(indexed); // ['0: 1', '1: 2', '2: 3', '3: 4', '4: 5']
```

### filter() - Keep Matching Elements

Creates a **new array** with only elements that pass the test.

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Keep only even numbers
const evens = numbers.filter((n) => n % 2 === 0);
console.log(evens); // [2, 4, 6, 8, 10]

// Keep numbers greater than 5
const big = numbers.filter((n) => n > 5);
console.log(big); // [6, 7, 8, 9, 10]

// Filter objects
const products = [
  { name: "Laptop", price: 1000, inStock: true },
  { name: "Phone", price: 500, inStock: false },
  { name: "Tablet", price: 300, inStock: true },
];

const available = products.filter((p) => p.inStock);
console.log(available);
// [{ name: 'Laptop', ... }, { name: 'Tablet', ... }]

const affordable = products.filter((p) => p.price < 600);
console.log(affordable);
// [{ name: 'Phone', ... }, { name: 'Tablet', ... }]

// Multiple conditions
const goodDeals = products.filter((p) => p.inStock && p.price < 500);
```

### reduce() - Combine into Single Value

Reduces array to a **single value** by accumulating results.

```javascript
const numbers = [1, 2, 3, 4, 5];

// Sum all numbers
const sum = numbers.reduce((accumulator, current) => {
  return accumulator + current;
}, 0); // 0 is the initial value
console.log(sum); // 15

// Shorter syntax
const sum2 = numbers.reduce((acc, cur) => acc + cur, 0);

// Product of all numbers
const product = numbers.reduce((acc, cur) => acc * cur, 1);
console.log(product); // 120

// Find maximum
const max = numbers.reduce((acc, cur) => (cur > acc ? cur : acc), numbers[0]);
console.log(max); // 5

// Count occurrences
const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const count = fruits.reduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log(count); // { apple: 3, banana: 2, orange: 1 }

// Group by property
const people = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
  { name: "Charlie", age: 25 },
];

const byAge = people.reduce((acc, person) => {
  const key = person.age;
  if (!acc[key]) acc[key] = [];
  acc[key].push(person);
  return acc;
}, {});
console.log(byAge);
// { 25: [{name: 'Alice'...}, {name: 'Charlie'...}], 30: [{name: 'Bob'...}] }

// Flatten array (before flat() existed)
const nested = [[1, 2], [3, 4], [5]];
const flat = nested.reduce((acc, cur) => acc.concat(cur), []);
console.log(flat); // [1, 2, 3, 4, 5]
```

### reduceRight() - Reduce from Right to Left

```javascript
const numbers = [1, 2, 3, 4, 5];

// Same as reduce but starts from the end
const result = numbers.reduceRight((acc, cur) => {
  console.log(`acc: ${acc}, cur: ${cur}`);
  return acc + cur;
}, 0);
// Logs: 5, 4, 3, 2, 1 (right to left)
```

### forEach() - Execute for Each (No Return)

Executes a function for each element. **Returns undefined**.

```javascript
const numbers = [1, 2, 3];

// Side effects only (logging, updating external variables)
numbers.forEach((n) => console.log(n));
// 1
// 2
// 3

// Common mistake: trying to use return value
const result = numbers.forEach((n) => n * 2);
console.log(result); // undefined (NOT [2, 4, 6])

// Use map() instead if you need a return value!

// forEach with index
numbers.forEach((num, index) => {
  console.log(`Index ${index}: ${num}`);
});

// Cannot break out of forEach (use for...of or some/every instead)
```

---

## Flattening Arrays

### flat() - Flatten Nested Arrays

```javascript
// One level deep (default)
const nested = [1, [2, 3], [4, [5, 6]]];
console.log(nested.flat());
// [1, 2, 3, 4, [5, 6]]

// Two levels deep
console.log(nested.flat(2));
// [1, 2, 3, 4, 5, 6]

// Flatten all levels
const deepNested = [1, [2, [3, [4, [5]]]]];
console.log(deepNested.flat(Infinity));
// [1, 2, 3, 4, 5]

// Removes empty slots
const withHoles = [1, , 3, , 5];
console.log(withHoles.flat());
// [1, 3, 5]
```

### flatMap() - Map then Flatten

Combines `map()` and `flat(1)` in one step. More efficient than calling both.

```javascript
const sentences = ["Hello world", "How are you"];

// Split each sentence into words
const words = sentences.flatMap((s) => s.split(" "));
console.log(words);
// ['Hello', 'world', 'How', 'are', 'you']

// Without flatMap (same result, less efficient)
const words2 = sentences.map((s) => s.split(" ")).flat();

// Practical: Expand items
const users = [
  { name: "Alice", pets: ["cat", "dog"] },
  { name: "Bob", pets: ["fish"] },
];

const allPets = users.flatMap((user) => user.pets);
console.log(allPets); // ['cat', 'dog', 'fish']

// Filter and transform in one pass
const numbers = [1, 2, 3, 4, 5];

// Double only even numbers, remove odds
const doubledEvens = numbers.flatMap((n) => (n % 2 === 0 ? [n * 2] : []));
console.log(doubledEvens); // [4, 8]

// Duplicate each element
const duplicated = numbers.flatMap((n) => [n, n]);
console.log(duplicated); // [1, 1, 2, 2, 3, 3, 4, 4, 5, 5]
```

---

## Adding and Removing Elements

### push() and pop() - End of Array (Mutates)

```javascript
const arr = [1, 2, 3];

// push() - Add to end, returns new length
const newLength = arr.push(4);
console.log(arr); // [1, 2, 3, 4]
console.log(newLength); // 4

// Add multiple
arr.push(5, 6, 7);
console.log(arr); // [1, 2, 3, 4, 5, 6, 7]

// pop() - Remove from end, returns removed element
const removed = arr.pop();
console.log(removed); // 7
console.log(arr); // [1, 2, 3, 4, 5, 6]
```

### unshift() and shift() - Start of Array (Mutates)

```javascript
const arr = [1, 2, 3];

// unshift() - Add to beginning, returns new length
const newLength = arr.unshift(0);
console.log(arr); // [0, 1, 2, 3]
console.log(newLength); // 4

// Add multiple
arr.unshift(-2, -1);
console.log(arr); // [-2, -1, 0, 1, 2, 3]

// shift() - Remove from beginning, returns removed element
const removed = arr.shift();
console.log(removed); // -2
console.log(arr); // [-1, 0, 1, 2, 3]
```

### concat() - Combine Arrays (Non-Mutating)

```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];
const arr3 = [5, 6];

// Combine arrays
const combined = arr1.concat(arr2);
console.log(combined); // [1, 2, 3, 4]
console.log(arr1); // [1, 2] (unchanged)

// Combine multiple
const all = arr1.concat(arr2, arr3);
console.log(all); // [1, 2, 3, 4, 5, 6]

// Can also add individual elements
const withMore = arr1.concat(3, 4, [5, 6]);
console.log(withMore); // [1, 2, 3, 4, 5, 6]

// Modern alternative: spread operator
const combined2 = [...arr1, ...arr2, ...arr3];
console.log(combined2); // [1, 2, 3, 4, 5, 6]
```

---

## slice() vs splice()

This is a **very common interview question**. Know the difference!

### slice() - Extract Portion (Non-Mutating)

Returns a **new array** with extracted elements. Original unchanged.

```javascript
const arr = ["a", "b", "c", "d", "e"];

// slice(start, end) - end is NOT included
console.log(arr.slice(1, 3)); // ['b', 'c']
console.log(arr.slice(2)); // ['c', 'd', 'e'] (to end)
console.log(arr.slice(-2)); // ['d', 'e'] (last 2)
console.log(arr.slice(1, -1)); // ['b', 'c', 'd']
console.log(arr.slice()); // ['a', 'b', 'c', 'd', 'e'] (copy)

console.log(arr); // ['a', 'b', 'c', 'd', 'e'] (unchanged!)

// Common use: Copy array
const copy = arr.slice();
const copy2 = [...arr]; // Modern alternative
```

### splice() - Add/Remove Elements (Mutates!)

**Changes the original array**. Can remove, add, or replace elements.

```javascript
const arr = ["a", "b", "c", "d", "e"];

// splice(start, deleteCount, ...itemsToAdd)

// Remove 2 elements starting at index 1
const removed = arr.splice(1, 2);
console.log(removed); // ['b', 'c']
console.log(arr); // ['a', 'd', 'e']

// Reset array
const arr2 = ["a", "b", "c", "d", "e"];

// Remove 1 element at index 2, insert 'x', 'y'
arr2.splice(2, 1, "x", "y");
console.log(arr2); // ['a', 'b', 'x', 'y', 'd', 'e']

// Insert without removing (deleteCount = 0)
const arr3 = ["a", "b", "c"];
arr3.splice(1, 0, "inserted");
console.log(arr3); // ['a', 'inserted', 'b', 'c']

// Remove from end using negative index
const arr4 = ["a", "b", "c", "d", "e"];
arr4.splice(-2, 2);
console.log(arr4); // ['a', 'b', 'c']
```

### Quick Comparison

| Feature                 | slice()                           | splice()                  |
| ----------------------- | --------------------------------- | ------------------------- |
| **Mutates original**    | No                                | Yes                       |
| **Returns**             | New array with extracted elements | Array of removed elements |
| **Can add elements**    | No                                | Yes                       |
| **Can remove elements** | No (just extracts)                | Yes                       |
| **Use case**            | Copy, extract portion             | Modify array in place     |

```javascript
// Memory trick:
// slice = "slice off a copy" (non-destructive)
// splice = "splice into/out of" (surgery on the array)
```

---

## Sorting Arrays

### sort() - Sort Elements (Mutates!)

**Warning:** `sort()` modifies the original array and has quirky default behavior.

```javascript
// Default sort: converts to strings and sorts alphabetically
const numbers = [10, 5, 40, 25, 100, 1];
numbers.sort();
console.log(numbers); // [1, 10, 100, 25, 40, 5] - WRONG!

// Why? Because "10" < "5" alphabetically

// Correct numeric sort: provide compare function
const nums = [10, 5, 40, 25, 100, 1];
nums.sort((a, b) => a - b); // Ascending
console.log(nums); // [1, 5, 10, 25, 40, 100]

nums.sort((a, b) => b - a); // Descending
console.log(nums); // [100, 40, 25, 10, 5, 1]
```

### The Compare Function Explained

```javascript
// sort((a, b) => ...)
// If return < 0: a comes before b
// If return > 0: b comes before a
// If return = 0: order unchanged

const numbers = [3, 1, 4, 1, 5, 9];

// Ascending: a - b
// If a < b, result is negative, so a comes first
numbers.sort((a, b) => a - b); // [1, 1, 3, 4, 5, 9]

// Descending: b - a
// If a < b, result is positive, so b comes first
numbers.sort((a, b) => b - a); // [9, 5, 4, 3, 1, 1]
```

### Sorting Strings

```javascript
const fruits = ["banana", "Apple", "cherry"];

// Default: case-sensitive (uppercase first)
fruits.sort();
console.log(fruits); // ['Apple', 'banana', 'cherry']

// Case-insensitive sort
const fruits2 = ["banana", "Apple", "cherry"];
fruits2.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
console.log(fruits2); // ['Apple', 'banana', 'cherry']

// Using localeCompare for proper string sorting
const words = ["résumé", "resume", "cafe", "café"];
words.sort((a, b) => a.localeCompare(b));
console.log(words); // Properly sorted with accents
```

### Sorting Objects

```javascript
const users = [
  { name: "Charlie", age: 30 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 35 },
];

// Sort by age (ascending)
users.sort((a, b) => a.age - b.age);
console.log(users);
// [{ name: 'Alice', age: 25 }, { name: 'Charlie', age: 30 }, { name: 'Bob', age: 35 }]

// Sort by name (alphabetically)
users.sort((a, b) => a.name.localeCompare(b.name));
console.log(users);
// [{ name: 'Alice'... }, { name: 'Bob'... }, { name: 'Charlie'... }]

// Sort by multiple criteria (age, then name)
const people = [
  { name: "Charlie", age: 25 },
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

people.sort((a, b) => {
  if (a.age !== b.age) {
    return a.age - b.age; // Sort by age first
  }
  return a.name.localeCompare(b.name); // Then by name
});
```

### Non-Mutating Sort with toSorted()

```javascript
// Modern JavaScript: toSorted() returns new array
const numbers = [3, 1, 4, 1, 5];
const sorted = numbers.toSorted((a, b) => a - b);

console.log(sorted); // [1, 1, 3, 4, 5]
console.log(numbers); // [3, 1, 4, 1, 5] (unchanged!)

// Before toSorted(): Use slice then sort
const sortedOld = numbers.slice().sort((a, b) => a - b);
```

### reverse() - Reverse Array (Mutates!)

```javascript
const arr = [1, 2, 3, 4, 5];
arr.reverse();
console.log(arr); // [5, 4, 3, 2, 1]

// Non-mutating: toReversed()
const arr2 = [1, 2, 3, 4, 5];
const reversed = arr2.toReversed();
console.log(reversed); // [5, 4, 3, 2, 1]
console.log(arr2); // [1, 2, 3, 4, 5] (unchanged)

// Before toReversed(): Use slice then reverse
const reversedOld = arr2.slice().reverse();
```

---

## Other Useful Array Methods

### fill() - Fill with Value (Mutates)

```javascript
const arr = [1, 2, 3, 4, 5];

// Fill entire array
arr.fill(0);
console.log(arr); // [0, 0, 0, 0, 0]

// Fill from index 2 to 4
const arr2 = [1, 2, 3, 4, 5];
arr2.fill("x", 2, 4);
console.log(arr2); // [1, 2, 'x', 'x', 5]

// Create array of zeros
const zeros = new Array(5).fill(0);
console.log(zeros); // [0, 0, 0, 0, 0]

// WARNING: Objects are shared references!
const arr3 = new Array(3).fill({ value: 0 });
arr3[0].value = 1;
console.log(arr3); // [{ value: 1 }, { value: 1 }, { value: 1 }] - All changed!

// Correct way for objects:
const arr4 = Array.from({ length: 3 }, () => ({ value: 0 }));
```

### Array.from() - Create Array from Iterable

```javascript
// From string
const chars = Array.from("hello");
console.log(chars); // ['h', 'e', 'l', 'l', 'o']

// From Set
const unique = Array.from(new Set([1, 2, 2, 3, 3]));
console.log(unique); // [1, 2, 3]

// From Map
const map = new Map([
  ["a", 1],
  ["b", 2],
]);
const entries = Array.from(map);
console.log(entries); // [['a', 1], ['b', 2]]

// With mapping function
const numbers = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(numbers); // [1, 2, 3, 4, 5]

const squares = Array.from({ length: 5 }, (_, i) => i * i);
console.log(squares); // [0, 1, 4, 9, 16]

// Convert NodeList to Array
const divs = Array.from(document.querySelectorAll("div"));
```

### Array.of() - Create Array from Arguments

```javascript
// Difference from Array constructor
console.log(Array(3)); // [empty × 3]
console.log(Array.of(3)); // [3]

console.log(Array(1, 2, 3)); // [1, 2, 3]
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
```

### join() - Convert Array to String

```javascript
const words = ["Hello", "World"];

console.log(words.join()); // 'Hello,World' (default: comma)
console.log(words.join(" ")); // 'Hello World'
console.log(words.join("-")); // 'Hello-World'
console.log(words.join("")); // 'HelloWorld'

// Useful for building strings
const parts = ["2024", "01", "15"];
const date = parts.join("-");
console.log(date); // '2024-01-15'
```

### copyWithin() - Copy Within Array (Mutates)

```javascript
const arr = [1, 2, 3, 4, 5];

// copyWithin(target, start, end)
// Copy elements from start to end, paste at target
arr.copyWithin(0, 3);
console.log(arr); // [4, 5, 3, 4, 5]

const arr2 = [1, 2, 3, 4, 5];
arr2.copyWithin(1, 3, 4);
console.log(arr2); // [1, 4, 3, 4, 5]
```

### entries(), keys(), values() - Iterators

```javascript
const arr = ["a", "b", "c"];

// entries() - [index, value] pairs
for (const [index, value] of arr.entries()) {
  console.log(index, value);
}
// 0 'a'
// 1 'b'
// 2 'c'

// keys() - indices only
for (const index of arr.keys()) {
  console.log(index);
}
// 0, 1, 2

// values() - values only
for (const value of arr.values()) {
  console.log(value);
}
// 'a', 'b', 'c'
```

---

## Method Chaining

Combine multiple array methods for powerful data transformations.

### Basic Chaining

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Filter, then map
const doubledEvens = numbers
  .filter((n) => n % 2 === 0) // [2, 4, 6, 8, 10]
  .map((n) => n * 2); // [4, 8, 12, 16, 20]

console.log(doubledEvens); // [4, 8, 12, 16, 20]

// Filter, map, reduce
const sumOfDoubledEvens = numbers
  .filter((n) => n % 2 === 0) // [2, 4, 6, 8, 10]
  .map((n) => n * 2) // [4, 8, 12, 16, 20]
  .reduce((sum, n) => sum + n, 0); // 60

console.log(sumOfDoubledEvens); // 60
```

### Real-World Chaining Examples

```javascript
// Example 1: Process user data
const users = [
  { id: 1, name: "Alice", age: 25, active: true },
  { id: 2, name: "Bob", age: 30, active: false },
  { id: 3, name: "Charlie", age: 35, active: true },
  { id: 4, name: "Diana", age: 28, active: true },
];

// Get names of active users over 26, sorted alphabetically
const result = users
  .filter((u) => u.active) // Keep active users
  .filter((u) => u.age > 26) // Keep users over 26
  .map((u) => u.name) // Extract names
  .sort(); // Sort alphabetically

console.log(result); // ['Charlie', 'Diana']

// Example 2: Process orders
const orders = [
  { id: 1, items: ["apple", "banana"], total: 15 },
  { id: 2, items: ["orange"], total: 8 },
  { id: 3, items: ["apple", "grape", "melon"], total: 25 },
];

// Get all unique items from orders over $10
const expensiveItems = orders
  .filter((order) => order.total > 10)
  .flatMap((order) => order.items)
  .filter((item, index, arr) => arr.indexOf(item) === index); // Unique

console.log(expensiveItems); // ['apple', 'banana', 'grape', 'melon']

// Example 3: Transform API response
const apiResponse = [
  { userId: 1, title: "Post 1", body: "Content 1" },
  { userId: 1, title: "Post 2", body: "Content 2" },
  { userId: 2, title: "Post 3", body: "Content 3" },
];

// Group posts by user and count
const postsByUser = apiResponse.reduce((acc, post) => {
  const key = post.userId;
  if (!acc[key]) {
    acc[key] = { userId: key, posts: [], count: 0 };
  }
  acc[key].posts.push(post.title);
  acc[key].count++;
  return acc;
}, {});

console.log(postsByUser);
// { 1: { userId: 1, posts: ['Post 1', 'Post 2'], count: 2 }, ... }
```

### Formatting Chained Methods

```javascript
// Good: Each method on its own line
const result = users
  .filter((u) => u.active)
  .filter((u) => u.age > 18)
  .map((u) => u.name)
  .sort()
  .slice(0, 5);

// Bad: Hard to read
const result2 = users
  .filter((u) => u.active)
  .filter((u) => u.age > 18)
  .map((u) => u.name)
  .sort()
  .slice(0, 5);
```

---

# Part 2: String Methods

## String Basics Recap

Strings are **immutable** in JavaScript. All string methods return **new strings**.

```javascript
// Creating strings
const single = "Hello";
const double = "World";
const template = `Hello ${double}`;
const fromConstructor = String(123); // '123'

// Accessing characters
console.log(single[0]); // 'H'
console.log(single.at(-1)); // 'o' (last character)
console.log(single.charAt(0)); // 'H'

// String properties
console.log(single.length); // 5

// Strings are immutable
let str = "Hello";
str[0] = "J"; // Does nothing!
console.log(str); // 'Hello'
```

---

## Searching in Strings

### includes() - Check if Substring Exists

```javascript
const sentence = "The quick brown fox jumps over the lazy dog";

console.log(sentence.includes("quick")); // true
console.log(sentence.includes("Quick")); // false (case-sensitive)
console.log(sentence.includes("cat")); // false

// Start searching from position
console.log(sentence.includes("the", 30)); // true (finds 'the' after position 30)
console.log(sentence.includes("The", 1)); // false (starts after 'The')

// Common patterns
const email = "user@example.com";
if (email.includes("@")) {
  console.log("Valid email format");
}
```

### startsWith() and endsWith()

```javascript
const filename = "document.pdf";
const url = "https://example.com/page";

// startsWith()
console.log(url.startsWith("https")); // true
console.log(url.startsWith("http://")); // false
console.log(url.startsWith("example", 8)); // true (from position 8)

// endsWith()
console.log(filename.endsWith(".pdf")); // true
console.log(filename.endsWith(".doc")); // false
console.log(filename.endsWith("ment", 8)); // true (check first 8 chars)

// Practical examples
function isSecureUrl(url) {
  return url.startsWith("https://");
}

function isImageFile(filename) {
  return (
    filename.endsWith(".jpg") ||
    filename.endsWith(".png") ||
    filename.endsWith(".gif")
  );
}

function isPdfFile(filename) {
  return filename.toLowerCase().endsWith(".pdf");
}
```

### indexOf() and lastIndexOf()

```javascript
const str = "Hello World, Hello Universe";

// indexOf() - First occurrence
console.log(str.indexOf("Hello")); // 0
console.log(str.indexOf("World")); // 6
console.log(str.indexOf("hello")); // -1 (case-sensitive)
console.log(str.indexOf("Goodbye")); // -1 (not found)

// Start from position
console.log(str.indexOf("Hello", 1)); // 13 (skips first 'Hello')

// lastIndexOf() - Last occurrence
console.log(str.lastIndexOf("Hello")); // 13
console.log(str.lastIndexOf("o")); // 22

// Common pattern: Check if exists
if (str.indexOf("World") !== -1) {
  console.log("Found!");
}

// Better: Use includes()
if (str.includes("World")) {
  console.log("Found!");
}
```

### search() - Search with Regex

```javascript
const str = "The price is $50.00";

// Returns index of first match
console.log(str.search(/\d+/)); // 14 (first digit)
console.log(str.search(/price/)); // 4
console.log(str.search(/Price/i)); // 4 (case-insensitive)
console.log(str.search(/xyz/)); // -1 (not found)
```

### match() and matchAll() - Extract Matches

```javascript
const str = "The rain in Spain falls mainly in the plain";

// match() - Get matches
const matches = str.match(/ain/g);
console.log(matches); // ['ain', 'ain', 'ain', 'ain']

// Without 'g' flag - get details of first match
const match = str.match(/ain/);
console.log(match);
// ['ain', index: 5, input: 'The rain in Spain...', groups: undefined]

// With capture groups
const dateStr = "2024-01-15";
const dateMatch = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(dateMatch);
// ['2024-01-15', '2024', '01', '15', ...]

const [full, year, month, day] = dateMatch;
console.log(year, month, day); // '2024' '01' '15'

// matchAll() - Iterator of all matches with details
const str2 = "test1 test2 test3";
const matchesAll = [...str2.matchAll(/test(\d)/g)];
console.log(matchesAll);
// [['test1', '1', ...], ['test2', '2', ...], ['test3', '3', ...]]
```

---

## Extracting Substrings

### slice() - Extract Portion

```javascript
const str = "Hello World";

// slice(start, end) - end not included
console.log(str.slice(0, 5)); // 'Hello'
console.log(str.slice(6)); // 'World' (to end)
console.log(str.slice(-5)); // 'World' (last 5)
console.log(str.slice(0, -6)); // 'Hello' (exclude last 6)
console.log(str.slice(-5, -2)); // 'Wor'

// Common patterns
const filename = "document.pdf";
const name = filename.slice(0, -4); // 'document'
const ext = filename.slice(-3); // 'pdf'

// Get file extension
function getExtension(filename) {
  const lastDot = filename.lastIndexOf(".");
  return lastDot === -1 ? "" : filename.slice(lastDot + 1);
}
```

### substring() - Similar to slice()

```javascript
const str = "Hello World";

// substring(start, end) - end not included
console.log(str.substring(0, 5)); // 'Hello'
console.log(str.substring(6)); // 'World'

// Difference from slice(): handles negative/swapped indices differently
console.log(str.slice(6, 0)); // '' (empty - start > end)
console.log(str.substring(6, 0)); // 'Hello' (swaps arguments)

console.log(str.slice(-5)); // 'World' (from end)
console.log(str.substring(-5)); // 'Hello World' (treats -5 as 0)

// Recommendation: Use slice() - more predictable
```

### substr() - Deprecated, Don't Use

```javascript
// substr(start, length) - DEPRECATED
const str = "Hello World";
console.log(str.substr(0, 5)); // 'Hello'

// Use slice() instead
console.log(str.slice(0, 5)); // 'Hello'
```

---

## Modifying Strings

### replace() - Replace First Match

```javascript
const str = 'Hello World, Hello Universe';

// Replace first occurrence only
console.log(str.replace('Hello', 'Hi'));
// 'Hi World, Hello Universe'

// With regex
console.log(str.replace(/hello/i, 'Hi'));
// 'Hi World, Hello Universe'

// Replace with callback function
const prices = 'Price: $10, Sale: $5';
const doubled = prices.replace(/\$(\d+)/g, (match, num) => {
  return ' + (parseInt(num) * 2);
});
console.log(doubled); // 'Price: $20, Sale: $10'

// Special replacement patterns
const str2 = 'John Smith';
console.log(str2.replace(/(\w+) (\w+)/, '$2, $1'));
// 'Smith, John'
```

### replaceAll() - Replace All Matches

```javascript
const str = "Hello World, Hello Universe";

// Replace ALL occurrences
console.log(str.replaceAll("Hello", "Hi"));
// 'Hi World, Hi Universe'

// With regex (must have 'g' flag)
console.log(str.replaceAll(/Hello/g, "Hi"));
// 'Hi World, Hi Universe'

// Before replaceAll: Use regex with 'g' flag
console.log(str.replace(/Hello/g, "Hi"));
// 'Hi World, Hi Universe'

// Practical examples
const text = "a-b-c-d";
console.log(text.replaceAll("-", "_")); // 'a_b_c_d'

// Remove all spaces
const messy = "too   many   spaces";
console.log(messy.replaceAll(" ", "")); // 'toomanyspaces'
```

### repeat() - Repeat String

```javascript
const str = "abc";

console.log(str.repeat(3)); // 'abcabcabc'
console.log(str.repeat(0)); // ''
console.log("=-".repeat(20)); // '=-=-=-=-=-=-...'

// Practical: Create separator line
const line = "=".repeat(50);
console.log(line);

// Create indentation
function indent(text, level) {
  return "  ".repeat(level) + text;
}
console.log(indent("Hello", 3)); // '      Hello'
```

---

## Trimming and Padding

### trim(), trimStart(), trimEnd()

```javascript
const str = "   Hello World   ";

// Remove whitespace from both ends
console.log(str.trim()); // 'Hello World'

// Remove from start only
console.log(str.trimStart()); // 'Hello World   '
console.log(str.trimLeft()); // Same (alias)

// Remove from end only
console.log(str.trimEnd()); // '   Hello World'
console.log(str.trimRight()); // Same (alias)

// Original unchanged
console.log(str); // '   Hello World   '

// Practical: Clean user input
function cleanInput(input) {
  return input.trim().toLowerCase();
}

console.log(cleanInput("  HELLO  ")); // 'hello'

// Trim also removes newlines, tabs
const messy = "\n\t  Hello  \n\t";
console.log(messy.trim()); // 'Hello'
```

### padStart() and padEnd()

```javascript
const str = '5';

// Pad start (left)
console.log(str.padStart(3, '0'));   // '005'
console.log(str.padStart(5, '0'));   // '00005'
console.log(str.padStart(3));        // '  5' (default: space)

// Pad end (right)
console.log(str.padEnd(3, '0'));     // '500'
console.log(str.padEnd(5, '-'));     // '5----'

// If string is already longer, no padding
console.log('Hello'.padStart(3, '0')); // 'Hello'

// Practical: Format numbers
function formatNumber(num, digits = 2) {
  return String(num).padStart(digits, '0');
}

console.log(formatNumber(5));      // '05'
console.log(formatNumber(12));     // '12'
console.log(formatNumber(5, 4));   // '0005'

// Format time
function formatTime(hours, minutes, seconds) {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

console.log(formatTime(9, 5, 3)); // '09:05:03'

// Format currency display
function formatPrice(price) {
  return ' + price.toFixed(2).padStart(8);
}

console.log(formatPrice(5.5));    // '$    5.50'
console.log(formatPrice(125.99)); // '$  125.99'
```

---

## Splitting and Joining

### split() - String to Array

```javascript
const str = "Hello World";

// Split by space
console.log(str.split(" ")); // ['Hello', 'World']

// Split by each character
console.log(str.split("")); // ['H', 'e', 'l', 'l', 'o', ' ', 'W', ...]

// Split by comma
const csv = "apple,banana,cherry";
console.log(csv.split(",")); // ['apple', 'banana', 'cherry']

// Limit number of splits
console.log(csv.split(",", 2)); // ['apple', 'banana']

// Split with regex
const text = "a1b2c3d4";
console.log(text.split(/\d/)); // ['a', 'b', 'c', 'd', '']

// Keep the delimiter
const text2 = "one1two2three";
console.log(text2.split(/(\d)/)); // ['one', '1', 'two', '2', 'three']

// Practical: Parse path
const path = "/users/john/documents/file.txt";
const parts = path.split("/").filter(Boolean);
console.log(parts); // ['users', 'john', 'documents', 'file.txt']

// Parse query string
const query = "name=John&age=30&city=NYC";
const params = Object.fromEntries(
  query.split("&").map((pair) => pair.split("="))
);
console.log(params); // { name: 'John', age: '30', city: 'NYC' }
```

### join() - Array to String

```javascript
const words = ["Hello", "World"];

console.log(words.join()); // 'Hello,World' (default comma)
console.log(words.join(" ")); // 'Hello World'
console.log(words.join("-")); // 'Hello-World'
console.log(words.join("")); // 'HelloWorld'
console.log(words.join(" | ")); // 'Hello | World'

// Build file path
const pathParts = ["users", "john", "documents"];
console.log(pathParts.join("/")); // 'users/john/documents'

// Build CSS class string
const classes = ["btn", "btn-primary", "active"];
console.log(classes.join(" ")); // 'btn btn-primary active'

// Build HTML
const items = ["Apple", "Banana", "Cherry"];
const html = "<li>" + items.join("</li><li>") + "</li>";
console.log(html); // '<li>Apple</li><li>Banana</li><li>Cherry</li>'
```

### split() and join() Together

```javascript
// Reverse a string
const str = "Hello";
const reversed = str.split("").reverse().join("");
console.log(reversed); // 'olleH'

// Replace all spaces with dashes
const text = "Hello World How Are You";
const slugified = text.split(" ").join("-");
console.log(slugified); // 'Hello-World-How-Are-You'

// Capitalize each word
const sentence = "hello world";
const capitalized = sentence
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");
console.log(capitalized); // 'Hello World'

// Remove extra spaces
const messy = "too    many     spaces";
const clean = messy.split(/\s+/).join(" ");
console.log(clean); // 'too many spaces'
```

---

## Case Conversion

### toLowerCase() and toUpperCase()

```javascript
const str = "Hello World";

console.log(str.toLowerCase()); // 'hello world'
console.log(str.toUpperCase()); // 'HELLO WORLD'

// Case-insensitive comparison
const input = "HELLO";
if (input.toLowerCase() === "hello") {
  console.log("Match!");
}

// Locale-aware (for special characters)
const turkish = "İstanbul";
console.log(turkish.toLowerCase()); // may not work correctly
console.log(turkish.toLocaleLowerCase("tr-TR")); // correct for Turkish
```

### Custom Case Functions

```javascript
// Capitalize first letter
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
console.log(capitalize("hELLO")); // 'Hello'

// Title Case (capitalize each word)
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
console.log(toTitleCase("hello world foo bar")); // 'Hello World Foo Bar'

// camelCase
function toCamelCase(str) {
  return str
    .toLowerCase()
    .split(/[\s-_]+/)
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
}
console.log(toCamelCase("hello world")); // 'helloWorld'
console.log(toCamelCase("my-variable-name")); // 'myVariableName'

// snake_case
function toSnakeCase(str) {
  return str
    .replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[\s-]+/g, "_");
}
console.log(toSnakeCase("helloWorld")); // 'hello_world'
console.log(toSnakeCase("Hello World")); // 'hello_world'

// kebab-case
function toKebabCase(str) {
  return str
    .replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/[\s_]+/g, "-");
}
console.log(toKebabCase("helloWorld")); // 'hello-world'
```

---

## String Method Chaining

```javascript
// Chain multiple string operations
const input = "   Hello World   ";

const result = input
  .trim() // 'Hello World'
  .toLowerCase() // 'hello world'
  .replace(" ", "-") // 'hello-world'
  .toUpperCase(); // 'HELLO-WORLD'

console.log(result); // 'HELLO-WORLD'

// Create URL slug
function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -
}

console.log(createSlug("  Hello, World! How are you?  "));
// 'hello-world-how-are-you'

// Clean and validate email
function normalizeEmail(email) {
  return email.trim().toLowerCase().replace(/\s+/g, "");
}

console.log(normalizeEmail("  User@Example.COM  ")); // 'user@example.com'

// Format phone number
function formatPhone(phone) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length !== 10) return phone;

  return digits
    .slice(0, 3)
    .concat("-")
    .concat(digits.slice(3, 6))
    .concat("-")
    .concat(digits.slice(6));
}

console.log(formatPhone("1234567890")); // '123-456-7890'
console.log(formatPhone("(123) 456-7890")); // '123-456-7890'
```

---

# Part 3: Practical Applications

## Real-World Examples

### Example 1: Search and Filter

```javascript
const products = [
  { id: 1, name: "iPhone 14 Pro", category: "phones", price: 999 },
  { id: 2, name: "Samsung Galaxy S23", category: "phones", price: 899 },
  { id: 3, name: "MacBook Pro", category: "laptops", price: 1999 },
  { id: 4, name: "iPad Air", category: "tablets", price: 599 },
];

function searchProducts(products, query, options = {}) {
  const { category, minPrice, maxPrice, sortBy, sortOrder = "asc" } = options;

  let results = products;

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase();
    results = results.filter((p) => p.name.toLowerCase().includes(searchTerm));
  }

  // Filter by category
  if (category) {
    results = results.filter((p) => p.category === category);
  }

  // Filter by price range
  if (minPrice !== undefined) {
    results = results.filter((p) => p.price >= minPrice);
  }
  if (maxPrice !== undefined) {
    results = results.filter((p) => p.price <= maxPrice);
  }

  // Sort
  if (sortBy) {
    results = results.slice().sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      const comparison =
        typeof aVal === "string" ? aVal.localeCompare(bVal) : aVal - bVal;
      return sortOrder === "desc" ? -comparison : comparison;
    });
  }

  return results;
}

// Usage
console.log(searchProducts(products, "pro"));
// iPhone 14 Pro, MacBook Pro

console.log(
  searchProducts(products, "", {
    category: "phones",
    sortBy: "price",
  })
);
// Sorted phones by price
```

### Example 2: Data Transformation Pipeline

```javascript
const rawData = [
  "  John Doe, 30, Developer  ",
  "Jane Smith, 25, Designer",
  "  Bob Johnson, 35, Manager  ",
  "invalid entry",
  "Alice Brown, 28, Developer",
];

function processUserData(data) {
  return (
    data
      // Clean whitespace
      .map((line) => line.trim())
      // Filter valid entries
      .filter((line) => line.split(",").length === 3)
      // Parse into objects
      .map((line) => {
        const [name, age, role] = line.split(",").map((s) => s.trim());
        return {
          name,
          age: parseInt(age),
          role,
        };
      })
      // Filter valid ages
      .filter((user) => !isNaN(user.age))
      // Sort by name
      .sort((a, b) => a.name.localeCompare(b.name))
  );
}

console.log(processUserData(rawData));
// [
//   { name: 'Alice Brown', age: 28, role: 'Developer' },
//   { name: 'Bob Johnson', age: 35, role: 'Manager' },
//   { name: 'Jane Smith', age: 25, role: 'Designer' },
//   { name: 'John Doe', age: 30, role: 'Developer' }
// ]

// Group by role
const users = processUserData(rawData);
const byRole = users.reduce((acc, user) => {
  if (!acc[user.role]) acc[user.role] = [];
  acc[user.role].push(user);
  return acc;
}, {});

console.log(byRole);
// { Developer: [...], Designer: [...], Manager: [...] }
```

### Example 3: Text Analysis

```javascript
function analyzeText(text) {
  // Clean text
  const cleanText = text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .trim();

  // Split into words
  const words = cleanText.split(/\s+/).filter(Boolean);

  // Count words
  const wordCount = words.length;

  // Count characters (excluding spaces)
  const charCount = cleanText.replace(/\s/g, "").length;

  // Word frequency
  const frequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1;
    return acc;
  }, {});

  // Get most common words
  const mostCommon = Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, count]) => ({ word, count }));

  // Calculate average word length
  const avgWordLength = (charCount / wordCount).toFixed(2);

  return {
    wordCount,
    charCount,
    avgWordLength,
    frequency,
    mostCommon,
  };
}

const sampleText =
  "JavaScript is great! JavaScript helps developers. Great developers use JavaScript.";
console.log(analyzeText(sampleText));
// {
//   wordCount: 11,
//   charCount: 69,
//   avgWordLength: '6.27',
//   frequency: { javascript: 3, great: 2, is: 1, ... },
//   mostCommon: [{ word: 'javascript', count: 3 }, ...]
// }
```

### Example 4: Form Validation

```javascript
const validationRules = {
  username: {
    validate: (val) => val.length >= 3 && val.length <= 20,
    message: "Username must be 3-20 characters",
  },
  email: {
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
    message: "Invalid email format",
  },
  password: {
    validate: (val) => val.length >= 8,
    message: "Password must be at least 8 characters",
  },
  phone: {
    validate: (val) => /^\d{10}$/.test(val.replace(/\D/g, "")),
    message: "Phone must be 10 digits",
  },
};

function validateForm(data) {
  const errors = {};

  Object.entries(data).forEach(([field, value]) => {
    if (validationRules[field]) {
      const rule = validationRules[field];
      if (!rule.validate(value.trim())) {
        errors[field] = rule.message;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Usage
const formData = {
  username: "john_doe",
  email: "john@example.com",
  password: "password123",
  phone: "1234567890",
};

const validation = validateForm(formData);
console.log(validation); // { isValid: true, errors: {} }

const invalidData = {
  username: "ab",
  email: "invalid-email",
  password: "123",
  phone: "12345",
};

const invalidValidation = validateForm(invalidData);
console.log(invalidValidation);
// {
//   isValid: false,
//   errors: {
//     username: 'Username must be 3-20 characters',
//     email: 'Invalid email format',
//     password: 'Password must be at least 8 characters',
//     phone: 'Phone must be 10 digits',
//   }
// }
```

### Example 5: URL Parameter Builder

```javascript
function buildQueryString(params) {
  return Object.entries(params)
    .filter(
      ([key, value]) => value !== null && value !== undefined && value !== ""
    )
    .map(([key, value]) => {
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(
        Array.isArray(value) ? value.join(",") : String(value)
      );
      return `${encodedKey}=${encodedValue}`;
    })
    .join("&");
}

function parseQueryString(queryString) {
  const params = {};

  queryString
    .replace("?", "")
    .split("&")
    .forEach((pair) => {
      const [key, value] = pair.split("=");
      if (key) {
        params[decodeURIComponent(key)] = decodeURIComponent(value || "");
      }
    });

  return params;
}

// Usage
const params = {
  search: "javascript",
  page: 1,
  limit: 10,
  tags: ["react", "nodejs"],
};
const queryString = buildQueryString(params);
console.log(queryString);
// 'search=javascript&page=1&limit=10&tags=react%2Cnodejs'

const parsed = parseQueryString("?search=javascript&page=1&limit=10");
console.log(parsed);
// { search: 'javascript', page: '1', limit: '10' }
```

---

## Quick Reference

### Array Methods Cheat Sheet

```javascript
// FINDING
find(); // First match
findIndex(); // Index of first match
indexOf(); // Index of element
includes(); // Is element present?

// TESTING
some(); // At least one matches?
every(); // All match?

// TRANSFORMING
map(); // Transform each
filter(); // Keep matching
reduce(); // Combine to single value
forEach(); // Execute for each

// FLATTENING
flat(); // Flatten nested
flatMap(); // Map then flatten

// ADDING/REMOVING
push(); // Add to end
pop(); // Remove from end
unshift(); // Add to start
shift(); // Remove from start
splice(); // Add/remove anywhere

// SORTING
sort(); // Sort in place
reverse(); // Reverse in place
toSorted(); // Sort (non-mutating)
toReversed(); // Reverse (non-mutating)

// COMBINING
concat(); // Combine arrays
join(); // Convert to string
```

### String Methods Cheat Sheet

```javascript
// SEARCHING
includes(); // Contains substring?
startsWith(); // Starts with?
endsWith(); // Ends with?
indexOf(); // Index of substring
match(); // Get matches (regex)
search(); // Search with regex

// EXTRACTING
slice(); // Extract portion
substring(); // Similar to slice()
charAt(); // Character at index

// MODIFYING
replace(); // Replace first
replaceAll(); // Replace all
repeat(); // Repeat string

// TRIMMING/PADDING
trim(); // Remove whitespace
trimStart(); // Remove start whitespace
trimEnd(); // Remove end whitespace
padStart(); // Pad left
padEnd(); // Pad right

// SPLITTING/JOINING
split(); // String to array
join(); // Array to string

// CASE
toLowerCase(); // Convert to lowercase
toUpperCase(); // Convert to uppercase
```

### Common Patterns

```javascript
// Check if array is empty
arr.length === 0
// or
Array.isArray(arr) && arr.length === 0

// Get last element
arr[arr.length - 1]
// or
arr.at(-1)

// Copy array
[...arr]
// or
arr.slice()

// Remove duplicates
[...new Set(arr)]

// Sort numbers
arr.sort((a, b) => a - b)

// Check if all elements pass test
arr.every(el => condition)

// Check if any element passes test
arr.some(el => condition)

// Find and replace element
arr[arr.findIndex(el => el.id === 5)] = newElement

// Sum array
arr.reduce((sum, el) => sum + el, 0)

// Count occurrences
arr.reduce((acc, el) => ({ ...acc, [el]: (acc[el] || 0) + 1 }), {})

// Group by property
arr.reduce((acc, el) => {
  const key = el.property;
  if (!acc[key]) acc[key] = [];
  acc[key].push(el);
  return acc;
}, {})

// Flatten one level
arr.flat()

// Reverse string
str.split('').reverse().join('')

// Capitalize first letter
str.charAt(0).toUpperCase() + str.slice(1)

// Remove all spaces
str.replace(/\s+/g, '')

// Replace all occurrences
str.replaceAll(search, replace)

// Convert to slug
str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')

// Truncate string
str.length > n ? str.slice(0, n) + '...' : str

// Pad number with zeros
String(num).padStart(digits, '0')
```

---

## Tips and Best Practices

1. **Choose the right method for the job** - Use `find()` for objects, `indexOf()` for primitives
2. **Prefer non-mutating methods** - They're safer and don't cause side effects
3. **Chain methods when possible** - More readable than nested loops
4. **Use meaningful variable names in callbacks** - `users.filter(u => ...)` is clearer
5. **Remember empty array behaviors** - `every()` returns true, `some()` returns false
6. **Be careful with sort()** - It mutates the original array; use `toSorted()` if available
7. **Use reduce carefully** - It's powerful but can be harder to read than simpler methods
8. **Test regex patterns** - Use regex testers to validate before using in code
9. **Handle edge cases** - Check for empty arrays, null/undefined values
10. **Use modern methods** - `at()`, `findLast()`, `toSorted()`, `toReversed()` are cleaner alternatives
