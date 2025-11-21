# JavaScript APIs & HTTP Complete Guide

A comprehensive guide covering the Fetch API, HTTP requests, async patterns, and real-world implementation patterns.

---

## Table of Contents

1. [Understanding HTTP](#understanding-http)
2. [The Fetch API](#the-fetch-api)
3. [Making Different Types of Requests](#making-different-types-of-requests)
4. [Headers and Authentication](#headers-and-authentication)
5. [Error Handling](#error-handling)
6. [Request and Response Objects](#request-and-response-objects)
7. [AbortController - Cancelling Requests](#abortcontroller---cancelling-requests)
8. [Practical Async Patterns](#practical-async-patterns)
9. [Working with Different Data Types](#working-with-different-data-types)
10. [Real-World API Wrapper](#real-world-api-wrapper)
11. [Building APIs with Node.js](#building-apis-with-nodejs)

---

## Understanding HTTP

### What is HTTP?

HTTP (HyperText Transfer Protocol) is how browsers and servers communicate. Every time you visit a website or your app fetches data, HTTP is used.

### HTTP Methods (Verbs)

```javascript
// GET - Retrieve data (should never change data on server)
fetch("/api/users");

// POST - Create new resource
fetch("/api/users", { method: "POST", body: JSON.stringify(newUser) });

// PUT - Replace entire resource
fetch("/api/users/1", { method: "PUT", body: JSON.stringify(updatedUser) });

// PATCH - Update part of a resource
fetch("/api/users/1", {
  method: "PATCH",
  body: JSON.stringify({ name: "New Name" }),
});

// DELETE - Remove a resource
fetch("/api/users/1", { method: "DELETE" });
```

### Status Codes You Must Know

```javascript
// 2xx - Success
200; // OK - Request succeeded
201; // Created - New resource created (after POST)
204; // No Content - Success but no body (after DELETE)

// 3xx - Redirection
301; // Moved Permanently
304; // Not Modified (cached version is still valid)

// 4xx - Client Errors (YOUR fault)
400; // Bad Request - Invalid data sent
401; // Unauthorized - Not logged in
403; // Forbidden - Logged in but not allowed
404; // Not Found - Resource doesn't exist
409; // Conflict - Resource already exists
422; // Unprocessable Entity - Validation failed
429; // Too Many Requests - Rate limited

// 5xx - Server Errors (SERVER's fault)
500; // Internal Server Error - Server crashed
502; // Bad Gateway - Server behind proxy crashed
503; // Service Unavailable - Server overloaded
504; // Gateway Timeout - Server took too long
```

---

## The Fetch API

### Basic Syntax

`fetch()` returns a Promise that resolves to a Response object.

```javascript
// Simplest form
fetch("https://api.example.com/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));

// With async/await (preferred)
async function getData() {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  return data;
}
```

### Important: Fetch Does NOT Throw on HTTP Errors

This is a common mistake. Fetch only throws on network failures, not HTTP errors:

```javascript
// WRONG - This won't catch 404 or 500 errors
async function getUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json(); // This runs even on 404!
    return data;
  } catch (error) {
    // Only catches network errors, NOT 404/500
    console.error(error);
  }
}

// CORRECT - Check response.ok
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    // HTTP error occurred
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
```

---

## Making Different Types of Requests

### GET Request (Retrieve Data)

```javascript
// Simple GET
async function getUsers() {
  const response = await fetch("https://api.example.com/users");

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.status}`);
  }

  return response.json();
}

// GET with query parameters
async function searchUsers(query, page = 1, limit = 10) {
  // Build URL with query params
  const url = new URL("https://api.example.com/users");
  url.searchParams.set("q", query);
  url.searchParams.set("page", page);
  url.searchParams.set("limit", limit);

  // url.toString() = "https://api.example.com/users?q=john&page=1&limit=10"

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

// Usage
const users = await searchUsers("john", 2, 20);
```

### POST Request (Create Data)

```javascript
async function createUser(userData) {
  const response = await fetch("https://api.example.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    // Try to get error message from response
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `Failed to create user: ${response.status}`
    );
  }

  return response.json();
}

// Usage
const newUser = await createUser({
  name: "John Doe",
  email: "john@example.com",
  age: 25,
});
```

### PUT Request (Replace Data)

```javascript
async function replaceUser(id, userData) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }

  return response.json();
}

// Usage - must send ALL fields
await replaceUser(1, {
  name: "John Smith",
  email: "john.smith@example.com",
  age: 26,
});
```

### PATCH Request (Partial Update)

```javascript
async function updateUser(id, updates) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user: ${response.status}`);
  }

  return response.json();
}

// Usage - send only fields you want to change
await updateUser(1, { name: "John Smith" });
```

### DELETE Request (Remove Data)

```javascript
async function deleteUser(id) {
  const response = await fetch(`https://api.example.com/users/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.status}`);
  }

  // DELETE often returns 204 No Content (empty body)
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
```

---

## Headers and Authentication

### Common Headers

```javascript
const response = await fetch("https://api.example.com/data", {
  headers: {
    // Tell server what format you're sending
    "Content-Type": "application/json",

    // Tell server what format you want back
    Accept: "application/json",

    // Authentication
    Authorization: "Bearer your-token-here",

    // Custom headers (often prefixed with X-)
    "X-Request-ID": "unique-id-123",

    // API keys (varies by API)
    "X-API-Key": "your-api-key",
  },
});
```

### JWT Authentication Pattern

```javascript
// Store token (in memory or localStorage)
let authToken = null;

async function login(email, password) {
  const response = await fetch("https://api.example.com/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  authToken = data.token;
  return data;
}

// Use token in subsequent requests
async function getProfile() {
  if (!authToken) {
    throw new Error("Not authenticated");
  }

  const response = await fetch("https://api.example.com/me", {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  if (response.status === 401) {
    authToken = null; // Token expired
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    throw new Error("Failed to fetch profile");
  }

  return response.json();
}
```

### Sending Cookies (for Session Auth)

```javascript
// credentials: 'include' sends cookies with cross-origin requests
const response = await fetch("https://api.example.com/data", {
  credentials: "include", // or 'same-origin' for same-origin only
});

// credentials options:
// 'omit' - never send cookies
// 'same-origin' - send cookies only to same origin (default)
// 'include' - always send cookies, even cross-origin
```

---

## Error Handling

### Comprehensive Error Handling

```javascript
class APIError extends Error {
  constructor(message, status, data = null) {
    super(message);
    this.name = "APIError";
    this.status = status;
    this.data = data;
  }
}

async function fetchWithErrorHandling(url, options = {}) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    // Network error (no internet, DNS failure, etc.)
    throw new APIError("Network error. Please check your connection.", 0);
  }

  if (!response.ok) {
    let errorData = null;
    let errorMessage = `HTTP ${response.status}`;

    // Try to parse error body
    try {
      errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Response wasn't JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    // Handle specific status codes
    switch (response.status) {
      case 400:
        throw new APIError(`Invalid request: ${errorMessage}`, 400, errorData);
      case 401:
        throw new APIError("Please login to continue", 401, errorData);
      case 403:
        throw new APIError("You do not have permission", 403, errorData);
      case 404:
        throw new APIError("Resource not found", 404, errorData);
      case 422:
        throw new APIError(`Validation error: ${errorMessage}`, 422, errorData);
      case 429:
        throw new APIError("Too many requests. Please wait.", 429, errorData);
      case 500:
        throw new APIError(
          "Server error. Please try again later.",
          500,
          errorData
        );
      default:
        throw new APIError(errorMessage, response.status, errorData);
    }
  }

  // Handle empty responses
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

// Usage
async function getUser(id) {
  try {
    const user = await fetchWithErrorHandling(`/api/users/${id}`);
    return user;
  } catch (error) {
    if (error instanceof APIError) {
      if (error.status === 404) {
        console.log("User not found");
        return null;
      }
      if (error.status === 401) {
        // Redirect to login
        window.location.href = "/login";
        return;
      }
    }
    // Re-throw unexpected errors
    throw error;
  }
}
```

---

## Request and Response Objects

### The Response Object

```javascript
const response = await fetch("https://api.example.com/data");

// Properties
response.ok; // true if status is 200-299
response.status; // 200, 404, 500, etc.
response.statusText; // "OK", "Not Found", etc.
response.headers; // Headers object
response.url; // Final URL (after redirects)
response.redirected; // true if request was redirected
response.type; // "basic", "cors", "opaque", etc.

// Methods (can only call ONE of these - body can only be read once)
await response.json(); // Parse as JSON
await response.text(); // Get as text
await response.blob(); // Get as Blob (binary)
await response.arrayBuffer(); // Get as ArrayBuffer
await response.formData(); // Get as FormData

// Reading headers
response.headers.get("content-type"); // "application/json"
response.headers.get("x-total-count"); // Custom header value
response.headers.has("authorization"); // true/false

// Iterate headers
for (const [key, value] of response.headers) {
  console.log(`${key}: ${value}`);
}
```

### The Request Object

```javascript
// Create a Request object (useful for complex requests)
const request = new Request("https://api.example.com/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ name: "John" }),
});

// Use it with fetch
const response = await fetch(request);

// You can also clone requests
const clonedRequest = request.clone();
```

### The Headers Object

```javascript
// Create headers
const headers = new Headers();
headers.append("Content-Type", "application/json");
headers.append("Authorization", "Bearer token");

// Or create from object
const headers2 = new Headers({
  "Content-Type": "application/json",
  Authorization: "Bearer token",
});

// Methods
headers.get("Content-Type"); // "application/json"
headers.has("Authorization"); // true
headers.set("X-Custom", "val"); // Set or replace
headers.append("Accept", "json"); // Add (can have multiple)
headers.delete("X-Custom"); // Remove

// Use with fetch
const response = await fetch(url, { headers });
```

---

## AbortController - Cancelling Requests

### Basic Cancellation

```javascript
const controller = new AbortController();

// Start request
const fetchPromise = fetch("https://api.example.com/large-data", {
  signal: controller.signal,
});

// Cancel after 5 seconds
setTimeout(() => {
  controller.abort();
}, 5000);

try {
  const response = await fetchPromise;
  const data = await response.json();
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Request was cancelled");
  } else {
    throw error;
  }
}
```

### Timeout Pattern

```javascript
async function fetchWithTimeout(url, options = {}, timeout = 5000) {
  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  }
}

// Usage
try {
  const response = await fetchWithTimeout("/api/data", {}, 3000);
  const data = await response.json();
} catch (error) {
  console.error(error.message); // "Request timed out after 3000ms"
}
```

### Cancel on Component Unmount (React Pattern)

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchUser() {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Fetch failed:", error);
        }
      }
    }

    fetchUser();

    // Cleanup: cancel request if component unmounts
    return () => controller.abort();
  }, [userId]);

  return user ? <div>{user.name}</div> : <div>Loading...</div>;
}
```

---

## Practical Async Patterns

### Debounce - Wait Until User Stops Typing

```javascript
function debounce(func, wait) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, wait);
  };
}

// Usage: Search as user types
const searchInput = document.getElementById("search");

const debouncedSearch = debounce(async (query) => {
  if (!query.trim()) return;

  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const results = await response.json();
  displayResults(results);
}, 300); // Wait 300ms after user stops typing

searchInput.addEventListener("input", (e) => {
  debouncedSearch(e.target.value);
});
```

### Throttle - Limit How Often Function Runs

```javascript
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;

      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

// Usage: Track scroll position (max once per 100ms)
const throttledScroll = throttle(() => {
  console.log("Scroll position:", window.scrollY);
  // Send analytics or load more content
}, 100);

window.addEventListener("scroll", throttledScroll);
```

### Retry with Exponential Backoff

```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);

      // Don't retry client errors (4xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return response;
    } catch (error) {
      lastError = error;

      // Don't retry if it was aborted
      if (error.name === "AbortError") {
        throw error;
      }

      // Don't retry client errors
      if (error.message.startsWith("Client error")) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = Math.pow(2, attempt) * 1000; // 1s, 2s, 4s
        console.log(`Attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts: ${lastError.message}`);
}

// Usage
try {
  const response = await fetchWithRetry("/api/flaky-endpoint");
  const data = await response.json();
} catch (error) {
  console.error("All retries failed:", error.message);
}
```

### Sequential vs Parallel Requests

```javascript
// SEQUENTIAL - One after another (slow, but ordered)
async function getDataSequential(ids) {
  const results = [];

  for (const id of ids) {
    const response = await fetch(`/api/items/${id}`);
    const data = await response.json();
    results.push(data);
  }

  return results;
}

// PARALLEL - All at once (fast)
async function getDataParallel(ids) {
  const promises = ids.map((id) =>
    fetch(`/api/items/${id}`).then((r) => r.json())
  );

  return Promise.all(promises);
}

// PARALLEL with error handling for each
async function getDataParallelSafe(ids) {
  const promises = ids.map(async (id) => {
    try {
      const response = await fetch(`/api/items/${id}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return { id, data: await response.json(), error: null };
    } catch (error) {
      return { id, data: null, error: error.message };
    }
  });

  return Promise.all(promises);
}

// Usage
const results = await getDataParallelSafe([1, 2, 3, 4, 5]);
// [
//   { id: 1, data: {...}, error: null },
//   { id: 2, data: null, error: "HTTP 404" },
//   { id: 3, data: {...}, error: null },
//   ...
// ]
```

### Promise.allSettled - Handle Mixed Results

```javascript
async function fetchMultipleAPIs() {
  const urls = ["/api/users", "/api/products", "/api/orders"];

  const results = await Promise.allSettled(
    urls.map((url) => fetch(url).then((r) => r.json()))
  );

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`${urls[index]} succeeded:`, result.value);
    } else {
      console.log(`${urls[index]} failed:`, result.reason);
    }
  });

  // Extract successful results
  const successfulData = results
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  return successfulData;
}
```

### Promise.race - First to Complete Wins

```javascript
// Get data from fastest source
async function getFromFastestSource() {
  return Promise.race([
    fetch("/api/primary-source").then((r) => r.json()),
    fetch("/api/backup-source").then((r) => r.json()),
  ]);
}

