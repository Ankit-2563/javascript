# Error Handling in JavaScript - Complete Beginner's Guide

## What is an Error?

An error in JavaScript is when the JavaScript engine cannot continue running code as normal. Something went wrong, and the program needs to deal with it.

Understanding errors is critical because:

- Without proper error handling, your app will crash
- With proper error handling, your app can recover and provide a good user experience
- Good error handling makes debugging much easier

## Three Types of Errors

JavaScript has three main types of errors, and each is handled differently.

### Syntax Errors

Syntax errors occur when your code is not valid JavaScript. The code is written incorrectly.

Example:

```javascript
// Missing closing parenthesis
if (true {
  console.log("hi");
}
```

Why this happens: You forgot a bracket, semicolon, or wrote invalid code structure.

When it's caught: Before the program even runs. The JavaScript engine checks syntax first.

What to do: Fix the code in your editor.

### Runtime Errors

Runtime errors occur when your code is valid JavaScript, but something fails while the program is running.

Example:

```javascript
const user = null;
console.log(user.name); // TypeError: Cannot read properties of null
```

Why this happens: You tried to access a property on null or undefined, called a function that doesn't exist, or performed an invalid operation.

When it's caught: While the program is running. The program crashes unless you handle it.

What to do: Use try/catch blocks to handle these errors gracefully.

### Logical Errors

Logical errors occur when your code runs without throwing any error, but the behavior is wrong.

Example:

```javascript
function add(a, b) {
  return a - b; // Logic bug - should be a + b, not a - b
}

console.log(add(5, 3)); // Returns 2 instead of 8
```

Why this happens: Your code logic is incorrect, but JavaScript doesn't know that.

When it's caught: Never by the JavaScript engine. Only by testing or when you see wrong results.

What to do: Write tests, use logging, and check your code carefully.

## Understanding Try, Catch, Finally, and Throw

These are the main tools for handling errors. Let's understand each one.

### Try Block - Attempt the Code

The `try` block contains code that might throw an error. You are essentially saying: "Try to run this code, but be ready if it fails."

```javascript
try {
  const user = JSON.parse('{"name": "Ankit"'); // Invalid JSON will throw an error
  console.log(user.name);
} catch (err) {
  console.error("Failed to parse JSON:", err.message);
}
```

In this example, `JSON.parse()` will throw an error because the JSON is invalid (missing closing brace).

### Catch Block - Handle the Error

The `catch` block runs if an error is thrown in the try block. The `err` variable contains information about the error.

Why use catch:

- Your app doesn't crash
- You can show a helpful message to the user
- You can log the issue for debugging
- You can provide a fallback or default behavior

Without catch:

- The program stops running
- Everything after the error is skipped
- The user sees a broken app

```javascript
try {
  // Some operation that might fail
  riskyOperation();
} catch (err) {
  // If riskyOperation() throws, this code runs
  console.error("Something went wrong:", err.message);
  // Show friendly message to user
  // Use a fallback value
  // Retry the operation
}
```

### Finally Block - Cleanup Code

The `finally` block always runs, whether an error occurred or not. Use finally for cleanup work.

```javascript
let fileHandle;

try {
  fileHandle = openFile("data.txt");
  // read and process file
  console.log("File processed successfully");
} catch (err) {
  console.error("Error reading file:", err.message);
} finally {
  // This always runs, whether success or failure
  if (fileHandle) {
    fileHandle.close(); // Make sure we always close the file
  }
}
```

Why use finally:

- Close files or database connections (cleanup resources)
- Hide loading spinners (whether operation succeeded or failed)
- Clear timers or event listeners
- Stop background processes

Without finally, you might forget to clean up, and resources stay open. This can cause memory leaks or locked files.

### Throw - Create Your Own Errors

You can create and throw your own errors to signal that something is wrong.

```javascript
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}

try {
  console.log(divide(10, 0));
} catch (err) {
  console.error(err.message); // "Cannot divide by zero"
}
```

