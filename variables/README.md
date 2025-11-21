# JavaScript Naming Conventions Guide

A comprehensive guide to writing clean, professional JavaScript code through proper variable and function naming.

---

## 📋 Table of Contents

1. [Legal Rules](#legal-rules)
2. [Best Practices](#best-practices)
3. [Naming Patterns](#naming-patterns)
4. [Common Mistakes to Avoid](#common-mistakes-to-avoid)
5. [Quick Checklist](#quick-checklist)

---

## Legal Rules (JavaScript Syntax Rules)

These are the mandatory rules JavaScript enforces. Breaking these will cause errors.

### Valid Characters

You can use:

- **A–Z** and **a–z** (letters)
- **0–9** (numbers, but NOT at the start)
- **\_** (underscore)
- **$** (dollar sign)

**Examples:**

```javascript
let name; // correct
let user1; // correct
let _private; // correct
let $value; // correct
```

### Invalid Characters & Patterns

**Cannot start with a number:**

```javascript
let 1num;        // Error
```

**No spaces allowed:**

```javascript
let first name;  // Error
let firstName;   // Use camelCase instead
```

**No special characters:**

```javascript
let user@name;   // No @, #, -, %, *, /, etc.
```

**Cannot use reserved keywords:**

```javascript
let var;         // Reserved keyword
let let;         // Reserved keyword
let class;       // Reserved keyword
let function;    // Reserved keyword
let import;      // Reserved keyword
```

---

## Best Practices (Senior-Level Naming Rules)

These practices make your code clean, readable, and professional.

### Rule A: Use camelCase for Variables

The standard convention in JavaScript is camelCase, where the first word is lowercase and subsequent words are capitalized.

```javascript
let userName;
let totalPrice;
let isLoggedIn;
```

### Rule B: Name Must Describe the Purpose

A variable's name should tell the next developer: _"What are you storing here?"_

**Bad:**

```javascript
let a;
let data;
let value1;
```

**Good:**

```javascript
let userAge;
let productList;
let isUserLoggedIn;
```

### Rule C: Booleans Should Start with Specific Keywords

Start boolean variables with `is`, `has`, `can`, or `should` to make their purpose immediately clear.

```javascript
let isValid; // is → describes state
let hasAccess; // has → describes possession
let canDelete; // can → describes ability
let shouldRetry; // should → describes action
```

### Rule D: Arrays Should Have Plural Names

Using plural names instantly communicates that a variable holds a list.

**Bad:**

```javascript
let user;
```

**Good:**

```javascript
let users;
let items;
let messages;
```

### Rule E: Constants Must Be ALL_CAPS (Only for True Constants)

Use ALL_CAPS only for values that never change throughout your application.

```javascript
const MAX_USERS = 50;
const API_URL = "https://example.com";
const DEFAULT_TIMEOUT = 5000;
```

For regular constant variables, use camelCase instead:

```javascript
const userName = "ankit";
const productName = "Laptop";
```

### Rule F: Use Nouns for Variables, Verbs for Functions

Variables store data (nouns), functions perform actions (verbs).

**Variables (nouns):**

```javascript
let userToken;
let cartItems;
let price;
```

**Functions (verbs):**

```javascript
function getUser() {}
function updatePrice() {}
function fetchData() {}
function validateEmail() {}
```

### Rule G: Avoid One-Letter Variables

Exception: Single letters are acceptable in loops.

**Bad:**

```javascript
let x = 10;
let y = 20;
```

**Good:**

```javascript
let count = 10;
let total = 20;
```

**Acceptable (in loops):**

```javascript
for (let i = 0; i < 10; i++) {}
```

### Rule H: One Variable = One Thing (No Mixed Meaning)

Be clear and specific about what each variable represents.

**Bad:**

```javascript
let user; // Sometimes it's an object, sometimes an ID
```

**Good:**

```javascript
let userId;
let userDetails;
let userName;
```

---

## Naming Patterns Used by Professional JS Developers

### 1. camelCase

Used for regular variables and function names.

```javascript
let myVariableName;
function getUserData() {}
```

### 2. PascalCase

Used for class and constructor names.

```javascript
class UserAccount {}
class ShoppingCart {}
```

### 3. snake_case

Rarely used in JavaScript, but acceptable in JSON and configuration files.

```javascript
// Avoid in JS:
let user_name;  // wrong

// OK in JSON:
{ "user_name": "john" }  // correct
```

### 4. kebab-case

Never use for JavaScript variables. Only appropriate for file names and CSS classes.

```javascript
// Wrong:
let user-name;

// Correct usage (file names):
user-profile.js
user-settings.css
```

---

## Common Mistakes to Avoid

### Too Ambiguous

```javascript
let temp; // What's temporary?
let stuff; // What stuff?
let thing; // What thing?
```

### Too Short

```javascript
let d;
let n;
let x;
```

### Too Long

```javascript
let userNameForTheCurrentlyLoggedInUserWhoIsAuthenticated;
```

### Repeating Type Names

```javascript
let userArray = []; // Unnecessary
let userListArray = []; // Terrible

// Better:
let users = []; // correct
```

---

## Quick Checklist

Before naming a variable or function, verify:

- [ ] Must start with letter, `$`, or `_`
- [ ] Must not be a reserved keyword
- [ ] Use camelCase for variables and functions
- [ ] Name describes the purpose clearly
- [ ] Boolean? Starts with `is`, `has`, `can`, or `should`
- [ ] Array? Use plural name
- [ ] Variable? Use nouns
- [ ] Function? Use verbs
- [ ] Avoid magic/generic names (temp, data, stuff)
- [ ] Avoid extremely long names
- [ ] Avoid repeating type information (Array, String, etc.)

---

## Additional Tips

- **Consistency matters:** If you use one naming style, stick with it across the entire project
- **Context is key:** Consider other developers (or your future self) reading your code
- **Readability over brevity:** A longer, clear name is always better than a short, ambiguous one
- **IDE autocomplete:** Use meaningful names so your IDE can provide better autocomplete suggestions

---

## Example: Good vs Bad Naming

### Bad Code:

```javascript
let d = new Date();
let u = { id: 1, nm: "John" };
let temp = [];
let v = 100;
```

### Good Code:

```javascript
let currentDate = new Date();
let userDetails = { id: 1, name: "John" };
let filteredUsers = [];
let totalPrice = 100;
```

---
