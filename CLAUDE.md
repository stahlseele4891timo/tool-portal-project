# CLAUDE.md

## Tech Stack

- Plain HTML, CSS, and JavaScript only.
- No frameworks, no build step. Files must work by opening them directly in a browser.

## Project Structure

- `index.html` – portal home page; shows a card for each tool
- `css/style.css` – shared styles and the light/dark theme colors
- `js/theme.js` – theme toggle (remembers the choice)
- `js/tools.js` – the list of tools; add one entry per new tool
- `tools/<tool-name>/` – one folder per tool (currently `prompt-tutor`)
- `README.md`, `CLAUDE.md` – docs

## Feature Plan

Phase 1 is the portal plus exactly one tool.

- [x] Portal page (`index.html`) with a card grid, plus a placeholder "Tool 1 — coming soon" card that opens and closes through the portal's navigation (URL ending in `#tool-1`; the back link goes to `#`)
- [x] First real tool: AI Prompt Engineering Tutor (`tools/prompt-tutor/`)

## Key Requirements

1. Every page must be responsive and work on desktop, tablet, and phone.
2. Users can toggle between a light and a dark theme. The default is the light theme.
3. Text must stay easy to read, with good contrast, in both the light and the dark theme.

## Rules for Claude

- Explain technical terms in plain language.
- Ask before making big changes.
- Ask rather than guess when something is unclear.
