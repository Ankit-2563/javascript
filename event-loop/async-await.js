/* 
  -------------------
  Concept: async/await is built on Promises.
  
  await splits the function:
  - Before await = synchronous part
  - After await = microtask
*/

async function demo() {
  console.log("demo: 1");
  await null; // pauses here and moves rest to microtask
  console.log("demo: 2");
}

console.log("Start");
demo();
console.log("End");

/*
Output:
Start
demo: 1
End
demo: 2
*/
