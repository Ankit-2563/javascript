# DOM Manipulation

## Introduction

The DOM (Document Object Model) is how JavaScript talks to your webpage. When you want to change text, hide a button, or respond to a click, you're working with the DOM.

Think of HTML as a blueprint and the DOM as the actual house that JavaScript can renovate while people are living in it.

---

## Part 1: What is the DOM?

### 1.1 Simple Definition

**DOM stands for Document Object Model.**

Here's what happens:

1. You write HTML code (a text file)
2. Browser reads your HTML
3. Browser creates a JavaScript object tree from it
4. That tree is the DOM
5. JavaScript can now read and modify that tree

**Example:**

Your HTML:

```html
<h1>Hello</h1>
<p>Welcome to my page</p>
```

The browser creates a tree structure (the DOM):

```
document
  └── html
      ├── head
      └── body
          ├── h1 (text: "Hello")
          └── p (text: "Welcome to my page")
```

### 1.2 HTML vs DOM

**HTML:**

- Static text file you write
- Saved on the server
- Doesn't change

**DOM:**

- Live, in-memory representation
- Created by the browser
- Can be changed by JavaScript
- Changes appear instantly on the page

**Think of it like:**

- HTML = recipe (instructions)
- DOM = actual cooked meal (that you can modify)

---

## Part 2: The Window and Document Objects

### 2.1 Understanding the Hierarchy

In the browser, there are two main objects:

**window** - The entire browser window

```javascript
console.log(window); // The browser window object
```

**document** - The webpage inside the window

```javascript
console.log(document); // The DOM tree of your page
```

### 2.2 Relationship

```
window (browser window)
  └── document (your webpage)
      └── html
          ├── head
          └── body
              └── your elements
```

Usually you work with `document` to manipulate the page.

---

## Part 3: How the DOM is Created

### 3.1 The Loading Process

When you visit a webpage:

**Step 1:** Browser downloads the HTML file

**Step 2:** Browser starts parsing HTML from top to bottom

**Step 3:** Browser builds the DOM tree

**Step 4:** Browser fires `DOMContentLoaded` event (DOM is ready)

**Step 5:** Images, CSS, and other resources continue loading

**Step 6:** Browser fires `load` event (everything is ready)

### 3.2 Waiting for the DOM to be Ready

If your JavaScript runs before the DOM is ready, it won't find the elements.

**Problem:**

```html
<script>
  const button = document.querySelector("button");
  console.log(button); // null - button doesn't exist yet!
</script>

<button>Click me</button>
```

**Solution 1: Put script at the end**

```html
<body>
  <button>Click me</button>

  <script>
    const button = document.querySelector("button");
    console.log(button); // Works! Button exists now
  </script>
</body>
```

**Solution 2: Wait for DOMContentLoaded**

```html
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector("button");
    console.log(button); // Works! DOM is ready
  });
</script>
```

---

## Part 4: DOM Structure - Nodes and Elements

### 4.1 Types of Nodes

The DOM tree is made of different types of nodes:

**1. Document Node** - The root (`document`)

**2. Element Nodes** - HTML tags like `<div>`, `<p>`, `<button>`

**3. Text Nodes** - The actual text inside elements

**4. Comment Nodes** - HTML comments `<!-- like this -->`

### 4.2 Example Structure

HTML:

```html
<body>
  <h1>Hello</h1>
  <!-- This is a comment -->
  <p>Welcome</p>
</body>
```

DOM tree:

```
body (element node)
  ├── h1 (element node)
  │   └── "Hello" (text node)
  ├── comment node
  └── p (element node)
      └── "Welcome" (text node)
```

**Important:** Most of the time you work with element nodes, but remember that text is also a node.

---

## Part 5: Selecting Elements (Finding Things on the Page)

Before you can change something, you need to find it. This is called "selecting" or "querying" the DOM.

### 5.1 Old Methods (Still Common)

**Select by ID:**

```javascript
const title = document.getElementById("main-title");
```

**Select by class name:**

```javascript
const items = document.getElementsByClassName("item");
// Returns HTMLCollection (live - updates automatically)
```

