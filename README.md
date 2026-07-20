# InsightMotion

InsightMotion turns a performance-data question into a shareable, animated
decision brief. GPT-5.6 Terra reads simulated World Cup operations or retail data, produces a concise
finding and caption, then writes the three.js/anime.js scene code that the
browser runs live.

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

Set these values in `.env.local`:

```bash
OPENAI_API_KEY=...
DEMO_ACCESS_CODE=...
DEMO_SESSION_SECRET=long-random-string

# Only for a Vercel Preview deployment while recording; do not set in Production.
BEFORE_YOU_BELIEVE_DEMO_BYPASS=false

# Temporary capture override for any environment; remove or set false after recording.
DEMO_ACCESS_BYPASS=false
```

Open `http://localhost:3000`, enter the demo code, ask a sales question, and
generate the snapshot.

## Core demo flow

1. Ask: “Which region drove post-tournament growth?”
2. GPT-5.6 Terra returns a factual insight, visual direction, caption, and
   executable scene code.
3. The scene highlights the selected insight with color, pulse, and camera
   movement.
4. Copy/reload its query-string URL after entering demo access to regenerate
   from the simulated data—no stored image or cached scene.

## Safety and scope

- `OPENAI_API_KEY` is read only in the server-side `/api/generate` route.
- The demo gate uses a short-lived signed HTTP-only cookie; it is cost control,
  not a user-account system.
- `data/retail-sales.json` is clearly labeled simulated data.
- Generated browser code is intentionally constrained by the server prompt and
  retried up to three times if execution fails. This is a hackathon demo, not a
  sandbox for untrusted production code.

## Build

```bash
npm run build
```

## Deployment

Deploy as a single Vercel project. Set the three required variables in Vercel Project Settings before deploying.
For a recording-only Preview deployment, add `BEFORE_YOU_BELIEVE_DEMO_BYPASS=true` to
the Preview environment only; it never bypasses the production judge gate. Full command steps are in the final handoff and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