// Timeout using Promise.race
function timeout(ms) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });
}

async function fetchWithRaceTimeout(url, ms = 5000) {
  return Promise.race([fetch(url).then((r) => r.json()), timeout(ms)]);
}
```

---

## Working with Different Data Types

### FormData (File Uploads)

```javascript
// Upload a file
async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("description", "My uploaded file");

  // DON'T set Content-Type header - browser sets it automatically with boundary
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  return response.json();
}

// From a form element
const form = document.getElementById("upload-form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log("Upload result:", result);
});

// Multiple files
async function uploadMultiple(files) {
  const formData = new FormData();

  for (const file of files) {
    formData.append("files", file); // Same key for all files
  }

  const response = await fetch("/api/upload-multiple", {
    method: "POST",
    body: formData,
  });

  return response.json();
}
```

### Blob (Binary Data)

```javascript
// Download an image
async function downloadImage(url) {
  const response = await fetch(url);
  const blob = await response.blob();

  // Create URL for the blob
  const imageUrl = URL.createObjectURL(blob);

  // Use it
  const img = document.createElement("img");
  img.src = imageUrl;
  document.body.appendChild(img);

  // Clean up when done
  // URL.revokeObjectURL(imageUrl);

  return imageUrl;
}

// Download and save file
async function downloadFile(url, filename) {
  const response = await fetch(url);
  const blob = await response.blob();

  // Create download link
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = downloadUrl;
  a.download = filename;

  // Trigger download
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // Cleanup
  URL.revokeObjectURL(downloadUrl);
}
```

### URL and URLSearchParams

```javascript
// Building URLs safely
const baseUrl = "https://api.example.com/search";
const url = new URL(baseUrl);