**Select by tag name:**

```javascript
const paragraphs = document.getElementsByTagName("p");
// Returns all <p> elements
```

### 5.2 Modern Methods (Better)

**querySelector - Get ONE element:**

```javascript
// By class
const item = document.querySelector(".item");

// By ID
const title = document.querySelector("#main-title");

// By tag
const paragraph = document.querySelector("p");

// Complex selector
const input = document.querySelector('form input[type="email"]');
```

**querySelectorAll - Get MULTIPLE elements:**

```javascript
const items = document.querySelectorAll(".item");
// Returns NodeList (not live - snapshot)

// Loop through them
items.forEach((item) => {
  console.log(item);
});
```

### 5.3 Selector Syntax

Use CSS selectors:

```javascript
// ID: #
document.querySelector("#header");

// Class: .
document.querySelector(".button");

// Tag
document.querySelector("div");

// Combinations
document.querySelector("ul li.active");
document.querySelector('form input[name="email"]');
document.querySelector(".container > .item:first-child");
```

### 5.4 Which One to Use?

**Use `querySelector` when:**

- You need just one element
- You want the first match

**Use `querySelectorAll` when:**

- You need multiple elements
- You want all matches

**Modern best practice:** Use `querySelector` and `querySelectorAll` for everything. They're more flexible and consistent.

---

## Part 6: Reading and Changing Content

### 6.1 Getting and Setting Text

**textContent - Plain text (recommended):**

```javascript
const paragraph = document.querySelector("p");

// Read text
console.log(paragraph.textContent); // "Hello world"

// Change text
paragraph.textContent = "New text here";
```

**innerText - Similar but slower:**

```javascript
// Also gets/sets text, but respects CSS (hidden elements, etc.)
console.log(paragraph.innerText);
```

**When to use which:**

- Use `textContent` - faster, more predictable
- Use `innerText` only if you need CSS-aware behavior

### 6.2 Getting and Setting HTML

**innerHTML - Insert HTML:**

```javascript
const div = document.querySelector("#container");

// Read HTML
console.log(div.innerHTML);

// Set HTML
div.innerHTML = "<strong>Bold text</strong> and normal text";
```

**SECURITY WARNING:**

```javascript
// DANGEROUS - Never do this with user input
const userInput = "<img src=x onerror=\"alert('hacked')\">";
div.innerHTML = userInput; // XSS vulnerability!

// SAFE - Use textContent for user input
div.textContent = userInput; // Treats it as plain text
```

### 6.3 Practical Example

```javascript
// HTML: <h1 id="title">Old Title</h1>

const title = document.querySelector("#title");

// Read current text
console.log(title.textContent); // "Old Title"

// Change it
title.textContent = "New Title";

// Add HTML formatting
const container = document.querySelector("#container");
container.innerHTML = "<p>Hello <strong>World</strong></p>";
```

---

## Part 7: Working with Attributes

### 7.1 Attributes vs Properties

**Attributes** - What you write in HTML

```html
<img id="photo" src="avatar.png" alt="Profile picture" />
```

**Properties** - JavaScript object properties on the DOM element

### 7.2 Using Attributes

```javascript
const img = document.querySelector("#photo");

// Get attribute
console.log(img.getAttribute("src")); // "avatar.png"

// Set attribute
img.setAttribute("alt", "User avatar");

// Check if attribute exists
if (img.hasAttribute("data-id")) {
  console.log("Has data-id attribute");
}

// Remove attribute
img.removeAttribute("alt");
```

### 7.3 Using Properties (Faster and Easier)

```javascript
const img = document.querySelector("#photo");

// Get property
console.log(img.src); // Full URL

// Set property
img.src = "new-avatar.png";
img.alt = "New description";

// Other useful properties
const input = document.querySelector("input");
input.value = "Hello";
input.disabled = true;

const link = document.querySelector("a");
link.href = "https://example.com";
```

### 7.4 Special Properties

