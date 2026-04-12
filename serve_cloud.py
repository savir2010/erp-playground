"""
Cloud Run / production ASGI entry: FastAPI decide API under /api, Vite SPA from dist.

Listen with: uvicorn serve_cloud:app --host 0.0.0.0 --port $PORT
"""

from __future__ import annotations

import os

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from decide import app as decide_api

_ROOT = os.path.dirname(os.path.abspath(__file__))
_DIST = os.path.join(_ROOT, "erp-playground", "dist")

app = FastAPI(title="ERP Playground")


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


app.mount("/api", decide_api)

if os.path.isdir(_DIST):
    app.mount("/", StaticFiles(directory=_DIST, html=True), name="static")
else:

    @app.get("/")
    def _missing_frontend() -> dict[str, str]:
        return {"error": "erp-playground/dist not found — run npm run build in erp-playground/"}
