from flask import Flask, jsonify, render_template
import os
from db import init_db, close_db

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

