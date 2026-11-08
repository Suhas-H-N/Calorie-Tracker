const foodForm = document.getElementById("food-form");
const goalForm = document.getElementById("goal-form");
const waterForm = document.getElementById("water-form");
const waterGoalForm = document.getElementById("water-goal-form");

const foodName = document.getElementById("food-name");
const mealType = document.getElementById("meal-type");
const foodCalories = document.getElementById("food-calories");
const foodList = document.getElementById("food-list");
const selectedDate = document.getElementById("selected-date");
const searchFood = document.getElementById("search-food");
const filterMeal = document.getElementById("filter-meal");
const goalInput = document.getElementById("goal-input");

const waterAmount = document.getElementById("water-amount");
const waterGoalInput = document.getElementById("water-goal-input");
const waterList = document.getElementById("water-list");

const DEFAULT_GOAL = 2000;
const DEFAULT_WATER_GOAL = 2000;

let foodItems = loadFoodItems();
let dailyGoal = loadDailyGoal();
let waterRecords = loadWaterRecords();
let waterGoal = loadWaterGoal();
let editId = null;

function getTodayDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function loadFoodItems() {
    try {
        const savedItems = JSON.parse(localStorage.getItem("foodItems")) || [];

        if (!Array.isArray(savedItems)) return [];

        return savedItems.map(function(item) {
            return {
                id: item.id || Date.now() + Math.random(),
                name: String(item.name || ""),
                meal: String(item.meal || "Breakfast"),
                calories: Number(item.calories) || 0,
                date: item.date || getTodayDate()
            };
        });
    } catch (error) {
        return [];
    }
}

function loadWaterRecords() {
    try {
        const savedRecords = JSON.parse(localStorage.getItem("waterRecords")) || [];

        if (!Array.isArray(savedRecords)) return [];

        return savedRecords
            .filter(function(record) {
                return record && Number(record.amount) > 0;
            })
            .map(function(record) {
                return {
                    id: record.id || Date.now() + Math.random(),
                    amount: Number(record.amount),
                    date: record.date || getTodayDate()
                };
            });
    } catch (error) {
        return [];
    }
}

function loadDailyGoal() {
    const savedGoal = Number(localStorage.getItem("dailyCalorieGoal"));

    if (Number.isInteger(savedGoal) && savedGoal >= 1 && savedGoal <= 100000) {
        return savedGoal;
    }

    return DEFAULT_GOAL;
}

function loadWaterGoal() {
    const savedGoal = Number(localStorage.getItem("dailyWaterGoal"));

    if (Number.isInteger(savedGoal) && savedGoal >= 1 && savedGoal <= 20000) {
        return savedGoal;
    }

    return DEFAULT_WATER_GOAL;
}

function saveFoodItems() {
    try {
        localStorage.setItem("foodItems", JSON.stringify(foodItems));
        return true;
    } catch (error) {
        showStatus("Unable to save data in Local Storage.", true);
        return false;
    }
}

function saveWaterRecords() {
    try {
        localStorage.setItem("waterRecords", JSON.stringify(waterRecords));
        return true;
    } catch (error) {
        showWaterStatus("Unable to save water records.", true);
        return false;
    }
}

function saveDailyGoal() {
    try {
        localStorage.setItem("dailyCalorieGoal", String(dailyGoal));
        return true;
    } catch (error) {
        showGoalStatus("Unable to save your calorie goal.", true);
        return false;
    }
}

function saveWaterGoal() {
    try {
        localStorage.setItem("dailyWaterGoal", String(waterGoal));
        return true;
    } catch (error) {
        showWaterGoalStatus("Unable to save your water goal.", true);
        return false;
    }
}

function getSelectedDateItems() {
    return foodItems.filter(function(item) {
        return item.date === selectedDate.value;
    });
}

function getSelectedDateWaterRecords() {
    return waterRecords.filter(function(record) {
        return record.date === selectedDate.value;
    });
}

