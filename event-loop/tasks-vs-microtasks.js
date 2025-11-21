/* 
  --------------------------
  Concept: MICROTASKS run before TASKS.

  Microtasks = Promise.then(), queueMicrotask()
  Tasks      = setTimeout, setInterval, DOM events

  Order:
  1. Synchronous
  2. ALL Microtasks
  3. ONE Task
*/

console.log("Start");

setTimeout(() => {
  console.log("Task (setTimeout)");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask 1");
});

Promise.resolve().then(() => {
  console.log("Microtask 2");
});

console.log("End");

/*
Output:
Start
End
Microtask 1
Microtask 2
Task (setTimeout)
*/
