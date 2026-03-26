let data = {};
let totalIncome = 0;

// ADD INCOME BUTTON (adds to today)
function addIncome() {
  let input = document.getElementById("incomeInput");
  let value = Number(input.value);
  if (!value) return;

  let today = new Date().getDate();
  let key = today;

  data[key] = (data[key] || 0) + value;
  totalIncome += value;

  input.value = "";

  generateCalendar();
  updateSummary();
}

// CREATE CALENDAR
function generateCalendar() {
  let calendar = document.getElementById("calendar");
  calendar.innerHTML = "";

  let daysInMonth = 31;

  for (let i = 1; i <= daysInMonth; i++) {
    let div = document.createElement("div");
    div.classList.add("day");

    let income = data[i] || 0;

    div.innerHTML = `
      <strong>${i}</strong>
      <div>$${income}</div>
    `;

    div.onclick = () => {
  let current = data[i] || 0;

  let amount = prompt("Enter income:", current);
  if (amount === null) return;

  amount = Number(amount);

  // subtract old value, add new value
  totalIncome = totalIncome - current + amount;

  // replace value instead of adding
  data[i] = amount;

  generateCalendar();
  updateSummary();
};

    calendar.appendChild(div);
  }
}

// UPDATE RIGHT PANEL
function updateSummary() {
  let remaining = totalIncome;

  let today = new Date().getDate();
  let daysLeft = 31 - today;

  let daily = daysLeft > 0 ? remaining / daysLeft : remaining;

  document.getElementById("income").innerText = totalIncome.toFixed(2);
  document.getElementById("remaining").innerText = remaining.toFixed(2);
  document.getElementById("daily").innerText = daily.toFixed(2);
}

// DAYS UNTIL PAYDAY (1st)
function updatePayday() {
  let today = new Date();
  let nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

  let diff = nextMonth - today;
  let days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  document.getElementById("days").innerText = days;
}

let categories = [];

function addCategory() {
  let name = document.getElementById("catName").value;
  let type = document.getElementById("catType").value;
  let value = Number(document.getElementById("catValue").value);

  if (!name || !value) return;

  categories.push({
    name: name,
    type: type,
    value: value
  });

  closePopup();
  renderCategories();
}

function renderCategories() {
  let container = document.getElementById("categories");
  container.innerHTML = "";

  categories.forEach(cat => {
    let amount = 0;

    if (cat.type === "percent") {
      amount = (totalIncome * cat.value) / 100;
    } else {
      amount = cat.value;
    }

    let div = document.createElement("div");
    div.classList.add("category");

    div.innerHTML = `
      <strong>${cat.name}</strong>
      ${cat.type === "percent" ? cat.value + "%" : "$" + cat.value}
      <br>
      → $${amount.toFixed(2)}
    `;

    container.appendChild(div);
  });
}
// OPEN/CLOSE POPUP
function openPopup() {
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup() {
  document.getElementById("popup").classList.add("hidden");
}
// INIT
generateCalendar();
updateSummary();
updatePayday();
renderCategories();