function showStatus(message, isError = false) {
    const statusMessage = document.getElementById("status-message");
    statusMessage.textContent = message;
    statusMessage.style.color = isError ? "var(--danger)" : "var(--success)";
}

function showGoalStatus(message, isError = false) {
    const status = document.getElementById("goal-status");
    status.textContent = message;
    status.style.color = isError ? "var(--danger)" : "var(--success)";
}

function showWaterStatus(message, isError = false) {
    const status = document.getElementById("water-status");
    status.textContent = message;
    status.style.color = isError ? "var(--danger)" : "var(--success)";
}

function showWaterGoalStatus(message, isError = false) {
    const status = document.getElementById("water-goal-status");
    status.textContent = message;
    status.style.color = isError ? "var(--danger)" : "var(--success)";
}

/* Food Tracker */

function displayFoodItems() {
    foodList.replaceChildren();

    const selectedItems = getSelectedDateItems();
    const searchValue = searchFood.value.trim().toLowerCase();
    const filterValue = filterMeal.value;

    const filteredItems = selectedItems.filter(function(item) {
        const matchesSearch = item.name.toLowerCase().includes(searchValue);
        const matchesMeal = filterValue === "All" || item.meal === filterValue;

        return matchesSearch && matchesMeal;
    });

    filteredItems.forEach(function(item) {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = item.name;

        const mealCell = document.createElement("td");
        mealCell.textContent = item.meal;

        const caloriesCell = document.createElement("td");
        caloriesCell.textContent = `${item.calories} kcal`;

        const actionCell = document.createElement("td");
        const actionButtons = document.createElement("div");
        actionButtons.className = "action-buttons";

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function() {
            editFood(item.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", function() {
            deleteFood(item.id);
        });

        actionButtons.append(editButton, deleteButton);
        actionCell.appendChild(actionButtons);
        row.append(nameCell, mealCell, caloriesCell, actionCell);
        foodList.appendChild(row);
    });

    document.getElementById("empty-message").classList.toggle(
        "hidden",
        filteredItems.length > 0
    );

    updateTotal();
    updateMealSummary();
    updateHistoryMessage();
}

function updateTotal() {
    const items = getSelectedDateItems();

    const total = items.reduce(function(sum, item) {
        return sum + item.calories;
    }, 0);

    const remaining = dailyGoal - total;
    const percentage = Math.round((total / dailyGoal) * 100);

    document.getElementById("daily-goal").textContent = `${dailyGoal} kcal`;
    document.getElementById("total-calories").textContent = `${total} kcal`;

    document.getElementById("remaining-calories").textContent =
        `${Math.abs(remaining)} kcal${remaining < 0 ? " over" : ""}`;

    document.getElementById("table-total").textContent = `${total} kcal`;
    document.getElementById("progress-percent").textContent = `${percentage}%`;

    const progressBar = document.getElementById("progress-bar");
    progressBar.style.width = `${Math.min(percentage, 100)}%`;

    document.getElementById("goal-message").textContent =
        total === 0
            ? "Start adding your food!"
            : remaining > 0
                ? `${remaining} kcal remaining for your daily goal.`
                : remaining === 0
                    ? "Daily calorie goal achieved!"
                    : `${Math.abs(remaining)} kcal above your daily goal.`;

    progressBar.style.background =
        total > dailyGoal ? "var(--danger)" : "var(--success)";
}

function updateMealSummary() {
    const items = getSelectedDateItems();
    const meals = ["Breakfast", "Lunch", "Dinner", "Snack"];

    meals.forEach(function(meal) {
        const total = items
            .filter(function(item) {
                return item.meal === meal;
            })
            .reduce(function(sum, item) {
                return sum + item.calories;
            }, 0);

        document.getElementById(
            `${meal.toLowerCase()}-calories`
        ).textContent = `${total} kcal`;
    });
}

function updateHistoryMessage() {
    const message = document.getElementById("history-message");

    message.textContent = selectedDate.value === getTodayDate()
        ? "Showing today's food and water records."
        : `Showing food and water records for ${selectedDate.value}.`;
}

