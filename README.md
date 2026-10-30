# Calorie Tracker

A simple and responsive web application built using **HTML, CSS, and JavaScript** to record daily food intake, calculate calories, and monitor calorie goals.

## 🎯 Project Objective

The objective of this project is to help users track their daily food consumption, calculate total calories, monitor meal-wise intake, and maintain healthy eating habits.

## ✨ Features

- **Add Food:** Add food records with food name, meal type, and calories.
- **Meal Categories:** Organize food into Breakfast, Lunch, Dinner, and Snack.
- **Edit Food:** Update existing food records.
- **Delete Food:** Remove unwanted food records.
- **Undo Delete:** Restore the most recently deleted food record with its original details.
- **Daily Calorie Summary:** View total calories consumed for a selected date.
- **Daily Calorie Goal:** Track progress toward the 2000 kcal daily goal.
- **Remaining Calories:** View calories remaining or calories exceeding the daily goal.
- **Progress Bar:** Visualize daily calorie goal progress.
- **Meal-Wise Summary:** View calorie consumption for each meal category.
- **Daily Food History:** Select previous dates to view food records.
- **Search Food:** Search food records by name.
- **Filter by Meal:** Filter records according to meal type.
- **Weekly Calorie Report:** View weekly calorie totals, daily averages, and the highest-intake day.
- **Weekly Chart:** Visualize calorie consumption over seven days.
- **CSV Export:** Export all food records into a CSV file.
- **Local Storage:** Save food records in the browser.
- **Dark Mode:** Switch between light and dark themes.
- **Form Validation:** Prevent invalid food entries.
- **Responsive Design:** Supports desktop, tablet, and mobile screens.
- **Status Messages:** Display confirmation and validation messages.

## 🛠️ Technologies Used

- HTML5 – Application structure
- CSS3 – Styling, Flexbox, Grid, and responsive design
- JavaScript – Application logic and DOM manipulation
- Local Storage – Browser-based data persistence

## 📂 Project Structure

```text
Calorie-Tracker/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 How to Run the Project

1. Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
```

2. Open the project folder in VS Code.

3. Open `index.html` in your browser.

4. Add food records and start tracking your calories.

You can also use the **Live Server** extension in VS Code.

## 💡 How Undo Delete Works

1. Click the Delete button on a food record.
2. A deletion confirmation message appears.
3. Click the Undo button to restore the deleted record.
4. The restored record retains its original food name, meal type, calories, date, and ID.

**Note:** Undo is available only for the most recent deletion during the current page session. Refreshing the page clears the pending Undo action.

## 💾 Data Storage

Food records are stored using the browser's Local Storage.

- Records remain available after refreshing the page.
- Editing and deleting records update Local Storage.
- Undo restores the deleted record and saves it again.
- CSV export allows users to keep an external copy of their records.

**Note:** Data is stored in the current browser and device. Clearing browser storage may remove saved records.

## 📱 Responsive Design

The application uses CSS Flexbox and Grid to provide a responsive layout for different screen sizes.

## 🔮 Future Enhancements

- Customizable daily calorie goals.
- Monthly calorie reports.
- Food nutrition database integration.
- Data import from CSV files.
- User authentication and cloud-based storage.

## 👨‍💻 Author

**Suhas H N**

## 📄 License

This project is created for educational and learning purposes.