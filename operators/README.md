# JavaScript Operators Reference

A comprehensive guide to all JavaScript operators with detailed explanations of how they work and what they do.

## 1. Arithmetic Operators

### Addition `+`

**What it does:** Adds two numbers together or concatenates strings.

**How it works:**

- When both operands are numbers, it performs mathematical addition
- When one or both operands are strings, it converts everything to strings and concatenates them
- JavaScript automatically coerces types when needed

**Examples:**

```javascript
10 + 5; // 15 - adds two numbers
"Hello " + "World"; // "Hello World" - concatenates strings
10 + "5"; // "105" - converts number to string and concatenates
```

### Subtraction `-`

**What it does:** Subtracts the second number from the first.

**How it works:**

- Performs mathematical subtraction
- Automatically converts strings to numbers if possible
- If conversion fails, returns `NaN` (Not a Number)

**Examples:**

```javascript
10 - 5; // 5 - basic subtraction
"10" - 5; // 5 - string "10" is converted to number 10
"hello" - 5; // NaN - can't convert "hello" to a number
```

### Multiplication `*`

**What it does:** Multiplies two numbers together.

**How it works:**

- Performs mathematical multiplication
- Converts non-numeric values to numbers before multiplying
- Special cases: multiplying by `Infinity` or `0` follows mathematical rules

**Examples:**

```javascript
10 * 2; // 20
"5" * 2; // 10 - string "5" converted to number
true * 5; // 5 - true converts to 1
```

### Division `/`

**What it does:** Divides the first number by the second.

**How it works:**

- Performs mathematical division
- Division by zero returns `Infinity` (not an error in JavaScript)
- Returns floating-point results, not integers

**Examples:**

```javascript
10 / 2; // 5
10 / 3; // 3.3333333333333335
10 / 0 - // Infinity
  10 / 0; // -Infinity
```

### Modulus `%` (remainder)

**What it does:** Returns the remainder after division.

**How it works:**

- Divides the first number by the second
- Returns what's left over after division
- The sign of the result matches the sign of the dividend (first number)

**Examples:**

```javascript
10 % 3; // 1 - 10 divided by 3 is 3 with remainder 1
17 % 5; // 2
10 % 2; // 0 - no remainder, so 10 is even
```

**Common uses:**

- **Odd/even checking:** `n % 2 === 0` means even
- **Looping patterns:** Create repeating cycles
- **Circle rotations:** Keep angles within 0-360 degrees

### Exponentiation `**`

**What it does:** Raises the first number to the power of the second.

**How it works:**

- Calculates base raised to the exponent
- More readable alternative to `Math.pow(base, exponent)`
- Right-associative: `2 ** 3 ** 2` equals `2 ** (3 ** 2)`

**Examples:**

```javascript
2 ** 3; // 8 (2 × 2 × 2)
5 ** 2; // 25
10 ** -1; // 0.1 (negative exponent creates fraction)
```

### Unary `+` and `-`

**What it does:** Converts values to numbers (unary `+`) or negates them (unary `-`).

**How it works:**

- Unary `+` attempts to convert the operand to a number
- Unary `-` converts to number and negates it
- Works with booleans, strings, and other types

**Examples:**

```javascript
+"5" - // 5 - string converted to number
  "5" + // -5 - converted and negated
  true + // 1 - true converts to 1
  false + // 0 - false converts to 0
  "hello"; // NaN - can't convert to number
```

## 2. Assignment Operators

### Basic Assignment `=`

**What it does:** Assigns a value to a variable.

**How it works:**

- Takes the value on the right
- Stores it in the variable on the left
- Returns the assigned value (allows chaining)

**Examples:**

```javascript
x = 10; // x is now 10
y = x = 5; // Both x and y are 5
const z = (x = 20); // x is 20, z is 20
```

### Compound Assignments

**What they do:** Perform an operation and assign the result in one step.

**How they work:**

