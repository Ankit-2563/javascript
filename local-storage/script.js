// Select elements
const input = document.getElementById("nameInput");
const output = document.getElementById("output");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");

// Load name from localStorage when page opens
const savedName = localStorage.getItem("username");

if (savedName !== null) {
  output.textContent = `Saved name: ${savedName}`;
}

// Save button
saveBtn.addEventListener("click", () => {
  const name = input.value;

  if (name.trim() === "") {
    output.textContent = "Name cannot be empty!";
    return;
  }

  // Save to localStorage
  localStorage.setItem("username", name);

  output.textContent = `Saved name: ${name}`;
});

// Clear button
clearBtn.addEventListener("click", () => {
  localStorage.removeItem("username");
  output.textContent = "Name cleared from storage.";
});
