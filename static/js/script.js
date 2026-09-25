/**
 * Форма отправки данных — версия 1.0.
 * По нажатию кнопки «Отправить» текст из поля уходит на бэкенд
 * POST-запросом на /api/data.
 */

(function () {
    "use strict";

    const form = document.getElementById("send-form");
    const input = document.getElementById("text-input");
    const button = document.getElementById("send-button");
    const statusBox = document.getElementById("status");

    function showStatus(message, type) {
        statusBox.textContent = message;
        statusBox.className = "status status--" + type;
    }

    async function sendData() {
        const text = input.value.trim();

        if (!text) {
            showStatus("Введите текст перед отправкой.", "error");
            return;
        }

        button.disabled = true;
        showStatus("Отправка данных...", "success");

        try {
            const response = await fetch(window.BACKEND_URL + "/api/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: text })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Ошибка запроса");
            }

            showStatus(data.message + "\nВсего записей в data.txt: " + data.records, "success");
            input.value = "";
        } catch (error) {
            showStatus(
                "Не удалось выполнить запрос: " + error.message +
                "\nПроверьте, что бэкенд запущен по адресу " + window.BACKEND_URL,
                "error"
            );
        } finally {
            button.disabled = false;
        }
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        sendData();
    });
})();