- Shorthand for `x = x operator value`
- More concise and slightly more efficient
- Work with all arithmetic operators

**Examples:**

```javascript
x += 2; // Same as: x = x + 2
x -= 2; // Same as: x = x - 2
x *= 2; // Same as: x = x * 2
x /= 2; // Same as: x = x / 2
x %= 2; // Same as: x = x % 2
x **= 2; // Same as: x = x ** 2
```

## 3. Comparison Operators

### Greater than `>`

**What it does:** Checks if the left value is greater than the right value.

**How it works:**

- Compares two values numerically
- Converts strings to numbers when comparing with numbers
- Returns `true` or `false`

**Examples:**

```javascript
10 > 5; // true
5 > 10; // false
"10" > 5; // true - string "10" converted to number
```

### Less than `<`

**What it does:** Checks if the left value is less than the right value.

**How it works:**

- Opposite of greater than
- Follows same conversion rules
- Returns boolean result

**Examples:**

```javascript
3 < 10; // true
10 < 5; // false
"2" < 5; // true
```

### Greater or equal `>=`

**What it does:** Checks if the left value is greater than or equal to the right value.

**How it works:**

- Returns `true` if left is greater OR equal
- Combines `>` and `==` logic
- Uses type coercion like other comparison operators

**Examples:**

```javascript
10 >= 10; // true (equal)
10 >= 5; // true (greater)
5 >= 10; // false
```

### Less or equal `<=`

**What it does:** Checks if the left value is less than or equal to the right value.

**How it works:**

- Returns `true` if left is less OR equal
- Mirror of `>=` operator
- Type coercion applies

**Examples:**

```javascript
5 <= 5; // true (equal)
3 <= 10; // true (less)
10 <= 5; // false
```

### Not equal `!=` (loose, avoid)

**What it does:** Checks if two values are NOT equal, with type coercion.

**How it works:**

- Compares values after converting them to the same type
- Can lead to unexpected results
- Generally avoid in favor of `!==`

**Examples:**

```javascript
10 != "10"; // false - types coerced, values equal
10 != 5; // true
0 != false; // false - both coerce to same value
```

### Strict not equal `!==` (recommended)

**What it does:** Checks if two values are NOT equal, without type coercion.

**How it works:**

- Compares both value AND type
- Returns `true` if either value or type differs
- Safer and more predictable than `!=`

**Examples:**

```javascript
10 !== "10"; // true - different types
10 !== 10; // false - same value and type
0 !== false; // true - different types
```

## 4. Logical Operators

### AND `&&`

**What it does:** Returns the first falsy value, or the last value if all are truthy.

**How it works:**

- Evaluates from left to right
- Stops at the first falsy value (short-circuits)
- Returns that falsy value or the last value
- Doesn't convert to boolean automatically

**Falsy values in JavaScript:** `false`, `0`, `""`, `null`, `undefined`, `NaN`

**Examples:**

```javascript
true && 5; // 5 - true is truthy, returns second value
false && 5; // false - stops at first falsy value
"hello" && 10; // 10 - both truthy, returns last
0 && "anything"; // 0 - stops at falsy 0
null && "won't run"; // null - short-circuits
```

**Common uses:**

```javascript
// Conditional execution
isLoggedIn && redirectToProfile();

// Safe property access
user && user.name;

// Chaining conditions
age >= 18 && hasLicense && allowedToDrive();
```

### OR `||`

**What it does:** Returns the first truthy value, or the last value if all are falsy.

**How it works:**

- Evaluates from left to right
- Stops at the first truthy value (short-circuits)
- Returns that truthy value or the last value
- Used for default values and fallbacks

**Examples:**

```javascript
0 || 5; // 5 - 0 is falsy, returns 5
"" || "hello"; // "hello" - empty string is falsy
false || 10; // 10
true || "not used"; // true - short-circuits
null || undefined || "default"; // "default"
```

**Common uses:**

