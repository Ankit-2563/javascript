# Advanced JavaScript Concepts Guide

A comprehensive guide to advanced JavaScript topics, explained in simple terms with practical examples.

---

## Table of Contents

1. [The `this` Keyword](#1-the-this-keyword)
2. [Objects Deep Dive](#2-objects-deep-dive)
3. [Prototypes and Inheritance](#3-prototypes-and-inheritance)
4. [Classes](#4-classes)
5. [Destructuring](#5-destructuring)
6. [Spread and Rest Operators](#6-spread-and-rest-operators)
7. [Template Literals](#7-template-literals)
8. [Modules](#8-modules)
9. [Scope, Closures, and Hoisting](#9-scope-closures-and-hoisting)
10. [Asynchronous JavaScript](#10-asynchronous-javascript)
11. [Promises](#11-promises)
12. [Async/Await](#12-asyncawait)
13. [Regular Expressions](#13-regular-expressions)
14. [Map, Set, WeakMap, WeakSet](#14-map-set-weakmap-weakset)
15. [Symbols](#15-symbols)
16. [Iterators and Generators](#16-iterators-and-generators)
17. [Dates and Time](#17-dates-and-time)
18. [Events](#18-events)
19. [Web Storage](#19-web-storage)
20. [Strict Mode](#20-strict-mode)
21. [Debugging](#21-debugging)
22. [Best Practices](#22-best-practices)

---

## 1. The `this` Keyword

### What is `this`?

The `this` keyword refers to the object that is currently executing the code. Think of it as a special variable that changes depending on **where** and **how** a function is called. It's like a context-aware pronoun that says "the thing I'm talking about right now."

### Why is `this` Important?

Understanding `this` is crucial because:

- It lets objects reference themselves
- It enables method reusability
- It's fundamental to object-oriented JavaScript
- It's one of the most common sources of bugs for beginners

### The Five Rules of `this`

#### Rule 1: Global Context (Default Binding)

When `this` is used outside any function or in a regular function call, it refers to the global object.

```javascript
console.log(this);
// In browser: window object
// In Node.js: global object

function showThis() {
  console.log(this);
}

showThis();
// In non-strict mode: window/global
// In strict mode: undefined
```

**Think of it as:** When there's no specific context, `this` defaults to the "global environment" - like saying "in general" when you're not talking about anything specific.

#### Rule 2: Implicit Binding (Object Method)

When a function is called as a method of an object, `this` refers to that object.

```javascript
const person = {
  name: "Alice",
  age: 25,

  greet() {
    // 'this' refers to the person object
    console.log(`Hello, I'm ${this.name} and I'm ${this.age} years old`);
  },

  updateAge(newAge) {
    this.age = newAge; // Modifying the object's own property
  },
};

person.greet(); // "Hello, I'm Alice and I'm 25 years old"
person.updateAge(26);
person.greet(); // "Hello, I'm Alice and I'm 26 years old"
```

**Think of it as:** When an object calls its own method, `this` means "this object" - like when you say "I" when talking about yourself.

#### Rule 3: Explicit Binding (call, apply, bind)

You can explicitly tell a function what `this` should be using `call()`, `apply()`, or `bind()`.

```javascript
function introduce(greeting, punctuation) {
  console.log(`${greeting}, I'm ${this.name}${punctuation}`);
}

const person1 = { name: "Alice" };
const person2 = { name: "Bob" };

// call() - invoke immediately with arguments separated
introduce.call(person1, "Hello", "!");
// "Hello, I'm Alice!"

// apply() - invoke immediately with arguments in array
introduce.apply(person2, ["Hi", "."]);
// "Hi, I'm Bob."

// bind() - create new function with permanent 'this'
const aliceIntroduce = introduce.bind(person1);
aliceIntroduce("Hey", "!!!");
// "Hey, I'm Alice!!!"

// The bound function always uses person1 as 'this'
aliceIntroduce.call(person2, "Greetings", "?");
// Still "Greetings, I'm Alice?" - bind wins!
```

**Real-world analogy:**

- `call` is like directly telling someone "you do this task, here are the details one by one"
- `apply` is like "you do this task, here's a list of everything you need"
- `bind` is like "you will always do this task from now on, no matter what"

#### Rule 4: Constructor Functions and `new`

When you use the `new` keyword with a function, JavaScript creates a new object and sets `this` to that new object.

```javascript
function User(name, email) {
  // 'this' is a brand new empty object created by 'new'
  this.name = name;
  this.email = email;
  this.isActive = true;

  this.activate = function () {
    this.isActive = true;
  };

  this.deactivate = function () {
    this.isActive = false;
  };
}

const user1 = new User("Alice", "alice@example.com");
const user2 = new User("Bob", "bob@example.com");

console.log(user1.name); // "Alice"
console.log(user2.name); // "Bob"
// Each user has their own separate data
```

**What happens when you use `new`:**

1. JavaScript creates a new empty object: `{}`
2. Sets `this` to point to that new object
3. Executes your function code, adding properties to `this`
4. Automatically returns that object (unless you explicitly return something else)

#### Rule 5: Arrow Functions (Lexical `this`)

Arrow functions are special - they **DON'T** have their own `this`. Instead, they inherit `this` from their surrounding scope (where they were defined).

```javascript
const team = {
  name: "Development Team",
  members: ["Alice", "Bob", "Charlie"],

  // Regular function - has its own 'this'
  showTeamRegular() {
    console.log(`Team: ${this.name}`); // Works! 'this' = team

    this.members.forEach(function (member) {
      // PROBLEM: 'this' is undefined here!
      // The forEach callback creates a new context
      console.log(`${member} is in ${this.name}`); // Error!
    });
  },

  // Arrow function solution
  showTeamArrow() {
    console.log(`Team: ${this.name}`); // Works! 'this' = team

    this.members.forEach((member) => {
      // WORKS! Arrow function inherits 'this' from showTeamArrow
      console.log(`${member} is in ${this.name}`);
    });
  },
};

team.showTeamArrow();
// "Team: Development Team"
// "Alice is in Development Team"
// "Bob is in Development Team"
// "Charlie is in Development Team"
```

**Think of arrow functions as:** A transparent wrapper that doesn't change the context. Like using parentheses in a sentence - they don't change who "I" refers to.

### Common `this` Pitfalls and Solutions

#### Pitfall 1: Losing Context When Passing Methods

```javascript
const user = {
  name: "Alice",
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },
};

user.greet(); // Works: "Hello, I'm Alice"

// PROBLEM: Passing method to another function
const greetFunction = user.greet;
greetFunction(); // Error! 'this' is undefined

// SOLUTION 1: Use bind
const boundGreet = user.greet.bind(user);
boundGreet(); // Works: "Hello, I'm Alice"

// SOLUTION 2: Use arrow function wrapper
setTimeout(() => user.greet(), 1000); // Works!

// SOLUTION 3: Use bind inline
setTimeout(user.greet.bind(user), 1000); // Works!
```

**Why this happens:** When you extract a method from an object, it loses its connection to that object. It's like taking someone's business card - the card alone doesn't know who it belongs to.

#### Pitfall 2: Event Handlers

```javascript
class Button {
  constructor(label) {
    this.label = label;
    this.clickCount = 0;
  }

  // PROBLEM: Regular method loses 'this' in event handler
  handleClickWrong() {
    this.clickCount++; // 'this' will be the button element!
    console.log(`${this.label}: ${this.clickCount} clicks`);
  }

  // SOLUTION 1: Arrow function (inherits correct 'this')
  handleClickArrow = () => {
    this.clickCount++;
    console.log(`${this.label}: ${this.clickCount} clicks`);
  }

  // SOLUTION 2: Bind in constructor
  constructor(label) {
    this.label = label;
    this.clickCount = 0;
    this.handleClickWrong = this.handleClickWrong.bind(this);
  }
}

const myButton = new Button("Submit");

// With regular method - WRONG
document.querySelector('#btn').addEventListener('click', myButton.handleClickWrong);
// 'this' will be the button element, not your Button instance

// With arrow function - CORRECT
document.querySelector('#btn').addEventListener('click', myButton.handleClickArrow);
```

#### Pitfall 3: Nested Functions

```javascript
const calculator = {
  value: 10,

  // PROBLEM: Nested function loses context
  multiplyWrong(numbers) {
    numbers.forEach(function (num) {
      // 'this.value' is undefined here!
      console.log(num * this.value);
    });
  },

  // SOLUTION 1: Arrow function
  multiplyArrow(numbers) {
    numbers.forEach((num) => {
      // Arrow function inherits 'this' from multiplyArrow
      console.log(num * this.value);
    });
  },

  // SOLUTION 2: Save 'this' to variable
  multiplySaved(numbers) {
    const self = this; // Common pattern in older code
    numbers.forEach(function (num) {
      console.log(num * self.value);
    });
  },

  // SOLUTION 3: Use forEach's second parameter
  multiplyForEach(numbers) {
    numbers.forEach(function (num) {
      console.log(num * this.value);
    }, this); // Pass 'this' as context to forEach
  },
};

calculator.multiplyArrow([1, 2, 3]); // 10, 20, 30
```

### Mental Model for Understanding `this`

Use this decision tree:

1. **Is the function an arrow function?**

   - YES → `this` = inherited from parent scope
   - NO → Go to step 2

2. **Is the function called with `new`?**

   - YES → `this` = new empty object
   - NO → Go to step 3

3. **Is the function called with `call`, `apply`, or `bind`?**

   - YES → `this` = the object you specified
   - NO → Go to step 4

4. **Is the function called as a method (object.method())?**

   - YES → `this` = the object before the dot
   - NO → Go to step 5

5. **Default case:**
   - `this` = global object (or undefined in strict mode)

### Practice Exercise

Try to predict what `this` will be in each case:

```javascript
const obj = {
  value: 42,

  regularMethod() {
    console.log(this.value);
  },

  arrowMethod: () => {
    console.log(this.value);
  },

  nestedExample() {
    const inner = () => {
      console.log(this.value);
    };
    inner();
  },
};

// What will each output?
obj.regularMethod(); // ?
obj.arrowMethod(); // ?
obj.nestedExample(); // ?

const detached = obj.regularMethod;
detached(); // ?

setTimeout(obj.regularMethod, 100); // ?
setTimeout(() => obj.regularMethod(), 100); // ?
```

**Answers:**

1. `42` - implicit binding (object method)
2. `undefined` - arrow function inherits global `this`
3. `42` - inner arrow function inherits from nestedExample's `this`
4. `undefined` - lost context, default binding
5. `undefined` - lost context when passed as callback
6. `42` - arrow wrapper maintains context

---

## 2. Objects Deep Dive

### What Are Objects?

Objects are collections of related data and functionality. Think of them as containers that hold both information (properties) and actions (methods). In real life, everything is an object - a car has properties (color, model) and methods (drive, stop).

### Creating Objects - Multiple Ways

#### Method 1: Object Literal (Most Common)

```javascript
// Simple object
const person = {
  firstName: "Alice",
  lastName: "Johnson",
  age: 25,
};

// Object with methods
const calculator = {
  value: 0,

  add(n) {
    this.value += n;
    return this; // Return this for chaining
  },

  subtract(n) {
    this.value -= n;
    return this;
  },

  getResult() {
    return this.value;
  },
};

// Method chaining
calculator.add(10).subtract(3).add(5);
console.log(calculator.getResult()); // 12
```

#### Method 2: Object Constructor

```javascript
const person = new Object();
person.name = "Alice";
person.age = 25;

// Not commonly used, but you should know it exists
```

#### Method 3: Object.create() - Prototype-based Creation

```javascript
// Create object with specific prototype
const personPrototype = {
  greet() {
    console.log(`Hello, I'm ${this.name}`);
  },

  getAge() {
    const currentYear = new Date().getFullYear();
    return currentYear - this.birthYear;
  },
};

const person = Object.create(personPrototype);
person.name = "Alice";
person.birthYear = 1998;

person.greet(); // "Hello, I'm Alice"
console.log(person.getAge()); // Current age based on birth year
```

**When to use Object.create():** When you want to create objects that share methods but have different data. More memory-efficient than copying methods to every object.

#### Method 4: Constructor Function (Pre-ES6 Classes)

```javascript
function Person(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;
}

// Add methods to prototype (shared by all instances)
Person.prototype.getFullName = function () {
  return `${this.firstName} ${this.lastName}`;
};

Person.prototype.introduce = function () {
  return `Hi, I'm ${this.getFullName()}, ${this.age} years old`;
};

const person1 = new Person("Alice", "Johnson", 25);
const person2 = new Person("Bob", "Smith", 30);

console.log(person1.getFullName()); // "Alice Johnson"
console.log(person2.introduce()); // "Hi, I'm Bob Smith, 30 years old"

// Both share the same methods (memory efficient)
console.log(person1.getFullName === person2.getFullName); // true
```

### Property Shorthand and Computed Properties

```javascript
const name = "Alice";
const age = 25;
const city = "New York";

// OLD WAY - redundant
const person = {
  name: name,
  age: age,
  city: city,
};

// NEW WAY - shorthand (ES6+)
const person = {
  name,
  age,
  city,
};

// Computed property names
const propertyName = "email";
const person = {
  name: "Alice",
  [propertyName]: "alice@example.com", // Dynamic key
  [`${name}Id`]: 12345, // "AliceId": 12345
};

// Useful for dynamic key creation
function createUser(key, value) {
  return {
    name: "Alice",
    [key]: value, // Key name determined at runtime
  };
}

const user1 = createUser("role", "admin");
const user2 = createUser("department", "sales");
// user1 = { name: "Alice", role: "admin" }
// user2 = { name: "Alice", department: "sales" }
```

### Getters and Setters - Computed Properties

Getters and setters allow you to define properties that run code when accessed or modified.

```javascript
const person = {
  firstName: "Alice",
  lastName: "Johnson",
  birthYear: 1998,

  // GETTER - access like a property, runs like a function
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },

  // SETTER - assign like a property, runs like a function
  set fullName(value) {
    const parts = value.split(" ");
    this.firstName = parts[0];
    this.lastName = parts[1];
  },

  get age() {
    return new Date().getFullYear() - this.birthYear;
  },

  // You can have a setter without a getter (but not common)
  set age(value) {
    this.birthYear = new Date().getFullYear() - value;
  },
};

// Use like properties, not methods
console.log(person.fullName); // "Alice Johnson" (no parentheses!)
person.fullName = "Bob Smith"; // Triggers setter
console.log(person.firstName); // "Bob"

console.log(person.age); // 26 (calculated)
person.age = 30; // Sets birthYear accordingly
```

**Real-world example: Data validation**

```javascript
const user = {
  _email: "", // Convention: underscore = private

  get email() {
    return this._email;
  },

  set email(value) {
    // Validation happens automatically
    if (!value.includes("@")) {
      throw new Error("Invalid email format");
    }
    this._email = value.toLowerCase().trim();
  },

  _password: "",

  get password() {
    return "********"; // Never expose actual password
  },

  set password(value) {
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    // In reality, you'd hash this
    this._password = value;
  },
};

user.email = "  ALICE@EXAMPLE.COM  ";
console.log(user.email); // "alice@example.com" (cleaned)

user.password = "secret123";
console.log(user.password); // "********" (hidden)

user.email = "invalid"; // Error: Invalid email format
```

### Property Descriptors - Fine Control

Every property in JavaScript has hidden attributes that control its behavior.

```javascript
const user = {
  name: "Alice",
};

// Get property descriptor
const descriptor = Object.getOwnPropertyDescriptor(user, "name");
console.log(descriptor);
/* {
  value: "Alice",
  writable: true,      // Can change value
  enumerable: true,    // Shows up in for...in, Object.keys()
  configurable: true   // Can delete or reconfigure
} */

// Define property with custom descriptor
Object.defineProperty(user, "id", {
  value: 12345,
  writable: false, // Read-only
  enumerable: false, // Hidden from loops
  configurable: false, // Can't delete or reconfigure
});

user.id = 999; // Silently fails (or throws in strict mode)
console.log(user.id); // Still 12345

for (let key in user) {
  console.log(key); // Only "name" appears, not "id"
}

delete user.id; // Fails - property is not configurable
```

**Real-world example: Creating constants**

```javascript
const config = {};

Object.defineProperty(config, "API_KEY", {
  value: "secret-key-12345",
  writable: false,
  enumerable: true,
  configurable: false,
});

config.API_KEY = "hacked"; // Fails silently
console.log(config.API_KEY); // Still "secret-key-12345"
```

### Object Methods - Essential Utilities

#### Object.keys(), Object.values(), Object.entries()

```javascript
const user = {
  name: "Alice",
  age: 25,
  city: "NYC",
  isActive: true,
};

// Get array of keys
const keys = Object.keys(user);
console.log(keys); // ["name", "age", "city", "isActive"]

// Get array of values
const values = Object.values(user);
console.log(values); // ["Alice", 25, "NYC", true]

// Get array of [key, value] pairs
const entries = Object.entries(user);
console.log(entries);
/* [
  ["name", "Alice"],
  ["age", 25],
  ["city", "NYC"],
  ["isActive", true]
] */

// PRACTICAL USE: Iteration
Object.entries(user).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});
// name: Alice
// age: 25
// city: NYC
// isActive: true

// PRACTICAL USE: Filtering object properties
const filteredEntries = Object.entries(user).filter(
  ([key, value]) => typeof value === "string"
);

const stringProps = Object.fromEntries(filteredEntries);
console.log(stringProps); // { name: "Alice", city: "NYC" }
```

#### Object.assign() and Spread - Copying Objects

```javascript
const original = {
  name: "Alice",
  age: 25,
  address: {
    city: "NYC",
    country: "USA",
  },
};

// Method 1: Object.assign() (older way)
const copy1 = Object.assign({}, original);

// Method 2: Spread operator (modern, preferred)
const copy2 = { ...original };

// Merging objects
const defaults = { theme: "light", fontSize: 14 };
const userPrefs = { theme: "dark" };

const settings = { ...defaults, ...userPrefs };
console.log(settings);
// { theme: "dark", fontSize: 14 }
// userPrefs overwrites defaults

// IMPORTANT: These are SHALLOW copies
copy1.age = 30; // Doesn't affect original
copy1.address.city = "LA"; // AFFECTS original! (nested object)

console.log(original.address.city); // "LA" - Changed!
```

**Why shallow copy is problematic:**

```javascript
const person = {
  name: "Alice",
  friends: ["Bob", "Charlie"],
};

const copy = { ...person };

// Primitive values are truly copied
copy.name = "Eve";
console.log(person.name); // Still "Alice" ✓

// But arrays/objects are copied by reference
copy.friends.push("David");
console.log(person.friends); // ["Bob", "Charlie", "David"] ✗
// Original was modified!
```

**Solution: Deep copy**

```javascript
// Method 1: JSON (simple but has limitations)
const deepCopy = JSON.parse(JSON.stringify(original));
// Limitations: loses functions, Dates become strings, no undefined

// Method 2: structuredClone (modern, best option)
const deepCopy = structuredClone(original);
// Handles Dates, RegExp, Maps, Sets, etc.

// Method 3: Manual recursive function (full control)
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") return obj;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map((item) => deepClone(item));

  const clone = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}
```

#### Object.freeze() and Object.seal()

```javascript
const user = {
  name: "Alice",
  age: 25,
};

// FREEZE - Complete immutability
Object.freeze(user);

user.age = 30; // Fails
user.email = "a@b.com"; // Fails
delete user.name; // Fails
// Object is completely locked

console.log(Object.isFrozen(user)); // true

// SEAL - Can modify, can't add/remove
const product = {
  name: "Laptop",
  price: 999,
};

Object.seal(product);

product.price = 899; // Works - can modify existing
product.brand = "Dell"; // Fails - can't add new
delete product.name; // Fails - can't remove

console.log(Object.isSealed(product)); // true
```

**Real-world use: Configuration objects**

```javascript
const CONFIG = Object.freeze({
  API_URL: "https://api.example.com",
  TIMEOUT: 5000,
  MAX_RETRIES: 3,
});

// Anywhere in your code
CONFIG.API_URL = "hacked.com"; // Fails - config is protected
```

**Important:** freeze() and seal() are SHALLOW

```javascript
const user = Object.freeze({
  name: "Alice",
  address: {
    city: "NYC",
  },
});

user.name = "Bob"; // Fails - frozen
user.address.city = "LA"; // WORKS - nested object not frozen!

// Deep freeze solution
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach((value) => {
    if (typeof value === "object" && value !== null) {
      deepFreeze(value);
    }
  });
  return obj;
}

const fullyFrozen = deepFreeze({
  name: "Alice",
  address: { city: "NYC" },
});

fullyFrozen.address.city = "LA"; // Now this fails too
```

### Checking Properties

```javascript
const user = {
  name: "Alice",
  age: 25,
};

// Method 1: in operator (checks own + inherited properties)
console.log("name" in user); // true
console.log("toString" in user); // true (inherited from Object)

// Method 2: hasOwnProperty (checks only own properties)
console.log(user.hasOwnProperty("name")); // true
console.log(user.hasOwnProperty("toString")); // false

// Method 3: undefined check (not reliable)
console.log(user.name !== undefined); // true
// Problem: what if property exists but is undefined?
user.email = undefined;
console.log(user.email !== undefined); // false (but property exists!)

// Method 4: Object.hasOwn() (modern, safer)
console.log(Object.hasOwn(user, "name")); // true
```

### Object Patterns and Best Practices

#### Pattern 1: Factory Functions

```javascript
// Instead of classes, create objects with functions
function createUser(name, email) {
  // Private variables (only accessible within this scope)
  let loginCount = 0;
  const createdAt = new Date();

  return {
    // Public properties
    name,
    email,

    // Public methods
    login() {
      loginCount++;
      console.log(`${name} logged in (${loginCount} times)`);
    },

    getLoginCount() {
      return loginCount; // Controlled access to private data
    },

    getAccountAge() {
      return Date.now() - createdAt;
    },
  };
}

const user = createUser("Alice", "alice@example.com");
user.login(); // "Alice logged in (1 times)"
user.login(); // "Alice logged in (2 times)"
console.log(user.loginCount); // undefined - private!
console.log(user.getLoginCount()); // 2 - controlled access
```

#### Pattern 2: Module Pattern

```javascript
// Create self-contained modules with private state
const ShoppingCart = (function () {
  // Private variables
  const items = [];
  let total = 0;

  // Private functions
  function calculateTotal() {
    total = items.reduce((sum, item) => sum + item.price, 0);
  }

  // Public API
  return {
    addItem(item) {
      items.push(item);
      calculateTotal();
    },

    removeItem(itemId) {
      const index = items.findIndex((item) => item.id === itemId);
      if (index > -1) {
        items.splice(index, 1);
        calculateTotal();
      }
    },

    getItems() {
      return [...items]; // Return copy, not original
    },

    getTotal() {
      return total;
    },

    clear() {
      items.length = 0;
      total = 0;
    },
  };
})(); // IIFE - runs immediately

// Usage
ShoppingCart.addItem({ id: 1, name: "Laptop", price: 999 });
ShoppingCart.addItem({ id: 2, name: "Mouse", price: 29 });
console.log(ShoppingCart.getTotal()); // 1028
console.log(ShoppingCart.items); // undefined - private!
```

---

## 3. Prototypes and Inheritance

### What is a Prototype?

In JavaScript, every object has a secret connection to another object called its **prototype**. Think of a prototype as a "parent object" that children can inherit properties and methods from.

**Real-world analogy:** It's like genetic inheritance - you inherit traits from your parents (prototype), but you can also have your own unique characteristics.

### The Prototype Chain

When you try to access a property on an object:

1. JavaScript first looks at the object itself
2. If not found, it looks at the object's prototype
3. If still not found, it looks at the prototype's prototype
4. This continues until it reaches the end of the chain (null)

```javascript
const animal = {
  eats: true,

  eat() {
    console.log("Animal is eating");
  },
};

const rabbit = {
  jumps: true,
};

// Set rabbit's prototype to animal
rabbit.__proto__ = animal; // Don't use this in real code!
// Modern way: Object.setPrototypeOf(rabbit, animal);

console.log(rabbit.eats); // true (inherited from animal)
console.log(rabbit.jumps); // true (own property)

rabbit.eat(); // "Animal is eating" (inherited method)

// The chain: rabbit → animal → Object.prototype → null
console.log(rabbit.toString()); // "[object Object]"
// Found in Object.prototype (top of chain)
```

**Visualizing the chain:**

```
rabbit {
  jumps: true,
  __proto__: animal {
    eats: true,
    eat: function,
    __proto__: Object.prototype {
      toString: function,
      valueOf: function,
      ...
      __proto__: null
    }
  }
}
```

### Creating Objects with Prototypes

#### Method 1: Object.create() - The Recommended Way

```javascript
// Define a prototype object with shared methods
const animalMethods = {
  eat() {
    console.log(`${this.name} is eating`);
  },

  sleep() {
    console.log(`${this.name} is sleeping`);
  },

  describe() {
    return `${this.name} is a ${this.species}`;
  },
};

// Create objects that inherit from the prototype
const dog = Object.create(animalMethods);
dog.name = "Rex";
dog.species = "Dog";

const cat = Object.create(animalMethods);
cat.name = "Whiskers";
cat.species = "Cat";

dog.eat(); // "Rex is eating"
cat.sleep(); // "Whiskers is sleeping"

// Both share the same methods (memory efficient)
console.log(dog.eat === cat.eat); // true
```

**Why this is good:**

- Clear separation between shared methods and instance data
- Memory efficient (methods stored once, not per instance)
- Explicit and easy to understand

#### Method 2: Constructor Functions (Classical Pattern)

```javascript
// Constructor function (capitalzed by convention)
function Animal(name, species) {
  // Instance properties (unique to each object)
  this.name = name;
  this.species = species;
  this.energy = 100;
}

// Shared methods on prototype (ONE copy for all instances)
Animal.prototype.eat = function () {
  this.energy += 10;
  console.log(`${this.name} is eating. Energy: ${this.energy}`);
};

Animal.prototype.run = function () {
  if (this.energy < 10) {
    console.log(`${this.name} is too tired to run!`);
    return;
  }
  this.energy -= 10;
  console.log(`${this.name} is running. Energy: ${this.energy}`);
};

Animal.prototype.describe = function () {
  return `${this.name} is a ${this.species}`;
};

// Create instances with 'new' keyword
const dog = new Animal("Rex", "Dog");
const cat = new Animal("Whiskers", "Cat");

dog.eat(); // "Rex is eating. Energy: 110"
dog.run(); // "Rex is running. Energy: 100"
cat.run(); // "Whiskers is running. Energy: 90"

console.log(dog.describe()); // "Rex is a Dog"

// All instances share the same methods
console.log(dog.eat === cat.eat); // true
```

**What happens with the `new` keyword:**

1. Creates a new empty object
2. Sets the object's prototype to `Animal.prototype`
3. Calls `Animal` with `this` bound to the new object
4. Returns the new object (unless function returns its own object)

```javascript
// This is roughly what 'new' does:
function myNew(Constructor, ...args) {
  const obj = {};
  Object.setPrototypeOf(obj, Constructor.prototype);
  const result = Constructor.apply(obj, args);
  return result instanceof Object ? result : obj;
}
```

### Prototype Inheritance (Creating Hierarchies)

Building inheritance chains allows code reuse and logical organization.

```javascript
// Parent constructor
function Animal(name) {
  this.name = name;
  this.energy = 100;
}

Animal.prototype.eat = function () {
  this.energy += 10;
  console.log(`${this.name} is eating`);
};

Animal.prototype.sleep = function () {
  this.energy += 20;
  console.log(`${this.name} is sleeping`);
};

// Child constructor
function Dog(name, breed) {
  // Call parent constructor
  Animal.call(this, name); // Initialize inherited properties
  this.breed = breed; // Add child-specific property
}

// Set up inheritance - Dog inherits from Animal
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // Fix constructor reference

// Add Dog-specific methods
Dog.prototype.bark = function () {
  this.energy -= 5;
  console.log(`${this.name} says Woof! Energy: ${this.energy}`);
};

Dog.prototype.fetch = function () {
  if (this.energy < 20) {
    console.log(`${this.name} is too tired to fetch`);
    return;
  }
  this.energy -= 20;
  console.log(`${this.name} fetches the ball!`);
};

// Create instances
const myDog = new Dog("Rex", "Golden Retriever");

myDog.eat(); // Inherited from Animal
myDog.bark(); // Dog-specific
myDog.fetch(); // Dog-specific
myDog.sleep(); // Inherited from Animal

console.log(myDog.name); // "Rex"
console.log(myDog.breed); // "Golden Retriever"
console.log(myDog.energy); // varies based on actions

// Check the prototype chain
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true
```

**The inheritance chain:**

```
myDog
  ↓ __proto__
Dog.prototype (bark, fetch)
  ↓ __proto__
Animal.prototype (eat, sleep)
  ↓ __proto__
Object.prototype (toString, etc.)
  ↓ __proto__
null
```

### Checking Prototypes and Inheritance

```javascript
function Animal(name) {
  this.name = name;
}

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

const myDog = new Dog("Rex", "Labrador");

// Check if object is instance of constructor
console.log(myDog instanceof Dog); // true
console.log(myDog instanceof Animal); // true
console.log(myDog instanceof Object); // true

// Check if object has property (own or inherited)
console.log("name" in myDog); // true
console.log("breed" in myDog); // true
console.log("bark" in myDog); // false (if not defined)

// Check if property is own (not inherited)
console.log(myDog.hasOwnProperty("name")); // true
console.log(myDog.hasOwnProperty("breed")); // true

// Get the prototype of an object
console.log(Object.getPrototypeOf(myDog) === Dog.prototype); // true

// Check if one object is in another's prototype chain
console.log(Dog.prototype.isPrototypeOf(myDog)); // true
console.log(Animal.prototype.isPrototypeOf(myDog)); // true
```

### Common Prototype Pitfalls

#### Pitfall 1: Modifying Objects vs Prototypes

```javascript
function User(name) {
  this.name = name;
}

User.prototype.friends = []; // DANGER! Shared array

const user1 = new User("Alice");
const user2 = new User("Bob");

user1.friends.push("Charlie");

console.log(user1.friends); // ["Charlie"]
console.log(user2.friends); // ["Charlie"] - UNEXPECTED!
// Both share the same array!

// SOLUTION: Initialize arrays in constructor
function User(name) {
  this.name = name;
  this.friends = []; // Each instance gets its own array
}
```

#### Pitfall 2: Overwriting Prototype

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  console.log("eating");
};

const dog = new Animal("Rex");

// WRONG: Overwrites entire prototype
Animal.prototype = {
  sleep: function () {
    console.log("sleeping");
  },
};

dog.eat(); // Still works (dog still points to old prototype)

const cat = new Animal("Whiskers");
cat.eat(); // Error! New prototype doesn't have eat()
cat.sleep(); // Works (new prototype has sleep)

// CORRECT: Add to existing prototype
Animal.prototype.sleep = function () {
  console.log("sleeping");
};
```

#### Pitfall 3: Forgetting to Reset Constructor

```javascript
function Animal() {}
function Dog() {}

Dog.prototype = Object.create(Animal.prototype);
// Forgot: Dog.prototype.constructor = Dog;

const dog = new Dog();
console.log(dog.constructor === Dog); // false!
console.log(dog.constructor === Animal); // true - WRONG!

// Always reset constructor
Dog.prototype.constructor = Dog;
```

### Modern Alternative: Classes (Syntactic Sugar)

Prototypes are how JavaScript actually works, but classes provide cleaner syntax:

```javascript
// Using prototypes (how it works internally)
function Animal(name) {
  this.name = name;
}
Animal.prototype.eat = function () {
  console.log(`${this.name} is eating`);
};

// Using classes (cleaner syntax, same result)
class Animal {
  constructor(name) {
    this.name = name;
  }

  eat() {
    console.log(`${this.name} is eating`);
  }
}

// Both create the same structure!
// Classes are just "syntactic sugar" over prototypes
```

---

## 4. Classes

### What Are Classes?

Classes are templates for creating objects with predefined properties and methods. Think of a class as a blueprint - like architectural plans for a house. The blueprint itself isn't a house, but you can use it to build many houses.

**Important:** JavaScript classes are syntactic sugar over prototypes. They don't introduce a new object-oriented inheritance model - they're just a cleaner way to write prototype-based code.

### Basic Class Syntax

```javascript
class Person {
  // Constructor - runs when creating new instance
  constructor(firstName, lastName, age) {
    // Instance properties (unique to each object)
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.createdAt = new Date();
  }

  // Methods (shared by all instances via prototype)
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  introduce() {
    return `Hi, I'm ${this.getFullName()} and I'm ${this.age} years old`;
  }

  haveBirthday() {
    this.age++;
    console.log(`Happy birthday! Now ${this.age} years old`);
  }
}

// Create instances (objects) from the class
const person1 = new Person("Alice", "Johnson", 25);
const person2 = new Person("Bob", "Smith", 30);

console.log(person1.getFullName()); // "Alice Johnson"
console.log(person2.introduce()); // "Hi, I'm Bob Smith and I'm 30 years old"

person1.haveBirthday(); // "Happy birthday! Now 26 years old"

// Methods are shared (stored on prototype)
console.log(person1.getFullName === person2.getFullName); // true
```

### Class Inheritance with `extends`

Classes can inherit from other classes, creating hierarchies.

```javascript
// Parent class
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }

  eat(food) {
    this.energy += 10;
    console.log(`${this.name} eats ${food}. Energy: ${this.energy}`);
  }

  sleep(hours) {
    this.energy += hours * 5;
    console.log(`${this.name} sleeps ${hours} hours. Energy: ${this.energy}`);
  }

  describe() {
    return `${this.name} is a ${this.species}`;
  }
}

// Child class extends parent
class Dog extends Animal {
  constructor(name, breed) {
    // MUST call super() before using 'this'
    super(name, "Dog"); // Call parent constructor

    // Child-specific properties
    this.breed = breed;
    this.tricks = [];
  }

  // Override parent method
  describe() {
    // Can call parent method with super
    const basicInfo = super.describe();
    return `${basicInfo}, specifically a ${this.breed}`;
  }

  // Child-specific methods
  bark() {
    this.energy -= 2;
    console.log(`${this.name}: Woof! Woof!`);
  }

  learnTrick(trick) {
    this.tricks.push(trick);
    console.log(`${this.name} learned: ${trick}`);
  }

  performTricks() {
    if (this.tricks.length === 0) {
      console.log(`${this.name} doesn't know any tricks yet`);
      return;
    }

    console.log(`${this.name}'s tricks:`);
    this.tricks.forEach((trick) => console.log(`  - ${trick}`));
  }
}

// Create instance
const myDog = new Dog("Rex", "Golden Retriever");

// Use inherited methods
myDog.eat("kibble"); // From Animal
myDog.sleep(8); // From Animal

// Use Dog-specific methods
myDog.bark();
myDog.learnTrick("Sit");
myDog.learnTrick("Fetch");
myDog.learnTrick("Roll over");
myDog.performTricks();

// Overridden method
console.log(myDog.describe());
// "Rex is a Dog, specifically a Golden Retriever"
```

### The `super` Keyword

`super` is used to access the parent class:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  makeSound() {
    return "Some generic sound";
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    // 1. Call parent constructor
    super(name); // Required before using 'this'
    this.breed = breed;
  }

  makeSound() {
    // 2. Call parent method
    const parentSound = super.makeSound();
    return `${parentSound} but specifically: Woof!`;
  }

  introduce() {
    // 3. Access parent properties through 'this'
    // (no need for super, inherited automatically)
    return `I'm ${this.name}, a ${this.breed}`;
  }
}

const dog = new Dog("Rex", "Labrador");
console.log(dog.makeSound());
// "Some generic sound but specifically: Woof!"
```

**Important Rules:**

1. Must call `super()` in child constructor before using `this`
2. `super()` must be called if you define a constructor in the child
3. If you don't define a constructor, JavaScript calls `super()` automatically

```javascript
// This is automatic if you don't define constructor:
class Dog extends Animal {
  // JavaScript does this automatically:
  // constructor(...args) {
  //   super(...args);
  // }
}
```

### Static Methods and Properties

Static members belong to the class itself, not to instances.

```javascript
class MathHelper {
  // Static properties
  static PI = 3.14159;
  static E = 2.71828;

  // Static methods
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static calculateCircleArea(radius) {
    return this.PI * radius * radius;
  }
}

// Use directly on the class, NOT on instances
console.log(MathHelper.PI); // 3.14159
console.log(MathHelper.add(5, 3)); // 8
console.log(MathHelper.calculateCircleArea(10)); // 314.159

// Cannot access on instances
const helper = new MathHelper();
console.log(helper.PI); // undefined
console.log(helper.add); // undefined
```

**Real-world example: Utility class**

```javascript
class User {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.id = User.generateId();
  }

  // Static counter for unique IDs
  static currentId = 0;

  static generateId() {
    return ++User.currentId;
  }

  // Static validation method
  static isValidEmail(email) {
    return email.includes("@") && email.includes(".");
  }

  // Static factory method
  static createFromString(fullName, email) {
    const [firstName, lastName] = fullName.split(" ");
    return new User(firstName, lastName, email);
  }
}

// Use static methods
const user1 = new User("Alice", "Johnson", "alice@example.com");
console.log(user1.id); // 1

const user2 = new User("Bob", "Smith", "bob@example.com");
console.log(user2.id); // 2

// Validation before creating
const email = "invalid.com";
if (User.isValidEmail(email)) {
  const user = new User("Test", "User", email);
} else {
  console.log("Invalid email!");
}

// Factory method
const user3 = User.createFromString("Charlie Brown", "charlie@example.com");
console.log(user3.firstName); // "Charlie"
```

### Getters and Setters in Classes

Getters and setters allow you to control access to properties.

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius; // Convention: _ means "private"
  }

  // Getter - access like a property
  get celsius() {
    return this._celsius;
  }

  // Setter - assign like a property with validation
  set celsius(value) {
    if (value < -273.15) {
      throw new Error("Temperature below absolute zero!");
    }
    this._celsius = value;
  }

  // Computed property (getter only)
  get fahrenheit() {
    return (this._celsius * 9) / 5 + 32;
  }

  set fahrenheit(value) {
    this._celsius = ((value - 32) * 5) / 9;
  }

  get kelvin() {
    return this._celsius + 273.15;
  }

  set kelvin(value) {
    this.celsius = value - 273.15; // Uses celsius setter for validation
  }
}

const temp = new Temperature(25);

// Use like properties (no parentheses!)
console.log(temp.celsius); // 25
console.log(temp.fahrenheit); // 77
console.log(temp.kelvin); // 298.15

// Setter with validation
temp.celsius = 30;
console.log(temp.fahrenheit); // 86

temp.fahrenheit = 32;
console.log(temp.celsius); // 0

temp.celsius = -300; // Error: Temperature below absolute zero!
```

**Real-world example: User authentication**

```javascript
class User {
  constructor(username, email) {
    this.username = username;
    this._email = email;
    this._password = null;
  }

  get email() {
    // Only show partial email for privacy
    const [local, domain] = this._email.split("@");
    return `${local[0]}***@${domain}`;
  }

  set email(value) {
    // Validate format
    if (!value.includes("@") || !value.includes(".")) {
      throw new Error("Invalid email format");
    }
    // Normalize (lowercase, trim)
    this._email = value.toLowerCase().trim();
  }

  get password() {
    // Never expose password
    return "********";
  }

  set password(value) {
    // Validate password strength
    if (value.length < 8) {
      throw new Error("Password must be at least 8 characters");
    }
    if (!/[A-Z]/.test(value)) {
      throw new Error("Password must contain uppercase letter");
    }
    if (!/[0-9]/.test(value)) {
      throw new Error("Password must contain a number");
    }

    // In real app, hash the password
    this._password = value;
  }

  verifyPassword(input) {
    return this._password === input;
  }
}

const user = new User("alice", "alice@example.com");

console.log(user.email); // "a***@example.com"
user.email = "  NEWEMAIL@EXAMPLE.COM  ";
console.log(user._email); // "newemail@example.com" (stored normalized)

user.password = "Secret123";
console.log(user.password); // "********" (hidden)
console.log(user.verifyPassword("Secret123")); // true

user.password = "weak"; // Error: Password must be at least 8 characters
```

### Private Fields (Modern JavaScript)

True private fields that cannot be accessed from outside the class.

```javascript
class BankAccount {
  // Private fields (start with #)
  #balance = 0;
  #pin;
  #transactions = [];

  constructor(accountHolder, initialBalance, pin) {
    this.accountHolder = accountHolder;
    this.#balance = initialBalance;
    this.#pin = pin;
    this.#addTransaction("Initial deposit", initialBalance);
  }

  // Private method
  #addTransaction(type, amount) {
    this.#transactions.push({
      type,
      amount,
      date: new Date(),
      balance: this.#balance,
    });
  }

  // Public methods to interact with private fields
  deposit(amount, pin) {
    if (!this.#verifyPin(pin)) {
      throw new Error("Invalid PIN");
    }

    if (amount <= 0) {
      throw new Error("Amount must be positive");
    }

    this.#balance += amount;
    this.#addTransaction("Deposit", amount);
    return this.#balance;
  }

  withdraw(amount, pin) {
    if (!this.#verifyPin(pin)) {
      throw new Error("Invalid PIN");
    }

    if (amount > this.#balance) {
      throw new Error("Insufficient funds");
    }

    this.#balance -= amount;
    this.#addTransaction("Withdrawal", -amount);
    return this.#balance;
  }

  #verifyPin(inputPin) {
    return inputPin === this.#pin;
  }

  getBalance(pin) {
    if (!this.#verifyPin(pin)) {
      throw new Error("Invalid PIN");
    }
    return this.#balance;
  }

  getTransactionHistory(pin) {
    if (!this.#verifyPin(pin)) {
      throw new Error("Invalid PIN");
    }
    return [...this.#transactions]; // Return copy
  }
}

const account = new BankAccount("Alice Johnson", 1000, "1234");

account.deposit(500, "1234"); // 1500
account.withdraw(200, "1234"); // 1300

console.log(account.getBalance("1234")); // 1300

// Cannot access private fields from outside
console.log(account.#balance); // SyntaxError!
console.log(account.#pin); // SyntaxError!
account.#addTransaction(); // SyntaxError!

// Even with correct pin, can't access directly
console.log(account["#balance"]); // undefined
```

**Private vs Convention-based Privacy:**

```javascript
// OLD WAY: Convention (not enforced)
class OldUser {
  constructor(name) {
    this._password = "secret"; // _ means "please don't touch"
  }
}

const oldUser = new OldUser("Alice");
console.log(oldUser._password); // "secret" - still accessible!

// NEW WAY: True privacy
class NewUser {
  #password;

  constructor(name) {
    this.#password = "secret"; // Truly private
  }
}

const newUser = new NewUser("Alice");
console.log(newUser.#password); // SyntaxError - cannot access!
```

### Class Expressions

Classes can be defined as expressions, just like functions.

```javascript
// Named class expression
const Person = class PersonClass {
  constructor(name) {
    this.name = name;
  }
};

// Anonymous class expression
const Animal = class {
  constructor(species) {
    this.species = species;
  }
};

// Use in arrays or objects
const shapes = [
  class Circle {
    constructor(radius) {
      this.radius = radius;
    }

    area() {
      return Math.PI * this.radius ** 2;
    }
  },

  class Rectangle {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }

    area() {
      return this.width * this.height;
    }
  },
];

const circle = new shapes[0](5);
console.log(circle.area()); // 78.54
```

### Class Composition (Mixins)

JavaScript classes support single inheritance only, but you can use mixins for composition.

```javascript
// Mixin functions add functionality
const CanEat = (Base) =>
  class extends Base {
    eat(food) {
      console.log(`${this.name} is eating ${food}`);
    }
  };

const CanSwim = (Base) =>
  class extends Base {
    swim() {
      console.log(`${this.name} is swimming`);
    }
  };

const CanFly = (Base) =>
  class extends Base {
    fly() {
      console.log(`${this.name} is flying`);
    }
  };

// Base class
class Animal {
  constructor(name) {
    this.name = name;
  }
}

// Compose different abilities
class Duck extends CanFly(CanSwim(CanEat(Animal))) {
  quack() {
    console.log(`${this.name} says quack!`);
  }
}

class Fish extends CanSwim(CanEat(Animal)) {
  // Fish can eat and swim, but not fly
}

const duck = new Duck("Donald");
duck.eat("bread"); // Works
duck.swim(); // Works
duck.fly(); // Works
duck.quack(); // Works

const fish = new Fish("Nemo");
fish.eat("plankton"); // Works
fish.swim(); // Works
// fish.fly();        // Would error - Fish can't fly
```

### Real-World Class Example: Todo List Manager

```javascript
class TodoList {
  #todos = [];
  #nextId = 1;

  constructor(listName) {
    this.listName = listName;
    this.createdAt = new Date();
  }

  addTodo(text, priority = "medium") {
    const todo = {
      id: this.#nextId++,
      text,
      priority,
      completed: false,
      createdAt: new Date(),
    };

    this.#todos.push(todo);
    return todo;
  }

  removeTodo(id) {
    const index = this.#todos.findIndex((todo) => todo.id === id);
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }

    const removed = this.#todos.splice(index, 1)[0];
    return removed;
  }

  toggleTodo(id) {
    const todo = this.#findTodo(id);
    todo.completed = !todo.completed;
    return todo;
  }

  updateTodo(id, updates) {
    const todo = this.#findTodo(id);
    Object.assign(todo, updates);
    return todo;
  }

  #findTodo(id) {
    const todo = this.#todos.find((todo) => todo.id === id);
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    return todo;
  }

  getTodos(filter = "all") {
    switch (filter) {
      case "active":
        return this.#todos.filter((todo) => !todo.completed);
      case "completed":
        return this.#todos.filter((todo) => todo.completed);
      case "high":
        return this.#todos.filter((todo) => todo.priority === "high");
      default:
        return [...this.#todos];
    }
  }

  get stats() {
    const total = this.#todos.length;
    const completed = this.#todos.filter((t) => t.completed).length;
    const active = total - completed;

    return {
      total,
      completed,
      active,
      completionRate: total
        ? ((completed / total) * 100).toFixed(1) + "%"
        : "0%",
    };
  }

  clearCompleted() {
    const completed = this.#todos.filter((todo) => todo.completed);
    this.#todos = this.#todos.filter((todo) => !todo.completed);
    return completed;
  }
}

// Usage
const myList = new TodoList("Work Tasks");

myList.addTodo("Write documentation", "high");
myList.addTodo("Review code", "medium");
myList.addTodo("Update tests", "high");

console.log(myList.getTodos()); // All todos
myList.toggleTodo(1); // Mark first as complete

console.log(myList.stats);
// { total: 3, completed: 1, active: 2, completionRate: "33.3%" }

console.log(myList.getTodos("high")); // Only high priority
myList.clearCompleted(); // Remove completed todos
```

---

## 5. Destructuring

### What is Destructuring?

Destructuring is a syntax that lets you unpack values from arrays or properties from objects into distinct variables. It's like opening a package and taking out only the items you need.

**Why it's useful:**

- Write less repetitive code
- Extract multiple values in one line
- Set default values easily
- Make function parameters more readable

### Array Destructuring

#### Basic Usage

```javascript
// Without destructuring
const colors = ["red", "green", "blue"];
const first = colors[0];
const second = colors[1];
const third = colors[2];

// With destructuring
const [first, second, third] = colors;
console.log(first); // "red"
console.log(second); // "green"
console.log(third); // "blue"
```

#### Skipping Elements

```javascript
const colors = ["red", "green", "blue", "yellow"];

// Skip elements with empty slots
const [first, , third] = colors;
console.log(first); // "red"
console.log(third); // "blue"

// Get first and last
const [firstColor, , , lastColor] = colors;
console.log(firstColor); // "red"
console.log(lastColor); // "yellow"
```

#### Default Values

```javascript
// If array doesn't have enough elements
const [a, b, c, d = "default"] = ["one", "two", "three"];
console.log(d); // "default"

// Default only used if value is undefined
const [x, y = "default"] = ["value", null];
console.log(y); // null (not undefined, so default not used)
```

#### Rest Pattern

```javascript
const numbers = [1, 2, 3, 4, 5, 6];

// Get first element and rest
const [first, ...rest] = numbers;
console.log(first); // 1
console.log(rest);  // [2, 3, 4, 5, 6]

// Get first, second, and rest
const [a, b, ...others] = numbers;
console.log(a);      // 1
console.log(b);      // 2
console.log(others); // [3, 4, 5, 6]

// Rest must be last element
const [x, ...middle, y] = numbers; // SyntaxError!
```

#### Swapping Variables

```javascript
let a = 1;
let b = 2;

// OLD WAY: Need temporary variable
let temp = a;
a = b;
b = temp;

// NEW WAY: One line swap
[a, b] = [b, a];
console.log(a); // 2
console.log(b); // 1

// Works with more variables too
let x = 1,
  y = 2,
  z = 3;
[x, y, z] = [z, x, y];
console.log(x, y, z); // 3, 1, 2
```

#### Nested Array Destructuring

```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Destructure nested arrays
const [[a, b], [c, d]] = matrix;
console.log(a); // 1
console.log(b); // 2
console.log(c); // 4
console.log(d); // 5

// Get specific nested element
const [, [, middleElement]] = matrix;
console.log(middleElement); // 5
```

#### Real-World Examples

```javascript
// 1. Function returning multiple values
function getCoordinates() {
  return [40.7128, -74.006]; // New York coordinates
}

const [latitude, longitude] = getCoordinates();
console.log(`Lat: ${latitude}, Lon: ${longitude}`);

// 2. Splitting strings
const fullName = "Alice Johnson";
const [firstName, lastName] = fullName.split(" ");
console.log(firstName); // "Alice"
console.log(lastName); // "Johnson"

// 3. Parsing CSV data
const csvRow = "John,Doe,30,Engineer";
const [first, last, age, job] = csvRow.split(",");

// 4. Working with iterators
const [firstLetter, secondLetter] = "Hello";
console.log(firstLetter); // "H"
console.log(secondLetter); // "e"

// 5. Array methods
const users = [
  { name: "Alice", age: 25 },
  { name: "Bob", age: 30 },
];

users.forEach(({ name, age }) => {
  console.log(`${name} is ${age} years old`);
});
```

### Object Destructuring

#### Basic Usage

```javascript
const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  city: "New York",
};

// Without destructuring
const name = user.name;
const age = user.age;
const email = user.email;

// With destructuring
const { name, age, email } = user;
console.log(name); // "Alice"
console.log(age); // 25
console.log(email); // "alice@example.com"

// Order doesn't matter!
const { city, name: userName } = user;
// Variable names match property names
```

#### Renaming Variables

```javascript
const user = {
  name: "Alice",
  age: 25,
};

// Rename during destructuring
const { name: userName, age: userAge } = user;
console.log(userName); // "Alice"
console.log(userAge); // 25

// Original property names don't create variables
console.log(name); // ReferenceError (unless already defined)
```

#### Default Values

```javascript
const user = {
  name: "Alice",
  age: 25,
};

// Provide defaults for missing properties
const { name, age, country = "USA" } = user;
console.log(country); // "USA" (default used)

// Combine with renaming
const { name: userName, city: userCity = "Unknown" } = user;
console.log(userCity); // "Unknown"

// Default only used if property is undefined
const settings = { theme: null };
const { theme = "light" } = settings;
console.log(theme); // null (not undefined, so default not used)
```

#### Rest Pattern in Objects

```javascript
const user = {
  name: "Alice",
  age: 25,
  email: "alice@example.com",
  city: "NYC",
  country: "USA",
};

// Extract some properties, collect rest
const { name, age, ...contactInfo } = user;
console.log(name); // "Alice"
console.log(age); // 25
console.log(contactInfo);
// { email: "alice@example.com", city: "NYC", country: "USA" }

// Useful for removing properties
const { password, ...safeUser } = user;
// safeUser has everything except password
```

#### Nested Object Destructuring

```javascript
const user = {
  name: "Alice",
  age: 25,
  address: {
    street: "123 Main St",
    city: "New York",
    coordinates: {
      lat: 40.7128,
      lon: -74.006,
    },
  },
  contact: {
    email: "alice@example.com",
    phone: "555-1234",
  },
};

// Destructure nested objects
const {
  name,
  address: {
    city,
    coordinates: { lat, lon },
  },
  contact: { email },
} = user;

console.log(name); // "Alice"
console.log(city); // "New York"
console.log(lat); // 40.7128
console.log(email); // "alice@example.com"

// Note: intermediate objects aren't created as variables
console.log(address); // ReferenceError (unless already defined)

// If you want both parent and nested
const {
  address: userAddress,
  address: { city: userCity },
} = user;
console.log(userAddress); // Full address object
console.log(userCity); // "New York"
```

#### Destructuring with Default and Renaming

```javascript
const user = {
  name: "Alice",
};

// Combine all features
const {
  name: userName,
  age: userAge = 0,
  email: userEmail = "no-email@example.com",
} = user;

console.log(userName); // "Alice"
console.log(userAge); // 0 (default)
console.log(userEmail); // "no-email@example.com" (default)
```

#### Computed Property Names

```javascript
const key = "username";
const { [key]: value } = { username: "Alice" };
console.log(value); // "Alice"

// Dynamic destructuring
function getValue(obj, key) {
  const { [key]: result } = obj;
  return result;
}

console.log(getValue({ name: "Alice" }, "name")); // "Alice"
```

### Destructuring Function Parameters

#### Object Parameters

```javascript
// Without destructuring - hard to remember parameter order
function createUser(name, age, email, city, country) {
  // ...
}
createUser("Alice", 25, "alice@example.com", "NYC", "USA");

// With destructuring - named parameters!
function createUser({ name, age, email, city, country }) {
  console.log(`Creating user: ${name}, ${age} years old`);
  console.log(`Contact: ${email}`);
  console.log(`Location: ${city}, ${country}`);
}

// Order doesn't matter
createUser({
  name: "Alice",
  country: "USA",
  age: 25,
  city: "NYC",
  email: "alice@example.com",
});

// With defaults
function createUser({
  name,
  age = 0,
  email = "no-email",
  city = "Unknown",
  country = "Unknown",
} = {}) {
  // Default empty object
  console.log(`${name} (${age}), ${city}, ${country}`);
}

createUser({ name: "Alice" });
// "Alice (0), Unknown, Unknown"

createUser(); // Works with no arguments!
// "undefined (0), Unknown, Unknown"
```

#### Array Parameters

```javascript
function getFirstTwo([first, second]) {
  return { first, second };
}

console.log(getFirstTwo([1, 2, 3, 4]));
// { first: 1, second: 2 }

// With rest
function sum([first, ...rest]) {
  return rest.reduce((total, n) => total + n, first);
}

console.log(sum([1, 2, 3, 4, 5])); // 15
```

#### Real-World Function Examples

```javascript
// 1. API response handling
function handleUserData({ data: { user, posts, comments } }) {
  console.log(`User: ${user.name}`);
  console.log(`Posts: ${posts.length}`);
  console.log(`Comments: ${comments.length}`);
}

// 2. React component pattern
function UserCard({ name, age, email, avatar = "/default-avatar.png" }) {
  return `
    <div class="user-card">
      <img src="${avatar}" alt="${name}" />
      <h2>${name}, ${age}</h2>
      <p>${email}</p>
    </div>
  `;
}

// 3. Configuration objects
function connectDatabase({
  host = "localhost",
  port = 5432,
  username,
  password,
  database,
  ssl = false,
  timeout = 30000,
}) {
  console.log(`Connecting to ${host}:${port}/${database}`);
  // Connection logic...
}

connectDatabase({
  host: "db.example.com",
  username: "admin",
  password: "secret",
  database: "production",
});

// 4. Options with callbacks
function fetchData(
  url,
  {
    method = "GET",
    headers = {},
    timeout = 5000,
    onSuccess = (data) => console.log(data),
    onError = (err) => console.error(err),
  } = {}
) {
  // Fetch logic...
}

fetchData("/api/users", {
  method: "POST",
  onSuccess: (users) => console.log(`Got ${users.length} users`),
});
```

### Common Destructuring Patterns

#### Pattern 1: Extracting from Arrays of Objects

```javascript
const users = [
  { id: 1, name: "Alice", age: 25 },
  { id: 2, name: "Bob", age: 30 },
  { id: 3, name: "Charlie", age: 35 },
];

// Get first user's name and age
const [{ name, age }] = users;
console.log(name, age); // "Alice", 25

// Get multiple users
const [user1, user2] = users;
console.log(user1.name, user2.name); // "Alice", "Bob"

// Combine array and object destructuring
const [, { name: secondName }, { age: thirdAge }] = users;
console.log(secondName); // "Bob"
console.log(thirdAge); // 35
```

#### Pattern 2: Function Return Values

```javascript
// Return object for named values
function getUser() {
  return {
    name: "Alice",
    age: 25,
    email: "alice@example.com",
  };
}

const { name, age } = getUser();

// Multiple functions with destructuring
async function loadPageData() {
  const [users, posts, comments] = await Promise.all([
    fetchUsers(),
    fetchPosts(),
    fetchComments(),
  ]);

  return { users, posts, comments };
}

const { users, posts } = await loadPageData();
```

#### Pattern 3: Conditional Destructuring

```javascript
const user = {
  name: "Alice",
  settings: {
    theme: "dark",
  },
};

// Safe nested destructuring with optional chaining
const theme = user?.settings?.theme;

// Or use defaults
const { settings: { theme = "light" } = {} } = user;
```

#### Pattern 4: Renaming to Avoid Conflicts

```javascript
const response1 = { data: "first" };
const response2 = { data: "second" };

// Rename to avoid variable name conflict
const { data: data1 } = response1;
const { data: data2 } = response2;

console.log(data1); // "first"
console.log(data2); // "second"
```

#### Pattern 5: Partial Extraction

```javascript
const hugeObject = {
  id: 1,
  name: "Alice",
  // ... 100 more properties
};

// Only extract what you need
function displayUser({ id, name }) {
  console.log(`User #${id}: ${name}`);
}

displayUser(hugeObject); // Only uses id and name
```

### Destructuring Best Practices

```javascript
// ✅ DO: Use destructuring for clarity
function greet({ name, age }) {
  return `Hello ${name}, you are ${age} years old`;
}

// ❌ DON'T: Over-nest destructuring
const {
  a: {
    b: {
      c: {
        d: { e },
      },
    },
  },
} = obj; // Too complex!

// ✅ DO: Break into steps
const { a } = obj;
const { b } = a;
const { c } = b;

// ✅ DO: Provide defaults for optional properties
function createUser({ name, role = "user", isActive = true }) {
  // ...
}

// ✅ DO: Use rest to collect remaining properties
const { important1, important2, ...allOthers } = data;

// ❌ DON'T: Destructure in loops if performance matters
// BAD (creates new variables each iteration)
for (const { name, age } of users) {
  // ...
}

// BETTER (for performance-critical code)
for (const user of users) {
  const name = user.name;
  const age = user.age;
  // ...
}
```

---

## 6. Spread and Rest Operators

Both use the `...` syntax, but they serve opposite purposes.

### The Spread Operator (`...`) - Expanding

The spread operator **expands** (spreads out) elements. Think of it like unpacking a suitcase.

#### Spreading Arrays

```javascript
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];

// Combine arrays
const combined = [...arr1, ...arr2];
console.log(combined); // [1, 2, 3, 4, 5, 6]

// Add elements while spreading
const expanded = [0, ...arr1, 3.5, ...arr2, 7];
console.log(expanded); // [0, 1, 2, 3, 3.5, 4, 5, 6, 7]

// Copy array (shallow copy)
const copy = [...arr1];
copy.push(4);
console.log(arr1); // [1, 2, 3] - original unchanged
console.log(copy); // [1, 2, 3, 4]
```

#### Spreading in Function Calls

```javascript
const numbers = [5, 2, 8, 1, 9];

// Pass array elements as separate arguments
console.log(Math.max(...numbers)); // 9
// Equivalent to: Math.max(5, 2, 8, 1, 9)

// Without spread, you'd need apply
console.log(Math.max.apply(null, numbers)); // OLD WAY

// Works with any function
function greet(firstName, lastName, age) {
  return `Hello ${firstName} ${lastName}, age ${age}`;
}

const userData = ["Alice", "Johnson", 25];
console.log(greet(...userData));
// "Hello Alice Johnson, age 25"
```

#### Spreading Objects

```javascript
const user = {
  name: "Alice",
  age: 25,
};

const location = {
  city: "NYC",
  country: "USA",
};

// Combine objects
const userWithLocation = { ...user, ...location };
console.log(userWithLocation);
// { name: "Alice", age: 25, city: "NYC", country: "USA" }

// Copy object (shallow copy)
const userCopy = { ...user };
userCopy.age = 30;
console.log(user.age); // 25 - unchanged
console.log(userCopy.age); // 30

// Override properties
const defaults = {
  theme: "light",
  fontSize: 14,
  notifications: true,
};

const userSettings = {
  theme: "dark",
  fontSize: 16,
};

// Later spread wins
const finalSettings = { ...defaults, ...userSettings };
console.log(finalSettings);
// { theme: "dark", fontSize: 16, notifications: true }
```

#### Real-World Spread Examples

```javascript
// 1. Immutable array updates (React pattern)
const todos = [
  { id: 1, text: "Learn JS", done: true },
  { id: 2, text: "Build app", done: false },
];

// Add new todo immutably
const newTodos = [...todos, { id: 3, text: "Deploy", done: false }];

// Update todo immutably
const updatedTodos = todos.map((todo) =>
  todo.id === 2
    ? { ...todo, done: true } // Spread to copy, then override
    : todo
);

// 2. Immutable object updates
const user = {
  name: "Alice",
  age: 25,
  settings: {
    theme: "dark",
  },
};

// Update nested property immutably
const updatedUser = {
  ...user,
  settings: {
    ...user.settings,
    theme: "light",
  },
};

// 3. Combining API data
const response1 = await fetch("/api/users");
const response2 = await fetch("/api/posts");

const data1 = await response1.json();
const data2 = await response2.json();

const allData = {
  ...data1,
  ...data2,
  timestamp: Date.now(),
};

// 4. Removing properties (with destructuring)
const userWithPassword = {
  name: "Alice",
  email: "alice@example.com",
  password: "secret123",
};

const { password, ...safeUser } = userWithPassword;
// safeUser = { name: "Alice", email: "alice@example.com" }

// 5. Converting NodeList to Array
const divs = document.querySelectorAll("div");
const divsArray = [...divs]; // Now you can use array methods
divsArray.forEach((div) => console.log(div));

// 6. String to array of characters
const str = "Hello";
const chars = [...str];
console.log(chars); // ["H", "e", "l", "l", "o"]
```

### The Rest Operator (`...`) - Collecting

The rest operator **collects** remaining elements into an array. Think of it like packing leftovers into a container.

#### Rest in Function Parameters

```javascript
// Collect all arguments into array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

console.log(sum(1, 2));          // 3
console.log(sum(1, 2, 3, 4, 5)); // 15
console.log(sum());              // 0

// Combine with regular parameters
function multiply(multiplier, ...numbers) {
  return numbers.map(n => n * multiplier);
}

console.log(multiply(2, 1, 2, 3)); // [2, 4, 6]
console.log(multiply(10, 5, 3));   // [50, 30]

// Must be last parameter
function wrong(a, ...rest, b) {} // SyntaxError!
```

#### Rest in Array Destructuring

```javascript
const numbers = [1, 2, 3, 4, 5];

// Get first and collect rest
const [first, ...rest] = numbers;
console.log(first); // 1
console.log(rest); // [2, 3, 4, 5]

// Get first, second, and rest
const [a, b, ...others] = numbers;
console.log(a); // 1
console.log(b); // 2
console.log(others); // [3, 4, 5]

// Skip elements before rest
const [, , ...fromThird] = numbers;
console.log(fromThird); // [3, 4, 5]

// Rest captures everything remaining
const [x, ...everything] = [1];
console.log(everything); // [] - empty array, not undefined
```

#### Rest in Object Destructuring

```javascript
const user = {
  id: 1,
  name: "Alice",
  email: "alice@example.com",
  age: 25,
  city: "NYC",
};

// Extract specific props, collect rest
const { id, name, ...otherInfo } = user;
console.log(id); // 1
console.log(name); // "Alice"
console.log(otherInfo); // { email: "...", age: 25, city: "NYC" }

// Useful for component props
function UserCard({ name, avatar, ...otherProps }) {
  // Use name and avatar specifically
  // Pass everything else to child component
  return `
    <div class="user-card" ${objectToAttributes(otherProps)}>
      <img src="${avatar}" />
      <h2>${name}</h2>
    </div>
  `;
}
```

#### Real-World Rest Examples

```javascript
// 1. Flexible function arguments
function createQuery(baseUrl, ...filters) {
  const queryString = filters
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return `${baseUrl}?${queryString}`;
}

console.log(
  createQuery("/api/users", ["age", 25], ["city", "NYC"], ["active", true])
);
// "/api/users?age=25&city=NYC&active=true"

// 2. Logging with metadata
function log(level, message, ...metadata) {
  console.log(`[${level}] ${message}`);
  if (metadata.length > 0) {
    console.log("Metadata:", metadata);
  }
}

log("ERROR", "Failed to fetch", { url: "/api", status: 500 });

// 3. Removing properties from object
function omit(obj, ...keysToRemove) {
  const copy = { ...obj };
  keysToRemove.forEach((key) => delete copy[key]);
  return copy;
}

const user = { name: "Alice", age: 25, password: "secret" };
const safeUser = omit(user, "password");
console.log(safeUser); // { name: "Alice", age: 25 }

// 4. Higher-order function with extra args
function withLogging(fn) {
  return function (...args) {
    console.log(`Calling function with:`, args);
    const result = fn(...args);
    console.log(`Result:`, result);
    return result;
  };
}

const add = (a, b) => a + b;
const addWithLogging = withLogging(add);
addWithLogging(2, 3);
// Calling function with: [2, 3]
// Result: 5

// 5. Collecting all event handlers
function createButton({ text, type = "button", ...eventHandlers }) {
  const button = document.createElement("button");
  button.textContent = text;
  button.type = type;

  // Attach all event handlers
  Object.entries(eventHandlers).forEach(([event, handler]) => {
    button.addEventListener(event.replace("on", "").toLowerCase(), handler);
  });

  return button;
}

const btn = createButton({
  text: "Click me",
  onClick: () => console.log("Clicked!"),
  onMouseOver: () => console.log("Hovered!"),
  onFocus: () => console.log("Focused!"),
});
```

### Spread vs Rest - When to Use Which

```javascript
// SPREAD: When you want to EXPAND/UNPACK
// - Combining arrays
const all = [...array1, ...array2];

// - Copying arrays/objects
const copy = [...original];

// - Passing array as function arguments
Math.max(...numbers);

// - Adding properties to objects
const enhanced = { ...base, newProp: "value" };

// REST: When you want to COLLECT/GATHER
// - Function accepting unlimited arguments
function sum(...numbers) {}

// - Collecting remaining array elements
const [first, ...rest] = array;

// - Collecting remaining object properties
const { used, ...others } = object;
```

### Important Gotchas

```javascript
// 1. Shallow copy - nested objects/arrays not copied!
const original = {
  name: "Alice",
  friends: ["Bob", "Charlie"]
};

const copy = { ...original };
copy.friends.push("David");

console.log(original.friends); // ["Bob", "Charlie", "David"]
// Original was modified!

// SOLUTION: Deep copy
const deepCopy = JSON.parse(JSON.stringify(original));
// Or: structuredClone(original)

// 2. Order matters with objects
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };

console.log({ ...obj1, ...obj2 }); // { a: 1, b: 3, c: 4 } - obj2 wins
console.log({ ...obj2, ...obj1 }); // { a: 1, b: 2, c: 4 } - obj1 wins

// 3. Rest must be last
const [a, ...rest, b] = array; // SyntaxError!
const { x, ...rest, y } = obj;  // SyntaxError!

// 4. Can't spread objects into arrays or vice versa
const obj = { a: 1, b: 2 };
const arr = [...obj]; // TypeError!

// Only works with iterables
const arr = [...'hello']; // Works! ['h', 'e', 'l', 'l', 'o']
```

---

## 7. Template Literals

### What Are Template Literals?

Template literals are strings that allow embedded expressions and multi-line text. They use backticks (`) instead of quotes.

**Why use them:**

- Cleaner string interpolation
- Multi-line strings without \n
- Embed any JavaScript expression
- Tagged templates for advanced processing

### Basic String Interpolation

```javascript
const name = "Alice";
const age = 25;

// OLD WAY: String concatenation
const msg1 = "Hello, " + name + "! You are " + age + " years old.";

// NEW WAY: Template literals
const msg2 = `Hello, ${name}! You are ${age} years old.`;

console.log(msg2); // "Hello, Alice! You are 25 years old."
```

### Expressions Inside ${}

You can put **any** JavaScript expression inside ${}.

```javascript
const a = 10;
const b = 20;

// Math operations
console.log(`Sum: ${a + b}`); // "Sum: 30"
console.log(`Product: ${a * b}`); // "Product: 200"

// Function calls
function getDiscount(price) {
  return price * 0.1;
}
const price = 100;
console.log(`Discount: ${getDiscount(price)}`);
// "Discount: $10"

// Ternary operators
const age = 17;
console.log(`You are ${age >= 18 ? "an adult" : "a minor"}`);
// "You are a minor"

// Logical operators
const user = { name: "Alice" };
console.log(`Welcome, ${user.name || "Guest"}!`);
// "Welcome, Alice!"

// Array/Object methods
const numbers = [1, 2, 3, 4, 5];
console.log(`Average: ${numbers.reduce((a, b) => a + b) / numbers.length}`);
// "Average: 3"

// Template literals inside template literals
const outer = `Nested: ${`inner ${1 + 1}`}`;
console.log(outer); // "Nested: inner 2"
```

### Multi-line Strings

```javascript
// OLD WAY: Concatenation with \n
const oldWay = "Line 1\n" + "Line 2\n" + "Line 3";

// NEW WAY: Template literals preserve line breaks
const newWay = `Line 1
Line 2
Line 3`;

// Useful for HTML templates
const html = `
  <div class="card">
    <h2>Title</h2>
    <p>Description</p>
  </div>
`;

// SQL queries
const query = `
  SELECT users.name, orders.total
  FROM users
  JOIN orders ON users.id = orders.user_id
  WHERE orders.total > 100
  ORDER BY orders.total DESC
`;

// Preserves indentation
const code = `
function greet(name) {
  return \`Hello, \${name}!\`;
}
`;
```

### Real-World Template Literal Examples

```javascript
// 1. Dynamic HTML generation
function createUserCard(user) {
  return `
    <div class="user-card" data-user-id="${user.id}">
      <img src="${user.avatar}" alt="${user.name}" />
      <h3>${user.name}</h3>
      <p>${user.bio}</p>
      <span class="status ${user.isOnline ? 'online' : 'offline'}">
        ${user.isOnline ? '● Online' : '○ Offline'}
      </span>
    </div>
  `;
}

// 2. Email templates
function createWelcomeEmail(user) {
  return `
    Hi ${user.name},

    Welcome to our platform! We're excited to have you.

    Your account details:
    - Email: ${user.email}
    - Username: ${user.username}
    - Joined: ${new Date().toLocaleDateString()}

    Get started by visiting: ${process.env.APP_URL}/dashboard

    Best regards,
    The Team
  `;
}

// 3. URL building
function buildApiUrl(endpoint, params = {}) {
  const base = 'https://api.example.com';
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');

  return `${base}${endpoint}${queryString ? `?${queryString}` : ''}`;
}

console.log(buildApiUrl('/users', { age: 25, city: 'NYC' }));
// "https://api.example.com/users?age=25&city=NYC"

// 4. Console logging with formatting
function logError(error, context) {
  console.error(`
    ❌ ERROR OCCURRED
    ────────────────
    Message: ${error.message}
    Time: ${new Date().toISOString()}
    Context: ${JSON.stringify(context, null, 2)}
    Stack: ${error.stack}
  `);
}

// 5. Creating file paths
const environment = 'production';
const version = '1.2.3';
const filename = 'app.js';

const path = `/assets/${environment}/${version}/${filename}`;
console.log(path); // "/assets/production/1.2.3/app.js"

// 6. Formatted numbers and currencies
function formatPrice(amount, currency = 'USD') {
  return `${currency === 'USD' ? ' : currency} ${amount.toFixed(2)}`;
}

const cart = [
  { name: 'Laptop', price: 999.99 },
  { name: 'Mouse', price: 29.99 }
];

const receipt = `
  ──────────────────
  RECEIPT
  ──────────────────
  ${cart.map(item =>
    `${item.name.padEnd(20)} ${formatPrice(item.price)}`
  ).join('\n  ')}
  ──────────────────
  Total: ${formatPrice(cart.reduce((sum, item) => sum + item.price, 0))}
`;

console.log(receipt);
```

### Tagged Templates (Advanced)

Tagged templates allow you to parse template literals with a function.

```javascript
// The tag function receives string parts and values separately
function highlight(strings, ...values) {
  return strings.reduce((result, str, i) => {
    const value = values[i] !== undefined ? `<mark>${values[i]}</mark>` : "";
    return result + str + value;
  }, "");
}

const name = "Alice";
const age = 25;
const result = highlight`User ${name} is ${age} years old`;
console.log(result);
// "User <mark>Alice</mark> is <mark>25</mark> years old"

// Real-world: SQL query builder with escaping
function sql(strings, ...values) {
  return strings.reduce((query, str, i) => {
    const value = values[i];
    const escaped =
      typeof value === "string"
        ? `'${value.replace(/'/g, "''")}'` // Escape quotes
        : value;
    return query + str + (escaped !== undefined ? escaped : "");
  }, "");
}

const username = "'; DROP TABLE users; --";
const query = sql`SELECT * FROM users WHERE username = ${username}`;
// Safely escapes the malicious input

// Real-world: Styled components (React pattern)
function styled(strings, ...values) {
  return strings.reduce((css, str, i) => {
    const value =
      typeof values[i] === "function"
        ? values[i]() // Execute function to get value
        : values[i];
    return css + str + (value !== undefined ? value : "");
  }, "");
}

const primary = "#007bff";
const Button = styled`
  background: ${primary};
  color: white;
  padding: 10px 20px;
  border-radius: ${() => "4px"};
`;
```

### Escaping Backticks and ${}

```javascript
// Escape backtick with backslash
const str = `This is a \` backtick`;
console.log(str); // "This is a ` backtick"

// Escape ${} to prevent interpolation
const code = `Use \${variable} for interpolation`;
console.log(code); // "Use ${variable} for interpolation"

// Real example: Showing template literal syntax
const tutorial = `
  In JavaScript, use template literals like this:
  const name = "Alice";
  const greeting = \`Hello, \${name}\`;
`;
```

### Template Literal Best Practices

```javascript
// ✅ DO: Use for string interpolation
const msg = `Welcome, ${user.name}!`;

// ✅ DO: Use for multi-line strings
const html = `
  <div>
    <h1>Title</h1>
  </div>
`;

// ✅ DO: Use for complex expressions
const result = `Total: ${(price * quantity * (1 + taxRate)).toFixed(2)}`;

// ❌ DON'T: Use for simple strings with no interpolation
const simple = `Hello`; // Just use 'Hello'

// ❌ DON'T: Put too much logic in templates
const bad = `Result: ${(() => {
  // 20 lines of code here...
})()`;

// ✅ DO: Extract complex logic
const computedValue = complexCalculation();
const good = `Result: ${computedValue}`;
```

---

## 8. Modules

### What Are Modules?

Modules let you split your code into separate files, each with its own scope. They help organize code, prevent naming conflicts, and enable code reuse.

**Benefits:**

- Better code organization
- Explicit dependencies
- Avoid global namespace pollution
- Enable tree-shaking (remove unused code)
- Easier testing and maintenance

### ES6 Modules (Modern Standard)

#### Named Exports

```javascript
// math.js - Export multiple things
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export class Calculator {
  constructor() {
    this.result = 0;
  }

  add(n) {
    this.result += n;
    return this;
  }
}

// Or export all at once
const subtract = (a, b) => a - b;
const divide = (a, b) => a / b;

export { subtract, divide };
```

#### Default Exports

```javascript
// user.js - One main export per file
export default class User {
  constructor(name) {
    this.name = name;
  }
}

// Or with functions
export default function createUser(name) {
  return { name, createdAt: new Date() };
}

// Or with objects
export default {
  name: 'UserModule',
  version: '1.0.0',
  createUser() { /* ... */ }
};
```

#### Importing

```javascript
// app.js

// Import named exports
import { add, multiply, PI } from "./math.js";

// Import with alias
import { add as sum, multiply as product } from "./math.js";

// Import all as namespace
import * as MathUtils from "./math.js";
console.log(MathUtils.add(2, 3));
console.log(MathUtils.PI);

// Import default export
import User from "./user.js";
import createUser from "./user.js"; // Any name works

// Mix default and named
import Calculator, { add, PI } from "./math.js";

// Import for side effects only (runs the module)
import "./setup.js"; // Runs setup code

// Re-export (useful for index files)
export { add, multiply } from "./math.js";
export { default as User } from "./user.js";
```

#### Dynamic Imports

```javascript
// Load modules conditionally or lazily
async function loadFeature() {
  if (userWantsFeature) {
    const module = await import("./feature.js");
    module.initialize();
  }
}

// Load on demand (code splitting)
button.addEventListener("click", async () => {
  const { showModal } = await import("./modal.js");
  showModal();
});

// Conditional loading
const moduleName = isDevelopment ? "./dev.js" : "./prod.js";
const config = await import(moduleName);
```

### Module Patterns

#### Pattern 1: Index Files (Barrel Exports)

```javascript
// components/index.js - Single entry point
export { Button } from "./Button.js";
export { Input } from "./Input.js";
export { Modal } from "./Modal.js";

// Now import from one place
import { Button, Input, Modal } from "./components";
```

#### Pattern 2: Configuration Modules

```javascript
// config.js
export const API_URL = process.env.API_URL || "http://localhost:3000";
export const TIMEOUT = 5000;
export const MAX_RETRIES = 3;

export const ROUTES = {
  HOME: "/",
  USERS: "/users",
  POSTS: "/posts",
};

// Import only what you need
import { API_URL, TIMEOUT } from "./config.js";
```

#### Pattern 3: Utility Modules

```javascript
// utils.js
export function formatDate(date) {
  return new Date(date).toLocaleDateString();
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}
```

### Important Module Concepts

```javascript
// Modules have their own scope
// Variables are private unless exported
let privateVar = "secret"; // Not accessible from outside

export const publicVar = "visible"; // Can be imported

// Imports are read-only
import { value } from "./module.js";
value = 10; // Error! Cannot reassign

// Imports are live bindings
// Changes in the module affect imports
export let counter = 0;
export function increment() {
  counter++;
}

// In another file:
import { counter, increment } from "./module.js";
console.log(counter); // 0
increment();
console.log(counter); // 1 - reflects the change!

// Circular dependencies work (but be careful)
// a.js
import { b } from "./b.js";
export const a = "A";

// b.js
import { a } from "./a.js";
export const b = "B";
```

---

_Due to length constraints, I'll now provide the remaining sections (9-22) in a more condensed but complete format to ensure you have a full, usable guide:_

## 9. Scope, Closures, and Hoisting

### Scope Types

```javascript
// Global scope
const global = "accessible everywhere";

function outer() {
  // Function scope
  const functionScoped = "accessible in function";

  if (true) {
    // Block scope (let/const only)
    const blockScoped = "accessible in block";
    var notBlockScoped = "leaks out of block";
  }

  console.log(notBlockScoped); // Works - var isn't block-scoped
  console.log(blockScoped); // Error
}
```

### Closures - Functions That Remember

A closure is created when a function accesses variables from its outer scope, even after that scope has finished executing.

```javascript
function createCounter() {
  let count = 0; // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount()); // 2
console.log(counter.count); // undefined - private!
```

**Real-world: Data privacy**

```javascript
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private
  const transactions = []; // Private

  return {
    deposit(amount) {
      balance += amount;
      transactions.push({ type: "deposit", amount, date: new Date() });
      return balance;
    },

    withdraw(amount) {
      if (amount > balance) throw new Error("Insufficient funds");
      balance -= amount;
      transactions.push({ type: "withdrawal", amount, date: new Date() });
      return balance;
    },

    getBalance() {
      return balance;
    },

    getHistory() {
      return [...transactions]; // Return copy
    },
  };
}

const account = createBankAccount(1000);
account.deposit(500);
console.log(account.getBalance()); // 1500
console.log(account.balance); // undefined - private!
```

### Hoisting

JavaScript moves declarations to the top of their scope before execution.

```javascript
// Variables
console.log(x); // undefined (hoisted, not initialized)
var x = 5;

console.log(y); // ReferenceError (in Temporal Dead Zone)
let y = 10;

// Functions
sayHello(); // "Hello!" - works because function declarations are fully hoisted
function sayHello() {
  console.log("Hello!");
}

sayGoodbye(); // TypeError - function expressions not hoisted
const sayGoodbye = function () {
  console.log("Goodbye!");
};
```

---

## 10. Asynchronous JavaScript

### Callbacks

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: "Alice" };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data.name); // "Alice" after 1 second
});
```

**Callback Hell:**

```javascript
// Deeply nested callbacks - hard to read!
getData(function (a) {
  getMoreData(a, function (b) {
    getMoreData(b, function (c) {
      getMoreData(c, function (d) {
        console.log(d);
      });
    });
  });
});
```

---

## 11. Promises

Promises represent eventual completion (or failure) of an asynchronous operation.

```javascript
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = true;
    if (success) {
      resolve("Data loaded");
    } else {
      reject(new Error("Failed"));
    }
  }, 1000);
});

promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error))
  .finally(() => console.log("Cleanup"));
```

### Promise Combinators

```javascript
// Promise.all - wait for all (fails if any fails)
const [users, posts] = await Promise.all([
  fetch("/api/users"),
  fetch("/api/posts"),
]);

// Promise.allSettled - wait for all, get all results
const results = await Promise.allSettled([
  fetch("/api/users"),
  fetch("/api/might-fail"),
]);

// Promise.race - first to complete wins
const fastest = await Promise.race([fetch("/server1"), fetch("/server2")]);

// Promise.any - first to succeed wins
const firstSuccess = await Promise.any([fetch("/primary"), fetch("/backup")]);
```

---

## 12. Async/Await

Syntactic sugar over promises, making async code look synchronous.

```javascript
async function getUserData() {
  try {
    const response = await fetch("/api/user");
    const user = await response.json();

    const postsResponse = await fetch(`/api/posts/${user.id}`);
    const posts = await postsResponse.json();

    return { user, posts };
  } catch (error) {
    console.error("Failed:", error);
    throw error;
  }
}

// Parallel execution
async function loadDashboard() {
  const [users, stats, notifications] = await Promise.all([
    fetchUsers(),
    fetchStats(),
    fetchNotifications(),
  ]);

  return { users, stats, notifications };
}
```

---

## 13. Regular Expressions

Patterns for matching text.

```javascript
// Basic patterns
/hello/.test("hello world"); // true

// Special characters
\d  // digit
\w  // word character
\s  // whitespace
.   // any character
^   // start of string
$   // end of string

// Quantifiers
*   // 0 or more
+   // 1 or more
?   // 0 or 1
{3} // exactly 3

// Common patterns
const email = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
const phone = /^\d{3}-\d{3}-\d{4}$/;
const url = /^https?:\/\//;

// Methods
"test@example.com".match(email); // Match
"hello world".replace(/world/, "JS"); // Replace
"a,b,c".split(/,/); // Split
```

---

## 14. Map, Set, WeakMap, WeakSet

### Map - Key-Value with Any Key Type

```javascript
const map = new Map();

map.set("name", "Alice");
map.set(1, "one");
map.set({ key: "obj" }, "value");

console.log(map.get("name")); // "Alice"
console.log(map.has(1)); // true
console.log(map.size); // 3

for (const [key, value] of map) {
  console.log(key, value);
}
```

### Set - Unique Values

```javascript
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [1, 2, 3] - duplicates removed

set.add(4);
set.has(2); // true
set.delete(1);
console.log(set.size); // 3
```

---

## 15. Symbols

Unique identifiers.

```javascript
const id = Symbol("id");
const user = {
  name: "Alice",
  [id]: 12345, // Hidden from normal iteration
};

console.log(user[id]); // 12345
console.log(Object.keys(user)); // ["name"] - symbol hidden
```

---

## 16. Iterators and Generators

### Generators - Pausable Functions

```javascript
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();
console.log(gen.next().value); // 1
console.log(gen.next().value); // 2

// Infinite sequence
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}
```

---

## 17. Dates and Time

```javascript
const now = new Date();
const specific = new Date("2024-12-25");

// Getting components
now.getFullYear(); // 2024
now.getMonth(); // 0-11 (0 = January!)
now.getDate(); // 1-31
now.getDay(); // 0-6 (0 = Sunday)
now.getHours(); // 0-23

// Formatting
now.toDateString(); // "Wed Nov 23 2025"
now.toLocaleDateString("en-US"); // "11/23/2025"

// Intl.DateTimeFormat (best)
new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
}).format(now); // "November 23, 2025"
```

---

## 18. Events

```javascript
// Add event listener
element.addEventListener("click", (e) => {
  console.log("Clicked!", e.target);
});

// Event delegation (efficient for many elements)
document.querySelector(".list").addEventListener("click", (e) => {
  if (e.target.classList.contains("item")) {
    console.log("Item clicked:", e.target);
  }
});

// Custom events
const event = new CustomEvent("userLoggedIn", {
  detail: { userId: 123 },
});
document.dispatchEvent(event);

document.addEventListener("userLoggedIn", (e) => {
  console.log("User:", e.detail.userId);
});
```

---

## 19. Web Storage

```javascript
// localStorage - persists forever
localStorage.setItem("theme", "dark");
const theme = localStorage.getItem("theme");
localStorage.removeItem("theme");
localStorage.clear();

// sessionStorage - clears on tab close
sessionStorage.setItem("tempData", "value");

// Store objects (must stringify)
const user = { name: "Alice", age: 25 };
localStorage.setItem("user", JSON.stringify(user));
const retrieved = JSON.parse(localStorage.getItem("user"));
```

---

## 20. Strict Mode

```javascript
"use strict";

// Catches common mistakes:
x = 10; // Error: must declare variable
delete Object.prototype; // Error
function fn(a, a) {} // Error: duplicate params
```

---

## 21. Debugging

```javascript
// Console methods
console.log("Basic log");
console.error("Error message");
console.warn("Warning");
console.table([{ name: "Alice" }, { name: "Bob" }]);

// Groups
console.group("User Details");
console.log("Name: Alice");
console.groupEnd();

// Timing
console.time("operation");
// ... code ...
console.timeEnd("operation");

// Debugger
debugger; // Pauses execution if DevTools open

// Assertions
console.assert(1 === 2, "This will show");
```

---

## 22. Best Practices

```javascript
// Use const by default, let when needed, never var
const MAX = 100;
let count = 0;

// Use meaningful names
const activeUsers = getUsers().filter((u) => u.active); // Good
const au = getUsers().filter((u) => u.active); // Bad

// Use template literals
const msg = `Hello ${name}`; // Good
const msg = "Hello " + name; // Avoid

// Use destructuring
const { name, age } = user; // Good

// Use arrow functions for callbacks
arr.map((x) => x * 2); // Good

// Handle errors
try {
  const data = await fetchData();
} catch (error) {
  console.error("Failed:", error);
  throw error; // Don't swallow errors
}

// Avoid nested callbacks
// Use async/await instead

// Keep functions small and focused
// One function = one purpose

// Use modules to organize code
// Separate concerns into different files
```

---

## Quick Reference

### Must-Know Concepts

- **`this`**: Context-dependent (object method, arrow function, etc.)
- **Closures**: Functions remembering outer scope
- **Prototypes**: Inheritance mechanism
- **Promises/Async-Await**: Handling asynchronous operations
- **Destructuring**: Unpacking values
- **Spread/Rest**: Expanding/collecting elements
- **Modules**: Code organization

### Common Patterns

```javascript
// Factory function
function createUser(name) {
  return { name, createdAt: new Date() };
}

// Module pattern
const Module = (function () {
  let private = "secret";
  return {
    public: () => console.log(private),
  };
})();

// Singleton
class Database {
  static instance = null;
  static getInstance() {
    if (!this.instance) {
      this.instance = new Database();
    }
    return this.instance;
  }
}
```

---

**End of Guide**

This covers all advanced JavaScript concepts with practical examples. Practice these concepts by building real projects!
