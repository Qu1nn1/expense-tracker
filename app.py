from flask import Flask, jsonify, render_template, request
import os
from db import get_db, init_db, close_db
from decimal import Decimal, InvalidOperation
from datetime import date

app = Flask(__name__, instance_relative_config=True)

os.makedirs(app.instance_path, exist_ok=True)

app.teardown_appcontext(close_db) # After each request, call close_db

@app.cli.command("init-db")
def _init_db():
    init_db()
    print("DB initialized")

@app.get("/health")
def health():
    return jsonify(ok=True)

@app.get("/")
def index():
    return render_template("index.html")

@app.get("/api/transactions")
def list_transactions():
    db = get_db()
    rows = db.execute(
    "select id, amount_cents, category, note, date "
    "from transactions order by date desc, id desc"
    ).fetchall()
    return jsonify([dict(r) for r in rows])

@app.post("/api/transactions")
def add_transaction():
    data = request.get_json(silent=True) or {}
    for k in ("amount", "category", "date"):
        if not data.get(k):
            return jsonify(error=f"missing {k}"), 400
    try:
        cents = int(round(Decimal(str(data["amount"])) * 100))
    except (InvalidOperation, ValueError):
        return jsonify(error="bad amount"), 400
    if cents == 0:
        return jsonify(error="amount can not be 0"), 400
    try:
        date.fromisoformat(data["date"])
    except ValueError:
        return jsonify(error="bad date, use YYYY-MM-DD"), 400
    
    cat = str(data["category"]).strip()[:40]
    note = (data.get("note") or "").strip()[:200]

    db = get_db()
    cur = db.execute(
        "insert into transactions(amount_cents, category, note, date) "
        "values (?,?,?,?)", (cents, cat, note, data["date"]))
    db.commit()
    return jsonify(id=cur.lastrowid), 201