url.searchParams.set("query", "hello world"); // Automatically encoded
url.searchParams.set("page", "1");
url.searchParams.set("limit", "10");
url.searchParams.append("tag", "javascript");
url.searchParams.append("tag", "tutorial"); // Multiple values

console.log(url.toString());
// "https://api.example.com/search?query=hello+world&page=1&limit=10&tag=javascript&tag=tutorial"

// Parsing URLs
const parsed = new URL("https://api.example.com/users?id=123&sort=name");
console.log(parsed.hostname); // "api.example.com"
console.log(parsed.pathname); // "/users"
console.log(parsed.searchParams.get("id")); // "123"
console.log(parsed.searchParams.get("sort")); // "name"

// Working with query strings only
const params = new URLSearchParams("?name=John&age=25");
params.get("name"); // "John"
params.has("age"); // true
params.toString(); // "name=John&age=25"

// From object
const params2 = new URLSearchParams({
  search: "test",
  page: "1",
});
```

---

## Browser Web APIs

> **Add this section after "Working with Different Data Types" and before "Real-World API Wrapper"**

---

### Timers: setTimeout, setInterval, requestAnimationFrame

#### setTimeout - Run Once After Delay

```javascript
// Basic usage
const timeoutId = setTimeout(() => {
  console.log("Runs after 2 seconds");
}, 2000);