Why use throw:

- Signal to the caller that something is wrong
- Force the caller to handle the error
- Provide specific error messages
- Stop execution of the current function

Without throw, the function might return incorrect results:

```javascript
function divide(a, b) {
  return a / b; // If b is 0, this returns Infinity (wrong!)
}
```

### Error Objects - Understanding Error Information

When an error is thrown, you get an Error object with useful information:

```javascript
try {
  JSON.parse("invalid");
} catch (err) {
  console.log(err.name); // "SyntaxError"
  console.log(err.message); // "Unexpected token..."
  console.log(err.stack); // Full stack trace showing where error happened
}
```

Common Error types:

- `TypeError` - Wrong data type
- `ReferenceError` - Variable doesn't exist
- `SyntaxError` - Invalid syntax
- `RangeError` - Value out of range

You can throw specific errors:

```javascript
function validateAge(age) {
  if (typeof age !== "number") {
    throw new TypeError("Age must be a number");
  }
  if (age < 0 || age > 150) {
    throw new RangeError("Age must be between 0 and 150");
  }
}
```

### Custom Error Classes - Advanced Error Handling

For larger applications, create custom error classes to make error handling more specific:

```javascript
class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field; // Which field had the problem
  }
}

function createUser(data) {
  if (!data.email) {
    throw new ValidationError("Email is required", "email");
  }
  if (!data.password) {
    throw new ValidationError("Password is required", "password");
  }
}

try {
  createUser({});
} catch (err) {
  if (err instanceof ValidationError) {
    console.log("Validation failed on field:", err.field);
    console.log("Error:", err.message);
  } else {
    console.error("Unknown error:", err);
  }
}
```

Why use custom errors:

- Distinguish between different types of problems
- Provide relevant information for each error type
- Handle different errors differently
- Make code clearer and more maintainable

## Handling Errors in Asynchronous Code

Asynchronous code (code that takes time, like fetching data) needs special error handling. This is where most beginners struggle.

### The Old Way - Callbacks

Before modern JavaScript, errors in asynchronous code were handled using callbacks with an error-first pattern.

```javascript
function readFile(path, callback) {
  // Simulate async operation
  setTimeout(() => {
    if (path !== "data.txt") {
      callback(new Error("File not found")); // Error is first argument
    } else {
      callback(null, "file content here"); // null means no error
    }
  }, 1000);
}

readFile("data.txt", (err, data) => {
  if (err) {
    console.error("Error:", err.message);
    return; // Stop here
  }
  // If no error, process data
  console.log("Data:", data);
});
```

Rule: The callback function receives (error, result). If error exists, something went wrong.

Problems with callbacks:

- Easy to forget to check for errors
- Callback code becomes deeply nested ("callback hell")
- Hard to read and maintain

### Modern Way - Promises and .catch()

Promises make error handling cleaner:

```javascript
function getUser(id) {
  return fetch(`/api/users/${id}`).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    return res.json();
  });
}

getUser(1)
  .then((user) => {
    console.log("User:", user);
  })
  .catch((err) => {
    console.error("Error loading user:", err.message);
  });
```

Why use promises:

- Cleaner than nested callbacks
- .catch() catches any error in the chain
- Chain multiple async operations

Without .catch(), if any promise fails, the error is unhandled and causes problems.

### Best Way - Async/Await with Try/Catch

The modern standard way to handle async errors:

```javascript
async function loadUser() {
  try {
    const res = await fetch("/api/users/1");
    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }
    const user = await res.json();
    console.log("User:", user);
  } catch (err) {
    console.error("Error in loadUser:", err.message);
    // Show error to user, retry, or use fallback
  }
}

loadUser();
```

Why use async/await:

- Looks like normal synchronous code
- Easy to understand
- try/catch works naturally
- Less verbose than promises

Important: try/catch only catches errors inside that async function. It doesn't catch errors from other functions running elsewhere.

### Handling Multiple Async Operations

When you need to run multiple async operations together:

**Promise.all - All or nothing**

```javascript
const p1 = fetch("/api/users");
const p2 = fetch("/api/posts");
const p3 = fetch("/api/comments");

Promise.all([p1, p2, p3])
  .then((results) => {
    console.log("All data loaded:", results);
  })
  .catch((err) => {
    console.error("At least one failed:", err);
    // ALL operations failed or need to be retried
  });
```

Use when: All operations must succeed or the whole thing is useless.

Problem without error handling: If any operation fails, the user doesn't know why. The app just stops.

**Promise.allSettled - Handle partial failures**

```javascript
Promise.allSettled([p1, p2, p3]).then((results) => {
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log("Operation", index, "succeeded:", result.value);
    } else {
      console.error("Operation", index, "failed:", result.reason);
    }
  });
});
```

Use when: You want to handle each result individually, even if some fail.

Problem without this: If you use Promise.all and one fails, you don't know about the others that might have succeeded.

## Error Propagation - When to Catch, When to Let It Bubble Up

Not every function should catch errors. The key is catching errors where you can do something meaningful about them.

### Let Errors Bubble Up

Don't catch errors too early if you can't actually handle them:

```javascript
function parseConfig(jsonString) {
  // Don't catch here - let caller handle it
  return JSON.parse(jsonString);
}

function initApp(configJson) {
  const config = parseConfig(configJson); // Could throw
  console.log("Starting with config:", config);
}

try {
  initApp("{ invalid json");
} catch (err) {
  console.error("App failed to start:", err.message);
}
```

Why:

- parseConfig doesn't know what to do with the error
- initApp is also just passing it along
- Only the top level knows how to handle it (show user message, log it, etc.)

Without this approach: You catch errors at every level, and error handling code is duplicated everywhere.

### Rethrowing Errors with Context

Sometimes catch an error, add more information, and rethrow:

```javascript
function loadUser(jsonString) {
  try {
    const user = JSON.parse(jsonString);
    return user;
  } catch (err) {
    // Add context and rethrow
    throw new Error("Invalid user data: " + err.message);
  }
}

try {
  loadUser("not-json");
} catch (err) {
  console.error(err.message);
  // "Invalid user data: Unexpected token..."
}
```

Why:

- Original error message is preserved
- Context is added (tells you it was about user data)
- Caller gets a more specific error

Without this: Error messages are generic and don't tell you where the problem occurred.

## Common Error Handling Mistakes

### Mistake 1 - Empty Catch Blocks

Never do this:

```javascript
try {
  riskyOperation();
} catch (err) {
  // Just ignore the error (WRONG!)
}
```

Problems:

- Errors are hidden completely
- You'll never know when something fails
- Debugging becomes impossible
- Your app behaves randomly

Even if you must ignore an error, at least log it:

```javascript
try {
  riskyOperation();
} catch (err) {
  console.warn("Ignored error:", err.message);
}
```

### Mistake 2 - Using Errors for Normal Logic

Don't throw errors for conditions that are expected:

```javascript
// WRONG - User not found is normal, not exceptional
function findUser(id) {
  const user = users.find((u) => u.id === id);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

// RIGHT - Return null for normal cases
function findUser(id) {
  const user = users.find((u) => u.id === id);
  return user; // Returns undefined if not found
}

if (!user) {
  console.log("User not found");
}
```

Why:

- Errors are for exceptional situations
- Normal flow should use regular logic (if/else)
- Throwing is slower than returning null
- Code is clearer when errors mean "something went wrong"

### Mistake 3 - Over-Catching

Catching too broadly and continuing as if nothing happened:

```javascript
// WRONG - Critical failure, shouldn't continue
try {
  processCriticalPayment();
} catch (err) {
  console.log("Something happened, continuing...");
}
```

Problems:

- User's payment might have failed but they don't know
- No retry is offered
- Data corruption or inconsistency results

Better approach:

