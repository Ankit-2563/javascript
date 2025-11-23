# Web Performance & React Optimization Guide

## Table of Contents

1. [Ground Rules](#ground-rules)
2. [React Performance](#react-performance)
3. [Bundle Size Optimization](#bundle-size-optimization)
4. [Code Splitting Strategies](#code-splitting-strategies)
5. [Lazy Loading](#lazy-loading)
6. [Image Optimization](#image-optimization)
7. [Network Performance](#network-performance)
8. [Web Vitals (LCP, INP, CLS)](#web-vitals)
9. [Performance Profiling Tools](#performance-profiling-tools)

---

## Ground Rules

### Measure First, Then Optimize

**Performance work without measurement = guessing.** Always establish a baseline before making changes.

#### Essential Measurement Tools

- **Chrome DevTools**

  - Performance tab: Record traces during loading, scrolling, typing, or clicking
  - See long tasks, network waterfall, and FPS drops
  - Network tab: Monitor requests and timing

- **Lighthouse**

  - Automated performance audit (built into Chrome DevTools)
  - Provides scores and actionable suggestions
  - Estimates Core Web Vitals

- **React DevTools Profiler**

  - Identify which components re-render unnecessarily
  - Measure render time per component
  - Detect cascading re-renders

- **Web Vitals Metrics**
  - LCP (Largest Contentful Paint): Loading performance
  - INP (Interaction to Next Paint): Responsiveness
  - CLS (Cumulative Layout Shift): Visual stability

#### What to Look For

- **Slow initial load**: Bundle too large, images too heavy
- **Janky scrolling/typing**: Too much work on the main thread
- **Layout jumps**: Missing image sizes, bad CSS, unsized content
- **Long tasks**: JavaScript blocking the main thread (>50ms)

---

## React Performance

### 1.1 React.memo

**What it is:** A wrapper for functional components that skips re-render if props haven't changed (using shallow comparison).

**Why use it:** When a parent re-renders frequently, all its children also re-render by default. If a child renders complex UI or a large list, this is wasteful and can cause performance issues.

**When to use:**

- Components re-used many times (list items, cards, table rows)
- Components with relatively heavy rendering logic
- NOT needed on tiny components called only once

**Simple Example:**

```javascript
import React, { memo } from "react";

const ProductCard = memo(function ProductCard({ name, price }) {
  console.log("Rendered:", name);
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>₹{price}</p>
    </div>
  );
});

export default function ProductList({ products, filter }) {
  // Parent re-renders when filter changes
  const visible = products.filter((p) => p.name.includes(filter));

  return (
    <div>
      {visible.map((p) => (
        <ProductCard key={p.id} name={p.name} price={p.price} />
      ))}
    </div>
  );
}
```

**What happens:** When `filter` changes, the list filtering re-runs, but each `ProductCard` only re-renders if its `name` or `price` prop actually changed. Without `React.memo`, every card would re-render every time the parent re-renders.

---

### 1.2 useMemo

**What it is:** A React hook that caches the result of a calculation between renders.

**Why use it:** Expensive operations (sorting large arrays, heavy loops, deriving complex data) should not be repeated on every render.

**When to use:**

- Truly expensive calculations (sorting 10,000+ items, complex aggregations)
- Keep dependencies correct (the dependency array controls when to recalculate)
- Do NOT wrap every small `.map()` or `new Date()` with useMemo; this adds overhead without real gain

**Example: Expensive Calculation in Dashboard**

```javascript
import { useMemo } from "react";

function Dashboard({ transactions }) {
  const totalByCategory = useMemo(() => {
    console.log("Calculating...");
    const map = {};

    for (const tx of transactions) {
      map[tx.category] = (map[tx.category] || 0) + tx.amount;
    }

    return map;
  }, [transactions]); // Only recompute if transactions array changes

  return (
    <div>
      {Object.entries(totalByCategory).map(([cat, amount]) => (
        <div key={cat}>
          {cat}: ₹{amount}
        </div>
      ))}
    </div>
  );
}
```

**Key Rules:**

- Only use for truly expensive calculations
- Keep the dependency array accurate
- Avoid premature optimization on lightweight operations

---

### 1.3 useCallback

**What it is:** A React hook that caches a function reference between renders.

**Why use it:** When passing callbacks into memoized children (with `React.memo`) or into `useEffect`, a new function on each render will cause:

- Unnecessary child re-renders (because props changed)
- Effects to re-run unnecessarily

**When to use:**

- Callbacks passed to memoized components
- Callbacks used as dependencies in `useEffect` or other hooks

**Example: Todo List with Memoized Items**

```javascript
import { memo, useCallback, useState } from "react";

const TodoItem = memo(function TodoItem({ todo, onToggle }) {
  console.log("Todo render:", todo.text);

  return (
    <label>
      <input
        type="checkbox"
        checked={todo.done}
        onChange={() => onToggle(todo.id)}
      />
      {todo.text}
    </label>
  );
});

export default function TodoList() {
  const [todos, setTodos] = useState([
    { id: 1, text: "Study JS", done: false },
    { id: 2, text: "Practice React", done: false },
  ]);

  const handleToggle = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }, []); // Empty dependency array: same function reference across all renders

  return (
    <div>
      {todos.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={handleToggle} />
      ))}
    </div>
  );
}
```

**What happens:** Without `useCallback`, `onToggle` would be a new function on every render, causing `TodoItem` to re-render even though the logic is the same. With `useCallback`, the function reference stays the same, so memoized children don't re-render unnecessarily.

---

### 1.4 Virtualization (Windowing)

**What it is:** Rendering only a small window of a huge list (e.g., 10 visible items out of 10,000) and recycling DOM elements while scrolling.

**Why use it:** The DOM is heavy. Thousands of nodes cause slow layout calculations and expensive paint operations. Virtualization keeps the DOM small and focused, resulting in smooth scrolling.

**Real-world use cases:**

- Chat applications with thousands of messages
- E-commerce sites listing 20,000+ products
- Social media feeds with infinite scroll
- Data tables with millions of rows

**How it works:** Use libraries like `react-window` or `react-virtualized` to manage the rendering.

```javascript
import { FixedSizeList as List } from "react-window";

function HugeList({ items }) {
  return (
    <List height={600} itemCount={items.length} itemSize={50} width="100%">
      {({ index, style }) => <div style={style}>{items[index].name}</div>}
    </List>
  );
}
```

**Key benefit:** Only items currently visible in the scroll area are actually in the DOM. As the user scrolls, old items are removed and new ones are added, keeping the DOM minimal.

---

## Bundle Size Optimization

**Why it matters:** A larger bundle means:

- Slower initial download (especially on 3G or cheap mobile networks)
- More JavaScript to parse and execute
- Higher CPU cost on slower devices

### Key Techniques

#### Remove Unused Code

Use tree-shaking-friendly imports to avoid bundling unused utilities:

```javascript
// Bad: Imports the entire lodash library (~70+ KB)
import _ from "lodash";
const debounced = _.debounce(fn, 300);

// Good: Imports only the specific function
import debounce from "lodash/debounce";
const debounced = debounce(fn, 300);
```

#### Avoid Huge Libraries If Not Needed

- Instead of **moment.js** (~70+ KB), use native `Intl.DateTimeFormat` or lightweight alternatives like `date-fns` or `day.js`
- Instead of jQuery (in 2024), use native DOM APIs or lightweight frameworks
- Be intentional about every dependency you add

#### Use Production Builds

For React apps, ensure `NODE_ENV=production`:

```bash
NODE_ENV=production npm run build
```

This removes dev helpers, warnings, and debug code, significantly reducing bundle size and improving execution speed.

#### Analyze Your Bundle

Use tools to visualize what's taking up space:

- **webpack-bundle-analyzer**: Visual breakdown of bundle contents
- **Vite visualizer plugin**: For Vite projects
- **Chrome DevTools Coverage tab**: Shows which JS/CSS is unused on a page

**Mindset:** Every kilobyte your user downloads must be justified. If a library is 50 KB but you only use 5 KB of it, consider alternatives.

---

## Code Splitting Strategies

**What it is:** Splitting your JavaScript into multiple chunks and loading only what is needed for the current page or feature.

**Why it matters:** Faster initial page load. A user visiting the home page shouldn't download admin panel code, heavy charting libraries, or analytics tools they don't use.

### Route-Based Splitting

Each route or page becomes its own JavaScript chunk, loaded on-demand.

**Example with React Router:**

```javascript
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Admin = lazy(() => import("./pages/Admin"));
const Analytics = lazy(() => import("./pages/Analytics"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

**What happens:** When the app loads, only the Home component is downloaded and parsed. The Admin and Analytics chunks are downloaded only when the user navigates to those routes.

### Component-Level Splitting

Large or rarely-used components can be split into separate chunks:

```javascript
const DataChart = lazy(() => import("./components/DataChart"));
const RichTextEditor = lazy(() => import("./components/RichTextEditor"));

function Dashboard() {
  const [showChart, setShowChart] = useState(false);

  return (
    <div>
      <button onClick={() => setShowChart(!showChart)}>Toggle Chart</button>

      {showChart && (
        <Suspense fallback={<div>Loading chart...</div>}>
          <DataChart />
        </Suspense>
      )}
    </div>
  );
}
```

### Library-Level Splitting

Dynamically import heavy libraries only when the user needs them:

```javascript
async function openAnalytics() {
  // Only import and load the analytics library when needed
  const { default: AnalyticsModule } = await import("./modules/analytics");
  AnalyticsModule.init();
}
```

---

## Lazy Loading

Lazy loading means loading something only when it's needed. This can apply to JavaScript, images, or components.

### React Component Lazy Loading

Covered in [Code Splitting Strategies](#code-splitting-strategies). Use `React.lazy()` and `Suspense` for:

- Routes and pages
- Heavy widgets and components
- Modal dialogs or overlays

### Image Lazy Loading

Most of your users' bandwidth goes to images. Images below the fold shouldn't be loaded immediately.

#### Simple Approach: Native `loading="lazy"`

Modern browsers support the `loading` attribute:

```html
<img src="product.jpg" alt="Product" loading="lazy" width="300" height="200" />
```

The browser automatically delays loading until the image is close to the viewport.

#### Advanced Approach: IntersectionObserver

For more control, use the Intersection Observer API:

```javascript
const imgs = document.querySelectorAll("img[data-src]");

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const img = entry.target;
      img.src = img.dataset.src; // Load the actual image
      observer.unobserve(img); // Stop observing this image
    }
  });
});

imgs.forEach((img) => observer.observe(img));
```

**HTML setup:**

```html
<img
  data-src="product-large.jpg"
  alt="Product"
  src="placeholder.jpg"
  width="300"
  height="200"
/>
```

**Why:** The image doesn't load until it's about to enter the viewport, saving bandwidth for users who never scroll to see it.

---

## Image Optimization

Images are often the heaviest resources on a page. Optimizing them has a huge impact on performance.

### Use the Right Format

- **JPG/WEBP/AVIF**: For photographs and complex images (naturally smaller)
- **SVG**: For icons, logos, and simple graphics (scalable, small)
- **PNG**: For images requiring transparency

### Serve the Right Size

Don't ship a 3000×3000 px image to a 300×300 px card. Use responsive images:

```html
<picture>
  <source
    srcset="product-small.jpg 480w, product-medium.jpg 800w"
    media="(max-width: 800px)"
  />
  <source
    srcset="product-large.jpg 1200w, product-xlarge.jpg 1600w"
    media="(min-width: 801px)"
  />
  <img src="product-large.jpg" alt="Product" />
</picture>
```

Or use `srcset`:

```html
<img
  srcset="product-small.jpg 480w, product-large.jpg 1200w"
  sizes="(max-width: 600px) 100vw, 50vw"
  src="product-large.jpg"
  alt="Product"
/>
```

### Compression

Compress images in your build process using tools like:

- ImageOptim
- TinyPNG / TinyJPG
- Squoosh

### Use a CDN

Host images on a content delivery network (CDN) that supports:

- On-the-fly resizing (Cloudflare, Imgix, etc.)
- Format conversion (serving WebP to capable browsers, JPG to others)
- Compression and optimization

**Real-world example:** An e-commerce homepage loads 30 product cards. Each image is compressed to ~50 KB and set to `loading="lazy"`. Result: The first view loads fast (without images), and images stream in as the user scrolls.

---

## Network Performance

### HTTP/2+ Multiplexing

Modern servers use HTTP/2 and HTTP/3 automatically over TLS.

**Key benefits:**

- Multiple files transmitted over one connection (no connection overhead)
- Header compression
- Server push (optional)

**As a JavaScript developer:** Ensure your backend and CDN support HTTP/2+. Avoid making an insane number of tiny requests (there's still overhead per request, even in HTTP/2).

### Caching Strategies

**Goal:** Avoid re-downloading assets that don't change.

#### Static Assets (JS, CSS, Images, Fonts)

Use content hashing in filenames and long cache durations:

```javascript
// Webpack/build tool generates: app.abc123def456.js
Cache-Control: public, max-age=31536000, immutable
```

Browsers will cache these for a year. When you update the code, the filename changes, forcing a fresh download.

#### APIs That Change Infrequently

Example: `/api/countries`

```http
Cache-Control: max-age=3600
```

Cache for 1 hour, then revalidate. Or use ETags for conditional requests.

#### Client-Side Caching

Store responses in memory or persistent storage:

```javascript
// localStorage Example
async function fetchProfile() {
  const cached = localStorage.getItem("profile");
  if (cached) return JSON.parse(cached);

  const res = await fetch("/api/profile");
  const data = await res.json();
  localStorage.setItem("profile", JSON.stringify(data));

  return data;
}
```

Better options: IndexedDB for larger data, or libraries like React Query / SWR for intelligent caching and revalidation.

### Content Delivery Networks (CDNs)

**What they are:** Globally distributed servers that cache and serve your static files (JS, CSS, images, fonts) from locations near your users.

**Why it helps:**

- Shorter geographic distance = lower latency
- Offloads traffic from your origin server
- Automatic compression and optimization

**As a front-end developer:** You usually don't manage this directly. Services like Vercel, Netlify, and Cloudflare act as CDNs automatically when you deploy there.

---

## Web Vitals (LCP, INP, CLS)

Core Web Vitals are metrics that Google uses to measure and rank user experience. As of 2024, they consist of three metrics.

### LCP – Largest Contentful Paint

**What it measures:** Time until the largest visible content (image or text block) is painted on the screen.

**Good score:** ≤ 2.5 seconds

**Why it matters:** Users perceive the page as loaded when they see the main content.

**How to improve:**

1. **Optimize the hero image:**
   - Compress it aggressively
   - Serve from a CDN
   - Use the right format (WebP, AVIF)
   - Preload it with a `<link>` tag:

```html
<link rel="preload" as="image" href="hero.jpg" />
```

2. **Reduce render-blocking resources:**
   - Minify CSS and JS
   - Defer non-critical scripts:

```html
<script src="analytics.js" defer></script>
```

3. **Optimize CSS for above-the-fold content:**
   - Load critical CSS inline
   - Defer non-critical CSS

**Real-world example:** A landing page with a large banner image. Ensure the banner image loads and renders quickly, and the CSS for that section is minimal and non-blocking.

---

### INP – Interaction to Next Paint (Replaces FID)

**What it measures:** The time from when the user interacts (click, tap, keypress) to when the page responds with a visual update. Measured across the entire session, not just the first interaction.

**Good score:** ≤ 200 milliseconds

**Why it matters:** Users want pages to feel snappy and responsive. A 500 ms delay feels sluggish.

**How to improve:**

1. **Avoid long tasks on the main thread** (anything > 50 ms blocks user interactions)

   - Break heavy processing into smaller chunks

2. **Use `setTimeout` or `requestIdleCallback`** to yield to the browser:

```javascript
function processHugeArray(arr) {
  let i = 0;

  function chunk() {
    const end = Math.min(i + 1000, arr.length);

    for (; i < end; i++) {
      // Process arr[i]
    }

    if (i < arr.length) {
      setTimeout(chunk, 0); // Yield to browser
    }
  }

  chunk();
}
```

3. **Avoid heavy synchronous work in event handlers:**

```javascript
// Bad: Blocking the main thread for 300ms
button.addEventListener("click", () => {
  for (let i = 0; i < 1000000; i++) {
    expensiveCalculation();
  }
});

// Good: Yielding to the browser
button.addEventListener("click", () => {
  processInChunks(items);
});
```

4. **Use Web Workers** for CPU-heavy tasks:

```javascript
// main.js
const worker = new Worker("heavy-work.js");
worker.postMessage(largeDataset);

worker.onmessage = (e) => {
  console.log("Result:", e.data); // Main thread stays responsive
};
```

---

### CLS – Cumulative Layout Shift

**What it measures:** The sum of all unexpected layout movements while the page is loading and interacting. A score of 0 is perfect; every shift adds to the score.

**Good score:** ≤ 0.1

**Why it matters:** Layout shifts are jarring and annoying. You try to tap a button, but an ad loads above it and pushes it down, so you tap the wrong thing.

**How to improve:**

1. **Always reserve space for images and iframes:**

```html
<img src="product.jpg" alt="Product" width="300" height="200" />
```

Specifying `width` and `height` lets the browser reserve space before the image loads.

2. **Use CSS `aspect-ratio`:**

```css
.banner {
  aspect-ratio: 3 / 1;
  /* Browser reserves this space; image fills it */
}
```

3. **Don't inject content above existing content after load:**

Instead of inserting a cookie banner at the top (shifting everything down):

- Overlay it in a fixed position
- Or place it at the bottom
- Or reserve space for it from the start

4. **Set font-display for web fonts:**

```css
@font-face {
  font-family: "CustomFont";
  font-display: swap; /* Show fallback while loading */
  src: url("font.woff2") format("woff2");
}
```

---

## Performance Profiling Tools

### Chrome DevTools – Performance Panel

**How to use:**

1. Open DevTools (F12)
2. Go to the Performance tab
3. Click the Record button
4. Perform actions: load the page, scroll, type, click buttons
5. Click Stop
6. Analyze the trace

**What you'll see:**

- **Long tasks** (highlighted in red): JavaScript that blocks the main thread for > 50 ms
- **Network waterfall**: When files are downloaded and in what order
- **FPS drops**: Frames rendered per second
- **JavaScript evaluation time**: How long your code takes to parse and execute
- **Rendering work**: Layout calculations and paints

**What to look for:**

- Huge JS evaluation times (indicates bundle too large or heavy processing)
- Long scripting tasks (loops, calculations on main thread)
- Layout thrashing (many reflows from DOM manipulation)

---

### Lighthouse

**How to use:**

1. Open DevTools
2. Go to the Lighthouse tab
3. Click "Analyze page load"
4. Wait for the report

**What it checks:**

- Overall Performance score (0-100)
- Core Web Vitals estimates (LCP, INP, CLS)
- Best practices and SEO
- Accessibility issues

**What it suggests:**

- "Reduce unused JavaScript"
- "Serve images in next-gen formats"
- "Eliminate render-blocking resources"
- "Properly size images"

Use these suggestions as a roadmap for optimization.

---

## Resources

- [web.dev](https://web.dev) – Google's guide to web performance
- [React documentation](https://react.dev) – Official React docs on performance
- [Chrome DevTools](https://developer.chrome.com/docs/devtools) – Official DevTools documentation