// Cancel before it runs
clearTimeout(timeoutId);

// With arguments
setTimeout(
  (name, age) => {
    console.log(`${name} is ${age}`);
  },
  1000,
  "John",
  25
);

// Common pattern: Promisified delay
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Usage
async function example() {
  console.log("Start");
  await delay(2000);
  console.log("After 2 seconds");
}
```

#### setInterval - Run Repeatedly

```javascript
// Run every second
let count = 0;
const intervalId = setInterval(() => {
  count++;
  console.log(`Count: ${count}`);

  // Stop after 5 times
  if (count >= 5) {
    clearInterval(intervalId);
  }
}, 1000);

// Problem: setInterval doesn't wait for async operations
// BAD - requests can overlap
setInterval(async () => {
  await fetch("/api/data"); // If this takes 2s, next call starts before it finishes
}, 1000);

// GOOD - use recursive setTimeout instead
async function poll() {
  try {
    await fetch("/api/data");
  } finally {
    setTimeout(poll, 1000); // Schedule next only after current completes
  }
}
poll();
```

#### requestAnimationFrame - Smooth Animations

```javascript
// Runs before next repaint (~60fps = every 16.67ms)
let position = 0;

function animate() {
  position += 2;
  element.style.transform = `translateX(${position}px)`;

  if (position < 500) {
    requestAnimationFrame(animate); // Schedule next frame
  }
}

// Start animation
const animationId = requestAnimationFrame(animate);

// Cancel animation
cancelAnimationFrame(animationId);

// Smooth scroll example
function smoothScrollTo(targetY, duration = 500) {
  const startY = window.scrollY;
  const difference = targetY - startY;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    window.scrollTo(0, startY + difference * easeOut);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// Usage
smoothScrollTo(1000); // Scroll to 1000px from top
```

#### When to Use Which

| Timer                   | Use Case                                  |
| ----------------------- | ----------------------------------------- |
| `setTimeout`            | One-time delayed execution                |
| `setInterval`           | Simple repeated tasks (UI clocks)         |
| Recursive `setTimeout`  | Polling APIs, tasks that vary in duration |
| `requestAnimationFrame` | Visual animations, smooth UI updates      |

---

### IntersectionObserver - Detect Element Visibility

Efficiently detect when elements enter or leave the viewport.

```javascript
// Basic usage - lazy load images
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Element is visible
      const img = entry.target;
      img.src = img.dataset.src; // Load actual image
      observer.unobserve(img); // Stop watching
    }
  });
});

// Observe all lazy images
document.querySelectorAll("img[data-src]").forEach((img) => {
  observer.observe(img);
});

// With options
const observer2 = new IntersectionObserver(callback, {
  root: null, // viewport (null = browser viewport)
  rootMargin: "100px", // trigger 100px before entering viewport
  threshold: 0.5, // trigger when 50% visible
});

