# JavaScript Data Types

JavaScript has only **two kinds of data types**: Primitive Types and Reference Types.

---

## 1. Primitive Types (Value Types)

Primitive types are the most basic data types in JavaScript. They represent single, immutable values.

### Characteristics:

- **Stored by value** – The actual value is stored in the variable
- **Stored directly in memory** – Typically stored on the stack
- **Immutable** – Once created, the value cannot be changed (though variables can be reassigned)

### The 7 Primitive Types:

1. **String** – `"hello"`, `'world'`
2. **Number** – `42`, `3.14`, `NaN`, `Infinity`
3. **BigInt** – `123n`, `BigInt(456)`
4. **Boolean** – `true`, `false`
5. **Undefined** – `undefined`
6. **Null** – `null`
7. **Symbol** – `Symbol('description')`

### Example:

```javascript
let a = 10;
let b = a; // b gets a copy of the value
b = 20;

console.log(a); // 10 (unchanged)
console.log(b); // 20
```

---

## 2. Reference Types (Objects)

Reference types store a reference (memory address) to the data rather than the data itself.

### Characteristics:

- **Stored by reference** – Variables store the address/reference to the data
- **Mutable** – The contents can be changed
- **Stored on the heap** – Not on the stack like primitives

### Common Reference Types:

- **Object** – `{ name: "John", age: 30 }`
- **Array** – `[1, 2, 3, 4]`
- **Function** – `function() { ... }`
- **Date** – `new Date()`
- **RegExp** – `/pattern/`
- And many more (Map, Set, WeakMap, WeakSet, etc.)

### Example:

```javascript
let obj1 = { name: "Alice" };
let obj2 = obj1; // obj2 gets a reference to the same object
obj2.name = "Bob";

console.log(obj1.name); // "Bob" (changed!)
console.log(obj2.name); // "Bob"
```

---

## Key Differences

| Feature           | Primitive Types          | Reference Types                  |
| ----------------- | ------------------------ | -------------------------------- |
| **Storage**       | By value                 | By reference (address)           |
| **Location**      | Stack                    | Heap                             |
| **Mutability**    | Immutable                | Mutable                          |
| **Comparison**    | Compares values          | Compares references              |
| **Copy behavior** | Creates independent copy | Creates reference to same object |

---

## Understanding Immutability

```javascript
// Primitive - Immutable
let str = "hello";
str[0] = "H"; // This doesn't work
console.log(str); // Still "hello"

// Reference - Mutable
let arr = [1, 2, 3];
arr[0] = 99; // This works!
console.log(arr); // [99, 2, 3]
```

---

## Practical Implications

### Copying Objects

```javascript
// Shallow copy
let original = { x: 1 };
let copy = { ...original }; // or Object.assign({}, original)

// Deep copy (for nested objects)
let deepCopy = JSON.parse(JSON.stringify(original));
```

### Comparison

```javascript
// Primitives compare by value
console.log(5 === 5); // true

// Objects compare by reference
console.log({} === {}); // false (different references)
console.log([1] === [1]); // false (different references)
```

---

## Conclusion

Understanding the difference between primitive and reference types is fundamental to writing effective JavaScript code and avoiding common bugs related to unexpected mutations and reference sharing.
