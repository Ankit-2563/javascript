// Hoisting: function declarations are moved to the top by JS engine
// Function declarations are hoisted, function expressions and arrow functions are not

// This works because sayHi is a function declaration
sayHi();

function sayHi() {
  console.log("Hi, I am hoisted!");
}

// This does NOT work if uncommented, because sayHello is a const function expression
// sayHello(); // Uncommenting this line will cause an error

const sayHello = function () {
  console.log("Hello, I am NOT hoisted!");
};

sayHello();

// Same with arrow function
// sayBye(); // Uncommenting will cause an error

const sayBye = () => {
  console.log("Bye, I am also NOT hoisted!");
};

sayBye();