// Multiple thresholds
const observer3 = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      console.log(`${entry.intersectionRatio * 100}% visible`);
    });
  },
  {
    threshold: [0, 0.25, 0.5, 0.75, 1], // Fire at each threshold
  }
);

// Infinite scroll example
const sentinel = document.getElementById("load-more-trigger");

const infiniteScrollObserver = new IntersectionObserver(
  (entries) => {
    if (entries[0].isIntersecting) {
      loadMoreContent();
    }
  },
  {
    rootMargin: "200px", // Load before user reaches bottom
  }
);

infiniteScrollObserver.observe(sentinel);

// Cleanup
observer.disconnect(); // Stop all observations
```

---

### MutationObserver - Watch DOM Changes

Detect when the DOM is modified.

```javascript
// Watch for changes
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("Mutation type:", mutation.type);

    if (mutation.type === "childList") {
      console.log("Added nodes:", mutation.addedNodes);
      console.log("Removed nodes:", mutation.removedNodes);
    }

    if (mutation.type === "attributes") {
      console.log("Changed attribute:", mutation.attributeName);
      console.log("Old value:", mutation.oldValue);
    }
  });
});

// Start observing
const targetNode = document.getElementById("container");

observer.observe(targetNode, {
  childList: true, // Watch for added/removed children
  subtree: true, // Watch all descendants too
  attributes: true, // Watch attribute changes
  attributeOldValue: true, // Include old attribute values
  characterData: true, // Watch text content changes
  attributeFilter: ["class", "style"], // Only these attributes
});

// Stop observing
observer.disconnect();

