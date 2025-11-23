# JavaScript Fundamentals

A comprehensive, beginner-to-advanced JavaScript learning repository covering core concepts, best practices, and real-world patterns used by professional developers.

---

## What's Inside

This repository is organized into focused modules, each covering a fundamental JavaScript topic with detailed explanations, code examples, and best practices.

### Core Language Concepts

| Module                                                | Description                                                                                                              |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **[variables/](./variables)**                         | Variable declarations (`var`, `let`, `const`), naming conventions, scope, closures, hoisting, and the Temporal Dead Zone |
| **[data-type/](./data-type)**                         | Primitive vs reference types, mutability, cloning (shallow vs deep), and memory management                               |
| **[operators/](./operators)**                         | Arithmetic, assignment, comparison, logical, nullish coalescing, optional chaining, spread/rest operators                |
| **[equality-comparision/](./equality-comparision)**   | `==` vs `===`, type coercion, and why strict equality matters                                                            |
| **[typing-in-programming/](./typing-in-programming)** | Dynamic vs static typing, why TypeScript exists                                                                          |

### Control Flow & Functions

| Module                              | Description                                                                                                                  |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **[control-flow/](./control-flow)** | `if/else`, `switch`, `for`, `while`, `do-while`, `for...of`, `for...in`, `break/continue`, ternary operator                  |
| **[js-functions/](./js-functions)** | Function types (declaration, expression, arrow), callbacks, higher-order functions, closures, IIFE, pure vs impure functions |

### Arrays, Strings & Data

| Module                                                      | Description                                                                                       |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **[array-and-string-methods/](./array-and-string-methods)** | Complete guide to array methods (`map`, `filter`, `reduce`, `find`, etc.) and string manipulation |
| **[json/](./json)**                                         | JSON syntax, `JSON.parse()`, `JSON.stringify()`, and working with API data                        |
| **[xml/](./xml)**                                           | XML fundamentals, when to use XML vs JSON, parsing XML in JavaScript                              |

### Browser & DOM

| Module                                | Description                                                                               |
| ------------------------------------- | ----------------------------------------------------------------------------------------- |
| **[dom/](./dom)**                     | DOM manipulation, selecting elements, events, event delegation, forms, and best practices |
| **[local-storage/](./local-storage)** | `localStorage` and `sessionStorage` APIs, persistence, and security considerations        |
| **[js-in-browser/](./js-in-browser)** | Running JavaScript in HTML files                                                          |
| **[js-with-src/](./js-with-src)**     | External script files and the `defer` attribute                                           |

### Asynchronous JavaScript

| Module                                  | Description                                                                                                         |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **[event-loop/](./event-loop)**         | Call stack, heap, Web APIs, task queue, microtask queue, and how async code executes                                |
| **[js-apis/](./js-apis)**               | Fetch API, HTTP methods, headers, error handling, `AbortController`, async patterns, and building APIs with Express |
| **[error-handling/](./error-handling)** | `try/catch/finally`, throwing errors, custom error classes, and async error handling                                |

### Advanced Topics

| Module                                                      | Description                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[memory-management/](./memory-management)**               | Garbage collection, memory leaks, `WeakMap`, `WeakSet`, `WeakRef`, and performance optimization                                                                                                                                                                                                    |
| **[remaining/](./remaining)**                               | Advanced JavaScript concepts including `this`, objects, prototypes, classes, destructuring, spread/rest, template literals, modules, scope, closures, hoisting, async/await, promises, regex, Map/Set, symbols, generators, dates, events, web storage, strict mode, debugging, and best practices |
| **[Databases/](./Databases)**                               | Comprehensive guide to databases including PostgreSQL (SQL) and MongoDB (NoSQL), CRUD operations, relationships, indexing, transactions, ACID properties, connection pooling, pagination, environment variables, and testing                                                                       |
| **[performance-optimization/](./performance-optimization)** | Web performance and React optimization covering ground rules, React.memo, useMemo, useCallback, virtualization, bundle size optimization, code splitting, lazy loading, image optimization, network performance, Web Vitals (LCP, INP, CLS), and profiling tools                                   |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) installed (for running `.js` files)
- A code editor (VS Code recommended)
- Basic understanding of HTML/CSS (for DOM sections)

### Running Examples

Most examples can be run directly with Node.js:

```bash
node variables/script.js
node control-flow/for-loop/for.js
node js-functions/closures.js
```

For browser-specific examples (DOM, localStorage), open the HTML files in your browser:

```bash
# Open in browser
open dom/index.html
open local-storage/index.html
```

