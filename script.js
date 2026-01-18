const display = document.querySelector('.display');
const buttons = document.querySelector('.buttons');

let expression = '';

function updateDisplay(text) {
  display.value = text ?? expression || '0';
}

function appendValue(val) {
  // Convert fancy operator symbols to JS-equivalents when necessary
  if (val === '×') val = '*';
  if (val === '÷') val = '/';
  expression += val;
  updateDisplay();
}

function clearAll() {
  expression = '';
  updateDisplay();
}

function deleteLast() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

function evaluateExpression() {
  if (!expression) return;
  // Allow only safe characters: digits, operators, parentheses, dot, spaces, percent
  if (!/^[0-9+\-*/().% \s]+$/.test(expression)) {
    display.value = 'Error';
    expression = '';
    return;
  }
  try {
    // Evaluate using Function — ensure expression is only arithmetic by the regex above
    // Replace any accidental multiple leading zeros e.g. 00 -> 0 (not strictly necessary)
    const result = Function('"use strict"; return (' + expression + ')')();
    expression = String(result);
    updateDisplay();
  } catch (e) {
    display.value = 'Error';
    expression = '';
  }
}

// Button clicks
buttons.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;
  const val = btn.getAttribute('data-value');
  const action = btn.getAttribute('data-action');

  if (action === 'clear') clearAll();
  else if (action === 'delete') deleteLast();
  else if (action === 'equals') evaluateExpression();
  else if (val) appendValue(val);
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  const allowedKeys = '0123456789+-*/().%';
  if (allowedKeys.includes(e.key)) {
    appendValue(e.key);
    e.preventDefault();
    return;
  }
  if (e.key === 'Enter') { evaluateExpression(); e.preventDefault(); return; }
  if (e.key === 'Backspace') { deleteLast(); e.preventDefault(); return; }
  if (e.key === 'Escape') { clearAll(); e.preventDefault(); return; }
});

// initialize
updateDisplay();