// JavaScript has 3 ways to create variables:
// var — old, broken, avoid
// let — modern, safe
// const — modern, safest (when value shouldn’t change)

let name; // 'name' can be reassigned
console.log(name); // undefined

let myname = "Exodus";
console.log(myname); // "Exodus"

// const
const interestRate = 0.3;
interestRate = 1; // Error: Assignment to constant variable. because const are constants so their values cannot be changed
console.log(interestRate);
