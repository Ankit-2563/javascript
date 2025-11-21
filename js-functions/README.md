# JavaScript Functions - Complete Guide

## 1. What Is a Function? (Core Idea)

A function is:

- A reusable block of code
- That performs an action
- And can return a value

It helps you avoid repeating code.

**Example:**

```javascript
function greet() {
  console.log("Hello!");
}
```

## 2. Why Functions Exist

Functions help you:

- Organize code
- Reuse code
- Handle input/output
- Separate logic
- Write cleaner and maintainable code

## 3. Types of Functions in JavaScript

There are 8 major types you must know:

1. Function Declaration
2. Function Expression
3. Arrow Function
4. Anonymous Function
5. Callback Function
6. Higher-Order Function
7. IIFE (Immediately Invoked Function Expression)
8. Constructor Function (before classes)

## 4. Function Declaration

```javascript
function add(a, b) {
  return a + b;
}
```

**When to use:**

- When you want hoisting (usable before it appears)
- For utility functions
- For functions used throughout your file

**Features:**

- Hoisted → can call it before it's defined

```javascript
add(2, 3);

function add(x, y) {
  return x + y;
}
```

## 5. Function Expression

```javascript
const multiply = function (a, b) {
  return a * b;
};
```

**When to use:**

- When you want more control
- When you don't want hoisting
- When storing a function in a variable
- When passing functions to other functions (callbacks)

**Note:** Not hoisted.

## 6. Arrow Function (Modern JS)

```javascript
const subtract = (a, b) => a - b;
```

**Why arrow functions are special:**

- Short
- Clean
- Automatically return if 1-line
- Do NOT have their own `this`
- Best for callbacks

**Example:**

```javascript
setTimeout(() => {
  console.log("done");
}, 1000);
```

**When NOT to use arrow functions:**

- When using `this` inside objects
- When writing class methods
- As constructors (they can't be used with `new`)

## 7. Anonymous Function

A function without a name:

```javascript
setTimeout(function () {
  console.log("Hello");
}, 1000);
```

**Used mainly as:**

- Callbacks
- Event handlers
- Arguments to other functions

## 8. Callback Function

A function passed to another function.

```javascript
function greet(callback) {
  callback();
}

greet(() => console.log("Hello!"));
```

**Used in:**

- Event listeners
- Async code
- Array methods (map, filter, reduce)

## 9. Higher-Order Function

A function that:

- Takes a function as argument
- OR returns a function

**Example:**

```javascript
function createMultiplier(factor) {
  return function (num) {
    return num * factor;
  };
}

const double = createMultiplier(2);
console.log(double(5)); // 10
```

**Used in:**

- Functional programming
- Reusable logic
- Custom helpers
- React hooks (same idea)

## 10. IIFE (Immediately Invoked Function Expression)

Runs instantly:

```javascript
(function () {
  console.log("Runs immediately");
})();
```

**Used for:**

- Creating private scope
- Avoiding global variables
- Older JS patterns before modules

## 11. Constructor Function (Old OOP)

Before ES6 classes:

```javascript
function User(name, age) {
  this.name = name;
  this.age = age;
}

const user1 = new User("Ankit", 20);
```

Replaced mostly by classes.

## 12. Function Parameters & Arguments

**Parameters (placeholders):**

```javascript
function add(a, b) {}
```

**Arguments (real values):**

```javascript
add(10, 20);
```

**Default parameters:**

```javascript
function greet(name = "Guest") {
  console.log("Hello " + name);
}
```

## 13. Return Values

A function can return data:

```javascript
function square(num) {
  return num * num;
}
```

If you don't return: it returns `undefined` by default.

## 14. Named vs Anonymous Functions

**Named function:**

```javascript
function sayHi() {}
```

Good for debugging.

**Anonymous:**

```javascript
const sayHi = function () {};
```

Used for inline operations.

## 15. Pure vs Impure Functions

**Pure function:**

- Same output for same input
- No side effects

```javascript
function add(a, b) {
  return a + b;
}
```

**Impure function:**

- Modifies external state

```javascript
let x = 10;

function increase() {
  x++;
}
```

Pure functions are preferred in modern dev (React, Redux).

## 16. Function Hoisting (Very Important)

**Hoisted:**

- Function declarations

**Not hoisted:**

- Function expressions
- Arrow functions

**Example:**

```javascript
sayHi(); // works

function sayHi() {}
```

**But:**

```javascript
sayHi(); // error

const sayHi = function () {};
```

## 17. Using Functions Properly (Best Practices)

### 1. Name functions clearly

**Bad:**

```javascript
function x(a) {}
```

**Good:**

```javascript
function calculateTotal(price) {}
```

### 2. Functions should do ONE thing

Not 10 things.

### 3. Avoid long functions

Split into smaller helpers.

### 4. Keep parameters small

Max 2-3 parameters is ideal. If more → pass an object.

### 5. Use arrow functions for short logic

Especially in callbacks.

### 6. Use declarations for main logic

Better hoisting, readability.

## 18. Array Functions (Must Know)

These are built-in higher-order functions:

- **map()** - Transforms array items
- **filter()** - Filters items
- **reduce()** - Aggregates items
- **forEach()** - Side effects

These rely heavily on functions & callbacks.

## 19. Closures (Advanced but essential)

A closure occurs when a function remembers the variables of its parent function.

```javascript
function outer() {
  let count = 0;

  function inner() {
    count++;
    console.log(count);
  }

  return inner;
}

const inc = outer();
inc(); // 1
inc(); // 2
```

**Closures power:**

- Private variables
- Modules
- React hooks
- Async logic

## 20. Everything a Senior Dev Understands About Functions

- Functions are first-class citizens in JS
- You can store them in variables
- Pass them as arguments
- Return them
- Use them for callbacks
- Use them for closures
- They create scope
- Arrow functions preserve outer `this`
- Functions can be async
- Functions can be generators (`function*`)
- Functions form the foundation of React, Node, Express, etc.

---

## Summary

Mastering functions is essential to becoming proficient in JavaScript. Understanding the different types, when to use each, and best practices will significantly improve your code quality and development skills.
