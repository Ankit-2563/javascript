# Event Loop

## Introduction

JavaScript runs code one line at a time (single-threaded), but it can handle multiple tasks at once thanks to the **event loop**. This guide will help you understand how JavaScript manages to do many things seemingly at the same time, even though it can only do one thing at a time.

Think of it like a restaurant with one chef who can only cook one dish at a time, but manages to serve many customers by organizing the work efficiently.

---

## Part 1: The Building Blocks

### 1.1 The Call Stack

The call stack is where JavaScript actually runs your code. Think of it as a stack of plates:

- When you call a function, it gets added to the top of the stack
- JavaScript executes the function at the top
- When the function finishes, it gets removed from the stack
- Only one function runs at a time

**Example:**

```javascript
function first() {
  console.log("First function");
}

function second() {
  first();
  console.log("Second function");
}

second();

// Output:
// First function
// Second function
```

**What happens:**

1. `second()` goes on the stack
2. Inside `second()`, `first()` goes on top of the stack
3. `first()` runs and finishes, gets removed
4. `second()` continues and finishes, gets removed

### 1.2 The Heap

The heap is just a place in memory where JavaScript stores objects and variables. You don't need to worry much about this for understanding the event loop. Just know it's where your data lives.

### 1.3 Web APIs

These are special functions provided by the browser (or Node.js) that can do work in the background while JavaScript continues running other code.

**Common Web APIs:**

- `setTimeout` - runs code after a delay
- `fetch` - makes network requests
- DOM events - handles clicks, keyboard input, etc.
- `setInterval` - runs code repeatedly

**Important:** When you call these functions, they don't run in the call stack. They run separately and notify JavaScript when they're done.

### 1.4 The Queues

When Web APIs finish their work, they need to tell JavaScript. They do this by putting callback functions (the code you want to run) into queues. There are two types:

**Task Queue (Macrotask Queue):**

- Holds callbacks from `setTimeout`, `setInterval`, DOM events
- Lower priority

**Microtask Queue:**

- Holds callbacks from Promises, `queueMicrotask`
- Higher priority - always runs first

### 1.5 The Event Loop

The event loop is like a manager that constantly checks:

1. Is the call stack empty?
2. If yes, are there microtasks waiting? Run all of them.
3. If no microtasks, is there a task in the task queue? Run one.
4. Repeat forever

---

## Part 2: Synchronous vs Asynchronous Code

### 2.1 Synchronous Code (Blocking)

Synchronous code runs line by line. Each line waits for the previous one to finish.

```javascript
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");

// Output:
// Step 1
// Step 2
// Step 3
```

**Problem with synchronous code:**

```javascript
console.log("Start");

// This blocks everything for 3 seconds
function waitThreeSeconds() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // doing nothing, just waiting
  }
}

waitThreeSeconds();
console.log("End");

// Output:
// Start
// (wait 3 seconds - nothing else can happen)
// End
```

During those 3 seconds, your webpage would freeze. No clicks work, no animations run. This is bad.

### 2.2 Asynchronous Code (Non-blocking)

Asynchronous code lets other things happen while waiting.

```javascript
console.log("Start");

setTimeout(() => {
  console.log("After timeout");
}, 2000);

console.log("End");

// Output:
// Start
// End
// (wait 2 seconds)
// After timeout
```

**What happens:**

1. "Start" prints immediately
2. `setTimeout` is called - the browser starts a 2-second timer in the background
3. JavaScript doesn't wait - it continues to the next line
4. "End" prints immediately
5. After 2 seconds, the browser puts the callback in the task queue
6. The event loop moves it to the call stack
7. "After timeout" prints

---

## Part 3: Understanding the Event Loop Cycle

Here's what the event loop does, step by step:

**Step 1:** Run all synchronous code until the call stack is empty.

**Step 2:** Once the stack is empty, check the microtask queue. Run ALL microtasks until the queue is empty.

**Step 3:** Take ONE task from the task queue and run it.

**Step 4:** Go back to Step 2 and repeat forever.

**Key rule:** Microtasks always run before the next task.

