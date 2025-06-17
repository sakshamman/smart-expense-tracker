// ========== DOM Selectors ==========
const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionsList = document.getElementById("transactions");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const themeBtn = document.getElementById("toggle-theme");
const exportBtn = document.getElementById("export-btn");

let transactions = [];
let chart = null;

// ========== Utilities ==========
function generateID() {
  return Math.floor(Math.random() * 1000000);
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function loadLocalStorage() {
  const data = JSON.parse(localStorage.getItem("transactions"));
  if (data) transactions = data;
}

// ========== DOM & Logic ==========
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const li = document.createElement("li");
  li.classList.add(transaction.amount < 0 ? "minus" : "plus");
  li.innerHTML = `
    ${transaction.text} 
    <span>${sign}$${Math.abs(transaction.amount)}</span>
    <button onclick="removeTransaction(${transaction.id})">x</button>
  `;
  transactionsList.appendChild(li);
}

function updateValues() {
  const amounts = transactions.map((t) => t.amount);
  const total = amounts.reduce((a, b) => a + b, 0).toFixed(2);
  const incomeTotal = amounts
    .filter((x) => x > 0)
    .reduce((a, b) => a + b, 0)
    .toFixed(2);
  const expenseTotal = (
    amounts.filter((x) => x < 0).reduce((a, b) => a + b, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  income.innerText = `+$${incomeTotal}`;
  expense.innerText = `-$${expenseTotal}`;
}

function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  render();
}

// ========== Chart ==========
function updateChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");

  const categories = {};
  transactions.forEach((t) => {
    if (t.amount < 0) {
      const key = t.text.toLowerCase();
      categories[key] = (categories[key] || 0) + Math.abs(t.amount);
    }
  });

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          label: "Expenses",
          data,
          backgroundColor: [
            "#f94144",
            "#f3722c",
            "#f8961e",
            "#f9c74f",
            "#90be6d",
            "#43aa8b",
            "#577590",
          ],
        },
      ],
    },
  });
}

// ========== Init & Render ==========
function render() {
  transactionsList.innerHTML = "";
  transactions.forEach(addTransactionDOM);
  updateValues();
  updateChart();
}

// ========== Add Transaction ==========
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please fill in both fields");
    return;
  }

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  render();

  text.value = "";
  amount.value = "";
});

// ========== Export CSV ==========
exportBtn.addEventListener("click", () => {
  if (transactions.length === 0) return;

  const rows = [["ID", "Description", "Amount"]];
  transactions.forEach((t) => rows.push([t.id, t.text, t.amount]));

  const csv = rows.map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// ========== Dark Mode ==========
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

function initDarkMode() {
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }
}

// ========== Init ==========
function init() {
  loadLocalStorage();
  initDarkMode();
  render();
}

init();