function resetFoodForm() {
    foodForm.reset();
    editId = null;

    document.getElementById("form-heading").textContent = "Add Food";
    document.getElementById("submit-btn").textContent = "Add Food";
    document.getElementById("cancel-edit-btn").classList.add("hidden");
}

function addFood(event) {
    event.preventDefault();

    const name = foodName.value.trim();
    const meal = mealType.value;
    const calories = Number(foodCalories.value);

    if (!name || !Number.isFinite(calories) || calories <= 0) {
        showStatus("Please enter a valid food name and calorie amount.", true);
        return;
    }

    const previousItems = [...foodItems];

    if (editId !== null) {
        foodItems = foodItems.map(function(item) {
            if (item.id === editId) {
                return {
                    ...item,
                    name: name,
                    meal: meal,
                    calories: calories
                };
            }

            return item;
        });
    } else {
        foodItems.push({
            id: Date.now(),
            name: name,
            meal: meal,
            calories: calories,
            date: selectedDate.value
        });
    }

    if (!saveFoodItems()) {
        foodItems = previousItems;
        return;
    }

    showStatus(editId !== null ? "Food updated successfully!" : "Food added successfully!");
    resetFoodForm();
    displayFoodItems();
    updateReports();
}

function editFood(id) {
    const item = foodItems.find(function(food) {
        return food.id === id;
    });

    if (!item) return;

    editId = id;
    foodName.value = item.name;
    mealType.value = item.meal;
    foodCalories.value = item.calories;

    document.getElementById("form-heading").textContent = "Edit Food";
    document.getElementById("submit-btn").textContent = "Update Food";
    document.getElementById("cancel-edit-btn").classList.remove("hidden");

    foodForm.scrollIntoView({ behavior: "smooth" });
}

function deleteFood(id) {
    const item = foodItems.find(function(food) {
        return food.id === id;
    });

    if (!item) return;

    const previousItems = [...foodItems];

    foodItems = foodItems.filter(function(food) {
        return food.id !== id;
    });

    if (!saveFoodItems()) {
        foodItems = previousItems;
        return;
    }

    deletedItem = item;
    document.getElementById("undo-container").classList.remove("hidden");

    showStatus("Food deleted. You can undo this action.");
    displayFoodItems();
    updateReports();
}

function undoDelete() {
    if (!deletedItem) return;

    foodItems.push(deletedItem);

    if (!saveFoodItems()) {
        foodItems.pop();
        return;
    }

    deletedItem = null;
    document.getElementById("undo-container").classList.add("hidden");

    showStatus("Deleted food restored successfully!");
    displayFoodItems();
    updateReports();
}

function updateDailyGoal(event) {
    event.preventDefault();

    const newGoal = Number(goalInput.value);

    if (!Number.isInteger(newGoal) || newGoal < 1 || newGoal > 100000) {
        showGoalStatus("Enter a whole number between 1 and 100000.", true);
        return;
    }

    const previousGoal = dailyGoal;
    dailyGoal = newGoal;

    if (!saveDailyGoal()) {
        dailyGoal = previousGoal;
        return;
    }

    goalInput.value = dailyGoal;

    showGoalStatus("Your daily calorie goal has been updated successfully!");
    updateTotal();
    updateReports();
}

function exportCSV() {
    const items = getSelectedDateItems();

    if (items.length === 0) {
        showStatus("No food records available to export.", true);
        return;
    }

    const rows = [
        ["Food Name", "Meal Type", "Calories", "Date"],
        ...items.map(function(item) {
            return [item.name, item.meal, item.calories, item.date];
        })
    ];

    const csvContent = rows.map(function(row) {
        return row.map(function(value) {
            return `"${String(value).replace(/"/g, '""')}"`;
        }).join(",");
    }).join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `calorie-records-${selectedDate.value}.csv`;
    link.click();

    URL.revokeObjectURL(url);
    showStatus("CSV file exported successfully!");
}

