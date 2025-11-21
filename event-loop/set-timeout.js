/* 
  ----------------------
  Concept: setTimeout(fn, 0) DOES NOT run immediately.

  Even with 0ms, it goes to the Task Queue.
  It runs only after all synchronous code finishes.
*/

console.log("A");

setTimeout(() => {
  console.log("B (setTimeout 0)");
}, 0);

console.log("C");

/*
Output:
A
C
B (setTimeout 0)

Why?
- A prints
- setTimeout is scheduled (NOT run)
- C prints
- Event loop runs the callback last
*/
