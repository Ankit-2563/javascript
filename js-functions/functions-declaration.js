// Function Declaration: classic way to define a function
// It is hoisted (you can call it before its definition)

// Call before definition (works because of hoisting)
sayHello();

function sayHello() {
  console.log("Hello from a function declaration!");
}

// Utility function used many times in code
function calculateTotal(price, taxRate) {
  const tax = price * taxRate;
  const total = price + tax;
  return total;
}

console.log("Total:", calculateTotal(100, 0.18));
console.log("Total:", calculateTotal(250, 0.18));