// Practical example: Wait for dynamic content
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    // Check if already exists
    const element = document.querySelector(selector);
    if (element) {
      return resolve(element);
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Timeout
    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Element ${selector} not found within ${timeout}ms`));
    }, timeout);
  });
}

// Usage
const dynamicElement = await waitForElement("#loaded-by-ajax");
```

---

### ResizeObserver - Watch Element Size Changes

Detect when elements change size (more efficient than window resize).

```javascript
const observer = new ResizeObserver((entries) => {
  entries.forEach((entry) => {
    const { width, height } = entry.contentRect;
    console.log(`Element resized to ${width}x${height}`);

    // Responsive component logic
    if (width < 400) {
      entry.target.classList.add("compact");
    } else {
      entry.target.classList.remove("compact");
    }
  });
});

// Observe element
const element = document.getElementById("resizable");
observer.observe(element);

// Stop observing
observer.unobserve(element);
observer.disconnect();

// Practical: Responsive chart
const chartContainer = document.getElementById("chart");
const chartObserver = new ResizeObserver((entries) => {
  const { width, height } = entries[0].contentRect;
  redrawChart(width, height);
});
chartObserver.observe(chartContainer);
```

---

### Navigator Object - Browser & Device Info

```javascript
// User agent (browser info)
console.log(navigator.userAgent);
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."

// Language
console.log(navigator.language); // "en-US"
console.log(navigator.languages); // ["en-US", "en", "es"]

// Online status
console.log(navigator.onLine); // true or false

window.addEventListener("online", () => console.log("Back online!"));
window.addEventListener("offline", () => console.log("Lost connection"));

// Cookies enabled
console.log(navigator.cookieEnabled); // true or false

// Platform
console.log(navigator.platform); // "Win32", "MacIntel", etc.

// Hardware concurrency (CPU cores)
console.log(navigator.hardwareConcurrency); // 8

// Device memory (approximate RAM in GB)
console.log(navigator.deviceMemory); // 8

// Share API (mobile)
if (navigator.share) {
  navigator.share({
    title: "Check this out",
    text: "Amazing content",
    url: "https://example.com",
  });
}

// Vibration (mobile)
if (navigator.vibrate) {
  navigator.vibrate(200); // Vibrate 200ms
  navigator.vibrate([100, 50, 100]); // Pattern: vibrate, pause, vibrate
}

// Permissions API
const permission = await navigator.permissions.query({ name: "geolocation" });
console.log(permission.state); // "granted", "denied", or "prompt"

permission.addEventListener("change", () => {
  console.log("Permission changed to:", permission.state);
});
```

---

### History API - Browser Navigation

```javascript
// Current state
console.log(history.length); // Number of entries in history stack
console.log(history.state); // Current state object

// Navigate
history.back(); // Same as browser back button
history.forward(); // Same as browser forward button
history.go(-2); // Go back 2 pages
history.go(1); // Go forward 1 page

// Add history entry WITHOUT page reload
history.pushState(
  { page: "profile", userId: 123 }, // State object
  "", // Title (ignored by most browsers)
  "/profile/123" // New URL
);

// Replace current entry (no new history entry)
history.replaceState({ page: "profile", userId: 123 }, "", "/profile/123");

// Listen for back/forward navigation
window.addEventListener("popstate", (event) => {
  console.log("Navigation occurred");
  console.log("State:", event.state);

  // Handle the navigation
  if (event.state?.page === "profile") {
    showProfile(event.state.userId);
  }
});

// SPA Router Example
class SimpleRouter {
  constructor() {
    this.routes = {};
    window.addEventListener("popstate", (e) => this.handleRoute());
  }

  addRoute(path, handler) {
    this.routes[path] = handler;
  }

  navigate(path, state = {}) {
    history.pushState(state, "", path);
    this.handleRoute();
  }

  handleRoute() {
    const path = window.location.pathname;
    const handler = this.routes[path];

    if (handler) {
      handler(history.state);
    } else {
      this.routes["/404"]?.();
    }
  }
}

// Usage
const router = new SimpleRouter();
router.addRoute("/", () => showHome());
router.addRoute("/about", () => showAbout());
router.addRoute("/user", (state) => showUser(state.userId));
router.addRoute("/404", () => showNotFound());

// Navigate programmatically
router.navigate("/user", { userId: 123 });
```

---

### Clipboard API - Copy/Paste

```javascript
// Write to clipboard (modern async API)
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    console.log("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

// Read from clipboard
async function pasteFromClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    console.log("Pasted text:", text);
    return text;
  } catch (err) {
    console.error("Failed to paste:", err);
  }
}

// Copy image to clipboard
async function copyImage(imageBlob) {
  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": imageBlob,
      }),
    ]);
    console.log("Image copied!");
  } catch (err) {
    console.error("Failed to copy image:", err);
  }
}

// Read images from clipboard
async function pasteImage() {
  try {
    const items = await navigator.clipboard.read();

    for (const item of items) {
      for (const type of item.types) {
        if (type.startsWith("image/")) {
          const blob = await item.getType(type);
          const url = URL.createObjectURL(blob);
          return url;
        }
      }
    }
  } catch (err) {
    console.error("Failed to paste image:", err);
  }
}

// Fallback for older browsers
function copyTextFallback(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

// Copy button example
document.getElementById("copy-btn").addEventListener("click", async () => {
  const text = document.getElementById("text-to-copy").value;

  if (navigator.clipboard) {
    await copyToClipboard(text);
  } else {
    copyTextFallback(text);
  }

  showToast("Copied!");
});
```

---

### Geolocation API - User Location

```javascript
// Check if supported
if (!navigator.geolocation) {
  console.log("Geolocation not supported");
}

// Get current position (one-time)
navigator.geolocation.getCurrentPosition(
  // Success callback
  (position) => {
    console.log("Latitude:", position.coords.latitude);
    console.log("Longitude:", position.coords.longitude);
    console.log("Accuracy:", position.coords.accuracy, "meters");
    console.log("Altitude:", position.coords.altitude);
    console.log("Speed:", position.coords.speed);
    console.log("Timestamp:", position.timestamp);
  },
  // Error callback
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied geolocation");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Position unavailable");
        break;
      case error.TIMEOUT:
        console.log("Request timed out");
        break;
    }
  },
  // Options
  {
    enableHighAccuracy: true, // Use GPS if available
    timeout: 10000, // Max wait time (ms)
    maximumAge: 60000, // Accept cached position up to 1 min old
  }
);

// Watch position continuously
const watchId = navigator.geolocation.watchPosition(
  (position) => {
    updateMap(position.coords.latitude, position.coords.longitude);
  },
  (error) => {
    console.error("Watch error:", error);
  },
  {
    enableHighAccuracy: true,
  }
);

// Stop watching
navigator.geolocation.clearWatch(watchId);

// Promisified version
function getCurrentPosition(options = {}) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

// Usage
async function getLocation() {
  try {
    const position = await getCurrentPosition({ enableHighAccuracy: true });
    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
  } catch (error) {
    console.error("Failed to get location:", error);
    return null;
  }
}
```

---

### Web Storage: localStorage vs sessionStorage

Both have the same API but different lifetimes.

#### Key Differences

| Feature      | localStorage                 | sessionStorage   |
| ------------ | ---------------------------- | ---------------- |
| **Lifetime** | Forever (until cleared)      | Until tab closes |
| **Scope**    | Shared across all tabs       | Per tab only     |
| **Size**     | ~5-10MB                      | ~5-10MB          |
| **Survives** | Page reload, browser restart | Only page reload |

#### Complete API

```javascript
// Both have identical methods
const storage = localStorage; // or sessionStorage

// Set item
storage.setItem("username", "john");

// Get item
const username = storage.getItem("username"); // 'john' or null

// Remove item
storage.removeItem("username");

// Clear all
storage.clear();

// Get number of items
console.log(storage.length);

// Get key by index
const firstKey = storage.key(0);

// Iterate all items
for (let i = 0; i < storage.length; i++) {
  const key = storage.key(i);
  const value = storage.getItem(key);
  console.log(`${key}: ${value}`);
}

// Or using Object.keys (only own properties)
Object.keys(storage).forEach((key) => {
  console.log(`${key}: ${storage.getItem(key)}`);
});
```

#### Storing Objects and Arrays

```javascript
// Storage only holds strings!
const user = { name: "John", age: 25 };

// WRONG - stores "[object Object]"
localStorage.setItem("user", user);

// CORRECT - stringify first
localStorage.setItem("user", JSON.stringify(user));

// Parse when reading
const storedUser = JSON.parse(localStorage.getItem("user"));

// Helper functions
const storage = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  get(key, defaultValue = null) {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;

    try {
      return JSON.parse(item);
    } catch {
      return item; // Return as-is if not JSON
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },
};

// Usage
storage.set("settings", { theme: "dark", lang: "en" });
const settings = storage.get("settings", { theme: "light" });
```

#### Storage Events (Cross-Tab Communication)

```javascript
// Fires when storage changes in ANOTHER tab
window.addEventListener("storage", (event) => {
  console.log("Key changed:", event.key);
  console.log("Old value:", event.oldValue);
  console.log("New value:", event.newValue);
  console.log("URL that made change:", event.url);
  console.log("Storage area:", event.storageArea);

  // React to changes
  if (event.key === "theme") {
    applyTheme(event.newValue);
  }

  if (event.key === "logout") {
    // Another tab logged out
    window.location.href = "/login";
  }
});

// Trigger cross-tab logout
function logoutAllTabs() {
  localStorage.setItem("logout", Date.now().toString());
  localStorage.removeItem("logout");
  window.location.href = "/login";
}
```

#### When to Use Which

```javascript
// localStorage - Persistent data
localStorage.setItem("theme", "dark"); // User preference
localStorage.setItem("authToken", "xxx"); // Stay logged in
localStorage.setItem("recentSearches", "[]"); // History

// sessionStorage - Temporary/sensitive data
sessionStorage.setItem("formDraft", "{}"); // Form in progress
sessionStorage.setItem("wizardStep", "2"); // Multi-step flow
sessionStorage.setItem("returnUrl", "/profile"); // Where to redirect
```

#### Checking Storage Availability

```javascript
function isStorageAvailable(type) {
  try {
    const storage = window[type];
    const test = "__storage_test__";
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

// Usage
if (isStorageAvailable("localStorage")) {
  // Safe to use localStorage
} else {
  // Use fallback (cookies, in-memory, etc.)
}
```

---

### Quick Reference: All Browser APIs

| API                       | Purpose               | Key Methods                                            |
| ------------------------- | --------------------- | ------------------------------------------------------ |
| **setTimeout**            | Delay execution       | `setTimeout()`, `clearTimeout()`                       |
| **setInterval**           | Repeat execution      | `setInterval()`, `clearInterval()`                     |
| **requestAnimationFrame** | Smooth animations     | `requestAnimationFrame()`, `cancelAnimationFrame()`    |
| **IntersectionObserver**  | Visibility detection  | `observe()`, `unobserve()`, `disconnect()`             |
| **MutationObserver**      | DOM change detection  | `observe()`, `disconnect()`                            |
| **ResizeObserver**        | Size change detection | `observe()`, `unobserve()`, `disconnect()`             |
| **navigator**             | Browser/device info   | `.userAgent`, `.language`, `.onLine`, `.share()`       |
| **history**               | Browser navigation    | `pushState()`, `replaceState()`, `back()`, `forward()` |
| **clipboard**             | Copy/paste            | `writeText()`, `readText()`, `write()`, `read()`       |
| **geolocation**           | User location         | `getCurrentPosition()`, `watchPosition()`              |
| **localStorage**          | Persistent storage    | `setItem()`, `getItem()`, `removeItem()`, `clear()`    |
| **sessionStorage**        | Session storage       | Same as localStorage                                   |

## Real-World API Wrapper

```javascript
class APIClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...defaultHeaders,
    };
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token;
  }

  clearAuthToken() {
    this.authToken = null;
  }

  async request(endpoint, options = {}) {
    const url = new URL(endpoint, this.baseURL);

    // Add query params if provided
    if (options.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, value);
        }
      });
    }

    // Build headers
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    // Add auth token if available
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }

    // Build fetch options
    const fetchOptions = {
      method: options.method || "GET",
      headers,
    };

    // Add body if provided
    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    // Add signal for cancellation
    if (options.signal) {
      fetchOptions.signal = options.signal;
    }

    // Make request
    const response = await fetch(url, fetchOptions);

    // Handle errors
    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error = new Error(errorData.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    // Handle empty response
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Convenience methods
  get(endpoint, params, options = {}) {
    return this.request(endpoint, { ...options, method: "GET", params });
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "POST", body });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PUT", body });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: "PATCH", body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: "DELETE" });
  }
}

// Usage
const api = new APIClient("https://api.example.com");

// Login
const { token } = await api.post("/auth/login", {
  email: "user@example.com",
  password: "password123",
});
api.setAuthToken(token);

// Make authenticated requests
const users = await api.get("/users", { page: 1, limit: 10 });
const newUser = await api.post("/users", {
  name: "John",
  email: "john@example.com",
});
await api.patch("/users/1", { name: "John Updated" });
await api.delete("/users/1");

// With cancellation
const controller = new AbortController();
const users = await api.get("/users", {}, { signal: controller.signal });
```

---

## Building APIs with Node.js and Express

### Basic Server Setup

```javascript
const express = require("express");
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### RESTful Routes Pattern

```javascript
// In-memory data store (use database in real apps)
let users = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];
let nextId = 3;

