"""Frontend версии 2.0.

Веб-страница с двумя блоками:
  - отправка текста на бэкенд (из версии 1.0);
  - запрос сохраненных данных у бэкенда с выводом результата
    в отдельное поле на странице.
"""

import os

from flask import Flask, render_template

API_VERSION = "2.0"

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
