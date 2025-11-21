console.log("=== Nullish Coalescing ?? ===");

console.log("null ?? 10 =", null ?? 10);
console.log("undefined ?? 20 =", undefined ?? 20);
console.log("0 ?? 30 =", 0 ?? 30);
console.log("'' ?? 'hello' =", "" ?? "hello");

console.log("\n=== Optional chaining ?. ===");

const user = {
  name: "Ankit",
  address: {
    city: "Pune",
  },
};

const emptyUser = {};

console.log("user.address.city =", user.address.city);
console.log("user?.address?.city =", user?.address?.city);
console.log("emptyUser?.address?.city =", emptyUser?.address?.city);