---

## Recommended Learning Path

### Phase 1: Foundations

1. `variables/` - Start with how variables work
2. `data-type/` - Understand primitive vs reference types
3. `operators/` - Learn all JavaScript operators
4. `equality-comparision/` - Master `==` vs `===`

### Phase 2: Control Flow & Functions

5. `control-flow/` - Loops and conditionals
6. `js-functions/` - Functions are the heart of JavaScript

### Phase 3: Data Manipulation

7. `array-and-string-methods/` - Essential for real-world coding
8. `json/` - Working with data

### Phase 4: Browser & DOM

9. `dom/` - Making web pages interactive
10. `local-storage/` - Client-side data persistence

### Phase 5: Async JavaScript

11. `event-loop/` - Understand how JavaScript executes
12. `js-apis/` - Fetching data and building APIs
13. `error-handling/` - Writing robust code

### Phase 6: Advanced

14. `memory-management/` - Performance and optimization
15. `typing-in-programming/` - Intro to TypeScript concepts
16. `remaining/` - Deep dive into advanced JavaScript concepts
17. `Databases/` - Data persistence with PostgreSQL and MongoDB
18. `performance-optimization/` - Web performance and React optimization

---

## Advanced Topics Overview

### Advanced JavaScript Concepts (`remaining/`)

Comprehensive coverage of:

- **The `this` keyword**: Five rules, context binding, common pitfalls
- **Objects deep dive**: Creation methods, property descriptors, getters/setters, patterns
- **Prototypes and inheritance**: Prototype chain, constructor functions, inheritance patterns
- **Classes**: ES6 classes, inheritance, static methods, private fields, getters/setters
- **Destructuring**: Array and object destructuring, function parameters, patterns
- **Spread and rest operators**: Expanding and collecting elements
- **Template literals**: String interpolation, multi-line strings, tagged templates
- **Modules**: ES6 modules, import/export, dynamic imports
- **Scope, closures, and hoisting**: Variable scope, closure patterns, hoisting behavior
- **Asynchronous JavaScript**: Callbacks, promises, async/await
- **Regular expressions**: Pattern matching and text manipulation
- **Map, Set, WeakMap, WeakSet**: Advanced data structures
- **Symbols**: Unique identifiers
- **Iterators and generators**: Custom iteration, generator functions
- **Dates and time**: Working with dates, formatting, Intl API
- **Events**: Event listeners, delegation, custom events
- **Web Storage**: localStorage and sessionStorage
- **Strict mode**: Error prevention
- **Debugging**: Console methods, breakpoints, profiling
- **Best practices**: Code quality, patterns, and conventions

### Database Management (`Databases/`)

Complete database guide covering:

- **PostgreSQL (SQL)**: Relational database design, schemas, CRUD operations, relationships (one-to-many, many-to-many, one-to-one), transactions, ACID properties, using with JavaScript (pg library)
- **MongoDB (NoSQL)**: Document-oriented storage, collections and documents, CRUD operations, embedding vs referencing, Mongoose ODM, schema validation
- **When to use which**: Decision framework for choosing between SQL and NoSQL
- **Database design best practices**: Normalization, indexing, connection pooling, pagination, soft deletes, environment variables, testing

### Performance Optimization (`performance-optimization/`)

Web performance and React optimization covering:

- **Ground rules**: Measurement-first approach, essential tools (Chrome DevTools, Lighthouse, React DevTools Profiler)
- **React performance**: React.memo, useMemo, useCallback, virtualization (windowing)
- **Bundle size optimization**: Tree-shaking, removing unused code, production builds, bundle analysis
- **Code splitting strategies**: Route-based, component-level, and library-level splitting
- **Lazy loading**: Component lazy loading, image lazy loading, IntersectionObserver
- **Image optimization**: Format selection, responsive images, compression, CDN usage
- **Network performance**: HTTP/2+ multiplexing, caching strategies, CDN benefits
- **Web Vitals**: LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)
- **Performance profiling tools**: Chrome DevTools Performance panel, Lighthouse audits

---

## Additional Resources

- [MDN Web Docs](https://developer.mozilla.org/) - Comprehensive JavaScript documentation
- [JavaScript.info](https://javascript.info/) - Modern JavaScript tutorial
- [web.dev](https://web.dev) - Google's guide to web development and performance
- [React Documentation](https://react.dev) - Official React documentation
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Official PostgreSQL documentation
- [MongoDB Documentation](https://www.mongodb.com/docs/) - Official MongoDB documentation
