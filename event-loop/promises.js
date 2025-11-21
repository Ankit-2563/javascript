/* 
  ---------------------
  Concept: Promises use MICROTASK QUEUE.

  .then() callbacks always run:
  - AFTER synchronous code
  - BEFORE any tasks (setTimeout)
*/

console.log("1");

Promise.resolve().then(() => {
  console.log("2 (from Promise)");
});

console.log("3");

Promise.resolve()
  .then(() => console.log("4 (first then)"))
  .then(() => console.log("5 (second then)"));

console.log("6");

/*
Expected:
1
3
6
2
4
5
*/