// GET all users
app.get("/api/users", (req, res) => {
  // Handle query params for filtering/pagination
  const { page = 1, limit = 10, search } = req.query;

  let result = users;

  // Filter by search
  if (search) {
    result = result.filter((u) =>
      u.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  // Paginate
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedUsers = result.slice(startIndex, endIndex);

  res.json({
    data: paginatedUsers,
    meta: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: result.length,
      totalPages: Math.ceil(result.length / limit),
    },
  });
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({
      error: { message: "User not found", code: "USER_NOT_FOUND" },
    });
  }

  res.json({ data: user });
});

// POST create user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  // Validation
  if (!name || !email) {
    return res.status(400).json({
      error: { message: "Name and email are required" },
    });
  }

  // Check if email exists
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({
      error: { message: "Email already exists", code: "EMAIL_EXISTS" },
    });
  }

  const newUser = { id: nextId++, name, email };
  users.push(newUser);

  res.status(201).json({ data: newUser });
});

// PATCH update user
app.patch("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: { message: "User not found" },
    });
  }

  // Only update provided fields
  const { name, email } = req.body;
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;

  res.json({ data: users[userIndex] });
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      error: { message: "User not found" },
    });
  }

  users.splice(userIndex, 1);
  res.status(204).send(); // No content
});
```

### Middleware Examples

```javascript
// Logging middleware
function logger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
}

// Authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: { message: "Authentication required" },
    });
  }

  const token = authHeader.substring(7);

  try {
    // Verify token (using jwt library in real app)
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: { message: "Invalid or expired token" },
    });
  }
}

// Validation middleware factory
function validateBody(schema) {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.body[field];

      if (rules.required && !value) {
        errors.push(`${field} is required`);
      }

      if (rules.type && value && typeof value !== rules.type) {
        errors.push(`${field} must be a ${rules.type}`);
      }

      if (rules.minLength && value && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters`);
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: { message: "Validation failed", details: errors },
      });
    }

    next();
  };
}

// Use middleware
app.use(logger);

// Protected route
app.get("/api/profile", authenticate, (req, res) => {
  res.json({ data: req.user });
});

// Validated route
app.post(
  "/api/users",
  validateBody({
    name: { required: true, type: "string", minLength: 2 },
    email: { required: true, type: "string" },
  }),
  (req, res) => {
    // Request body is validated
  }
);
```

### Central Error Handling

```javascript
// Custom error class
class AppError extends Error {
  constructor(message, statusCode, code = null) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

// Async handler wrapper (avoids try-catch in every route)
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Routes using asyncHandler
app.get(
  "/api/users/:id",
  asyncHandler(async (req, res) => {
    const user = await findUserById(req.params.id);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }

    res.json({ data: user });
  })
);

// 404 handler (for undefined routes)
app.use((req, res) => {
  res.status(404).json({
    error: { message: `Cannot ${req.method} ${req.path}` },
  });
});

// Global error handler (must be last)
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Operational errors (expected)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      },
    });
  }

  // Programming errors (unexpected) - don't leak details
  res.status(500).json({
    error: { message: "Internal server error" },
  });
});
```

### CORS Configuration

```javascript
const cors = require("cors");

// Allow all origins (development only)
app.use(cors());

// Production configuration
app.use(
  cors({
    origin: ["https://myapp.com", "https://admin.myapp.com"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies
    maxAge: 86400, // Cache preflight for 24 hours
  })
);

// Dynamic origin
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ["https://myapp.com"];

      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
```

### Rate Limiting

```javascript
const rateLimit = require("express-rate-limit");

// General rate limit
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  message: {
    error: { message: "Too many requests, please try again later" },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  message: {
    error: { message: "Too many login attempts, please try again later" },
  },
});

// Apply limiters
app.use("/api/", generalLimiter);
app.use("/api/auth/login", authLimiter);
```

---

## Summary: Complete Fetch Checklist

### Making Requests

- [ ] Use `async/await` for cleaner code
- [ ] Always check `response.ok` before parsing
- [ ] Set correct `Content-Type` header for POST/PUT/PATCH
- [ ] Use `URLSearchParams` for query strings
- [ ] Handle both network errors and HTTP errors

### Error Handling

- [ ] Create custom error classes for different error types
- [ ] Parse error response body when available
- [ ] Handle specific status codes (401, 403, 404, 429, 500)
- [ ] Provide user-friendly error messages

### Advanced Patterns

- [ ] Implement request timeout with `AbortController`
- [ ] Use debounce for search inputs
- [ ] Use throttle for scroll/resize handlers
- [ ] Implement retry with exponential backoff
- [ ] Cancel requests on component unmount

### Security

- [ ] Never store tokens in code
- [ ] Use HTTPS in production
- [ ] Validate all input on the server
- [ ] Implement rate limiting
- [ ] Configure CORS properly

### Performance

- [ ] Use parallel requests when possible (`Promise.all`)
- [ ] Implement caching where appropriate
- [ ] Paginate large datasets
- [ ] Consider request deduplication