```javascript
const input = document.querySelector("#email");

// Form input values
console.log(input.value); // Current value
input.value = "new@email.com";

// Checkboxes and radio buttons
const checkbox = document.querySelector("#agree");
console.log(checkbox.checked); // true or false
checkbox.checked = true;

// Element ID and classes
const div = document.querySelector("div");
console.log(div.id);
console.log(div.className); // String of class names
```

---

## Part 8: Working with Classes and Styles

### 8.1 Classes (The Right Way)

**classList API:**

```javascript
const box = document.querySelector(".box");

// Add a class
box.classList.add("active");

// Remove a class
box.classList.remove("hidden");

// Toggle a class (add if missing, remove if present)
box.classList.toggle("dark-mode");

// Check if class exists
if (box.classList.contains("active")) {
  console.log("Box is active");
}

// Add multiple classes
box.classList.add("large", "highlighted");

// Remove multiple classes
box.classList.remove("small", "dim");
```

### 8.2 Practical Class Example

```javascript
const button = document.querySelector(".toggle-button");
const menu = document.querySelector(".menu");

button.addEventListener("click", function () {
  menu.classList.toggle("open");
});
```

CSS:

```css
.menu {
  display: none;
}

.menu.open {
  display: block;
}
```

### 8.3 Inline Styles (Use Sparingly)

```javascript
const box = document.querySelector(".box");

// Set individual styles
box.style.backgroundColor = "red";
box.style.width = "200px";
box.style.fontSize = "16px";

// Note: Use camelCase for CSS properties
// CSS: background-color → JS: backgroundColor
// CSS: font-size → JS: fontSize
```

### 8.4 Best Practice: Classes vs Inline Styles

**Good: Use classes**

```javascript
// JavaScript
element.classList.add("highlight");
```

```css
/* CSS */
.highlight {
  background-color: yellow;
  font-weight: bold;
}
```

**Bad: Use inline styles**

```javascript
// JavaScript
element.style.backgroundColor = "yellow";
element.style.fontWeight = "bold";
```

**Why classes are better:**

- Keeps styling in CSS where it belongs
- Easier to maintain
- Can use media queries and pseudo-selectors
- Cleaner separation of concerns

---

## Part 9: Creating, Inserting, and Removing Elements

### 9.1 Creating New Elements

```javascript
// Create a new element
const newDiv = document.createElement("div");

// Add content
newDiv.textContent = "I am a new div";

// Add classes
newDiv.classList.add("box", "new");

// Add attributes
newDiv.setAttribute("data-id", "123");

// Note: Element is created but not yet on the page
```

### 9.2 Adding Elements to the Page

**appendChild (old way):**

```javascript
const container = document.querySelector("#container");
container.appendChild(newDiv); // Adds at the end
```

**Modern methods (better):**

```javascript
const list = document.querySelector("ul");
const newItem = document.createElement("li");
newItem.textContent = "New item";

// Add at the end
list.append(newItem);

// Add at the beginning
list.prepend(newItem);

// Add before the list
list.before(newItem);

// Add after the list
list.after(newItem);
```

### 9.3 Practical Example: Adding List Items

```javascript
const list = document.querySelector("#todo-list");
const input = document.querySelector("#todo-input");
const button = document.querySelector("#add-button");

button.addEventListener("click", function () {
  // Get input value
  const text = input.value;

  if (text.trim() !== "") {
    // Create new list item
    const li = document.createElement("li");
    li.textContent = text;

    // Add to list
    list.append(li);

    // Clear input
    input.value = "";
  }
});
```

### 9.4 Removing Elements

**Modern way:**

```javascript
const element = document.querySelector(".item");
element.remove(); // Removes itself from DOM
```

**Old way:**

```javascript
const parent = document.querySelector("ul");
const child = document.querySelector("li");
parent.removeChild(child);
```

### 9.5 Cloning Elements

```javascript
const original = document.querySelector(".template");

// Shallow clone (element only, no children)
const copy1 = original.cloneNode(false);

// Deep clone (element and all children)
const copy2 = original.cloneNode(true);

// Add clone to page
document.body.append(copy2);
```

---

## Part 10: DOM Traversal (Moving Around the Tree)

### 10.1 Parent and Children

