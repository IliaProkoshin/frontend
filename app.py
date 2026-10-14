"""Frontend версии 2.0.

Веб-страница с двумя блоками:
  - отправка текста на бэкенд (из версии 1.0);
  - запрос сохраненных данных у бэкенда с выводом результата
    в отдельное поле на странице.

Дополнительно реализован обратный прокси: запросы вида ``/api/*`` frontend
перенаправляет в сервис бэкенда. Благодаря этому браузеру не нужно знать
внутренний адрес бэкенда, а сам бэкенд может не публиковать свой порт
наружу — контейнеры общаются только по внутренней сети Docker.
"""

import os

import requests
from flask import Flask, Response, render_template, request

API_VERSION = "2.0"

app = Flask(__name__)
app.config["BACKEND_URL"] = os.environ.get("BACKEND_URL", "http://127.0.0.1:5001")


@app.route("/")
def index():
    """Отдать главную страницу формы отправки."""
    return render_template(
        "index.html",
        # Браузер обращается к API относительно текущего хоста ("/api/...").
        # Реальные запросы к бэкенду выполняет прокси ниже.
        backend_url="",
        version=API_VERSION.split(".")[0],
    )


@app.route("/api/<path:subpath>", methods=["GET", "POST"])
def api_proxy(subpath):
    """Проксировать запросы /api/* на бэкенд по внутренней сети."""
    url = "{base}/api/{sub}".format(base=app.config["BACKEND_URL"], sub=subpath)
    backend_response = requests.request(
        method=request.method,
        url=url,
        params=request.args,
        json=request.get_json(silent=True),
        timeout=10,
    )
    return Response(
        backend_response.content,
        status=backend_response.status_code,
        content_type=backend_response.headers.get("Content-Type", "application/json"),
    )


if __name__ == "__main__":
    # В контейнере сервис должен слушать все интерфейсы (HOST=0.0.0.0),
    # чтобы страница была доступна с хост-машины.
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5000"))
    app.run(host=host, port=port, debug=True)
