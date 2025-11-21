// Map - stores key-value pairs (keys can be ANY type)
let userRoles = new Map();

userRoles.set("Exodus", "Admin");
userRoles.set("Satyam", "Developer");

console.log(userRoles);
console.log(userRoles.get("Exodus"));
