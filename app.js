const display = document.querySelector("#display");
const expression = document.querySelector("#expression");
const keypad = document.querySelector(".keypad");

let currentInput = "0";
let previousValue = null;
let pendingOperator = null;
let waitingForOperand = false;
let hasError = false;

function formatNumber(value) {
  return Number(value.toPrecision(12)).toString();
}

function updateScreen() {
  display.textContent = currentInput;
  display.classList.toggle("is-error", hasError);
  expression.textContent = expression.textContent || "\u00a0";
}

function clearAll() {
  currentInput = "0";
  previousValue = null;
  pendingOperator = null;
  waitingForOperand = false;
  hasError = false;
  expression.textContent = "\u00a0";
  updateScreen();
}

function showError(message) {
  currentInput = "Error";
  previousValue = null;
  pendingOperator = null;
  waitingForOperand = true;
  hasError = true;
  expression.textContent = message;
  updateScreen();
}

function enterDigit(digit) {
  if (hasError) clearAll();

  if (waitingForOperand) {
    currentInput = digit;
    waitingForOperand = false;
  } else if (currentInput === "0") {
    currentInput = digit;
  } else if (currentInput.length < 14) {
    currentInput += digit;
  }

  expression.textContent = "\u00a0";
  updateScreen();
}

function enterDecimal() {
  if (hasError) clearAll();
  if (waitingForOperand) {
    currentInput = "0.";
    waitingForOperand = false;
  } else if (!currentInput.includes(".")) {
    currentInput += ".";
  }
  expression.textContent = "\u00a0";
  updateScreen();
}

function calculate(left, right, operator) {
  switch (operator) {
    case "+": return left + right;
    case "-": return left - right;
    case "*": return left * right;
    case "/": return right === 0 ? null : left / right;
    default: return null;
  }
}

function operatorSymbol(operator) {
  return { "/": "÷", "*": "×", "-": "−", "+": "+" }[operator];
}

function chooseOperator(operator) {
  if (hasError) clearAll();
  const inputValue = Number(currentInput);

  if (pendingOperator && !waitingForOperand) {
    const result = calculate(previousValue, inputValue, pendingOperator);
    if (result === null) {
      showError("Cannot divide by zero");
      return;
    }
    if (!Number.isFinite(result)) {
      showError("Result is out of range");
      return;
    }
    currentInput = formatNumber(result);
    previousValue = Number(currentInput);
  } else {
    previousValue = inputValue;
  }

  pendingOperator = operator;
  waitingForOperand = true;
  expression.textContent = `${formatNumber(previousValue)} ${operatorSymbol(operator)}`;
  updateScreen();
}

function evaluate() {
  if (!pendingOperator || previousValue === null || hasError) return;

  const left = previousValue;
  const right = waitingForOperand ? left : Number(currentInput);
  const operator = pendingOperator;
  const result = calculate(left, right, operator);

  if (result === null) {
    showError("Cannot divide by zero");
    return;
  }
  if (!Number.isFinite(result)) {
    showError("Result is out of range");
    return;
  }

  expression.textContent = `${formatNumber(left)} ${operatorSymbol(operator)} ${formatNumber(right)} =`;
  currentInput = formatNumber(result);
  previousValue = null;
  pendingOperator = null;
  waitingForOperand = true;
  updateScreen();
}

function deleteDigit() {
  if (hasError) {
    clearAll();
    return;
  }
  if (waitingForOperand) return;

  currentInput = currentInput.slice(0, -1);
  if (!currentInput || currentInput === "-") currentInput = "0";
  updateScreen();
}

function toggleSign() {
  if (hasError) clearAll();
  if (waitingForOperand || Number(currentInput) === 0) return;
  currentInput = currentInput.startsWith("-") ? currentInput.slice(1) : `-${currentInput}`;
  updateScreen();
}

function handleAction(action) {
  switch (action) {
    case "clear": clearAll(); break;
    case "delete": deleteDigit(); break;
    case "decimal": enterDecimal(); break;
    case "equals": evaluate(); break;
    case "sign": toggleSign(); break;
  }
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.digit !== undefined) {
    enterDigit(button.dataset.digit);
  } else if (button.dataset.operator) {
    chooseOperator(button.dataset.operator);
  } else {
    handleAction(button.dataset.action);
  }
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (/^[0-9]$/.test(key)) {
    enterDigit(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "x") {
    chooseOperator("*");
  } else if (key === "." || key === ",") {
    enterDecimal();
  } else if (key === "enter" || key === "=") {
    evaluate();
  } else if (key === "backspace") {
    deleteDigit();
  } else if (key === "escape" || key === "delete") {
    clearAll();
  } else {
    return;
  }
  event.preventDefault();
});

updateScreen();
