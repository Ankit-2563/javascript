// 09_delete_in_new_void.js
console.log("=== delete operator ===");

const user = { name: "Ankit", age: 20 };
console.log("before delete =", user);

delete user.age;
console.log("after delete =", user);

console.log("\n=== in operator ===");

console.log("'name' in user =", "name" in user);
console.log("'age' in user =", "age" in user);

const arr = [10, 20, 30];
console.log("0 in arr =", 0 in arr);
console.log("3 in arr =", 3 in arr);

console.log("\n=== new operator ===");

function Car(model) {
  this.model = model;
}
const myCar = new Car("Tesla");
console.log("myCar.model =", myCar.model);

console.log("\n=== void operator ===");

console.log("void 0 =", void 0);
console.log("void(123) =", void 123);