/* Water Intake Tracker */

function getWaterTotal() {
    return getSelectedDateWaterRecords().reduce(function(sum, record) {
        return sum + record.amount;
    }, 0);
}

function updateWaterSummary() {
    const total = getWaterTotal();
    const remaining = waterGoal - total;
    const percentage = Math.round((total / waterGoal) * 100);

    document.getElementById("water-goal-display").textContent =
        `${waterGoal} ml`;

    document.getElementById("water-consumed").textContent =
        `${total} ml`;

    document.getElementById("water-remaining").textContent =
        `${Math.max(remaining, 0)} ml${remaining < 0 ? " over" : ""}`;

    document.getElementById("water-progress-percent").textContent =
        `${percentage}%`;

    const progressBar = document.getElementById("water-progress-bar");

    progressBar.style.width = `${Math.min(percentage, 100)}%`;

    document.getElementById("water-progress-message").textContent =
        total === 0
            ? "Start tracking your water intake!"
            : remaining > 0
                ? `${remaining} ml remaining to reach your water goal.`
                : remaining === 0
                    ? "Daily water goal achieved!"
                    : `${Math.abs(remaining)} ml above your water goal.`;
}

function displayWaterRecords() {
    waterList.replaceChildren();

    const records = getSelectedDateWaterRecords();

    records.forEach(function(record) {
        const row = document.createElement("tr");

        const amountCell = document.createElement("td");
        amountCell.textContent = `${record.amount} ml`;

        const dateCell = document.createElement("td");
        dateCell.textContent = record.date;

        const actionCell = document.createElement("td");
        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";
        deleteButton.className = "water-delete-btn";

        deleteButton.addEventListener("click", function() {
            deleteWaterRecord(record.id);
        });

        actionCell.appendChild(deleteButton);
        row.append(amountCell, dateCell, actionCell);

        waterList.appendChild(row);
    });

    document.getElementById("water-empty-message").classList.toggle(
        "hidden",
        records.length > 0
    );

    document.getElementById("water-table-total").textContent =
        `${getWaterTotal()} ml`;

    updateWaterSummary();
}

function addWater(amount) {
    if (!Number.isInteger(amount) || amount <= 0 || amount > 20000) {
        showWaterStatus("Enter a valid water amount between 1 and 20000 ml.", true);
        return;
    }

    const record = {
        id: Date.now() + Math.random(),
        amount: amount,
        date: selectedDate.value
    };

    waterRecords.push(record);

    if (!saveWaterRecords()) {
        waterRecords.pop();
        return;
    }

    showWaterStatus(`${amount} ml of water added successfully!`);
    displayWaterRecords();
}

function addCustomWater(event) {
    event.preventDefault();

    const amount = Number(waterAmount.value);

    if (!Number.isInteger(amount) || amount < 1 || amount > 20000) {
        showWaterStatus("Enter a whole number between 1 and 20000 ml.", true);
        return;
    }

    addWater(amount);
    waterForm.reset();
}

function updateWaterGoal(event) {
    event.preventDefault();

    const newGoal = Number(waterGoalInput.value);

    if (!Number.isInteger(newGoal) || newGoal < 1 || newGoal > 20000) {
        showWaterGoalStatus("Enter a whole number between 1 and 20000 ml.", true);
        return;
    }

    const previousGoal = waterGoal;
    waterGoal = newGoal;

    if (!saveWaterGoal()) {
        waterGoal = previousGoal;
        return;
    }

    waterGoalInput.value = waterGoal;

    showWaterGoalStatus("Your daily water goal has been updated successfully!");
    updateWaterSummary();
}

function deleteWaterRecord(id) {
    const previousRecords = [...waterRecords];

    waterRecords = waterRecords.filter(function(record) {
        return record.id !== id;
    });

    if (!saveWaterRecords()) {
        waterRecords = previousRecords;
        return;
    }

    showWaterStatus("Water record deleted successfully!");
    displayWaterRecords();
}

