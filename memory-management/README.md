# JavaScript Memory Management Complete Guide

A comprehensive guide to understanding how JavaScript manages memory, garbage collection, memory leaks, and how to write memory-efficient code.

---

## Table of Contents

1. [How Memory Works in JavaScript](#how-memory-works-in-javascript)
2. [The Memory Lifecycle](#the-memory-lifecycle)
3. [Stack vs Heap Memory](#stack-vs-heap-memory)
4. [Garbage Collection](#garbage-collection)
5. [Common Memory Leaks](#common-memory-leaks)
6. [WeakMap and WeakSet](#weakmap-and-weakset)
7. [WeakRef and FinalizationRegistry](#weakref-and-finalizationregistry)
8. [Detecting Memory Leaks](#detecting-memory-leaks)
9. [Best Practices](#best-practices)
10. [Real-World Examples](#real-world-examples)

---

## How Memory Works in JavaScript

### The Simple Explanation

Think of memory like a hotel:

1. **Allocation** - Guest checks in (variable is created)
2. **Usage** - Guest uses the room (variable is used in code)
3. **Release** - Guest checks out (variable is no longer needed)

In JavaScript, you don't manually check guests out. The hotel manager (garbage collector) automatically evicts guests who are no longer needed.

### Why Should You Care?

JavaScript handles memory automatically, so why learn this?

- **Memory leaks** can crash your app or make it slow
- **Poor memory usage** affects performance, especially on mobile
- **Understanding memory** helps you write better code
- **Debugging** memory issues requires this knowledge
- **Interviews** often ask about garbage collection

---

## The Memory Lifecycle

Every piece of data in JavaScript goes through three stages:

### Stage 1: Allocation

Memory is reserved when you create values.

```javascript
// Primitive allocation (small, fixed size)
const name = "John"; // Allocates memory for string
const age = 25; // Allocates memory for number
const isActive = true; // Allocates memory for boolean

// Object allocation (larger, dynamic size)
const user = {
  // Allocates memory for object
  name: "John",
  age: 25,
};

const numbers = [1, 2, 3]; // Allocates memory for array

// Function allocation
function greet() {
  // Allocates memory for function
  console.log("Hello");
}
```

### Stage 2: Usage

Memory is read from and written to.

```javascript
// Reading memory
console.log(user.name); // Read from user object

// Writing to memory
user.age = 26; // Write to user object
numbers.push(4); // Write to array (may reallocate)
```

### Stage 3: Release

Memory is freed when no longer needed. This happens automatically through **garbage collection**.

```javascript
function createUser() {
  const tempUser = { name: "Temp" }; // Memory allocated
  return tempUser.name;
}

const name = createUser();
// tempUser object is now unreachable
// Garbage collector will free its memory
```

---

## Stack vs Heap Memory

JavaScript uses two types of memory storage:

### Stack Memory

**What it stores:**

- Primitive values (numbers, strings, booleans, null, undefined, symbols, bigint)
- References to objects (not the objects themselves)
- Function call information

**Characteristics:**

- Fast access
- Fixed size
- Automatically managed (LIFO - Last In, First Out)
- Small (usually 1-10 MB)

```javascript
function example() {
  const a = 10; // Stored on stack
  const b = "hello"; // Stored on stack
  const c = true; // Stored on stack
}
// When function ends, stack is automatically cleaned
```

### Heap Memory

**What it stores:**

- Objects
- Arrays
- Functions
- Anything with dynamic size

**Characteristics:**

- Slower access than stack
- Dynamic size
- Requires garbage collection
- Much larger than stack

```javascript
const user = { name: "John" }; // Object stored on heap
const arr = [1, 2, 3]; // Array stored on heap

// 'user' and 'arr' variables are on the stack
// but they POINT TO data on the heap
```

### Visual Representation

```
STACK                          HEAP
┌─────────────────┐           ┌─────────────────────────┐
│ arr → ──────────│──────────→│ [1, 2, 3]               │
├─────────────────┤           ├─────────────────────────┤
│ user → ─────────│──────────→│ { name: 'John' }        │
├─────────────────┤           ├─────────────────────────┤
│ c = true        │           │                         │
├─────────────────┤           │   (more objects...)     │
│ b = 'hello'     │           │                         │
├─────────────────┤           └─────────────────────────┘
│ a = 10          │
└─────────────────┘
```

---

## Garbage Collection

### What is Garbage Collection?

Garbage collection (GC) is the automatic process of finding and freeing memory that's no longer being used.

**The Golden Rule:** If a value cannot be reached from anywhere in your code, it's garbage and will be collected.

### How Does JavaScript Know What's Garbage?

JavaScript uses **reachability** to determine if something is still needed.

**Reachable values are kept:**

- Global variables
- Currently executing function's local variables and parameters
- Variables in the current closure chain
- Anything referenced by the above

**Unreachable values are garbage:**

- Objects with no references pointing to them
- Circular references with no external reference

### The Mark-and-Sweep Algorithm

Modern JavaScript engines (V8, SpiderMonkey) use Mark-and-Sweep:

**Step 1: Mark Phase**
Starting from "roots" (global object, current call stack), mark every object that can be reached.

**Step 2: Sweep Phase**
Go through all objects in memory. Delete those that aren't marked.

```javascript
// Example of how reachability works

let user = { name: "John" }; // Object is reachable via 'user'

user = null; // Object is now unreachable
// It will be garbage collected
```

### Visual Example

```javascript
// Initially
let a = { value: 1 };
let b = { value: 2 };
let c = a; // c also points to a's object

// Memory state:
// a ──→ { value: 1 } ←── c
// b ──→ { value: 2 }

a = null; // Object { value: 1 } still reachable via c

// Memory state:
// a = null
// b ──→ { value: 2 }
// c ──→ { value: 1 }    ← Still reachable!

c = null; // NOW { value: 1 } is unreachable → GARBAGE

// Memory state after GC:
// a = null
// b ──→ { value: 2 }
// c = null
// { value: 1 } is GONE
```

### Circular References

Old browsers had problems with circular references. Modern engines handle them correctly.

```javascript
function createCircular() {
  const objA = {};
  const objB = {};

  objA.ref = objB; // A points to B
  objB.ref = objA; // B points to A (circular!)

  return "done";
}

createCircular();
// After function returns:
// - objA and objB are unreachable from outside
// - Even though they reference each other
// - Modern GC will collect BOTH
```

### When Does Garbage Collection Run?

You cannot control when GC runs. The engine decides based on:

- Memory pressure (running low on memory)
- Idle time (when browser isn't busy)
- Heuristics (patterns the engine recognizes)

**Important:** GC can cause brief pauses. Modern engines minimize this, but it's why memory efficiency matters.

---

## Common Memory Leaks

A memory leak occurs when memory that's no longer needed isn't released. Here are the most common causes:

### Leak #1: Accidental Global Variables

```javascript
// BAD - Creates global variable (no let/const/var)
function createUser() {
  user = { name: "John" }; // 'user' is now GLOBAL
}
createUser();
// user stays in memory forever (until page closes)

// ALSO BAD - 'this' in non-strict mode
function badFunction() {
  this.leaked = "I am global now"; // 'this' is window
}
badFunction();

// GOOD - Always use let/const
function createUser() {
  const user = { name: "John" }; // Local, will be GC'd
  return user;
}

// GOOD - Use strict mode
("use strict");
function safeFunction() {
  this.value = 1; // Error! Can't set property on undefined
}
```

### Leak #2: Forgotten Timers

```javascript
// BAD - Timer keeps running forever
function startPolling() {
  const hugeData = new Array(1000000).fill("x");

  setInterval(() => {
    console.log(hugeData.length); // hugeData can never be GC'd
  }, 1000);
}
startPolling();
// Even if you don't need hugeData, it stays in memory
// because the interval callback references it

// GOOD - Clear timers when done
function startPolling() {
  const hugeData = new Array(1000000).fill("x");

  const intervalId = setInterval(() => {
    console.log(hugeData.length);
  }, 1000);

  // Return cleanup function
  return () => clearInterval(intervalId);
}

const stopPolling = startPolling();
// Later, when done:
stopPolling(); // Now hugeData can be GC'd
```

### Leak #3: Forgotten Event Listeners

```javascript
// BAD - Listeners accumulate
function setupHandler() {
  const hugeData = new Array(1000000).fill("x");

  document.getElementById("btn").addEventListener("click", () => {
    console.log(hugeData.length);
  });
}

// If called multiple times, adds multiple listeners!
// Each listener holds reference to its own hugeData
setupHandler();
setupHandler();
setupHandler(); // 3 listeners, 3 hugeData arrays!

// GOOD - Remove listeners when done
function setupHandler() {
  const hugeData = new Array(1000000).fill("x");

  const handler = () => {
    console.log(hugeData.length);
  };

  const btn = document.getElementById("btn");
  btn.addEventListener("click", handler);

  // Return cleanup function
  return () => btn.removeEventListener("click", handler);
}

const cleanup = setupHandler();
// When done:
cleanup();

// ALSO GOOD - Use { once: true } for one-time handlers
btn.addEventListener("click", handler, { once: true });
```

### Leak #4: Closures Holding References

```javascript
// BAD - Closure holds large data unnecessarily
function createHandler() {
  const hugeData = new Array(1000000).fill("x");
  const needed = hugeData.length; // Only need the length

  return function () {
    // This closure captures hugeData even though
    // we only use 'needed'
    console.log(hugeData.length);
  };
}

// GOOD - Only capture what you need
function createHandler() {
  const hugeData = new Array(1000000).fill("x");
  const length = hugeData.length; // Extract what we need

  // hugeData can now be GC'd after this function returns

  return function () {
    console.log(length); // Only captures 'length'
  };
}
```

### Leak #5: Detached DOM Elements

```javascript
// BAD - Keeping references to removed DOM elements
const elements = [];

function addElement() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  elements.push(div); // Store reference
}

function removeElements() {
  document.body.innerHTML = ""; // Remove from DOM
  // BUT 'elements' array still holds references!
  // The DOM nodes cannot be GC'd
}

// GOOD - Clear references when removing
const elements = [];

function addElement() {
  const div = document.createElement("div");
  document.body.appendChild(div);
  elements.push(div);
}

function removeElements() {
  elements.forEach((el) => el.remove());
  elements.length = 0; // Clear the array
  // Now DOM nodes can be GC'd
}

// ALSO GOOD - Use WeakRef or don't store references
```

### Leak #6: Caches Without Limits

```javascript
// BAD - Unbounded cache
const cache = {};

function fetchWithCache(url) {
  if (cache[url]) {
    return cache[url];
  }

  const data = fetch(url).then((r) => r.json());
  cache[url] = data; // Cache grows forever!
  return data;
}

// GOOD - Limited cache with LRU eviction
class LRUCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new Map(); // Map preserves insertion order
  }

  get(key) {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Delete oldest (first item)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}

const cache = new LRUCache(50);
```

### Leak #7: Console.log in Production

```javascript
// BAD - console.log holds references to logged objects
function processData() {
  const hugeData = generateHugeData();
  console.log("Processing:", hugeData); // DevTools holds reference!
  return hugeData.length;
}

// Objects logged to console are kept in memory
// by browser DevTools for inspection

// GOOD - Remove console.logs in production
// Or use a logger that can be disabled
const logger = {
  log:
    process.env.NODE_ENV === "production"
      ? () => {}
      : console.log.bind(console),
};

function processData() {
  const hugeData = generateHugeData();
  logger.log("Processing:", hugeData.length); // Only log what's needed
  return hugeData.length;
}
```

---

## WeakMap and WeakSet

Regular Map and Set hold **strong references** - they prevent garbage collection. WeakMap and WeakSet hold **weak references** - they allow garbage collection.

### The Problem with Regular Map

```javascript
const cache = new Map();

let user = { name: "John" };
cache.set(user, "some cached data");

user = null; // We're done with user

// BUT the Map still holds a reference to the user object
// So it cannot be garbage collected!
console.log(cache.size); // 1 - user object still in memory
```

### WeakMap to the Rescue

```javascript
const cache = new WeakMap();

let user = { name: "John" };
cache.set(user, "some cached data");

user = null; // We're done with user

// WeakMap's reference is WEAK
// The user object CAN be garbage collected
// (We can't check cache.size - WeakMap has no size property)
```

### WeakMap Characteristics

```javascript
const wm = new WeakMap();

// Keys MUST be objects (not primitives)
wm.set({ a: 1 }, "value"); // OK
wm.set([1, 2, 3], "value"); // OK
wm.set(function () {}, "value"); // OK
// wm.set('string', 'value');  // ERROR - primitives not allowed
// wm.set(123, 'value');       // ERROR

// Limited API (no iteration possible)
wm.set(obj, value); // Set a value
wm.get(obj); // Get a value
wm.has(obj); // Check if key exists
wm.delete(obj); // Delete entry

// These DON'T exist on WeakMap:
// wm.size
// wm.keys()
// wm.values()
// wm.entries()
// wm.forEach()
// wm.clear()
```

### WeakMap Use Cases

#### Use Case 1: Private Data

```javascript
// Store private data for objects
const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;
    // Store password privately
    privateData.set(this, { password });
  }

  checkPassword(input) {
    return privateData.get(this).password === input;
  }
}

const user = new User("John", "secret123");
console.log(user.name); // 'John' - public
console.log(user.password); // undefined - not accessible
console.log(user.checkPassword("secret123")); // true

// When user is GC'd, private data is automatically GC'd too
```

#### Use Case 2: Caching Computed Values

```javascript
const computedCache = new WeakMap();

function expensiveOperation(obj) {
  // Check cache first
  if (computedCache.has(obj)) {
    console.log("Cache hit!");
    return computedCache.get(obj);
  }

  // Expensive computation
  console.log("Computing...");
  const result = Object.keys(obj).length * 1000;

  // Cache the result
  computedCache.set(obj, result);
  return result;
}

let myObj = { a: 1, b: 2, c: 3 };
expensiveOperation(myObj); // Computing...
expensiveOperation(myObj); // Cache hit!

myObj = null;
// Object AND its cached result can now be GC'd
```

#### Use Case 3: DOM Element Metadata

```javascript
const elementData = new WeakMap();

function setElementData(element, data) {
  elementData.set(element, data);
}

function getElementData(element) {
  return elementData.get(element);
}

// Usage
const div = document.getElementById("myDiv");
setElementData(div, { clicks: 0, created: Date.now() });

// If div is removed from DOM and no other references exist,
// both the element AND its metadata will be GC'd
```

### WeakSet

WeakSet is like Set but with weak references.

```javascript
const ws = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

ws.add(obj1);
ws.add(obj2);

console.log(ws.has(obj1)); // true

obj1 = null;
// obj1 can now be GC'd (WeakSet won't prevent it)

// WeakSet API
ws.add(obj); // Add object
ws.has(obj); // Check if exists
ws.delete(obj); // Remove object

// NO iteration, NO size
```

#### WeakSet Use Case: Tracking Visited Objects

```javascript
// Track which objects have been processed
function processObjects(objects) {
  const processed = new WeakSet();

  function process(obj) {
    if (processed.has(obj)) {
      console.log("Already processed, skipping");
      return;
    }

    // Do processing
    console.log("Processing:", obj.id);
    processed.add(obj);

    // Process nested objects
    if (obj.children) {
      obj.children.forEach((child) => process(child));
    }
  }

  objects.forEach((obj) => process(obj));
}

// Works even with circular references
const a = { id: "a" };
const b = { id: "b", children: [a] };
a.children = [b]; // Circular!

processObjects([a, b]);
// Processing: a
// Processing: b
// Already processed, skipping (for the circular refs)
```

---

## WeakRef and FinalizationRegistry

These are advanced features for special cases. Most applications don't need them.

### WeakRef - Weak Reference to Object

```javascript
// Create a weak reference
let obj = { name: "John", data: new Array(1000000) };
const weakRef = new WeakRef(obj);

// Get the object (might be undefined if GC'd)
const maybeObj = weakRef.deref();
if (maybeObj) {
  console.log(maybeObj.name); // 'John'
} else {
  console.log("Object was garbage collected");
}

// Clear strong reference
obj = null;

// Now the object CAN be GC'd
// Future calls to weakRef.deref() may return undefined
```

### FinalizationRegistry - Cleanup Callbacks

```javascript
// Create a registry with cleanup callback
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with ID ${heldValue} was garbage collected`);
  // Perform cleanup (close files, release resources, etc.)
});

function createTrackedObject(id) {
  const obj = { id, data: new Array(1000) };

  // Register object for cleanup notification
  registry.register(obj, id); // id is the "held value"

  return obj;
}

let myObj = createTrackedObject(123);
myObj = null;

// Eventually (when GC runs):
// "Object with ID 123 was garbage collected"
```

### Practical Example: Cache with Automatic Cleanup

```javascript
class WeakCache {
  constructor() {
    this.cache = new Map(); // key (string) → WeakRef
    this.registry = new FinalizationRegistry((key) => {
      // Remove from cache when object is GC'd
      console.log(`Cache entry "${key}" was garbage collected`);
      this.cache.delete(key);
    });
  }

  set(key, value) {
    // Remove old entry if exists
    const oldRef = this.cache.get(key);
    if (oldRef) {
      this.registry.unregister(oldRef);
    }

    // Store weak reference
    const ref = new WeakRef(value);
    this.cache.set(key, ref);
    this.registry.register(value, key, ref);
  }

  get(key) {
    const ref = this.cache.get(key);
    if (!ref) return undefined;

    const value = ref.deref();
    if (value === undefined) {
      // Object was GC'd, clean up
      this.cache.delete(key);
    }
    return value;
  }

  has(key) {
    return this.get(key) !== undefined;
  }
}

// Usage
const cache = new WeakCache();

let user = { name: "John", data: generateHugeData() };
cache.set("user-123", user);

console.log(cache.get("user-123")?.name); // 'John'

user = null; // Allow GC

// Later, after GC runs:
console.log(cache.get("user-123")); // undefined
```

### Warning: Don't Overuse WeakRef

WeakRef and FinalizationRegistry are **unpredictable**:

- You don't know WHEN GC will run
- Cleanup callbacks may be delayed or never called
- Different browsers/engines behave differently

**Use only when:**

- You need caches that don't prevent GC
- You're managing native resources
- You understand the unpredictability

**Don't use for:**

- Critical cleanup (use explicit cleanup instead)
- Time-sensitive operations
- Anything where timing matters

---

## Detecting Memory Leaks

### Using Chrome DevTools

#### Memory Tab - Heap Snapshots

1. Open DevTools → Memory tab
2. Select "Heap snapshot"
3. Click "Take snapshot"
4. Perform actions in your app
5. Take another snapshot
6. Compare snapshots to find growing objects

#### Performance Tab - Memory Timeline

1. Open DevTools → Performance tab
2. Check "Memory" checkbox
3. Click Record
4. Perform actions in your app
5. Stop recording
6. Look for continuously growing memory (sawtooth is normal, stairs are not)

### Identifying Leaks in Code

```javascript
// Add this to help identify leaks during development
class MemoryTracker {
  constructor() {
    this.instances = new Map();
  }

  track(name, instance) {
    if (!this.instances.has(name)) {
      this.instances.set(name, new Set());
    }
    this.instances.get(name).add(new WeakRef(instance));
  }

  report() {
    console.log("=== Memory Report ===");
    for (const [name, refs] of this.instances) {
      let alive = 0;
      for (const ref of refs) {
        if (ref.deref()) alive++;
      }
      console.log(`${name}: ${alive} instances alive`);
    }
  }
}

const tracker = new MemoryTracker();

// Track instances
class MyComponent {
  constructor() {
    tracker.track("MyComponent", this);
  }
}

// Check periodically
setInterval(() => tracker.report(), 10000);
```

### Common Patterns to Watch For

```javascript
// RED FLAG 1: Growing arrays/objects
const data = [];
function handler() {
  data.push(new Array(10000)); // Grows forever!
}

// RED FLAG 2: Event listeners in loops or repeated calls
function setup() {
  window.addEventListener("resize", onResize); // Called multiple times?
}

// RED FLAG 3: Closures capturing large scopes
function createHandlers() {
  const hugeData = loadHugeData();

  return {
    onClick: () => console.log(hugeData), // Captures hugeData
    onHover: () => console.log(hugeData), // Captures hugeData
    onScroll: () => console.log(hugeData), // Captures hugeData
  };
}

// RED FLAG 4: Timers without cleanup
useEffect(() => {
  setInterval(doSomething, 1000);
  // Missing cleanup!
}, []);
```

---

## Best Practices

### 1. Always Clean Up

```javascript
// React pattern
useEffect(() => {
  const intervalId = setInterval(tick, 1000);
  window.addEventListener("resize", handleResize);

  return () => {
    clearInterval(intervalId);
    window.removeEventListener("resize", handleResize);
  };
}, []);

// Vanilla JS pattern
class Component {
  constructor() {
    this.intervalId = setInterval(this.tick.bind(this), 1000);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener("resize", this.handleResize);
  }

  destroy() {
    clearInterval(this.intervalId);
    window.removeEventListener("resize", this.handleResize);
  }
}
```

### 2. Nullify References When Done

```javascript
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.heavyData = null;
  }

  process(data) {
    this.heavyData = transformData(data);
    const result = analyze(this.heavyData);

    // Clear when done
    this.heavyData = null;

    return result;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### 3. Use WeakMap for Object Metadata

```javascript
// GOOD - Metadata is automatically cleaned up
const metadata = new WeakMap();

function processElement(element) {
  metadata.set(element, {
    processedAt: Date.now(),
    clickCount: 0,
  });
}

// BAD - Manual cleanup required
const metadata = new Map();

function processElement(element) {
  metadata.set(element, { ... });
}

function removeElement(element) {
  element.remove();
  metadata.delete(element);  // Easy to forget!
}
```

### 4. Limit Cache Sizes

```javascript
// GOOD - Bounded cache
const MAX_CACHE = 100;
const cache = new Map();

function cacheResult(key, value) {
  if (cache.size >= MAX_CACHE) {
    // Delete oldest entry
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, value);
}

// ALSO GOOD - Time-based expiry
function cacheWithExpiry(key, value, ttl = 60000) {
  cache.set(key, {
    value,
    expires: Date.now() + ttl,
  });
}

function getFromCache(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;

  if (Date.now() > entry.expires) {
    cache.delete(key);
    return undefined;
  }

  return entry.value;
}
```

### 5. Avoid Closures Capturing Large Scopes

```javascript
// BAD
function setupHandlers() {
  const allData = loadLotsOfData(); // 100MB

  return {
    getName: () => allData.name, // Captures all 100MB
    getAge: () => allData.age, // Captures all 100MB
  };
}

// GOOD - Extract only what's needed
function setupHandlers() {
  const allData = loadLotsOfData();
  const { name, age } = allData; // Extract needed values
  // allData can now be GC'd

  return {
    getName: () => name, // Only captures string
    getAge: () => age, // Only captures number
  };
}
```

### 6. Use Object Pools for Frequent Allocations

```javascript
// For frequently created/destroyed objects (games, animations)
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];

    // Pre-allocate
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(createFn());
    }
  }

  acquire() {
    return this.pool.length > 0 ? this.pool.pop() : this.createFn();
  }

  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}

// Usage
const bulletPool = new ObjectPool(
  () => ({ x: 0, y: 0, active: false }),
  (bullet) => {
    bullet.x = 0;
    bullet.y = 0;
    bullet.active = false;
  },
  100
);

// Get a bullet
const bullet = bulletPool.acquire();
bullet.x = 100;
bullet.y = 200;
bullet.active = true;

// Return it when done
bulletPool.release(bullet);
```

---

## Real-World Examples

### Example 1: React Component with Proper Cleanup

```javascript
function UserDashboard({ userId }) {
  const [data, setData] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // AbortController for fetch cleanup
    const abortController = new AbortController();

    // Fetch data
    async function fetchData() {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: abortController.signal,
        });
        const json = await response.json();
        setData(json);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      }
    }

    fetchData();

    // Event listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Interval for periodic refresh
    const intervalId = setInterval(fetchData, 30000);

    // CLEANUP - This is critical!
    return () => {
      abortController.abort(); // Cancel pending fetch
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearInterval(intervalId);
    };
  }, [userId]);

  return (
    <div>
      {isOnline ? "Online" : "Offline"}
      {data && <UserInfo data={data} />}
    </div>
  );
}
```

### Example 2: Event Emitter with Automatic Cleanup

```javascript
class SafeEventEmitter {
  constructor() {
    this.listeners = new Map();
    this.instanceListeners = new WeakMap();
  }

  on(event, callback, instance = null) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }

    this.listeners.get(event).add(callback);

    // Track which instance owns this listener
    if (instance) {
      if (!this.instanceListeners.has(instance)) {
        this.instanceListeners.set(instance, []);
      }
      this.instanceListeners.get(instance).push({ event, callback });
    }

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  off(event, callback) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  // Remove all listeners for an instance
  removeAllForInstance(instance) {
    const instanceCallbacks = this.instanceListeners.get(instance);
    if (instanceCallbacks) {
      instanceCallbacks.forEach(({ event, callback }) => {
        this.off(event, callback);
      });
    }
  }

  emit(event, data) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach((callback) => callback(data));
    }
  }
}

// Usage
const emitter = new SafeEventEmitter();

class MyComponent {
  constructor() {
    // Pass 'this' so listeners can be cleaned up
    this.unsubscribe = emitter.on("update", this.handleUpdate.bind(this), this);
  }

  handleUpdate(data) {
    console.log("Update received:", data);
  }

  destroy() {
    // Clean up all listeners for this instance
    emitter.removeAllForInstance(this);
    // Or use the returned unsubscribe function
    // this.unsubscribe();
  }
}
```

### Example 3: Image Loader with Memory Management

```javascript
class ImageLoader {
  constructor(maxCacheSize = 50) {
    this.cache = new Map();
    this.maxCacheSize = maxCacheSize;
    this.loadingPromises = new Map();
  }

  async load(url) {
    // Return cached if available
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }

    // Return existing promise if already loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Load new image
    const loadPromise = new Promise((resolve, reject) => {
      const img = new Image();

      img.onload = () => {
        this.loadingPromises.delete(url);
        this.addToCache(url, img);
        resolve(img);
      };

      img.onerror = () => {
        this.loadingPromises.delete(url);
        reject(new Error(`Failed to load: ${url}`));
      };

      img.src = url;
    });

    this.loadingPromises.set(url, loadPromise);
    return loadPromise;
  }

  addToCache(url, img) {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(url, img);
  }

  clearCache() {
    this.cache.clear();
  }

  removeFromCache(url) {
    this.cache.delete(url);
  }
}

// Usage
const imageLoader = new ImageLoader(100);

async function displayImage(url) {
  try {
    const img = await imageLoader.load(url);
    document.getElementById("container").appendChild(img.cloneNode());
  } catch (error) {
    console.error(error);
  }
}
```

### Example 4: WebSocket Manager with Cleanup

```javascript
class WebSocketManager {
  constructor(url) {
    this.url = url;
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectTimeout = null;
    this.isDestroyed = false;
  }

  connect() {
    if (this.isDestroyed) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const handlers = this.listeners.get(data.type);
      if (handlers) {
        handlers.forEach((handler) => handler(data.payload));
      }
    };

    this.ws.onclose = () => {
      if (!this.isDestroyed) {
        this.scheduleReconnect();
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    const delay = Math.pow(2, this.reconnectAttempts) * 1000;
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnecting... (attempt ${this.reconnectAttempts})`);
      this.connect();
    }, delay);
  }

  on(type, handler) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(handler);

    // Return unsubscribe function
    return () => {
      const handlers = this.listeners.get(type);
      if (handlers) {
        handlers.delete(handler);
      }
    };
  }

  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    }
  }

  // CRITICAL: Call this when done
  destroy() {
    this.isDestroyed = true;

    // Clear reconnect timeout
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    // Close WebSocket
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    // Clear all listeners
    this.listeners.clear();
  }
}