---

## Part 4: Tasks vs Microtasks

### 4.1 Tasks (Macrotasks)

Tasks are callbacks that run later, one at a time.

**Examples:**

- `setTimeout`
- `setInterval`
- DOM events (clicks, etc.)

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Task 1");
}, 0);

setTimeout(() => {
  console.log("Task 2");
}, 0);

console.log("End");

// Output:
// Start
// End
// Task 1
// Task 2
```

**Why this order:**

1. Synchronous code runs first: "Start", "End"
2. Both `setTimeout` callbacks go to the task queue
3. Event loop takes them one at a time: "Task 1", then "Task 2"

### 4.2 Microtasks

Microtasks are high-priority callbacks that run before any tasks.

**Examples:**

- `Promise.then()`
- `Promise.catch()`
- `queueMicrotask()`

```javascript
console.log("Start");

setTimeout(() => {
  console.log("Task");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask");
});

console.log("End");

// Output:
// Start
// End
// Microtask
// Task
```

**Why this order:**

1. Synchronous code: "Start", "End"
2. Call stack is empty
3. Event loop checks microtask queue first: runs "Microtask"
4. Then checks task queue: runs "Task"

### 4.3 The Priority Rule

After every task completes, the event loop runs ALL microtasks before moving to the next task.

```javascript
setTimeout(() => {
  console.log("Task 1");

  Promise.resolve().then(() => {
    console.log("Microtask inside Task 1");
  });
}, 0);

setTimeout(() => {
  console.log("Task 2");
}, 0);

// Output:
// Task 1
// Microtask inside Task 1
// Task 2
```

**Explanation:**

1. Task 1 runs
2. Before Task 2, the microtask inside Task 1 runs
3. Then Task 2 runs

---

## Part 5: Promises and the Event Loop

Promises use the microtask queue. Every `.then()` callback is a microtask.

### 5.1 Basic Promise Example

```javascript
console.log("1");

Promise.resolve().then(() => {
  console.log("2");
});

console.log("3");

// Output:
// 1
// 3
// 2
```

**Step by step:**

1. "1" prints (synchronous)
2. Promise is created, `.then()` callback goes to microtask queue
3. "3" prints (synchronous)
4. Call stack empty, microtask runs: "2" prints

### 5.2 Chained Promises

Each `.then()` creates a new microtask.

```javascript
Promise.resolve()
  .then(() => {
    console.log("First then");
  })
  .then(() => {
    console.log("Second then");
  });

console.log("Synchronous");

// Output:
// Synchronous
// First then
// Second then
```

**Explanation:**

1. Synchronous code runs first
2. First `.then()` runs as a microtask
3. Second `.then()` runs as the next microtask

---

## Part 6: Async/Await Explained

`async` and `await` are just a cleaner way to work with Promises. Under the hood, they use the same microtask queue.

### 6.1 How Async Functions Work

An `async` function always returns a Promise.

```javascript
async function example() {
  return "Hello";
}

// This is the same as:
function example() {
  return Promise.resolve("Hello");
}
```

### 6.2 How Await Works

`await` pauses the function and schedules the rest as a microtask.

```javascript
async function demo() {
  console.log("1");
  await null; // Pauses here
  console.log("2");
}

console.log("Start");
demo();
console.log("End");

// Output:
// Start
// 1
// End
// 2
```

**What happens:**

1. "Start" prints
2. `demo()` is called, "1" prints
3. `await` pauses the function, everything after it becomes a microtask
4. "End" prints (synchronous code continues)
5. Microtask runs: "2" prints

### 6.3 Practical Example

```javascript
async function fetchData() {
  console.log("Fetching...");
  const data = await fetch("https://api.example.com/data");
  console.log("Data received");
  return data;
}

console.log("Start");
fetchData();
console.log("End");

// Output:
// Start
// Fetching...
// End
// (when fetch completes)
// Data received
```

---

## Part 7: Common Problems

### 7.1 Blocking the Event Loop

If you run heavy computation, everything freezes.

```javascript
console.log("Start");

