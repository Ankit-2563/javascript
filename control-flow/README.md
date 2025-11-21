# JavaScript Control Flow Guide

This guide covers fundamental control flow statements in JavaScript, including conditionals and loops.

## Table of Contents

1. [If-Else Statements](#if-else-statements)
2. [Switch Statements](#switch-statements)
3. [While Loops](#while-loops)
4. [Do-While Loops](#do-while-loops)
5. [For Loops](#for-loops)
6. [For...of Loops](#forof-loops)
7. [For...in Loops](#forin-loops)
8. [Break and Continue](#break-and-continue)
9. [Ternary Operator](#ternary-operator)

---

## If-Else Statements

The `if-else` statement executes code blocks based on whether a condition is true or false.

### Basic If-Else

```javascript
const age = 20;
if (age >= 18) {
  console.log("You are an adult");
} else {
  console.log("You are a minor");
}
```

**Explanation:** If the condition `age >= 18` is true, the first block executes. Otherwise, the else block executes.

### Multiple Conditions (Else If)

```javascript
const score = 85;
if (score >= 90) {
  console.log("Grade A");
} else if (score >= 75) {
  console.log("Grade B");
} else if (score >= 50) {
  console.log("Grade C");
} else {
  console.log("Failed");
}
```

**Explanation:** Conditions are checked in order from top to bottom. The first condition that evaluates to true will execute its block, and the rest are skipped.

### Nested If

```javascript
const isMember = true;
const price = 100;
if (isMember) {
  if (price > 50) {
    console.log("Discount Applied");
  }
}
```

**Explanation:** An `if` statement inside another `if` statement. The inner condition is only checked if the outer condition is true. Both conditions must be true for the inner code to execute.

**Key Points:**

- Use `if-else` for binary decisions
- Use `else if` for multiple mutually exclusive conditions
- Nested `if` statements require all parent conditions to be true

---

## Switch Statements

The `switch` statement evaluates an expression and executes code based on matching cases.

```javascript
const fruit = "banana";
switch (fruit) {
  case "apple":
    console.log("Apple selected");
    break;
  case "banana":
    console.log("Banana selected");
    break;
  case "orange":
    console.log("Orange selected");
    break;
  default:
    console.log("Unknown fruit");
}
```

**Explanation:**

- The expression `fruit` is evaluated once
- Its value is compared with each `case`
- When a match is found, the corresponding code executes
- `break` prevents fall-through to the next case
- `default` executes if no case matches

**When to Use:**

- When comparing one variable against multiple specific values
- Better readability than multiple `else if` statements for exact matches

---

## While Loops

The `while` loop executes code repeatedly as long as a condition is true.

```javascript
let count = 1;
while (count <= 5) {
  console.log("Count is:", count);
  count++;
}
```

**Explanation:**

- The condition is checked before each iteration
- The loop continues while the condition is true
- You must update the condition variable inside the loop to avoid infinite loops

### Countdown Example

```javascript
let num = 10;
while (num > 0) {
  console.log("num:", num);
  num--;
}
```

**Key Points:**

- Condition is checked before the first execution
- May not execute at all if condition is initially false
- Ensure the condition will eventually become false

---

## Do-While Loops

The `do-while` loop executes code at least once, then repeats while a condition is true.

```javascript
let i = 1;
do {
  console.log("i is:", i);
  i++;
} while (i <= 5);
```

**Explanation:**

- Code block executes first
- Then the condition is checked
- Loop continues if condition is true

### Guaranteed Execution Example

```javascript
let x = 10;
do {
  console.log("Runs once even if x < 0");
  x = -1;
} while (x > 0);
```

**Key Difference from While:**

- `do-while` always runs at least once
- `while` may never run if condition is initially false

---

## For Loops

The `for` loop is used when you know how many times you want to iterate.

### Basic For Loop

```javascript
for (let i = 1; i <= 5; i++) {
  console.log("Number:", i);
}
```

**Syntax:** `for (initialization; condition; update)`

- **Initialization:** Runs once before the loop starts
- **Condition:** Checked before each iteration
- **Update:** Runs after each iteration

### Looping Over Arrays

```javascript
const names = ["Ankit", "Rohan", "Sam"];
for (let i = 0; i < names.length; i++) {
  console.log(names[i]);
}
```

**Explanation:** Use the index `i` to access each element in the array.

### Backward Looping

```javascript
for (let j = 5; j >= 1; j--) {
  console.log("Reverse:", j);
}
```

**Key Points:**

- Most common loop for counting
- All loop control is in one line
- Index-based access to arrays

---

## For...of Loops

The `for...of` loop iterates over values of iterable objects like arrays and strings.

### Array Iteration

```javascript
const colors = ["red", "green", "blue"];
for (const color of colors) {
  console.log(color);
}
```

**Explanation:** Directly provides each value in the array without needing an index.

### String Iteration

```javascript
for (const char of "ANKIT") {
  console.log(char);
}
```

**When to Use:**

- When you need values, not indices
- Works with arrays, strings, Maps, Sets
- Cleaner syntax than traditional `for` loop

**Does Not Work With:** Plain objects (use `for...in` instead)

---

## For...in Loops

The `for...in` loop iterates over keys (property names) of an object.

```javascript
const user = {
  name: "Ankit",
  age: 20,
  city: "Mumbai",
};
for (const key in user) {
  console.log(key, "=", user[key]);
}
```

**Explanation:**

- `key` is the property name
- `user[key]` accesses the property value
- Iterates over all enumerable properties

**When to Use:**

- Iterating over object properties
- Getting both keys and values from objects

**Caution:** Can also iterate over arrays, but returns indices as strings. Use `for...of` for arrays instead.

---

## Break and Continue

Control statements that modify loop behavior.

### Break Statement

```javascript
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break; // exit loop completely
  }
  console.log("i =", i);
}
```

**Explanation:** `break` immediately exits the loop. In this example, the loop stops when `i` equals 5.

### Continue Statement

```javascript
for (let j = 1; j <= 10; j++) {
  if (j % 2 === 0) {
    continue; // skip current iteration
  }
  console.log("Odd:", j);
}
```

**Explanation:** `continue` skips the rest of the current iteration and moves to the next one. This example skips even numbers and only prints odd numbers.

**Key Differences:**

- `break`: Terminates the entire loop
- `continue`: Skips to the next iteration

---

## Ternary Operator

A shorthand for simple `if-else` statements.

### Basic Ternary

```javascript
const age = 18;
const message = age >= 18 ? "Adult" : "Minor";
console.log(message);
```

**Syntax:** `condition ? valueIfTrue : valueIfFalse`

### Chained Ternary

```javascript
const temp = 30;
const weather =
  temp > 35 ? "Very Hot" : temp > 25 ? "Pleasant" : temp > 15 ? "Cool" : "Cold";
console.log(weather);
```

**Explanation:** Multiple ternary operators can be chained for multiple conditions. Read from top to bottom like `else if` chains.

**When to Use:**

- Simple conditional assignments
- Short, readable conditions
- Avoid for complex logic (use `if-else` instead)

**Best Practice:** Keep ternary operators simple. If you need more than one level of nesting, use regular `if-else` statements for better readability.

---

## Summary

| Statement  | Use Case                                            |
| ---------- | --------------------------------------------------- |
| `if-else`  | Binary or multiple conditional branches             |
| `switch`   | Comparing one value against many cases              |
| `while`    | Loop when iterations unknown, condition first       |
| `do-while` | Loop when iterations unknown, execute at least once |
| `for`      | Loop with known iterations or array indices         |
| `for...of` | Iterate over array/string values                    |
| `for...in` | Iterate over object keys                            |
| `break`    | Exit loop early                                     |
| `continue` | Skip current iteration                              |
| `ternary`  | Short conditional assignment                        |

---

## Running the Examples

Each concept has its own file. Run them individually with Node.js:

```bash
node 01_if_else.js
node 02_switch.js
node 03_while.js
node 04_do_while.js
node 05_for.js
node 06_for_of.js
node 07_for_in.js
node 08_break_continue.js
node 09_ternary.js
```

---