```javascript
// Default values
const name = userName || "Guest";

// Fallback chain
const value = fromAPI || fromCache || defaultValue;

// First valid option
const port = process.env.PORT || 3000;
```

### NOT `!`

**What it does:** Converts a value to boolean and inverts it.

**How it works:**

- First converts the value to boolean
- Then flips `true` to `false` and vice versa
- Truthy values become `false`, falsy values become `true`

**Examples:**

```javascript
!true; // false
!false; // true
!0; // true - 0 is falsy
!"hey"; // false - non-empty string is truthy
!""; // true - empty string is falsy
!null; // true
```

**Double NOT `!!` - Convert to boolean:**

**What it does:** Converts any value to its boolean equivalent.

**How it works:**

- First `!` converts to boolean and inverts
- Second `!` inverts back to original boolean meaning
- Useful for explicitly converting to boolean

**Examples:**

```javascript
!!"hi"; // true - truthy value
!!0; // false - falsy value
!!100; // true
!!""; // false
```

## 5. Nullish Coalescing Operator `??`

**What it does:** Returns the right value ONLY if the left side is `null` or `undefined`.

**How it works:**

- Checks specifically for `null` or `undefined`
- Ignores other falsy values like `0`, `false`, `""`
- More precise than `||` for default values
- Prevents bugs when `0` or `""` are valid values

**Examples:**

```javascript
null ?? 10; // 10 - null triggers fallback
undefined ?? 20; // 20 - undefined triggers fallback
0 ?? 30; // 0 - zero is NOT null/undefined
"" ?? "hello"; // "" - empty string is kept
false ?? true; // false - false is kept
```

**Why it's important:**

**Problem with `||`:**

```javascript
const count = 0;
const result = count || 10; // 10 - wrong! 0 is valid
```

**Solution with `??`:**

```javascript
const count = 0;
const result = count ?? 10; // 0 - correct!
```

**Common uses:**

```javascript
// User settings with defaults
const volume = userVolume ?? 50; // 0 volume is valid

// Optional configuration
const timeout = config.timeout ?? 3000;

// API responses
const data = response.data ?? [];
```

## 6. Optional Chaining `?.`

**What it does:** Safely accesses nested properties without errors if something is `null` or `undefined`.

**How it works:**

- Checks if the left side is `null` or `undefined`
- If yes, stops and returns `undefined` (no error thrown)
- If no, continues accessing the property
- Can chain multiple levels deep

**Examples:**

```javascript
// Without optional chaining (risky):
const city = user.address.city; // Error if address is undefined

// With optional chaining (safe):
const city = user?.address?.city; // undefined if address is missing

// More examples:
user?.name; // undefined if user is null
users?.[0]; // undefined if users is null
obj?.method(); // undefined if obj is null
obj?.method?.(); // undefined if method doesn't exist
```

**Common use cases:**

```javascript
// API responses
const userName = apiResponse?.data?.user?.name;

// Optional callbacks
onSuccess?.(); // Only calls if onSuccess exists

// Array access
const firstItem = items?.[0];

// Nested objects
const street = company?.headquarters?.address?.street;
```

**Useful for:**

- API data that might be incomplete
- Deeply nested objects
- Optional fields in configurations
- Preventing "Cannot read property of undefined" errors

## 7. Spread Operator `...`

**What it does:** Expands or "spreads" an iterable (array, object, string) into individual elements.

**How it works:**

- Takes an array or object
- Unpacks all elements/properties
- Places them in a new location
- Creates shallow copies

### Spread in arrays:

**What it does:** Copies array elements or combines arrays.

**Examples:**

```javascript
const arr = [1, 2, 3];
const newArr = [...arr, 4, 5]; // [1, 2, 3, 4, 5]

// Copying arrays
const copy = [...arr]; // Creates new array

// Combining arrays
const combined = [...arr1, ...arr2, ...arr3];

// Array cloning
const original = [1, 2, 3];
const clone = [...original]; // Independent copy
```

