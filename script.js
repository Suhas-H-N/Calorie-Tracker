/* Load food records from Local Storage */
function loadFoodItems() {
    try {
        let savedItems = localStorage.getItem("foodItems");

        if (savedItems === null) {
            return [];
        }

        let parsedItems = JSON.parse(savedItems);

        if (!Array.isArray(parsedItems)) {
            return [];
        }

        return parsedItems.filter(function(item) {
            return item &&
                typeof item.id === "number" &&
                typeof item.name === "string" &&
                typeof item.meal === "string" &&
                typeof item.calories === "number" &&
                Number.isFinite(item.calories) &&
                item.calories > 0;
        });
    } catch (error) {
        console.error("Unable to load food records:", error);
        return [];
    }
}

let foodItems = loadFoodItems();
let editId = null;
const dailyGoal = 2000;

/* Get required HTML elements using their IDs */
const foodForm = document.getElementById("food-form");
const foodName = document.getElementById("food-name");
const mealType = document.getElementById("meal-type");
const calories = document.getElementById("calories");
const foodList = document.getElementById("food-list");
const searchFood = document.getElementById("search-food");
const filterMeal = document.getElementById("filter-meal");
const dailyGoalElement = document.getElementById("daily-goal");
const totalCalories = document.getElementById("total-calories");
const remainingCalories = document.getElementById("remaining-calories");
const dailyTotal = document.getElementById("daily-total");
const emptyState = document.getElementById("empty-state");
const statusMessage = document.getElementById("status-message");
const addFoodBtn = document.getElementById("add-food-btn");

dailyGoalElement.textContent = dailyGoal;

/* Save food records to Local Storage */
function saveFoodItems() {
    try {
        localStorage.setItem("foodItems", JSON.stringify(foodItems));
        return true;
    } catch (error) {
        console.error("Unable to save food records:", error);
        statusMessage.textContent = "Unable to save records. Check browser storage.";
        return false;
    }
}

/* Display, search and filter food records */
function displayFoodItems() {
    foodList.innerHTML = "";

    let searchValue = searchFood.value.trim().toLowerCase();
    let filterValue = filterMeal.value;

    let filteredItems = foodItems.filter(function(item) {
        let foodItemName = item.name.toLowerCase();
        let matchesSearch = foodItemName.includes(searchValue);
        let matchesFilter = filterValue === "all" || item.meal === filterValue;

        return matchesSearch && matchesFilter;
    });

    /* Show empty state when no records match */
    if (filteredItems.length === 0) {
        emptyState.textContent = "No food records available.";
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    /* Create table rows dynamically */
    filteredItems.forEach(function(item) {
        let row = document.createElement("tr");

        let foodCell = document.createElement("td");
        foodCell.textContent = item.name;

        let mealCell = document.createElement("td");
        mealCell.textContent = item.meal;

        let calorieCell = document.createElement("td");
        calorieCell.textContent = item.calories + " kcal";

        let actionCell = document.createElement("td");
        actionCell.classList.add("action-cell");

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", function() {
            editFood(item.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.classList.add("delete-btn");
        deleteButton.addEventListener("click", function() {
            deleteFood(item.id);
        });

        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);

        row.appendChild(foodCell);
        row.appendChild(mealCell);
        row.appendChild(calorieCell);
        row.appendChild(actionCell);

        foodList.appendChild(row);
    });

    updateTotal();
}

/* Add a new food record or update an existing record */
function addFood(event) {
    event.preventDefault();

    let name = foodName.value.trim();
    let meal = mealType.value;
    let calorieValue = Number(calories.value);

    if (name === "") {
        statusMessage.textContent = "Please enter food name.";
        return;
    }

    if (name.length < 2) {
        statusMessage.textContent = "Food name must contain at least 2 characters.";
        return;
    }

    if (meal === "") {
        statusMessage.textContent = "Please select a meal type.";
        return;
    }

    if (calories.value.trim() === "" || !Number.isFinite(calorieValue) || calorieValue <= 0) {
        statusMessage.textContent = "Please enter valid calories.";
        return;
    }

    if (editId === null) {
        let newFood = {
            id: Date.now(),
            name: name,
            meal: meal,
            calories: calorieValue
        };

        foodItems.push(newFood);

        if (!saveFoodItems()) {
            foodItems.pop();
            displayFoodItems();
            return;
        }

        statusMessage.textContent = "Food record added successfully.";
    } else {
        let food = foodItems.find(function(item) {
            return item.id === editId;
        });

        if (!food) {
            editId = null;
            addFoodBtn.textContent = "Add Food";
            statusMessage.textContent = "Food record not found.";
            return;
        }

        let previousFood = {
            id: food.id,
            name: food.name,
            meal: food.meal,
            calories: food.calories
        };

        food.name = name;
        food.meal = meal;
        food.calories = calorieValue;

        if (!saveFoodItems()) {
            Object.assign(food, previousFood);
            displayFoodItems();
            return;
        }

        editId = null;
        addFoodBtn.textContent = "Add Food";
        statusMessage.textContent = "Food record updated successfully.";
    }

    displayFoodItems();
    foodForm.reset();
}

/* Load selected food details into the form for editing */
function editFood(id) {
    let food = foodItems.find(function(item) {
        return item.id === id;
    });

    if (!food) {
        statusMessage.textContent = "Food record not found.";
        return;
    }

    foodName.value = food.name;
    mealType.value = food.meal;
    calories.value = food.calories;
    editId = id;
    addFoodBtn.textContent = "Update Food";
    statusMessage.textContent = "";
}

/* Delete a selected food record */
function deleteFood(id) {
    let deletedFood = foodItems.find(function(item) {
        return item.id === id;
    });

    if (!deletedFood) {
        return;
    }

    foodItems = foodItems.filter(function(item) {
        return item.id !== id;
    });

    if (!saveFoodItems()) {
        foodItems.push(deletedFood);
        displayFoodItems();
        return;
    }

    if (editId === id) {
        editId = null;
        foodForm.reset();
        addFoodBtn.textContent = "Add Food";
    }

    displayFoodItems();
    statusMessage.textContent = "Food record deleted successfully.";
}

/* Calculate total and update calorie summary */
function updateTotal() {
    let total = 0;

    foodItems.forEach(function(item) {
        total += item.calories;
    });

    let remaining = dailyGoal - total;

    totalCalories.textContent = total;
    dailyTotal.textContent = total;

    if (remaining >= 0) {
        remainingCalories.textContent = remaining + " kcal";
    } else {
        remainingCalories.textContent = "Exceeded by " + Math.abs(remaining) + " kcal";
    }
}

/* Handle form submission, search and filter actions */
foodForm.addEventListener("submit", addFood);
searchFood.addEventListener("input", displayFoodItems);
filterMeal.addEventListener("change", displayFoodItems);

/* Automatically display saved records when the page opens */
displayFoodItems();