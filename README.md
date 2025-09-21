# Expense Tracker

A minimal web app to track expenses and visualize spending trends.  
Flask backend · SQLite database · Bootstrap frontend · Plotly charts.

## Features
- Add and list transactions (`amount`, `date`, `category`, `note`)
- Summaries by category and by month
- Interactive charts (bar + line) with Plotly
- One-page UI with Bootstrap form, table, and charts

## Tech Stack
- **Backend:** Flask (Python), SQLite  
- **Frontend:** HTML, Bootstrap, Vanilla JS  
- **Charts:** Plotly.js  

## Setup

```bash
# clone and enter
git clone https://github.com/yourname/expense-tracker.git
cd expense-tracker

# create venv
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# install dependencies
pip install -r requirements.txt

# init database
flask --app app init-db

# run server
flask --app app run --debug
````

Open [http://127.0.0.1:5000](http://127.0.0.1:5000)

## API Endpoints

* `GET /api/transactions` → list all transactions
* `POST /api/transactions` → add transaction
  example body:

  ```json
  {"amount":"-9.95","category":"Food","note":"Coffee","date":"2025-09-13"}
  ```
* `GET /api/summary/category` → totals by category
* `GET /api/summary/month` → totals by month

All responses are JSON.

## Screenshots

![form+table](docs/screen-form.png)
![charts](docs/screen-charts.png)

## Notes

* Data stored in `instance/expenses.sqlite3`
* Amounts stored internally in **cents** (integers) for accuracy
* Negative = expense, positive = income
