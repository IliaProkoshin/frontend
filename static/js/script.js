(function () {
    "use strict";

    const sendForm = document.getElementById("send-form");
    const textInput = document.getElementById("text-input");
    const sendButton = document.getElementById("send-button");
    const sendStatus = document.getElementById("status");

    const readForm = document.getElementById("read-form");
    const queryInput = document.getElementById("query-input");
    const readButton = document.getElementById("read-button");
    const readStatus = document.getElementById("read-status");
    const resultOutput = document.getElementById("result-output");

    function showStatus(box, message, type) {
        box.textContent = message;
        box.className = "status status--" + type;
    }

    function showError(box, error) {
        showStatus(
            box,
            "Не удалось выполнить запрос: " + error.message +
            "\nПроверьте, что бэкенд запущен по адресу " + window.BACKEND_URL,
            "error"
        );
    }
    function checkResponse(response) {
        if (response.ok) {
            return;
        }
        if (response.status === 405) {
            throw new Error(
                "бэкенд не поддерживает такой запрос (HTTP 405). " +
                "Похоже, запущена версия 1.0, где чтение данных еще не реализовано"
            );
        }
        throw new Error("HTTP " + response.status);
    }
    async function readJson(response) {
        const contentType = response.headers.get("Content-Type") || "";
        if (!contentType.includes("application/json")) {
            return {};
        }
        return await response.json();
    }

    function asNumber(value) {
        return typeof value === "number" ? value : 0;
    }
    async function sendData() {
        const text = textInput.value.trim();

        if (!text) {
            showStatus(sendStatus, "Введите текст перед отправкой.", "error");
            return;
        }

        sendButton.disabled = true;
        showStatus(sendStatus, "Отправка данных...", "success");

        try {
            const response = await fetch(window.BACKEND_URL + "/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });

            checkResponse(response);
            const data = await readJson(response);

            let message = data.message || "Данные отправлены";
            if (asNumber(data.records) > 0) {
                message += "\nВсего записей в data.txt: " + data.records;
            }

            showStatus(sendStatus, message, "success");
            textInput.value = "";
        } catch (error) {
            showError(sendStatus, error);
        } finally {
            sendButton.disabled = false;
        }
    }
    async function readData() {
        const query = queryInput.value.trim();
        const url = window.BACKEND_URL + "/api/data" +
            (query ? "?query=" + encodeURIComponent(query) : "");

        readButton.disabled = true;
        resultOutput.value = "";
        showStatus(readStatus, "Запрос данных...", "success");

        try {
            const response = await fetch(url, { method: "GET" });
            checkResponse(response);
            const data = await readJson(response);

            resultOutput.value = data.content || "";
            showStatus(
                readStatus,
                "Записей в файле: " + asNumber(data.total) +
                ", показано: " + asNumber(data.count),
                "success"
            );
        } catch (error) {
            resultOutput.value = "";
            showError(readStatus, error);
        } finally {
            readButton.disabled = false;
        }
    }

    sendForm.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData();
    });

    readForm.addEventListener("submit", function (event) {
        event.preventDefault();
        readData();
    });
})();
