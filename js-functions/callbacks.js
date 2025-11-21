// A callback is a function passed into another function

// Simple function that accepts a callback
function runWithMessage(message, callback) {
  console.log("Message:", message);
  callback(); // call the function we received
}

// Define a callback function
function onDone() {
  console.log("Callback has been executed");
}

// Pass named function as callback
runWithMessage("Starting task", onDone);

// Pass anonymous function as callback
runWithMessage("Another task", function () {
  console.log("Anonymous callback executed");
});

// Pass arrow function as callback
runWithMessage("Arrow callback task", () => {
  console.log("Arrow callback executed");
});

// Realistic example: using setTimeout
setTimeout(() => {
  console.log("This runs after 1 second (1000ms)");
}, 1000);
