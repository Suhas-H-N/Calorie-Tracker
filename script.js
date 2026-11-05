const foodForm = document.getElementById("food-form");
const goalForm = document.getElementById("goal-form");
const foodName = document.getElementById("food-name");
const mealType = document.getElementById("meal-type");
const foodCalories = document.getElementById("food-calories");
const foodList = document.getElementById("food-list");
const selectedDate = document.getElementById("selected-date");
const searchFood = document.getElementById("search-food");
const filterMeal = document.getElementById("filter-meal");
const goalInput = document.getElementById("goal-input");

const DEFAULT_GOAL = 2000;

let foodItems = loadFoodItems();
let dailyGoal = loadDailyGoal();
let editId = null;
let deletedItem = null;

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

        if (!Array.isArray(savedItems)) {
            return [];
        }

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

function loadDailyGoal() {
    const savedGoal = Number(localStorage.getItem("dailyCalorieGoal"));

    if (Number.isInteger(savedGoal) && savedGoal >= 1 && savedGoal <= 100000) {
        return savedGoal;
    }

    return DEFAULT_GOAL;
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

function saveDailyGoal() {
    try {
        localStorage.setItem("dailyCalorieGoal", String(dailyGoal));
        return true;
    } catch (error) {
        showGoalStatus("Unable to save your calorie goal.", true);
        return false;
    }
}

function getSelectedDateItems() {
    return foodItems.filter(function(item) {
        return item.date === selectedDate.value;
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
        ? "Showing today's food records."
        : `Showing food records for ${selectedDate.value}.`;
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

    document.getElementById("food-form").scrollIntoView({
        behavior: "smooth"
    });
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
            return [
                item.name,
                item.meal,
                item.calories,
                item.date
            ];
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
        bar.style.height = `${Math.max((totals[index] / Math.max(highest, 1)) * 100, 2)}%`;

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
        const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        dates.push(date);
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

foodForm.addEventListener("submit", addFood);
goalForm.addEventListener("submit", updateDailyGoal);

document.getElementById("cancel-edit-btn").addEventListener("click", resetFoodForm);

document.getElementById("today-btn").addEventListener("click", function() {
    selectedDate.value = getTodayDate();
    searchFood.value = "";
    filterMeal.value = "All";

    displayFoodItems();
    updateReports();
});

selectedDate.addEventListener("change", function() {
    resetFoodForm();
    displayFoodItems();
    updateReports();
});

searchFood.addEventListener("input", displayFoodItems);
filterMeal.addEventListener("change", displayFoodItems);

document.getElementById("export-csv-btn").addEventListener("click", exportCSV);
document.getElementById("undo-btn").addEventListener("click", undoDelete);

document.getElementById("monthly-month").addEventListener("change", updateMonthlyReport);

selectedDate.value = getTodayDate();
document.getElementById("monthly-month").value = getTodayDate().slice(0, 7);
goalInput.value = dailyGoal;

loadTheme();
displayFoodItems();
updateReports();