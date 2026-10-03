/* Load food records from Local Storage */
let foodItems = JSON.parse(localStorage.getItem("foodItems")) || [];
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
    localStorage.setItem("foodItems", JSON.stringify(foodItems));
}

/* Display, search and filter food records */
function displayFoodItems() {
    foodList.innerHTML = "";

    let searchValue = searchFood.value.toLowerCase().trim();
    let filterValue = filterMeal.value;

    let filteredItems = foodItems.filter(function(item) {
        let matchesSearch = item.name.toLowerCase().includes(searchValue);
        let matchesFilter = filterValue === "all" || item.meal === filterValue;
        return matchesSearch && matchesFilter;
    });

    /* Show empty state when no matching records are available */
    if (filteredItems.length === 0) {
        emptyState.style.display = "block";
    } else {
        emptyState.style.display = "none";
    }

    /* Create table rows dynamically for each food record */
    filteredItems.forEach(function(item) {
        let row = document.createElement("tr");

        let foodCell = document.createElement("td");
        foodCell.textContent = item.name;

        let mealCell = document.createElement("td");
        mealCell.textContent = item.meal;

        let calorieCell = document.createElement("td");
        calorieCell.textContent = item.calories + " kcal";

        let actionCell = document.createElement("td");

        /* Create Edit button */
        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", function() {
            editFood(item.id);
        });

        /* Create Delete button */
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

    /* Validate food name */
    if (name === "") {
        statusMessage.textContent = "Please enter food name.";
        return;
    }

    if (name.length < 2) {
        statusMessage.textContent = "Food name must contain at least 2 characters.";
        return;
    }

    /* Validate meal type */
    if (meal === "") {
        statusMessage.textContent = "Please select a meal type.";
        return;
    }

    /* Validate calories */
    if (calorieValue <= 0 || isNaN(calorieValue)) {
        statusMessage.textContent = "Please enter valid calories.";
        return;
    }

    /* Add a new food record */
    if (editId === null) {
        let newFood = {
            id: Date.now(),
            name: name,
            meal: meal,
            calories: calorieValue
        };

        foodItems.push(newFood);
        statusMessage.textContent = "Food record added successfully.";
    } else {
        /* Update an existing food record */
        let food = foodItems.find(function(item) {
            return item.id === editId;
        });

        food.name = name;
        food.meal = meal;
        food.calories = calorieValue;

        editId = null;
        addFoodBtn.textContent = "Add Food";
        statusMessage.textContent = "Food record updated successfully.";
    }

    saveFoodItems();
    displayFoodItems();
    foodForm.reset();
}

/* Load selected food details into the form for editing */
function editFood(id) {
    let food = foodItems.find(function(item) {
        return item.id === id;
    });

    foodName.value = food.name;
    mealType.value = food.meal;
    calories.value = food.calories;
    editId = id;
    addFoodBtn.textContent = "Update Food";
}

/* Delete a selected food record */
function deleteFood(id) {
    foodItems = foodItems.filter(function(item) {
        return item.id !== id;
    });

    saveFoodItems();
    displayFoodItems();
    statusMessage.textContent = "Food record deleted successfully.";
}

/* Calculate total and remaining calories */
function updateTotal() {
    let total = 0;

    foodItems.forEach(function(item) {
        total += item.calories;
    });

    let remaining = dailyGoal - total;

    totalCalories.textContent = total;
    dailyTotal.textContent = total;
    remainingCalories.textContent = remaining;
}

/* Handle form submission, search and filter actions */
foodForm.addEventListener("submit", addFood);
searchFood.addEventListener("input", displayFoodItems);
filterMeal.addEventListener("change", displayFoodItems);

/* Display saved food records when the page loads */
displayFoodItems();