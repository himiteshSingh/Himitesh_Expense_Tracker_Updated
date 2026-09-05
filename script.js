let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

let pieChart;
let barChart;

function addExpense() {
    const name = document.getElementById("expenseName").value;
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;
    const date = document.getElementById("expenseDate").value;

    if (name === "" || amount === "" || category === "" || date === "") {
        alert("Please fill all fields!");
        return;
    }

    const expense = {
        id: Date.now(),
        name: name,
        amount: Number(amount),
        category: category,
        date: date
    };

    expenses.push(expense);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";
    document.getElementById("expenseCategory").value = "";
    document.getElementById("expenseDate").value = "";

    displayExpenses();
}

function displayExpenses() {
    const container = document.getElementById("expenseContainer");

    if (expenses.length === 0) {
        container.innerHTML = '<p class="empty">No expenses added yet.</p>';
        updateSummary();
        updateCharts();
        return;
    }

    container.innerHTML = "";

    expenses.forEach(function(expense) {
        const item = document.createElement("div");

        item.className = "expense-item";

        item.innerHTML = `
            <div class="expense-info">
                <h3>${expense.name}</h3>
                <p>${expense.category} • ${expense.date}</p>
            </div>

            <div>
                <span class="amount">₹${expense.amount}</span>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">
                    Delete
                </button>
            </div>
        `;

        container.appendChild(item);
    });

    updateSummary();
    updateCharts();
}

function deleteExpense(id) {
    expenses = expenses.filter(function(expense) {
        return expense.id !== id;
    });

    localStorage.setItem("expenses", JSON.stringify(expenses));

    displayExpenses();
}

function updateSummary() {
    let total = 0;

    expenses.forEach(function(expense) {
        total += expense.amount;
    });

    document.getElementById("totalExpense").innerText = "₹" + total;
    document.getElementById("expenseCount").innerText = expenses.length;
}

function updateCharts() {
    const categories = ["Food", "Travel", "Shopping", "Education", "Bills", "Other"];

    const categoryTotals = categories.map(function(category) {
        return expenses
            .filter(function(expense) {
                return expense.category === category;
            })
            .reduce(function(total, expense) {
                return total + expense.amount;
            }, 0);
    });

    if (pieChart) {
        pieChart.destroy();
    }

    if (barChart) {
        barChart.destroy();
    }

    pieChart = new Chart(document.getElementById("pieChart"), {
        type: "pie",
        data: {
            labels: categories,
            datasets: [{
                data: categoryTotals
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.label + ": ₹" + context.raw;
                        }
                    }
                }
            }
        }
    });

    barChart = new Chart(document.getElementById("barChart"), {
        type: "bar",
        data: {
            labels: categories,
            datasets: [{
                label: "Amount Spent (₹)",
                data: categoryTotals
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return "₹" + context.raw;
                        }
                    }
                }
            }
        }
    });
}

displayExpenses();
