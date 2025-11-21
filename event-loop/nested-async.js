/* 
  --------------------
  Concept: Microtasks inside tasks run BEFORE next task.

  Flow:
  1. Synchronous
  2. Microtasks
  3. Task 1
  4. Microtask inside Task 1
  5. Task 2
*/

setTimeout(() => {
  console.log("Timeout 1");

  Promise.resolve().then(() => {
    console.log("Microtask inside Timeout 1");
  });
}, 0);

setTimeout(() => {
  console.log("Timeout 2");
}, 0);

Promise.resolve().then(() => {
  console.log("Microtask 1");
});

/*
Output:
Microtask 1
Timeout 1
Microtask inside Timeout 1
Timeout 2
*/
