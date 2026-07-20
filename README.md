# InsightMotion

InsightMotion turns a performance-data question into a shareable, animated
decision brief. GPT-5.6 Terra reads simulated global football tournament engagement operations or retail data, produces a concise
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

## Built with Codex and GPT-5.6

InsightMotion was built as a close product-and-engineering collaboration with
Codex. The human product lead set the target: a credible Work & Productivity
tool, a short demo with a visible live-AI moment, and a deliberately bounded
one-day MVP. They chose the two repeatable simulated scenarios, the global football tournament
engagement operations opening story, the dark presentation style, the manual 3D
inspection controls, and the privacy and cost boundaries.

Codex accelerated the workflow from the supplied prototype and written spec:
it translated the execution contract into a Next.js App Router app, preserved
the three.js/anime.js generated-scene runtime, added the server-only OpenAI
route and repair loop, created sample-data handling and CSV limits, integrated
OrbitControls, ran builds, handled review feedback, and prepared the Vercel,
README, Devpost, and demo-video materials. The product decisions stayed human:
Codex provided implementation options and evidence; the product lead chose the
scope and direction.

At runtime, `gpt-5.6-terra` is the live analytical and creative component. It
receives the current bounded data and analyst question, produces a factual
finding and public visual direction, then writes the runnable three.js/anime.js
scene code. The browser executes that code in the tested contract, while the
server keeps `OPENAI_API_KEY` private and can ask the model to repair a failed
scene up to three times. This makes GPT-5.6 responsible for the question-specific
insight and visual story, while Codex was the coding collaborator that helped
turn the concept into a working product.

## How we built it with Codex

InsightMotion was built collaboratively with Codex across the whole lifecycle —
spec, implementation, three.js integration, verification, and submission assets.
The dated commit history is the evidence trail.

**Where Codex accelerated the work**

- **MVP scaffold** (`ba51bd5`): Codex turned the spec into the first working
  Next.js + server-side `/api/generate` loop and the three.js runtime contract.
- **Live-generation trace + preview capture** (`3f17041`): Codex added the
  visible `Analyze → Generate → Run` pipeline and the recording-friendly preview
  mode without loosening the production gate.
- **Ephemeral CSV input** (`cab6b46`): Codex implemented the in-browser CSV
  parser with the 200-row / 20-column bounds and the "never stored" guarantee.
- **Scene controls + submission assets** (`23ab957`): OrbitControls (orbit/zoom/
  pan) plus the diagrams and demo runbook.
- **Demo access bypass + video pipeline** (`bb338ab`, `242838e`): the env-gated
  judge-access switch and the 1080p ffmpeg assembly script.

**Where we made the key decisions**

- *Product:* the deliverable is a directed 3D decision brief, not a chart image —
  motion only earns its place when it answers "where should I look?".
- *Engineering:* keep `OPENAI_API_KEY` server-side; constrain generated code to a
  fixed `(scene, camera, THREE, anime)` contract; on runtime failure, feed the
  error + prior code back to the model for up to three repairs.
- *Design/safety:* simulated aggregate data only, in-frame numeric labels to
  preserve evidence, and a first-4-seconds camera/focus cue.

**How GPT-5.6 and Codex contributed to the result**

GPT-5.6 Terra is the runtime engine — it reads the data + question and returns
the finding, public visual plan, and executable scene code live per request.
Codex was the build engine — it produced and iterated the app, the repair loop,
and the capture pipeline that turn that live generation into a shareable brief.

## Build

```bash
npm run build
```

## Deployment

Deploy as a single Vercel project. Set the three required variables in Vercel Project Settings before deploying.
For a recording-only Preview deployment, add `BEFORE_YOU_BELIEVE_DEMO_BYPASS=true` to
the Preview environment only; it never bypasses the production judge gate. Full command steps are in the final handoff and [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).