### Spread in objects:

**What it does:** Copies object properties or merges objects.

**Examples:**

```javascript
const obj = { a: 1, b: 2 };
const newObj = { ...obj, c: 3 }; // { a: 1, b: 2, c: 3 }

// Merging objects
const merged = { ...obj1, ...obj2 };

// Overriding properties
const updated = { ...user, age: 30 }; // Updates age

// Creating copies
const copy = { ...original };
```

### Spread in function arguments:

**What it does:** Passes array elements as individual arguments.

**Examples:**

```javascript
const numbers = [1, 5, 3, 9, 2];
Math.max(...numbers); // 9 - same as Math.max(1, 5, 3, 9, 2)

// Without spread (doesn't work):
Math.max(numbers); // NaN - can't find max of array itself

// Spreading strings
const chars = [..."hello"]; // ['h', 'e', 'l', 'l', 'o']
```

## 8. Rest Operator `...`

**What it does:** Collects multiple elements into an array (opposite of spread).

**How it works:**

- Looks identical to spread operator
- Different purpose: gathers instead of spreads
- Must be the last parameter
- Creates an array from remaining elements

### Collect function arguments:

**What it does:** Gathers all arguments into an array.

**Examples:**

```javascript
function add(...nums) {
  return nums.reduce((a, b) => a + b);
}

add(1, 2, 3, 4); // 10
add(5, 10); // 15

// Mixed with regular parameters
function greet(greeting, ...names) {
  return `${greeting} ${names.join(", ")}`;
}

greet("Hello", "Alice", "Bob", "Charlie");
// "Hello Alice, Bob, Charlie"
```

### Rest in destructuring:

**What it does:** Collects remaining properties into an object or array.

**Array destructuring:**

```javascript
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1
// second = 2
// rest = [3, 4, 5]
```

**Object destructuring:**

```javascript
const { a, b, ...rest } = { a: 1, b: 2, c: 3, d: 4 };
// a = 1
// b = 2
// rest = { c: 3, d: 4 }
```

**Key difference from spread:**

- **Spread** = unpacks (expands)
- **Rest** = packs (collects)

## 9. Ternary Operator `? :`

**What it does:** Provides a shorthand for `if/else` statements.

**How it works:**

- Evaluates a condition
- Returns first value if condition is `true`
- Returns second value if condition is `false`
- Can be nested but becomes hard to read

**Syntax:**

```
condition ? valueIfTrue : valueIfFalse
```

**Examples:**

```javascript
const age = 20;
const status = age >= 18 ? "Adult" : "Minor"; // "Adult"

// In assignments
const price = isMember ? 10 : 20;

// In return statements
return isValid ? data : null;

// Inline rendering
<div>{isLoggedIn ? <Profile /> : <Login />}</div>;

// Nested (use sparingly)
const result = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";
```

**When to use:**

- Simple conditional assignments
- Inline conditional rendering
- When readability isn't compromised

**When NOT to use:**

- Complex conditions
- Multiple statements in branches
- When an if/else is clearer

## 10. The `typeof` Operator

**What it does:** Returns a string indicating the type of a value.

**How it works:**

- Evaluates the operand
- Returns one of several predefined strings
- Always returns a string (lowercase)
- Has some quirks (like `typeof null`)

**Examples:**

```javascript
typeof 10; // "number"
typeof "hi"; // "string"
typeof true; // "boolean"
typeof {}; // "object"
typeof []; // "object" (arrays are objects)
typeof null; // "object" (historical bug in JS)
typeof undefined; // "undefined"
typeof function () {}; // "function"
typeof Symbol(); // "symbol"
typeof 10n; // "bigint"
```

**Common uses:**

```javascript
// Type checking before operations
if (typeof value === "string") {
  console.log(value.toUpperCase());
}

// Checking if variable is defined
if (typeof myVar !== "undefined") {
  // Use myVar
}

// Validating function arguments
function process(callback) {
  if (typeof callback === "function") {
    callback();
  }
}
```