```javascript
try {
  processCriticalPayment();
} catch (err) {
  console.error("Payment failed:", err);
  showUserMessage("Payment failed. Please try again.");
  // Provide retry button
  // Stop the flow
}
```

## Global Error Handlers - Last Resort

Not all errors can be caught locally. JavaScript provides global handlers as a safety net.

### In the Browser

```javascript
window.onerror = function (message, source, lineno, colno, error) {
  console.error("Global error:", message, "at", source, lineno + ":" + colno);
  // Send to logging server
  sendErrorToServer(error);
};

window.onunhandledrejection = function (event) {
  console.error("Unhandled promise rejection:", event.reason);
  sendErrorToServer(event.reason);
};
```

Use for:

- Logging uncaught errors
- Showing a generic error UI ("Something went wrong")
- Alerting developers

Without these: Some errors slip through and the app fails silently.

### In Node.js (Backend)

```javascript
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
  // Log to file or service
  // Gracefully shutdown
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled rejection:", reason);
  // Same handling
});
```

Important: These are last resort. You should still handle errors properly in your app logic.

## Error Handling in APIs and Servers

### Centralized Error Handling

In Express (a popular Node.js framework), handle errors in one place:

```javascript
const express = require("express");
const app = express();

app.get("/user/:id", async (req, res, next) => {
  try {
    const user = await findUser(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    next(err); // Pass to central handler
  }
});

// Central error handler (must be after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});
```

Why this is better:

- One place to format error responses
- Consistent error messages for users
- One place to log errors
- Don't leak sensitive details (stack traces) to users
- Cleaner route handlers

Without this: Every route has its own error handling, and error responses are inconsistent.

### Async Route Wrapper

A senior developer trick to avoid repeating try/catch:

```javascript
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

app.get(
  "/user/:id",
  asyncHandler(async (req, res) => {
    const user = await findUser(req.params.id);
    res.json(user);
  })
);
```

Now errors automatically go to the central handler. No need to write try/catch in every route.

## User Experience - Show Friendly Errors

Error handling is not just about logging. It's about user experience.

### Never Show Raw Errors to Users

Bad:

```
TypeError: Cannot read property 'address' of undefined at loadAddress (app.js:42)
```

Good:

```
Failed to load address. Please try again.
```

### Show Context-Specific Messages

Different situations need different messages:

```javascript
async function fetchWithFriendlyError(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Your session expired. Please login again.");
      }
      if (res.status === 404) {
        throw new Error("This resource was not found.");
      }
      throw new Error("Request failed. Please try again.");
    }
    return await res.json();
  } catch (err) {
    showToast(err.message); // Show to user
    console.error("API error:", err); // Log actual error
    throw err; // Still let caller know
  }
}
```

Good error messages include:

- Retry buttons for network errors
- "Try again later" for server errors
- Specific messages for expected failures
- Toast notifications or modals, not console logs

## Writing Good Error Messages

Error messages are for humans (developers and users). Make them clear and specific.

### Bad Error Messages

```javascript
throw new Error("Something went wrong");
throw new Error("Error");
throw new Error("Oops");
```

Problems: No information about what happened or why.

### Good Error Messages

```javascript
throw new Error("Login failed: invalid email or password");
throw new Error("Database connection failed: timeout after 5s");
throw new Error("Invalid input: age must be a positive number");
```

Benefits: Developers know exactly what failed and why.

### Even Better - Include Context

```javascript
throw new Error(`Payment failed for user ${userId}: insufficient funds`);
throw new Error(
  `Failed to load post ${postId} for user ${userId}: permission denied`
);
```

Benefits:

- IDs help locate the exact record
- Context helps reproduce the issue
- Makes debugging much faster

### Important - Don't Leak Sensitive Data

Bad (leaks password):

```javascript
throw new Error(`Login failed: password is ${user.password}`);
```

Good:

```javascript
throw new Error("Login failed: invalid email or password");
```

## Preventing Errors Before They Happen

The best error to handle is one that never happens.

### Validate Input Immediately

