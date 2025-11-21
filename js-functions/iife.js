// IIFE: Immediately Invoked Function Expression
// It runs as soon as it is defined

// Basic IIFE
(function () {
  console.log("IIFE ran immediately");
})();

// IIFE used to create private variables
const counterModule = (function () {
  // Private variable (not directly accessible from outside)
  let count = 0;

  function increment() {
    count++;
    console.log("count =", count);
  }

  function getCount() {
    return count;
  }

  // Return an object exposing only what we want public
  return {
    increment,
    getCount,
  };
})();

counterModule.increment(); // count = 1
counterModule.increment(); // count = 2
console.log("Current count:", counterModule.getCount());