**Important quirks:**

- `typeof null` returns `"object"` (known bug, kept for compatibility)
- Arrays return `"object"`, use `Array.isArray()` instead
- Functions return `"function"` even though they're objects

## 11. `instanceof` Operator

**What it does:** Checks if an object was created by a specific constructor or class.

**How it works:**

- Tests if an object's prototype chain includes the constructor's prototype
- Returns `true` or `false`
- Works with built-in and custom classes
- More specific than `typeof` for objects

**Examples:**

```javascript
// Built-in types
const arr = [1, 2, 3];
arr instanceof Array; // true
arr instanceof Object; // true (inheritance)

const date = new Date();
date instanceof Date; // true
date instanceof Object; // true

// Custom classes
class User {
  constructor(name) {
    this.name = name;
  }
}

const user = new User("Alice");
user instanceof User; // true
user instanceof Object; // true

// Primitives
5 instanceof Number; // false (primitives aren't objects)
"hello" instanceof String; // false
```

**When to use:**

```javascript
// Differentiating object types
if (value instanceof Array) {
  value.push(item);
} else if (value instanceof Set) {
  value.add(item);
}

// Checking error types
try {
  // code
} catch (error) {
  if (error instanceof TypeError) {
    // Handle type error
  }
}

// Validating custom objects
function processUser(obj) {
  if (obj instanceof User) {
    // Process user
  }
}
```

## 12. Unary Operators: `delete`, `void`

### `delete` Operator

**What it does:** Removes a property from an object.

**How it works:**

- Removes the specified property
- Returns `true` if deletion successful
- Returns `false` if property can't be deleted
- Does NOT delete variables or functions

**Examples:**

```javascript
const user = {
  name: "Ankit",
  age: 20,
  email: "ankit@example.com",
};

delete user.age; // true
console.log(user); // { name: "Ankit", email: "ankit@example.com" }

// Can't delete variables
let x = 10;
delete x; // false (in strict mode, throws error)

// Can delete array elements (leaves hole)
const arr = [1, 2, 3];
delete arr[1];
console.log(arr); // [1, empty, 3]
console.log(arr.length); // 3 (length unchanged)
```

**Important notes:**

- Only works on object properties
- Creates "holes" in arrays (use `splice()` instead)
- Can't delete non-configurable properties
- Use with caution - removing properties can break code

### `void` Operator

**What it does:** Evaluates an expression and returns `undefined`.

**How it works:**

- Evaluates the expression after it
- Discards the result
- Always returns `undefined`
- Rarely used in modern JavaScript

**Examples:**

```javascript
void 0                    // undefined
void (1 + 1)              // undefined (still calculates, but returns undefined)
void console.log("hi")    // prints "hi", returns undefined

// Historical use in links (rarely needed now)
<a href="javascript:void(0)">Click me</a>

// Getting undefined safely
const undefinedValue = void 0;  // Guaranteed undefined
```

**When used:**

- Getting pure `undefined` (though `undefined` keyword works now)
- Old-style bookmarklets
- Preventing page navigation in old HTML
- Very rare in modern code

## 13. The `in` Operator

**What it does:** Checks if a property or index exists in an object or array.

**How it works:**

- Returns `true` if property exists (even if value is `undefined`)
- Returns `false` if property doesn't exist
- Checks own properties and inherited properties
- Works with objects, arrays, and strings

**Examples:**

```javascript
// Objects
const user = { name: "Ankit", age: 20 };
"name" in user; // true
"email" in user; // false
"toString" in user; // true (inherited from Object)

// Arrays (checks indexes)
const arr = [10, 20, 30];
0 in arr; // true
2 in arr; // true
5 in arr; // false
"length" in arr; // true

// Checking for undefined vs non-existent
const obj = { prop: undefined };
"prop" in obj; // true (property exists)
obj.prop !== undefined; // false (value is undefined)
```

