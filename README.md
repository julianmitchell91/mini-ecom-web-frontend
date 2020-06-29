# Mini E‑com — Web (Candidate)

Welcome — this is a small, intentionally buggy mini e‑commerce project used for a short coding/interview task.

Goal
- Find and fix the bugs in this project by reading and editing the code.
- Make the automated tests pass and (optionally) make the UI work end-to-end.
- Keep your fixes minimal and well-explained.

What’s included
- frontend/ — React + Vite + Tailwind frontend (candidate-facing).
  - Key files you may edit: frontend/src/* (App and util functions), frontend/tailwind.config.js, etc.

Timebox
- Recommended time: 10 minutes (adjust per interview).
- Please work within the time limit set by the interviewer.

Constraints / rules
- Keep edits minimal and localized; prefer small, clear changes over broad rewrites.
- Don’t add new packages unless you document why they are necessary (prefer avoiding new deps).
- Explain your fixes in 2–5 sentences in your submission (what you changed and why).

Local setup and commands

Prerequisites
- Node.js (18.x recommended) and npm
- A modern browser for frontend testing

Notes
- The tests exercise the checkout flow. Initially, tests are expected to fail until you fix the backend/frontend bugs.

Frontend — run React dev server
(Unix / macOS / WSL)
```bash
cd frontend
npm ci
npm run dev
```
(Windows PowerShell)
```powershell
cd .\frontend
npm ci
npm run dev
```
Open the URL printed by Vite (usually http://localhost:5173).

CORS note for manual UI
- The frontend (Vite dev server) and backend may run on different origins — the backend does not add CORS headers by default. If browser requests fail due to CORS, you can:
  - Temporarily enable CORS in backend (add and use the `cors` middleware) OR
  - Serve the built frontend from the backend (copy built files into backend/public) — either approach is fine for the interview.

What we expect from you
- Run the tests, identify failing tests, inspect the code to find root causes, and apply minimal fixes.
- Make tests pass and briefly describe your changes and rationale.
- If you fix frontend behavior, show that the UI can complete a demo purchase (manual run) or explain why UI changes are required.

Submission
- Commit your changes on a branch and push to your fork or create a patch (git format-patch) and provide it to the interviewer.
- Include a short summary (2–5 sentences) of each change and why it fixes the issue.

Good luck!