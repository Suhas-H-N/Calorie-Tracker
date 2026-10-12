# 🍎 Calorie Tracker

A simple and responsive web application built using **HTML, CSS, and JavaScript** to record food intake, track daily calories, and monitor progress toward a daily calorie goal.

## 📌 Project Overview

The Calorie Tracker helps users maintain a record of their food consumption throughout the day. Users can add food items, select meal types, enter calories, edit or delete records, and view their daily calorie summary.

The application uses browser **Local Storage** to preserve food records after refreshing or reopening the page in the same browser.

## ✨ Features

- **Add Food:** Add food items with their names, meal types, and calorie values.
- **Meal Type Selection:** Categorize food as Breakfast, Lunch, Dinner, or Snack.
- **Edit Food:** Update existing food records.
- **Delete Food:** Remove unwanted food records.
- **Daily Calorie Summary:** View the daily goal, total calories consumed, and remaining calories.
- **Exceeded Goal Display:** Shows how many calories the user has exceeded when consumption goes above the daily goal.
- **Search Food:** Find food items using case-insensitive search.
- **Filter Meals:** Display records by meal type.
- **Local Storage:** Automatically save records after adding, editing, or deleting food.
- **Automatic Data Loading:** Restore saved records when the page opens.
- **Input Validation:** Handle empty food names, invalid meal selections, and invalid calorie values.
- **Empty State:** Display a helpful message when no food records match the current search or filter.
- **Responsive Design:** Adapt the form and layout for mobile and desktop screens.
- **Improved Table Design:** Clear headings, row spacing, hover effects, aligned calorie values, and distinct Edit/Delete buttons.
- **Status Messages:** Display feedback after successful operations or invalid input.

## 🛠️ Technologies Used

- **HTML5** – Structure and semantic elements.
- **CSS3** – Styling, Flexbox, CSS Grid, hover effects, and responsive layouts.
- **JavaScript** – DOM manipulation, event handling, validation, search, filtering, and calorie calculations.
- **Local Storage** – Persistent browser-side storage for food records.

## 📂 Project Structure

```text
Calorie-Tracker/
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run the Project

1. Clone or download this repository.
2. Open the project folder in Visual Studio Code.
3. Make sure `index.html`, `style.css`, and `script.js` are in the same folder.
4. Open `index.html` in your browser, or run it using the Live Server extension in VS Code.
5. Start adding food records and tracking your calories.

No backend or database installation is required.

## 📖 How to Use

1. Open the Calorie Tracker in your browser.
2. Enter the food name.
3. Select the meal type.
4. Enter the calories.
5. Click **Add Food**.
6. View the food record in the table and check the updated calorie summary.
7. Use **Edit** to update a record or **Delete** to remove it.
8. Use the search field to find food items and the filter to select a meal type.
9. Refresh the browser to verify that saved records are restored automatically.

## 🎯 Daily Calorie Goal

The default daily calorie goal is **2000 kcal**.

The summary displays:

- **Daily Goal:** The target calorie amount.
- **Consumed:** The total calories recorded.
- **Remaining:** The calories left before reaching the goal.

If the total exceeds the goal, the application displays the excess amount.

Example:

| Daily Goal | Consumed | Remaining |
|---:|---:|---:|
| 2000 kcal | 1500 kcal | 500 kcal |
| 2000 kcal | 2000 kcal | 0 kcal |
| 2000 kcal | 2300 kcal | Exceeded by 300 kcal |

The goal is a configurable value in the JavaScript code. The application is a tracking tool and does not provide personalized dietary advice.

## 💾 Data Storage

Food records are stored in the browser's Local Storage under the key `foodItems`.

The application saves changes after:
- Adding a food record.
- Editing a food record.
- Deleting a food record.

Saved records are loaded automatically when the page opens again in the same browser and website origin.

**Note:** Local Storage is browser-specific. Clearing site data or using another browser or device may remove or hide saved records.

## 📱 Responsive Design

The interface uses CSS Grid and Flexbox to maintain a clean layout across screen sizes.

- Food entry fields stack vertically on smaller screens.
- Search and filter controls adapt to mobile layouts.
- The food records table supports horizontal scrolling on narrow screens.
- Buttons, headings, and spacing are adjusted for readability.

## 📚 Concepts Learned

This project provides hands-on practice with:

- HTML forms and semantic elements.
- CSS Grid and Flexbox.
- Responsive web design and media queries.
- JavaScript functions and event listeners.
- DOM manipulation and dynamic table generation.
- Array methods such as `filter()` and `find()`.
- Form validation.
- Case-insensitive string matching.
- Browser Local Storage using `JSON.stringify()` and `JSON.parse()`.
- Basic error handling.

## 🔮 Future Improvements

Possible future enhancements include:

- Customizable daily calorie goals.
- Date-wise food tracking and history.
- Meal-wise calorie summaries.
- Exporting food records to CSV.
- Charts for visualizing calorie consumption.

## 👨‍💻 Author

**Developed as a front-end development mini project** to practice HTML, CSS, JavaScript, and browser storage.

## 📄 License

This project is available for learning and educational purposes. Add a specific open-source license if you intend to distribute it under formal license terms.
