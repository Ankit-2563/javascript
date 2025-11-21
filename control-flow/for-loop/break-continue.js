
for (let i = 1; i <= 10; i++) {
  if (i === 5) {
    break; // exit loop
  }
  console.log("i =", i);
}

// continue: skip current iteration
for (let j = 1; j <= 10; j++) {
  if (j % 2 === 0) {
    continue; // skip even numbers
  }
  console.log("Odd:", j);
}
