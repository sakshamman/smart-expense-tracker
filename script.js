// Elements
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionsList = document.getElementById("transactions");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

// Initial dummy data
let transactions = [];

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  updateDOM();
  updateValues();
  updateLocalStorage();

  text.value = "";
  amount.value = "";
}

// Generate random ID
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

// Update DOM
function updateDOM() {
  transactionsList.innerHTML = "";

  transactions.forEach((transaction) => {
    const sign = transaction.amount < 0 ? "-" : "+";
    const item = document.createElement("li");

    item.classList.add(transaction.amount < 0 ? "minus" : "plus");
    item.innerHTML = `
      ${transaction.text} 
      <span>${sign}$${Math.abs(transaction.amount)}</span>
      <button onclick="removeTransaction(${transaction.id})">x</button>
    `;

    transactionsList.appendChild(item);
  });
}

// Update Income, Expense, Balance
function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const incomeVal = amounts
    .filter((val) => val > 0)
    .reduce((acc, val) => acc + val, 0)
    .toFixed(2);
  const expenseVal = (
    amounts.filter((val) => val < 0).reduce((acc, val) => acc + val, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  income.innerText = `+$${incomeVal}`;
  expense.innerText = `-$${expenseVal}`;
}

// Remove transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  updateDOM();
  updateValues();
}

// Local storage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function init() {
  const saved = JSON.parse(localStorage.getItem("transactions"));
  if (saved) transactions = saved;
  updateDOM();
  updateValues();
}

form.addEventListener("submit", addTransaction);
init();