```javascript
function createUser({ name, age, email }) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new TypeError("Name must be a non-empty string");
  }
  if (typeof age !== "number" || age < 0 || age > 150) {
    throw new TypeError("Age must be a number between 0 and 150");
  }
  if (!email.includes("@")) {
    throw new TypeError("Email must be valid");
  }
  // Safe to use at this point
}
```

Why:

- Catch bad data early
- Fail fast instead of causing problems later
- Clear error messages for callers

### Use Guard Clauses

Guard clauses return early if conditions aren't met:

```javascript
// Without guard clause
function getFirstItem(arr) {
  if (Array.isArray(arr)) {
    if (arr.length > 0) {
      return arr[0];
    }
  }
  return null;
}

// With guard clause (cleaner)
function getFirstItem(arr) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null;
  }
  return arr[0];
}
```

Benefits:

- Code is easier to read
- Less nesting
- Safer (catches edge cases early)

### Use Optional Chaining and Default Values

```javascript
// Without optional chaining - crashes if user is null
const city = user.address.city; // Error!

// With optional chaining - returns undefined if user is null
const city = user?.address?.city; // undefined if any step is null

// With default value
const city = user?.address?.city ?? "Unknown"; // "Unknown" if undefined
```

Benefits:

- Prevents "Cannot read property" errors
- Code is more defensive
- Cleaner than checking every level

## Logging - Debug Like a Pro

Good logging helps you find and fix problems after they happen.

### Use the Right Log Level

```javascript
console.log("User created:", userId); // Regular info
console.warn("Database connection slow"); // Warning
console.error("Payment failed:", error); // Error
```

### Include Context

```javascript
// BAD - No context
console.error("Error");

// GOOD - Include relevant information
console.error("Failed to save order", {
  orderId: order.id,
  userId: user.id,
  error: err.message,
});
```

Benefits:

- You know exactly where the error happened
- You can find the specific order/user
- Easier to reproduce and fix

### Group Related Logs

```javascript
// Group logs by feature
console.group("User Authentication");
console.log("User logging in:", email);
console.log("Token generated");
console.groupEnd();

console.group("Payment Processing");
console.log("Processing payment...");
console.error("Payment failed: insufficient funds");
console.groupEnd();
```

## The Senior Developer Mindset

When writing code, experienced developers ask themselves:

**1. What can go wrong here?**

- Network request could fail
- Server could be slow
- User input could be invalid
- Database could be down
- File might not exist

**2. Can I prevent it early?**

- Validate input immediately
- Set defaults
- Check preconditions
- Use guard clauses

**3. If it still fails, who should handle it?**

- Should this component handle it?
- Should the page handle it?
- Should the global handler handle it?
- Is this error for the user or just developers?

**4. What should the user see?**

- Friendly message (not technical)
- Option to retry
- Clear next steps

**5. What should we log?**

- Enough context to debug later
- Don't log sensitive data
- Include relevant IDs and state

**6. Is this error expected or exceptional?**

- Expected error: "User not found" - handle with normal logic (if/else)
- Exceptional error: "Database connection failed" - throw and catch

## Key Takeaways

1. Three types of errors: syntax (before running), runtime (while running), logical (wrong behavior)
2. Use try/catch for code that might throw errors
3. Use finally for cleanup (closing files, hiding loaders)
4. Use throw to signal errors to the caller
5. In async code, use async/await with try/catch
6. Catch errors where you can actually handle them (show message, retry, etc.)
7. Never use empty catch blocks - always log at minimum
8. Use custom error classes to distinguish different types of problems
9. Write clear error messages with context, not raw stack traces
10. Global error handlers are last resort, not primary strategy
11. Show friendly errors to users, detailed errors to developers
12. Prevent errors before they happen: validate input, use guard clauses, use optional chaining
13. Log with context so you can debug problems after they happen

Error handling separates professional code from buggy code. Master these concepts and your applications will be reliable, maintainable, and provide good user experiences.
