
const age = 18;

const message = age >= 18 ? "Adult" : "Minor";
console.log(message);

// Multiple ternaries (use carefully)
const temp = 30;

const weather =
  temp > 35 ? "Very Hot" : temp > 25 ? "Pleasant" : temp > 15 ? "Cool" : "Cold";

console.log(weather);
