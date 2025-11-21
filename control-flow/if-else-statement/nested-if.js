// Nested if
const isMember = false;
const price = 100;

if (isMember) {
  if (price > 50) {
    console.log("Discount Applied");
  } else {
    console.log("No Discount");
  }
} else {
  console.log("Please sign up to become a member");
}
