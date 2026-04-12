"""
POST /decide — turns a natural-language utterance + UI target roster into ordered steps.
Run from repo root: uvicorn decide:app --reload --port 8765
Requires OPENAI_API_KEY in .env
"""

from __future__ import annotations

import json
import os
from typing import Literal

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
from pydantic import BaseModel, Field

load_dotenv()

app = FastAPI(title="ERP Widget Decide")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TargetItem(BaseModel):
    id: str = Field(..., max_length=120)
    kind: str = Field(..., max_length=32)
    label: str = Field(default="", max_length=200)


class DecideRequest(BaseModel):
    utterance: str = Field(..., max_length=2000)
    activeTab: str = Field(..., max_length=64)
    pageContext: str = Field(
        default="",
        max_length=2000,
        description="Human summary of what the current tab shows; authoritative for planning.",
    )
    targets: list[TargetItem] = Field(default_factory=list, max_length=80)


class Step(BaseModel):
    action: Literal["point", "highlight"]
    targetId: str = Field(..., max_length=120)
    waitFor: Literal["click", "none"]


class DecideResponse(BaseModel):
    steps: list[Step] = Field(default_factory=list, max_length=8)

doc = open("document.txt", "r").read()

SYSTEM_PROMPT = """
You are a UI Navigation Planner for a single-page ERP Playground. Your goal is to guide the user to a specific UI element or action based on the current application state.

ERP Layout Reference
Sidebar (Navigation): Swaps the main content area. Includes Dashboard, Accounting, Procurement, CRM, Logistics, Warehouse, HR Management, Analytics, Settings, and API Logs.

Dashboard Page: Contains the "Recent Transactions Table," "Quick Entry Form" (with Submit button), and the "Admin Quick Actions" Button Wall.

Module Pages: Generic views containing an "Initialize [Module] Setup" button.

Success Modal: Contains "Continue" and "Close (X)" buttons.

Ground Rules
Current State is Truth: Use activeTab, pageContext, and targets provided in the current snapshot.

Greedy Navigation: If the goal is not on the current screen, your primary objective is to find the Sidebar button (nav:<module>) that leads to the goal.

Example: If the goal is "Edit Config" and you are on "Accounting," your first and only step is to point at nav:dashboard.

Target Integrity: Use ONLY targetId values present in the current targets list. Never hallucinate IDs.

Action Sequence: - Use point with waitFor: "click" for buttons that must be pressed to progress.

Use highlight with waitFor: "none" for the final destination or to draw attention to static elements.

Crucial: highlight must be the last step in the steps array.

Multi-Round Logic
This is a stateful loop. You will receive the user request again after every click. Do not plan for future screens. Only provide steps for the targetIds visible right now.

Output Format
Return ONLY valid JSON. No markdown, no prose.
{
"steps": [
{
"action": "point" | "highlight",
"targetId": "string",
"waitFor": "click" | "none"
}
]
}

Constraint Checklist
Max 3 steps per response.

If the goal is a button (e.g., "Submit"), point to it.

If the goal is a concept or piece of data, highlight the relevant UI element.

If a modal is blocking the UI (e.g., Success Modal), you must first provide a step to dismiss it (action
"""

def _build_user_message(req: DecideRequest) -> str:
    targets_json = json.dumps(
        [t.model_dump() for t in req.targets],
        ensure_ascii=False,
    )
    ctx = (req.pageContext or "").strip() or "(not provided — infer only from activeTab and targets)"
    return (
        "=== CURRENT_PAGE (decide from here first) ===\n"
        f"activeTab: {req.activeTab!r}\n"
        f"pageContext: {ctx}\n"
        "\n=== USER_GOAL ===\n"
        f"utterance: {req.utterance!r}\n"
        "\n=== DOM_TARGETS (only these elements exist on screen now) ===\n"
        f"{targets_json}\n"
        '\nReturn JSON: {"steps": [...]}'
    )


def _parse_steps(raw: str) -> list[Step]:
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Invalid JSON from model: {e}") from e
    if not isinstance(data, dict) or "steps" not in data:
        raise HTTPException(status_code=502, detail="Model response missing 'steps'")
    steps_raw = data["steps"]
    if not isinstance(steps_raw, list):
        raise HTTPException(status_code=502, detail="'steps' must be a list")
    out: list[Step] = []
    for i, item in enumerate(steps_raw):
        try:
            out.append(Step.model_validate(item))
        except Exception as e:
            raise HTTPException(
                status_code=502,
                detail=f"Invalid step at index {i}: {e}",
            ) from e
    return out


@app.get("/health")
def health():
    return {"ok": True}


@app.post("/decide", response_model=DecideResponse)
def decide(req: DecideRequest) -> DecideResponse:
    if not req.targets:
        raise HTTPException(
            status_code=400,
            detail="targets list is empty — the client must send widget hooks.",
        )

    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise HTTPException(
            status_code=500,
            detail="OPENAI_API_KEY is not set",
        )

    valid_ids = {t.id for t in req.targets}
    client = OpenAI(api_key=key)

    try:
        completion = client.chat.completions.create(
            model=os.getenv("OPENAI_DECIDE_MODEL", "gpt-4o-mini"),
            temperature=0.2,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": _build_user_message(req)},
            ],
            response_format={"type": "json_object"},
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"OpenAI error: {e!s}") from e

    choice = completion.choices[0].message.content
    if not choice:
        raise HTTPException(status_code=502, detail="Empty model response")

    steps = _parse_steps(choice)
    if len(steps) > 8:
        raise HTTPException(status_code=502, detail="Too many steps")

    for step in steps:
        if step.targetId not in valid_ids:
            raise HTTPException(
                status_code=502,
                detail=f"Model returned unknown targetId: {step.targetId!r}",
            )

    return DecideResponse(steps=steps)