// Usage
const wsManager = new WebSocketManager("wss://api.example.com");
wsManager.connect();

const unsubscribe = wsManager.on("message", (data) => {
  console.log("Received:", data);
});

// When done (e.g., component unmount)
unsubscribe(); // Remove specific listener
wsManager.destroy(); // Clean up everything
```

### Example 5: Infinite Scroll with Proper Cleanup

```javascript
class InfiniteScroll {
  constructor(container, loadMore) {
    this.container = container;
    this.loadMore = loadMore;
    this.isLoading = false;
    this.hasMore = true;
    this.observer = null;
    this.sentinel = null;

    this.init();
  }

  init() {
    // Create sentinel element
    this.sentinel = document.createElement("div");
    this.sentinel.className = "infinite-scroll-sentinel";
    this.container.appendChild(this.sentinel);

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !this.isLoading && this.hasMore) {
          this.load();
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    this.observer.observe(this.sentinel);
  }

  async load() {
    this.isLoading = true;

    try {
      const { items, hasMore } = await this.loadMore();
      this.hasMore = hasMore;

      // Append items
      items.forEach((item) => {
        const element = this.createItemElement(item);
        this.container.insertBefore(element, this.sentinel);
      });
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      this.isLoading = false;
    }
  }

  createItemElement(item) {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item.title;
    return div;
  }

