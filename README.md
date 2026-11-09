Calorie Tracker
A simple and responsive web application to track daily food intake,
calories, and water consumption. The application helps users monitor
their calorie goals, review meal-wise summaries, and track water intake
throughout the day.
Features
Food and Calorie Tracking
- Add food items with food name, meal type, and calories.
- Edit and delete food records.
- View the total calories consumed for the selected date.
- Calculate remaining calories based on the daily calorie goal.
- Search food items by name.
- Filter records by meal type.
- Undo the most recent food deletion.
- Save food records in browser Local Storage.
Calorie Goal
- Set a custom daily calorie goal.
- View calorie progress through a progress bar.
- See the percentage of the goal completed.
- View meal-wise calorie summaries for breakfast, lunch, dinner, and
  snacks.
Water Intake Tracking
- Set a daily water intake goal.
- Add water using quick-add buttons or a custom amount.
- View consumed and remaining water.
- Monitor water progress with a progress bar.
- View water intake history for the selected date.
- Delete individual water records or reset the selected date's water
  records.
- Save water records in browser Local Storage.
Reports and Export
- View a weekly calorie report.
- View a monthly calorie report.
- See daily totals, averages, highest-intake days, and goal-achieved
  days.
- Export food records for the selected date as a CSV file.
Additional Features
- Select a date to view and manage that day's records.
- Quickly return to the current date.
- Dark mode toggle.
- Responsive layout for desktop and mobile screens.
- Form validation for user input.
Technologies Used
- HTML5
- CSS3
- JavaScript
- Browser Local Storage
Project Structure
calorie-tracker/
├── index.html
├── style.css
├── script.js
└── README.md
Getting Started
1. Download or clone this repository.
2. Open the project folder in Visual Studio Code or another code
   editor.
3. Open index.html in your browser.
You can also use the Live Server extension in Visual Studio Code to
run the application locally.
How to Use
1. Open the application in your browser.
2. Select a date or use the Today button.
3. Enter a food name, choose a meal type, and enter the calories.
4. Add the food item to view it in the food history.
5. Edit, delete, search, or filter food records as needed.
6. Set your daily calorie goal and monitor the progress bar.
7. Add water using the quick-add buttons or enter a custom amount.
8. Set your daily water goal and monitor your water intake.
9. Review weekly and monthly calorie reports.
10. Export the selected date's food records using the CSV export option.
Data Storage
The application uses browser Local Storage to save food records, water
records, calorie goals, water goals, and the selected theme.
- Data remains available after refreshing the page in the same
  browser.
- Data is stored locally in the browser and is not automatically
  synced across devices or browsers.
- Clearing the browser's site data may remove the saved records.
Validation and Notes
- Enter valid food names and positive calorie values.
- Enter a positive water amount when adding water.
- Calorie and water records are associated with the selected date.
- The CSV export includes food records for the selected date.
Future Improvements
- Duplicate food entry option.
- Custom meal categories.
- Downloadable PDF reports.
- User accounts and cloud data synchronization.
- Charts and additional nutrition insights.
Author
Developed as a frontend practice project using HTML, CSS, and
JavaScript.