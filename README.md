# Fitness Tracker

A personal daily tracker app for body recomposition (lose fat, build muscle). Built as a single-file React artifact for the Claude.ai artifact system with persistent storage.

## Features

- **Macro tracking** — log food with progress bars for calories, protein, carbs, and fat vs daily targets
- **AI nutrition lookup** — enter a food name + weight in grams, get macro estimates via Claude API
- **Food library** — save frequently eaten foods with custom serving sizes for quick re-logging
- **AI workout programming** — 3-day full body program auto-generated from a categorized exercise pool (lower body, upper body, core, cardio/conditioning)
- **Exercise logging** — quick-tap weight/rep buttons with history tracking per exercise
- **Rest day detection** — automatically programs a rest day with a walk task if you trained the previous day
- **GIF demonstrations** — exercise cards include animated GIFs sourced from Wikimedia Commons

## Architecture

The core app lives in `tracker.tsx` — a single-file React component designed to run inside the Claude.ai artifact runtime (`application/vnd.ant.react`). It uses `window.storage` for persistence.

A Vite + Docker setup (`src/`, `Dockerfile`, `docker-compose.yml`) is also included for local development and self-hosting with a file-based storage backend.

## Setup

### Claude.ai Artifact
Copy the contents of `tracker.tsx` into a Claude.ai artifact conversation.

### Local Development
```bash
npm install
npm run dev
```

### Docker
```bash
docker compose up --build
```

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_ANTHROPIC_API_KEY` | Anthropic API key for nutrition + workout AI features |

Create a `.env` file with your key:
```
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

## Tech Stack

- React (no external UI libraries)
- Vite (local dev server)
- Claude API (nutrition lookup + workout programming)
- Inline styles, dark theme
