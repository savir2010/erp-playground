<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/ba17e282-4a4a-4b4a-9994-03c88b0cef62

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Guided task widget (`public/widget.js`) + `decide.py`

The floating **Task** button opens a panel where you type a goal (e.g. “I want to export data”). The widget calls **`POST /api/decide`**, which Vite proxies to a local Python service.

1. **Python (repo root `benben/`, not inside `erp-playground/`):** create a `.env` with `OPENAI_API_KEY=...` (see [.env.example](.env.example)).
2. Install deps and start the API (from `benben/`):

   ```bash
   pip install -r requirements.txt
   uvicorn decide:app --reload --port 8765
   ```

3. In another terminal, run **`npm run dev`** in `erp-playground/` as usual (port 3000). Open the app, click **Task**, enter your phrase, and **Send**.

If `decide.py` is not running, the widget shows a network error when you send.
