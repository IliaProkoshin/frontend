import os

import requests
from flask import Flask, Response, render_template, request

API_VERSION = "2.0"

app = Flask(__name__)
app.config["BACKEND_URL"] = os.environ.get("BACKEND_URL", "http://127.0.0.1:5001")


@app.route("/")
def index():
    return render_template(
        "index.html",
        backend_url="",
        version=API_VERSION.split(".")[0],
    )


@app.route("/api/<path:subpath>", methods=["GET", "POST"])
def api_proxy(subpath):
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
    host = os.environ.get("HOST", "127.0.0.1")
    port = int(os.environ.get("PORT", "5000"))
    debug = os.environ.get("DEBUG", "true").lower() in ("1", "true", "yes", "on")
    app.run(host=host, port=port, debug=debug)