```javascript
const element = document.querySelector(".item");

// Go up (parent)
const parent = element.parentElement;

// Go down (children)
const children = element.children; // HTMLCollection
const firstChild = element.firstElementChild;
const lastChild = element.lastElementChild;

// Count children
console.log(element.children.length);
```

### 10.2 Siblings

```javascript
const element = document.querySelector(".item");

// Previous sibling
const previous = element.previousElementSibling;

// Next sibling
const next = element.nextElementSibling;
```

### 10.3 Practical Example

```html
<ul id="menu">
  <li class="item">Home</li>
  <li class="item active">About</li>
  <li class="item">Contact</li>
</ul>
```

```javascript
const active = document.querySelector(".active");

// Get parent list
const menu = active.parentElement;

// Get siblings
const previous = active.previousElementSibling;
const next = active.nextElementSibling;

console.log(previous.textContent); // "Home"
console.log(next.textContent); // "Contact"
```

### 10.4 Avoiding Common Mistakes

Use element-specific properties to avoid text nodes:

**Good:**

```javascript
element.firstElementChild; // First child element
element.nextElementSibling; // Next sibling element
```

**Avoid (unless you need text nodes):**

```javascript
element.firstChild; // Might be a text node
element.nextSibling; // Might be a text node
```

---

## Part 11: Events (Making Things Interactive)

### 11.1 What are Events?

Events are things that happen on the page:

- User clicks a button
- User types in an input
- Page finishes loading
- Mouse moves over an element

### 11.2 Common Events

**Mouse events:**

- `click` - User clicks
- `dblclick` - User double-clicks
- `mouseover` - Mouse enters element
- `mouseout` - Mouse leaves element
- `mousemove` - Mouse moves

**Keyboard events:**

- `keydown` - Key is pressed
- `keyup` - Key is released
- `keypress` - Key is pressed (deprecated)

**Form events:**

- `submit` - Form is submitted
- `input` - Input value changes
- `change` - Input loses focus after change
- `focus` - Element receives focus
- `blur` - Element loses focus

**Other events:**

- `DOMContentLoaded` - DOM is ready
- `load` - Page fully loaded
- `scroll` - Page is scrolled
- `resize` - Window is resized

### 11.3 Adding Event Listeners

```javascript
const button = document.querySelector("button");

button.addEventListener("click", function (event) {
  console.log("Button was clicked!");
  console.log(event); // Event object with details
});
```

### 11.4 The Event Object

The event object contains information about what happened:

```javascript
button.addEventListener("click", function (e) {
  console.log(e.target); // Element that was clicked
  console.log(e.type); // "click"
  console.log(e.clientX, e.clientY); // Mouse position
});

input.addEventListener("keydown", function (e) {
  console.log(e.key); // Which key was pressed
  console.log(e.code); // Physical key code
});
```

### 11.5 Preventing Default Behavior

Stop the browser's default action:

```javascript
// Prevent form submission
const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page reload

  // Handle form with JavaScript instead
  console.log("Form submitted");
});

// Prevent link navigation
const link = document.querySelector("a");
link.addEventListener("click", function (e) {
  e.preventDefault(); // Don't follow the link
  console.log("Link clicked but not followed");
});
```

### 11.6 Removing Event Listeners

```javascript
function handleClick() {
  console.log("Clicked");
}

// Add listener
button.addEventListener("click", handleClick);

// Remove listener (must use same function reference)
button.removeEventListener("click", handleClick);
```

---

## Part 12: Event Bubbling and Delegation

### 12.1 What is Event Bubbling?

When you click an element, the event doesn't just fire on that element. It "bubbles up" through all parent elements.

**Example:**

```html
<div id="outer">
  <div id="middle">
    <button id="inner">Click me</button>
  </div>
</div>
```

When you click the button, the click event fires on:

1. The button (`#inner`)
2. Then the middle div (`#middle`)
3. Then the outer div (`#outer`)
4. Then the body
5. Then the document

### 12.2 Visualizing Bubbling

