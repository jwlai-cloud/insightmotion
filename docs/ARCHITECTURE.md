# Architecture

## Current system

One Next.js App Router project deploys to one Vercel project.

```text
Browser
  ├─ POST /api/access -> signed HTTP-only demo cookie
  └─ POST /api/generate -> validates cookie + scenario/focus/highlight
                            -> GPT-5.6 Terra Chat Completions
                            -> { code, caption, insight, visualPlan, generatedAt }
       Browser -> executes code with (scene, camera, THREE, anime)
                -> three.js render loop + optional window.__sceneUpdate
```

## Components

- `app/page.tsx`: app entry point.
- `components/live-snapshot.tsx`: demo gate, controls, URL state, model calls,
  three-attempt repair loop, visible AI decision and generated-code panels.
- `components/snapshot-stage.tsx`: owns renderer, scene, camera, OrbitControls, lighting,
  resize observer, animation loop, and generated-code execution contract.
- `app/api/access/route.ts`: verifies shared demo code and issues a signed,
  eight-hour HTTP-only cookie.
- `app/api/generate/route.ts`: server-only model invocation, data validation,
  prompt construction, and structured response validation.
- `data/retail-sales.json`: static simulated Q2 2026 source data.
- `data/world-cup-2026-review.json`: static simulated aggregate internal
  sportsbook operations review for 104 World Cup matches. It contains no
  individual bettor data, real odds, prediction, or betting advice.

## Data flow

URL query parameters (`scenario`, `focus`, `highlight`, `question`) are the
shareable state. The page copies controls into the URL before every generation.
Opening a shared URL, then passing demo access, triggers a new model request.
No generation, chat history, or user data is persisted. World Cup is the
default scenario; retail remains a second scenario.

## Security boundaries

- `OPENAI_API_KEY` never enters client code.
- `/api/generate` requires signed demo cookie before invoking OpenAI.
- Generated JavaScript runs in browser by deliberate MVP design. Prompt limits
  code to three.js primitives and existing variables. It is not suitable for
  execution of arbitrary untrusted content outside this controlled demo.

## Deployment

Vercel hosts static frontend assets and executes the two route handlers as
server functions. Required environment variables: `OPENAI_API_KEY`,
`DEMO_ACCESS_CODE`, and `DEMO_SESSION_SECRET`.
