/* 
  -----------------
  Concept: CALL STACK

  JavaScript runs one function at a time.
  When you call a function, it goes on top of the "stack".
  When it finishes, it is removed, and execution continues.

  Think of the stack like plates: last in → first out.
*/

function first() {
  console.log("First function");
}

function second() {
  first(); // first() is pushed on top
  console.log("Second function");
}

console.log("Before calling second()");
second();
console.log("After calling second()");

/*
Output:
Before calling second()
First function
Second function
After calling second()
*/