**Common uses:**

```javascript
// Feature detection
if ("geolocation" in navigator) {
  // Use geolocation
}

// Safe property checking
if ("optionalProp" in config) {
  // Use the property
}

// Checking array indices
if (index in myArray) {
  // Index exists
}
```

**Difference from `hasOwnProperty()`:**

- `in` checks inherited properties too
- `hasOwnProperty()` only checks own properties

## 14. The `new` Operator

**What it does:** Creates a new instance of an object from a constructor function or class.

**How it works:**

1. Creates a new empty object
2. Sets the object's prototype to the constructor's prototype
3. Executes the constructor with `this` bound to the new object
4. Returns the new object (unless constructor returns an object)

**Examples:**

```javascript
// With classes
class User {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
}

const user = new User("Alice", 25);
// Creates: { name: "Alice", age: 25 }

// With built-in constructors
const date = new Date();
const regex = new RegExp("\\d+");
const arr = new Array(5);
const map = new Map();

// With constructor functions
function Car(make, model) {
  this.make = make;
  this.model = model;
}

const myCar = new Car("Toyota", "Camry");
```

**Used with:**

- **Classes:** `new MyClass()`
- **Dates:** `new Date()`
- **Regular expressions:** `new RegExp()`
- **Built-in objects:** `new Map()`, `new Set()`, `new Promise()`
- **Custom constructors:** Any function designed as a constructor

**What happens without `new`:**

```javascript
// Without new - THIS IS WRONG
const user = User("Alice", 25); // undefined
// 'this' refers to global object or undefined (strict mode)

// With new - CORRECT
const user = new User("Alice", 25); // Proper object creation
```

**Common uses:**

```javascript
// Creating instances
const users = [new User("Alice", 25), new User("Bob", 30)];

// Date manipulation
const now = new Date();
const tomorrow = new Date(now.getTime() + 86400000);

// Data structures
const mySet = new Set([1, 2, 3]);
const myMap = new Map([["key", "value"]]);

// Custom objects
const game = new Game({
  width: 800,
  height: 600,
});
```

## Complete Operator Checklist

### Arithmetic Operators

- `+` Addition/Concatenation
- `-` Subtraction
- `*` Multiplication
- `/` Division
- `%` Modulus (remainder)
- `**` Exponentiation
- `++` Increment
- `--` Decrement

### Assignment Operators

- `=` Assignment
- `+=` Add and assign
- `-=` Subtract and assign
- `*=` Multiply and assign
- `/=` Divide and assign
- `%=` Modulus and assign
- `**=` Exponentiate and assign

### Comparison Operators

- `>` Greater than
- `<` Less than
- `>=` Greater than or equal
- `<=` Less than or equal
- `==` Loose equality (avoid)
- `===` Strict equality
- `!=` Loose inequality (avoid)
- `!==` Strict inequality

### Logical Operators

- `&&` Logical AND
- `||` Logical OR
- `!` Logical NOT
- `??` Nullish coalescing

### Other Operators

- `?.` Optional chaining
- `...` Spread/Rest operator
- `? :` Ternary/conditional operator
- `typeof` Type checking
- `instanceof` Instance checking
- `in` Property checking
- `delete` Property deletion
- `new` Object instantiation
- `void` Return undefined

---

## Summary

JavaScript operators are the building blocks of expressions and logic in your code. Understanding how each operator works—not just its syntax but its behavior with different types—is crucial for writing robust JavaScript applications.

Key takeaways:

- Use `===` and `!==` instead of `==` and `!=` for predictable comparisons
- Prefer `??` over `||` when `0` or `""` are valid values
- Use optional chaining `?.` to safely access nested properties
- Understand the difference between spread (unpacking) and rest (collecting)
- Remember that `typeof null` returns `"object"` (historical quirk)
- Use `instanceof` for checking object types, not `typeof`
