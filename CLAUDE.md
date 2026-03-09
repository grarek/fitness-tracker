# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
A personal daily tracker app for Kyle. Goals: fat loss + body recomposition (lose fat, build muscle simultaneously). Built as a single-file React artifact using the Claude.ai artifact system with persistent storage.

## Development

There is no build system, package manager, test suite, or linter. The entire app is a single file (`tracker.tsx`) that runs inside the Claude.ai artifact runtime (`application/vnd.ant.react`).

**To deploy changes:** Copy the contents of `tracker.tsx` into a Claude.ai artifact conversation.

**There are no commands to build, test, or lint.** The artifact runtime provides React and handles rendering.

## Critical Constraints

- **Single file only** — all components, helpers, styles, and constants live in `tracker.tsx` as one default export. No imports beyond `{ useState, useEffect } from "react"`.
- **`window.storage` only** — the sole persistence API. Not localStorage, not sessionStorage. All ops are async and must be wrapped in try/catch.
- **No external libraries** — no Tailwind, no npm packages. Only React and what the artifact runtime provides.
- **All styles are inline** — dark theme using `#111`/`#1a1a1a`/`#222` backgrounds, accent colors `#4f9` (green), `#f90` (orange), `#f44` (red), `#48f` (blue), `#f48` (magenta).
- **GIFs must be from Wikimedia Commons** — Giphy URLs are blocked from third-party embeds.
- **Avoid deeply nested JSX ternaries** — use flat `if/else` blocks to prevent parse errors in the artifact system.
- **`max_tokens` limits for API calls:** nutrition = 200, recommendations = 600.

## User Profile & Targets

- **Age:** 36 | **Height:** 6'0" | **Weight:** 225 lbs
- **Goal:** Body recomposition — lose fat, build noticeable muscle
- **Training:** 3 days/week, home basement gym, evenings
- **Job:** Desk job, mostly sedentary

| Macro | Target |
|---|---|
| Calories | 2,300 kcal |
| Protein | 175–185g |
| Carbs | ~215g |
| Fat | ~72g |

**Food dislikes:** Cauliflower rice, ground turkey, tomato, yogurt, cucumber

## Equipment (Home Basement)
Squat rack, 45 lb barbell, 35 lb barbell, various plates, multiple kettlebells, adjustable dumbbells

## Workout Program
**3-day full body, AI-selected from a categorized exercise pool.** Each session the AI picks 7 exercises (2-3 lower, 2-3 upper, 1-2 core, 1 cardio) from the pool, varying the selection to avoid repeating recent exercises.

### Exercise Pool Categories

**Lower Body (11):** Barbell Back Squat, Dumbbell Romanian Deadlift, Kettlebell Goblet Squat, Barbell Lunge, Barbell Deadlift, Barbell Romanian Deadlift, Barbell Hip Thrust, Dumbbell Step-Up, Barbell Front Squat, Kettlebell Bulgarian Split Squat, Dumbbell Sumo Squat

**Upper Body (15):** Dumbbell Floor Press, Dumbbell Row, Dumbbell Lateral Raise, Overhead Press, Dumbbell Incline Floor Press, Dumbbell Curl + Press Combo, Dumbbell Hammer Curl, Dumbbell Tricep Kickback, Push-Up Variations, Kettlebell Clean & Press, Barbell Bent Over Row, Dumbbell Arnold Press, Kettlebell Halo, Dumbbell Pullover, Dumbbell Reverse Fly

**Core (6):** Plank, Dead Bug, Ab Wheel Rollout, Suitcase Carry, Kettlebell Windmill, Pallof Press

**Cardio/Conditioning (5):** Kettlebell Swing, Farmer Carry, Kettlebell Snatch, Dumbbell Thruster, Barbell Complex

### Rest Days
Rest day is triggered if the user worked out the previous calendar day. Shows a walk task (20–30 min) instead of exercises.

## App Architecture

### Storage Keys
| Key | Contents |
|---|---|
| `tracker:YYYY-MM-DD` | Daily data: `{ foods, workout (array of exercise names), workoutLog, walked }` |
| `exhistory:Exercise_Name` | Array of `{ date, weight, reps, feel }` per exercise |
| `fooddb:entries` | Food library: object keyed by normalized food name |

### Key Functions
- **`callClaude(prompt, maxTokens)`** — raw Anthropic API call via fetch to `https://api.anthropic.com/v1/messages`, model `claude-sonnet-4-20250514`. Parses JSON from response text.
- **`getAIRecommendation(recentWorkouts, exerciseLogs)`** — determines rest vs workout day, picks exercises from the categorized pool, returns per-exercise weight suggestions.
- **`getNutrition(foodName, weightG)`** — looks up macro estimates via Claude API.
- **`parseRepOptions(sets)`** — parses sets string like `"4 x 6-8"` or `"3 x 30-45 sec"` into button options. Time-based exercises show 5-second increments.
- **`loadRecentWorkouts()`** — lists `tracker:*` keys, loads last 14 days, extracts workout history.

### AI Response Shapes
```json
// Workout day
{ "restDay": false, "exercises": ["Barbell Back Squat", "Dumbbell Row", ...], "reason": "...", "suggestions": { "Barbell Back Squat": "135 lbs" } }

// Rest day
{ "restDay": true, "reason": "..." }

// Nutrition lookup
{ "calories": 250, "protein": 30, "carbs": 10, "fat": 8, "note": "optional clarification" }
```

### Components
- **`App`** — main component, manages all state, renders food and workout tabs
- **`RestDay`** — rest day view with walk logging + recovery tips
- **`ExerciseCard`** — collapsible card with GIF, description, history, weight/rep logging buttons
- **`WeightButtons`** — quick-tap weight chips (previous weight, AI suggested, +10, +15) + manual "Other" input
- **`RepButtons`** — quick-tap rep/time chips parsed from sets string + manual "Other" input
- **`FoodDBModal`** — bottom sheet modal for food library CRUD
- **`MacroField`** — macro input with unit label
- **`Bar`** — macro progress bar

### Food Features
- Macro tracking with progress bars vs daily targets
- Nutrition lookup by food name + weight in grams via Claude API
- Food library with custom serving size/unit, editable, deletable
- Serving scaling — selecting a library food switches weight field to servings; macros scale proportionally
- Autocomplete from food library + today's log; library entries show "Library" badge
- "Save to Library" button appears after a successful lookup

## Planned / Possible Future Features
- Weekly summary view (weight trend, workouts completed, avg macros)
- Browse past days food log
- Body weight logging and trend chart
- Nutrition lookup from barcode or image
