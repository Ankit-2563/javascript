console.log("=== typeof ===");

console.log("typeof 10 =", typeof 10);
console.log("typeof 'hi' =", typeof "hi");
console.log("typeof true =", typeof true);
console.log("typeof {} =", typeof {});
console.log("typeof [] =", typeof []);
console.log("typeof null =", typeof null); // JS bug
console.log("typeof undefined =", typeof undefined);
console.log("typeof function(){} =", typeof function () {});

console.log("\n=== instanceof ===");

const arr = [];
console.log("arr instanceof Array =", arr instanceof Array);
console.log("arr instanceof Object =", arr instanceof Object);

function User(name) {
  this.name = name;
}

const u = new User("Ankit");
console.log("u instanceof User =", u instanceof User);
console.log("u instanceof Object =", u instanceof Object);
