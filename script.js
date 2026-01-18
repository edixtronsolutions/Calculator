// script.js
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".buttons button");

// Append value to display (map visual operators to JS operators)
function appendValue(value) {
  if (value == null) return;
  // Map any visual symbols to JS-friendly ones (if buttons use them)
  const map = {
    "×": "*",
    "÷": "/",
    "−": "-",
  };
  const v = map[value] ?? value;
  display.value = (display.value || "") + v;
}

// Evaluate the expression shown on the display
function calculate() {
  if (!display.value) return;
  try {
    // Prevent accidental letters — allow only numbers, operators, parentheses, decimal point and spaces.
    // Note: escape the forward slash inside the regex character class.
    const safe = display.value.replace(/[^\d+\-*\/().\s]/g, "");
    // Evaluate — using Function is slightly safer than eval (but still be careful)
    // Note: This is intended for a local calculator app only.
    const result = Function(`"use strict"; return (${safe})`)();
    display.value = String(result);
  } catch (err) {
    console.error("Calculation error:", err);
    display.value = "Error";
    // Optionally clear after short delay:
    // setTimeout(() => (display.value = ""), 1200);
  }
}

// Delete last character
function deleteLast() {
  display.value = (display.value || "").slice(0, -1);
}

// Clear full display
function clearDisplay() {
  display.value = "";
}

// Hook up button clicks
buttons.forEach((btn) => {
  const v = btn.dataset.value;
  const action = btn.dataset.action;

  if (v !== undefined) {
    btn.addEventListener("click", () => appendValue(v));
  } else if (action === "clear") {
    btn.addEventListener("click", clearDisplay);
  } else if (action === "delete") {
    btn.addEventListener("click", deleteLast);
  } else if (action === "equals") {
    btn.addEventListener("click", calculate);
  }
});

// Keyboard input handling
document.addEventListener("keydown", function (event) {
  const key = event.key;

  // Digits and decimal point
  if (!isNaN(key) || key === ".") {
    appendValue(key);
    event.preventDefault();
    return;
  }

  // Operators
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    appendValue(key);
    event.preventDefault();
    return;
  }

  if (key === "Enter") {
    event.preventDefault();
    calculate();
    return;
  }

  if (key === "Backspace") {
    event.preventDefault();
    deleteLast();
    return;
  }

  if (key === "Escape") {
    event.preventDefault();
    clearDisplay();
    return;
  }
});
