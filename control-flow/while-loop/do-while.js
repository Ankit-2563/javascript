let i = 1;

do {
  console.log("i is:", i);
  i++;
} while (i <= 5);

// do-while ALWAYS runs at least once
let x = 10;

do {
  console.log("Runs once even if x < 0");
  x = -1;
} while (x > 0);