function resetWaterRecords() {
    const records = getSelectedDateWaterRecords();

    if (records.length === 0) {
        showWaterStatus("There are no water records to reset.", true);
        return;
    }

    const confirmed = confirm(
        `Are you sure you want to delete all water records for ${selectedDate.value}?`
    );

    if (!confirmed) return;

    const previousRecords = [...waterRecords];

    waterRecords = waterRecords.filter(function(record) {
        return record.date !== selectedDate.value;
    });

    if (!saveWaterRecords()) {
        waterRecords = previousRecords;
        return;
    }

    showWaterStatus("Water records reset successfully!");
    displayWaterRecords();
}

/* Weekly and Monthly Reports */

function getDateTotal(date) {
    return foodItems
        .filter(function(item) {
            return item.date === date;
        })
        .reduce(function(sum, item) {
            return sum + item.calories;
        }, 0);
}

function formatDate(date) {
    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}

function updateWeeklyReport() {
    const selected = new Date(`${selectedDate.value}T00:00:00`);
    const dayOfWeek = selected.getDay();

    const startDate = new Date(selected);
    startDate.setDate(selected.getDate() - dayOfWeek);

    const dates = [];

    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        dates.push(`${year}-${month}-${day}`);
    }

    const totals = dates.map(getDateTotal);
    const total = totals.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    const average = Math.round(total / 7);
    const highest = Math.max(...totals);
    const highestIndex = totals.indexOf(highest);

    document.getElementById("weekly-date-range").textContent =
        `${formatDate(new Date(`${dates[0]}T00:00:00`))} - ${formatDate(new Date(`${dates[6]}T00:00:00`))}`;

    document.getElementById("weekly-total").textContent = `${total} kcal`;
    document.getElementById("weekly-average").textContent = `${average} kcal`;
    document.getElementById("weekly-highest").textContent = `${highest} kcal`;

    document.getElementById("weekly-highest-date").textContent =
        highest > 0
            ? formatDate(new Date(`${dates[highestIndex]}T00:00:00`))
            : "No records";

    const chart = document.getElementById("weekly-chart");
    chart.replaceChildren();

    dates.forEach(function(date, index) {
        const column = document.createElement("div");
        column.className = "bar-column";

        const value = document.createElement("span");
        value.className = "bar-value";
        value.textContent = totals[index];

        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height =
            `${Math.max((totals[index] / Math.max(highest, 1)) * 100, 2)}%`;

        const label = document.createElement("span");
        label.className = "bar-label";
        label.textContent = new Date(`${date}T00:00:00`)
            .toLocaleDateString("en-IN", { weekday: "short" });

        column.append(value, bar, label);
        chart.appendChild(column);
    });

    const list = document.getElementById("weekly-list");
    list.replaceChildren();

    dates.forEach(function(date, index) {
        const row = document.createElement("div");
        row.className = "report-row";

        const dateLabel = document.createElement("span");
        dateLabel.textContent = formatDate(new Date(`${date}T00:00:00`));

        const calorieLabel = document.createElement("strong");
        calorieLabel.textContent = `${totals[index]} kcal`;

        row.append(dateLabel, calorieLabel);
        list.appendChild(row);
    });
}

