/* 
  --------------------
  Concept: SYNCHRONOUS vs ASYNCHRONOUS

  Synchronous = blocks the program until finished.
  Asynchronous = allows other code to run while waiting (non-blocking).

  setTimeout is asynchronous.
*/

console.log("SYNC: Start");

// Blocking (BAD for UI)
function waitThreeSeconds() {
  const start = Date.now();
  while (Date.now() - start < 3000) {
    // This blocks everything for 3 seconds
  }
}

waitThreeSeconds();
console.log("SYNC: End");

console.log("ASYNC: Start");

setTimeout(() => {
  console.log("ASYNC: After 2 seconds");
}, 2000);

console.log("ASYNC: End");

/*
Output:
SYNC: Start
(3 sec freeze)
SYNC: End
ASYNC: Start
ASYNC: End
(2 sec wait)
ASYNC: After 2 seconds
*/
