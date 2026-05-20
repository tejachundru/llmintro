# AGENTS.md — Coding Agent Instructions

## Project Overview

**LLMs Made Simple** — A single-page educational site explaining large language models to beginners through 6 interactive sessions. Built with Vite + React + TypeScript + Tailwind CSS.

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run typecheck` — TypeScript type-checking
- `npm run lint` — ESLint

## Architecture

- **Entry**: `src/main.tsx` → `src/App.tsx`
- **Sessions**: `src/components/Session{1-6}{Topic}.tsx` — each is a self-contained section
- **Shared UI**: `src/components/shared.tsx` — reuse components from here (`SectionHeader`, `AnalogyCard`, `DemoCard`, `RevealSection`, `ConceptBlock`, `KeyPoint`, `FlowDiagram`, `InfoBox`, `RecapBox`, etc.)
- **Design tokens**: CSS variables defined in `src/index.css`, full design spec in `DESIGN.md`
- **State**: Local component state only — no global store, no backend

## Conventions

### Style
- Use **inline styles** (not Tailwind classes) — this project consistently uses inline style objects
- Follow CSS variable tokens: `var(--text)`, `var(--muted)`, `var(--border)`, `var(--accent)`, `var(--bg2)`, etc.
- Use `e.currentTarget` type-cast pattern for mouse event handlers (see `AnalogyCard` in `shared.tsx`)

### Components
- Each session component follows the same pattern: import shared pieces, define accent color constant (`AC`), define data arrays, export a default function component
- Use `SectionHeader` with `{ num, tag, title, accentColor, borderColor }` at the top of each session
- Group content with `SubSection`, `ConceptBlock`, `KeyPoint`
- Interactive demos use `DemoCard`

### TypeScript
- Keep types co-located with the component that uses them
- No unnecessary exports — types used in one file stay in that file

### Adding a new session
1. Create `src/components/SessionN{Name}.tsx`
2. Import shared components from `./shared`
3. Follow the existing session pattern (accent color, data constants, default export)
4. Register it in `App.tsx` with a `<Divider />` between sessions

## Design Reference

Read `DESIGN.md` before making UI changes. Key points:
- Cohere-inspired design: clean white canvases, rounded cards, tight display type
- Cards use `borderRadius: 14`, subtle borders, hover lift effects
- Accent colors per session (check existing sessions for the palette)
- No gradients on UI surfaces — keep backgrounds flat

## Dependencies

- **React 18** — UI framework
- **Lucide React** — icon library
- **Supabase** — declared in package.json but not yet wired up
- **Tailwind CSS** — configured but this project primarily uses inline styles
