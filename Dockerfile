# --- Frontend (Vite) ---
FROM node:22-bookworm-slim AS frontend
WORKDIR /app/erp-playground

COPY erp-playground/package.json erp-playground/package-lock.json ./
RUN npm ci

COPY erp-playground/ ./
RUN npm run build

# --- API + static ---
FROM python:3.12-slim-bookworm

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY decide.py serve_cloud.py document.txt ./
COPY --from=frontend /app/erp-playground/dist ./erp-playground/dist

ENV PORT=8080
EXPOSE 8080

CMD ["sh", "-c", "exec uvicorn serve_cloud:app --host 0.0.0.0 --port ${PORT}"]
