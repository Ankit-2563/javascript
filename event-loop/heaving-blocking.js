/* 
  ----------------------
  Concept: Heavy synchronous code BLOCKS timers.

  setTimeout cannot run until the call stack is empty.
*/

console.log("Start");

setTimeout(() => {
  console.log("Should run after 1 sec");
}, 1000);

// Heavy blocking loop (~5 sec)
const start = Date.now();
while (Date.now() - start < 5000) {
  // Blocking everything
}

console.log("End");

/*
Output:
Start
(5 sec delay)
End
Should run after 1 sec  <-- but actually runs AFTER 5 sec
*/
