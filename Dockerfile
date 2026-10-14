# Образ фронтенда (Flask + HTML/JS).
# База — официальный уменьшенный образ Python.
FROM python:3.12-slim

# Не создавать .pyc-файлы и не буферизовать вывод (логи сразу в docker logs).
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Рабочий каталог внутри контейнера.
WORKDIR /app

# Сначала зависимости — слой кешируется и не пересобирается при правке кода.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Затем всё приложение: app.py, templates/ и static/.
COPY . .

# Порт, который публикуется наружу (страница доступна из браузера).
EXPOSE 5000

CMD ["python", "app.py"]