```javascript
document.querySelector("#outer").addEventListener("click", function () {
  console.log("Outer clicked");
});

document.querySelector("#middle").addEventListener("click", function () {
  console.log("Middle clicked");
});

document.querySelector("#inner").addEventListener("click", function () {
  console.log("Inner clicked");
});

// When you click the button, console shows:
// Inner clicked
// Middle clicked
// Outer clicked
```

### 12.3 Stopping Bubbling

```javascript
button.addEventListener("click", function (e) {
  e.stopPropagation(); // Stop bubbling
  console.log("Only this listener runs");
});
```

### 12.4 Event Delegation (Very Important)

Instead of adding listeners to many elements, add ONE listener to their parent.

**Bad way (inefficient):**

```javascript
// Adding 100 listeners
const items = document.querySelectorAll(".item");
items.forEach((item) => {
  item.addEventListener("click", function () {
    console.log("Item clicked");
  });
});
```

**Good way (event delegation):**

```javascript
// Adding 1 listener
const list = document.querySelector("#list");

list.addEventListener("click", function (e) {
  // Check if clicked element is an item
  if (e.target.classList.contains("item")) {
    console.log("Item clicked:", e.target.textContent);
  }
});
```

### 12.5 Why Event Delegation is Better

1. **Performance:** One listener instead of many
2. **Dynamic elements:** Works for elements added later
3. **Memory:** Uses less memory

**Example with dynamic elements:**

```javascript
const list = document.querySelector("#todo-list");

// One listener for all items (even future ones)
list.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    e.target.classList.toggle("completed");
  }
});

// Add new item (listener still works!)
const newItem = document.createElement("li");
newItem.textContent = "New task";
list.append(newItem);
```

---

## Part 13: Working with Forms

### 13.1 Getting Form Values

```javascript
// Text input
const nameInput = document.querySelector("#name");
console.log(nameInput.value);

// Checkbox
const checkbox = document.querySelector("#agree");
console.log(checkbox.checked); // true or false

// Radio buttons
const selected = document.querySelector('input[name="size"]:checked');
if (selected) {
  console.log(selected.value);
}

// Select dropdown
const select = document.querySelector("#country");
console.log(select.value);
```

### 13.2 Handling Form Submission

```javascript
const form = document.querySelector("#contact-form");

form.addEventListener("submit", function (e) {
  e.preventDefault(); // Stop page reload

  // Get values
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;

  console.log("Name:", name);
  console.log("Email:", email);

  // Validate
  if (name.trim() === "" || email.trim() === "") {
    alert("Please fill all fields");
    return;
  }

  // Submit data (fetch API, etc.)
  console.log("Form is valid, submitting...");
});
```

### 13.3 Using FormData (Modern Way)

```javascript
form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Get all form data automatically
  const formData = new FormData(form);

  // Access by input name attribute
  const name = formData.get("name");
  const email = formData.get("email");

  console.log(name, email);

  // Convert to object
  const data = Object.fromEntries(formData);
  console.log(data);
});
```

### 13.4 Real-time Validation

```javascript
const emailInput = document.querySelector("#email");

emailInput.addEventListener("input", function () {
  const email = emailInput.value;

  if (email.includes("@")) {
    emailInput.classList.remove("invalid");
    emailInput.classList.add("valid");
  } else {
    emailInput.classList.remove("valid");
    emailInput.classList.add("invalid");
  }
});
```

---

## Part 14: Data Attributes

### 14.1 What are Data Attributes?

Custom attributes to store extra information on elements.

```html
<button id="buy" data-product-id="123" data-price="499" data-name="Laptop">
  Buy Now
</button>
```

### 14.2 Reading Data Attributes

```javascript
const button = document.querySelector("#buy");

// Using dataset (modern way)
console.log(button.dataset.productId); // "123"
console.log(button.dataset.price); // "499"
console.log(button.dataset.name); // "Laptop"

// Using getAttribute
console.log(button.getAttribute("data-product-id")); // "123"
```

### 14.3 Setting Data Attributes

```javascript
// Set data attribute
button.dataset.price = "599";
button.dataset.discount = "10";

// Now HTML is:
// <button data-price="599" data-discount="10">
```

