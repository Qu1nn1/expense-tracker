import sqlite3
import pathlib
from flask import current_app, g

def get_db():
    if "db" not in g:
        db_path = pathlib.Path(current_app.instance_path) / "expenses.sqlite3"
        conn = sqlite3.connect(db_path, detect_types=sqlite3.PARSE_DECLTYPES)
        conn.row_factory = sqlite3.Row
        g.db = conn
    return g.db

def close_db(e=None):
    db = g.pop("db", None)
    if db:
        db.close()

def init_db():
    db = get_db()
    with current_app.open_resource("schema.sql") as f:
        db.executescript(f.read().decode("utf-8"))