function updateMonthlyReport() {
    const monthValue = document.getElementById("monthly-month").value;
    if (!monthValue) return;

    const [year, month] = monthValue.split("-").map(Number);
    const daysInMonth = new Date(year, month, 0).getDate();

    const dates = [];

    for (let day = 1; day <= daysInMonth; day++) {
        dates.push(
            `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
        );
    }

    const totals = dates.map(getDateTotal);
    const total = totals.reduce(function(sum, value) {
        return sum + value;
    }, 0);

    const daysWithRecords = totals.filter(function(value) {
        return value > 0;
    }).length;

    const average = daysWithRecords > 0
        ? Math.round(total / daysWithRecords)
        : 0;

    const highest = Math.max(...totals);
    const highestIndex = totals.indexOf(highest);

    const goalDays = totals.filter(function(value) {
        return value >= dailyGoal;
    }).length;

    document.getElementById("monthly-total").textContent = `${total} kcal`;
    document.getElementById("monthly-average").textContent = `${average} kcal`;
    document.getElementById("monthly-highest").textContent = `${highest} kcal`;

    document.getElementById("monthly-highest-date").textContent =
        highest > 0
            ? formatDate(new Date(`${dates[highestIndex]}T00:00:00`))
            : "No records";

    document.getElementById("monthly-goal-days").textContent =
        `${goalDays} days`;

    const chart = document.getElementById("monthly-chart");
    chart.replaceChildren();

    const hasRecords = daysWithRecords > 0;

    document.getElementById("monthly-empty").classList.toggle(
        "hidden",
        hasRecords
    );

    dates.forEach(function(date, index) {
        const day = document.createElement("div");
        day.className = "month-day";

        const value = document.createElement("span");
        value.className = "month-day-value";
        value.textContent = totals[index] > 0 ? totals[index] : "";

        const track = document.createElement("div");
        track.className = "month-bar-track";

        const bar = document.createElement("div");
        bar.className = "month-bar";

        if (totals[index] >= dailyGoal && totals[index] > 0) {
            bar.classList.add("goal-met");
        }

        const height = highest > 0
            ? (totals[index] / highest) * 100
            : 0;

        bar.style.height = `${height}%`;
        bar.title = `${date}: ${totals[index]} kcal`;

        track.appendChild(bar);

        const dayNumber = document.createElement("span");
        dayNumber.className = "month-day-number";
        dayNumber.textContent = index + 1;

        day.append(value, track, dayNumber);
        chart.appendChild(day);
    });
}

function updateReports() {
    updateWeeklyReport();
    updateMonthlyReport();
}

/* Dark Mode */

function applyTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    document.getElementById("theme-toggle").textContent =
        isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
}

function loadTheme() {
    const savedTheme = localStorage.getItem("calorieTrackerTheme");
    applyTheme(savedTheme === "dark");
}

document.getElementById("theme-toggle").addEventListener("click", function() {
    const isDark = !document.body.classList.contains("dark-mode");

    applyTheme(isDark);
    localStorage.setItem("calorieTrackerTheme", isDark ? "dark" : "light");
});

/* Event Listeners */

foodForm.addEventListener("submit", addFood);
goalForm.addEventListener("submit", updateDailyGoal);
waterForm.addEventListener("submit", addCustomWater);
waterGoalForm.addEventListener("submit", updateWaterGoal);

document.getElementById("cancel-edit-btn").addEventListener("click", resetFoodForm);

document.getElementById("today-btn").addEventListener("click", function() {
    selectedDate.value = getTodayDate();
    searchFood.value = "";
    filterMeal.value = "All";

    displayFoodItems();
    displayWaterRecords();
    updateReports();
});

selectedDate.addEventListener("change", function() {
    resetFoodForm();
    displayFoodItems();
    displayWaterRecords();
    updateReports();
});

searchFood.addEventListener("input", displayFoodItems);
filterMeal.addEventListener("change", displayFoodItems);

document.getElementById("export-csv-btn").addEventListener("click", exportCSV);
document.getElementById("undo-btn").addEventListener("click", undoDelete);
document.getElementById("reset-water-btn").addEventListener("click", resetWaterRecords);

document.getElementById("monthly-month").addEventListener("change", updateMonthlyReport);

document.querySelectorAll(".water-add-btn").forEach(function(button) {
    button.addEventListener("click", function() {
        const amount = Number(button.dataset.amount);
        addWater(amount);
    });
});

/* Initial Setup */

selectedDate.value = getTodayDate();
document.getElementById("monthly-month").value = getTodayDate().slice(0, 7);

goalInput.value = dailyGoal;
waterGoalInput.value = waterGoal;

loadTheme();
displayFoodItems();
displayWaterRecords();
updateReports();