### 14.4 Practical Example

```javascript
const buttons = document.querySelectorAll(".delete-btn");

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const userId = this.dataset.userId;
    const userName = this.dataset.userName;

    if (confirm(`Delete user ${userName}?`)) {
      deleteUser(userId);
    }
  });
});
```

---

## Part 15: DOM vs BOM (Browser Object Model)

### 15.1 What's the Difference?

**DOM (Document Object Model):**

- The webpage content
- `document` and all elements
- Structure of the page

**BOM (Browser Object Model):**

- Browser-related features
- `window`, `location`, `history`, `navigator`
- Not about page content

### 15.2 BOM Examples

```javascript
// window - browser window
console.log(window.innerWidth); // Viewport width
console.log(window.innerHeight); // Viewport height

// location - current URL
console.log(location.href); // Full URL
console.log(location.pathname); // /path/to/page
location.href = "https://example.com"; // Navigate

// history - browser history
history.back(); // Go back
history.forward(); // Go forward

// navigator - browser info
console.log(navigator.userAgent); // Browser details
console.log(navigator.language); // User's language

// Storage
localStorage.setItem("theme", "dark");
sessionStorage.setItem("temp", "value");
```

---

## Part 16: Performance and Best Practices

### 16.1 Cache DOM Queries

**Bad (slow):**

```javascript
document.querySelector("#box").style.color = "red";
document.querySelector("#box").style.width = "200px";
document.querySelector("#box").textContent = "Hello";
```

**Good (fast):**

```javascript
const box = document.querySelector("#box");
box.style.color = "red";
box.style.width = "200px";
box.textContent = "Hello";
```

### 16.2 Batch DOM Changes

**Bad (causes multiple reflows):**

```javascript
element.style.width = "100px";
element.style.height = "100px";
element.style.backgroundColor = "red";
```

**Better (one reflow):**

```javascript
element.style.cssText = "width: 100px; height: 100px; background-color: red;";
```

**Best (use classes):**

```javascript
element.classList.add("styled-box");
```

### 16.3 Security: Never Use innerHTML with User Input

**Dangerous:**

```javascript
const userInput = "<img src=x onerror=\"alert('XSS')\">";
div.innerHTML = userInput; // XSS attack!
```

**Safe:**

```javascript
div.textContent = userInput; // Treats as plain text
```

### 16.4 Separate Concerns

**Good structure:**

- HTML = content and structure
- CSS = styling
- JavaScript = behavior

```javascript
// JavaScript just toggles classes
element.classList.toggle("active");
```

```css
/* CSS defines what 'active' looks like */
.active {
  background: blue;
  transform: scale(1.1);
}
```

---

## Part 17: Complete Example - Todo List

Let's build a simple todo list using everything we've learned:

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .completed {
        text-decoration: line-through;
        opacity: 0.5;
      }
    </style>
  </head>
  <body>
    <h1>My Todo List</h1>

    <form id="todo-form">
      <input type="text" id="todo-input" placeholder="Add a task" />
      <button type="submit">Add</button>
    </form>

    <ul id="todo-list"></ul>

    <script>
      // Get elements
      const form = document.querySelector("#todo-form");
      const input = document.querySelector("#todo-input");
      const list = document.querySelector("#todo-list");

      // Handle form submission
      form.addEventListener("submit", function (e) {
        e.preventDefault();

        const text = input.value.trim();
        if (text === "") return;

        // Create new todo item
        const li = document.createElement("li");
        li.textContent = text;

        // Create delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.style.marginLeft = "10px";

        // Add delete button to list item
        li.append(deleteBtn);

        // Add to list
        list.append(li);

        // Clear input
        input.value = "";
      });

      // Event delegation for clicks on list
      list.addEventListener("click", function (e) {
        // Toggle completed on li click
        if (e.target.tagName === "LI") {
          e.target.classList.toggle("completed");
        }

        // Delete on button click
        if (e.target.tagName === "BUTTON") {
          e.target.parentElement.remove();
        }
      });
    </script>
  </body>
</html>
```

---
