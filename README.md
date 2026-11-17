# Calorie Tracker

A lightweight, responsive browser app for tracking daily food, calories, and water intake. Set personal daily goals, review meal summaries, and explore weekly and monthly calorie reports—all stored locally in your browser.

## Features

### Food and calorie tracking

- Add, edit, and delete food entries with a name, meal category, and calorie amount.
- View food records and calorie totals for a selected date, or jump back to today.
- Search entries by food name and filter them by meal.
- Undo the most recent food deletion.
- See calories consumed, calories remaining (or over goal), progress toward your daily goal, and a breakdown by meal.
- Export the selected date's food entries as a CSV file.

### Daily calorie goal

- Set a custom daily calorie goal. The default is **2,000 kcal**.
- Follow progress in the summary and progress bar.

### Water intake tracking

- Set a custom daily water goal. The default is **2,000 ml**.
- Log water with the **+250 ml** and **+500 ml** buttons or enter a custom amount.
- Review the selected date's water entries and total, track goal progress, delete entries, or reset that date's water records.

### Reports and appearance

- Review a seven-day calorie report centered on the selected date's week (Sunday–Saturday).
- View a monthly chart, total, average for days with recorded intake, highest-intake day, and number of days at or above the current calorie goal.
- Switch between light and dark themes.
- Use the responsive interface on desktop and mobile screens.

## Getting started

This project uses plain HTML, CSS, and JavaScript; no package installation or build step is required.

1. Clone or download this repository.
2. Open `index.html` in a modern web browser.

For local development, you can also open the project folder in an editor such as Visual Studio Code and serve it with an extension such as Live Server.

## How to use

1. Choose a date with the date picker, or click **Today**.
2. Set your calorie and water goals if you want to change the defaults.
3. Add food by entering its name, choosing a meal, and entering calories.
4. Use **Edit** or **Delete** in the food records table to manage entries. After a deletion, use **Undo** to restore the most recently deleted entry.
5. Search or filter food records, and click **Clear Filters** to reset the search and meal filter.
6. Add water with a quick-add button or a custom amount. Delete individual water entries or reset water records for the selected date.
7. Review the weekly and monthly reports. The monthly report uses the current calorie goal to count goal-achieved days.
8. Click **Export CSV** to download food records for the selected date.

## Project files

```text
Calorie-Tracker/
├── index.html   # App layout and controls
├── style.css    # Responsive layout and light/dark themes
├── script.js    # Tracking, reports, and browser storage logic
└── README.md
```

## Technologies

- HTML5
- CSS3
- JavaScript (vanilla)
- Browser Local Storage

## Data and privacy

The app saves food entries, water entries, calorie and water goals, and theme preference in the browser's Local Storage. Data is kept in the current browser on the current device; it is not uploaded or synchronized to an account. Clearing the browser's site data can remove saved records. Use the CSV export to keep a separate copy of food entries for a selected date.

## Input limits

- Food name is required and must contain non-whitespace text.
- Food calories must be a positive number.
- Calorie goal must be a whole number from **1 to 100,000 kcal**.
- Water amount must be a whole number from **1 to 20,000 ml**.
- Water goal must be a whole number from **1 to 20,000 ml**.

## Notes

- Entries are associated with the date selected when they are added. Changing the date shows that date's food and water records.
- The weekly report runs from Sunday through Saturday for the week containing the selected date.
- The monthly average is calculated over days with recorded calorie intake.
- Calorie tracking is for personal record-keeping and is not medical or dietary advice.

## License

No license file is currently included in this repository. Unless a license is added, standard copyright applies and reuse is not automatically granted.