  // CRITICAL: Clean up resources
  destroy() {
    // Disconnect observer
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    // Remove sentinel
    if (this.sentinel && this.sentinel.parentNode) {
      this.sentinel.parentNode.removeChild(this.sentinel);
      this.sentinel = null;
    }

    // Clear references
    this.container = null;
    this.loadMore = null;
  }
}

// Usage
let page = 0;
const infiniteScroll = new InfiniteScroll(
  document.getElementById("list"),
  async () => {
    page++;
    const response = await fetch(`/api/items?page=${page}`);
    const data = await response.json();
    return {
      items: data.items,
      hasMore: data.hasMore,
    };
  }
);

// When navigating away or component unmounts
infiniteScroll.destroy();
```

---

## Summary: Memory Management Checklist

### Understanding

- [ ] Know the difference between stack and heap memory
- [ ] Understand how garbage collection works (mark-and-sweep)
- [ ] Know that reachability determines what gets collected

### Prevention

- [ ] Always use `let`/`const`, never create accidental globals
- [ ] Clear timers with `clearTimeout`/`clearInterval`
- [ ] Remove event listeners when done
- [ ] Abort fetch requests on component unmount
- [ ] Use WeakMap/WeakSet for object metadata
- [ ] Limit cache sizes or use time-based expiry
- [ ] Don't capture more than needed in closures

### Detection

- [ ] Use Chrome DevTools Memory tab for heap snapshots
- [ ] Use Performance tab to monitor memory over time
- [ ] Look for growing arrays, uncleaned listeners, retained DOM nodes

### Patterns

- [ ] Always return cleanup functions from setup functions
- [ ] Use AbortController for cancellable fetches
- [ ] Implement destroy/dispose methods on classes
- [ ] Use object pools for frequent allocations (games)

### Key Takeaways

1. **JavaScript manages memory automatically**, but you can still cause leaks
2. **Memory leaks = references that should be removed but aren't**
3. **The most common leaks**: forgotten timers, event listeners, closures, detached DOM
4. **WeakMap/WeakSet** let GC collect keys even if the Map/Set exists
5. **Always clean up** in component unmount, class destroy methods
6. **Profile your app** with DevTools to find real issues