setTimeout(() => {
  console.log("This should run after 1 second");
}, 1000);

// Heavy computation - blocks for 5 seconds
const start = Date.now();
while (Date.now() - start < 5000) {
  // doing nothing
}

console.log("End");

// Output:
// Start
// (5 second freeze)
// End
// This should run after 1 second
```

The setTimeout callback had to wait 5 seconds because the call stack was busy.

**How to avoid:**

- Don't do heavy calculations in JavaScript
- Break work into smaller chunks
- Use Web Workers for heavy computation

### 7.2 setTimeout with 0 Delay Doesn't Mean Immediate

```javascript
console.log("A");

setTimeout(() => {
  console.log("B");
}, 0);

console.log("C");

// Output:
// A
// C
// B
```

Even with 0 delay, setTimeout goes through the task queue, so it runs after all synchronous code and microtasks.

### 7.3 Microtask Starvation

If you keep creating microtasks, tasks never run.

```javascript
function infiniteMicrotasks() {
  Promise.resolve().then(infiniteMicrotasks);
}

infiniteMicrotasks();

setTimeout(() => {
  console.log("This will never run!");
}, 0);
```

This creates an infinite loop of microtasks, blocking everything else.

---

## Part 8: Practical Examples

### Example 1: Mixed Async Code

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
}, 0);

Promise.resolve().then(() => {
  console.log("3");
});

Promise.resolve().then(() => {
  console.log("4");
});

console.log("5");

// Output:
// 1
// 5
// 3
// 4
// 2
```

**Analysis:**

- Synchronous: 1, 5
- Microtasks: 3, 4 (both run before any task)
- Tasks: 2

### Example 2: Nested Async

```javascript
setTimeout(() => {
  console.log("Timeout 1");

  Promise.resolve().then(() => {
    console.log("Promise in Timeout 1");
  });
}, 0);

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise 1");
});

// Output:
// Promise 1
// Timeout 1
// Promise in Timeout 1
// Timeout 2
```

**Analysis:**

1. All synchronous code finishes
2. Microtask: Promise 1
3. Task: Timeout 1
4. Microtask created inside Timeout 1 runs before next task
5. Task: Timeout 2

### Example 3: Async/Await with Timers

```javascript
async function example() {
  console.log("A");
  await Promise.resolve();
  console.log("B");
}

console.log("Start");
example();

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");

// Output:
// Start
// A
// End
// B
// Timeout
```

---

## Part 9: Quick Mental Model

When you see code with async parts, ask yourself:

1. **What runs synchronously first?** (All regular code)
2. **What becomes microtasks?** (Promise.then, await, queueMicrotask)
3. **What becomes tasks?** (setTimeout, setInterval, events)
4. **In what order?** (Sync → All Microtasks → One Task → Repeat)

---

## Part 10: Best Practices

1. **Use Promises and async/await** for cleaner asynchronous code
2. **Use microtasks** when something must run right after current code
3. **Use tasks (setTimeout)** to break up heavy work so the UI doesn't freeze
4. **Never block the event loop** with heavy synchronous calculations
5. **Be careful with infinite loops** of microtasks
6. **Remember:** setTimeout(fn, 0) doesn't mean "right now", it means "later"

---

## Summary Checklist

You understand the event loop when you can answer:

- What is the call stack and why can it only do one thing at a time?
- What's the difference between synchronous and asynchronous code?
- What are Web APIs and how do they help JavaScript do multiple things?
- What's the difference between the task queue and microtask queue?
- Why do microtasks always run before tasks?
- How does the event loop decide what to run next?
- Why does setTimeout(fn, 0) not run immediately?
- How do Promises use the microtask queue?
- What does await actually do to your code?
- Why is blocking the event loop bad?

---

## Practice Exercise

Try to predict the output of this code:

```javascript
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => {
    console.log("3");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("4");
  setTimeout(() => {
    console.log("5");
  }, 0);
});

console.log("6");
```

**Answer:** 1, 6, 4, 2, 3, 5

Take your time to understand why this is the order. Draw the call stack, microtask queue, and task queue if it helps!
