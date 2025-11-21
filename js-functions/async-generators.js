// This file just gives a taste of async functions and generators

// Async function: returns a Promise and allows use of "await"
async function fetchDataMock() {
  console.log("Starting fake fetch...");

  // Simulate delay using Promise + setTimeout
  function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await delay(1000); // wait 1 second

  // After waiting, return some data
  return { status: "ok", data: [1, 2, 3] };
}

// Use async function
async function run() {
  const result = await fetchDataMock();
  console.log("Result from async function:", result);
}

run();

// Basic generator example
function* numberGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = numberGenerator();

console.log("gen.next():", gen.next());
console.log("gen.next():", gen.next());
console.log("gen.next():", gen.next());
console.log("gen.next():", gen.next()); // done: true
