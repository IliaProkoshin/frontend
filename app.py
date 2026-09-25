"""Frontend версии 1.0.

Веб-страница с полем ввода и кнопкой «Отправить». При нажатии введенный
текст отправляется на бэкенд POST-запросом.
"""

import os

from flask import Flask, render_template

API_VERSION = "1.0"

app = Flask(__name__)
app.config["BACKEND_URL"] = os.environ.get("BACKEND_URL", "http://127.0.0.1:5001")


@app.route("/")
def index():
    """Отдать главную страницу формы отправки."""
    return render_template(
        "index.html",
        backend_url=app.config["BACKEND_URL"],
        version=API_VERSION.split(".")[0],
    )


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
