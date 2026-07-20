# InsightMotion

**InsightMotion turns a CSV or business-data question into a live, AI-directed 3D decision brief — not another dashboard screenshot.**

## Inspiration

A team receives a CSV, opens a dashboard, and still has to decide which chart
matters and explain where colleagues should look. The result is usually a
screenshot: static, quickly stale, and disconnected from the question that
created it. We wanted the shareable artifact to carry both the answer and the
attention path.

## What it does

InsightMotion makes GPT’s analytical conclusion and visual direction one live
loop:

1. Start with one of two simulated, repeatable business datasets, or upload a
   temporary CSV (up to 200 rows and 20 columns).
2. Ask a normal business question in plain language.
3. GPT-5.6 Terra analyzes that request, writes a concise finding and visual
   direction, then generates executable three.js/anime.js scene code.
4. The browser runs the generated code as a labeled 3D scene: camera movement,
   focus rings, color, and numeric labels direct attention to the answer.
5. The viewer can orbit, zoom, and pan the live scene; the timestamp, visible
   generation pipeline, and code disclosure make the live model run auditable.

Unlike an AI answer beside a conventional chart, InsightMotion uses GPT to
create the explanation *and* choreograph the viewer’s attention in real time.

## How we built it

- **App:** Next.js 16.2 App Router, React 19, TypeScript, and one Vercel project.
- **Model:** OpenAI Chat Completions using `gpt-5.6-terra` for short live
  analysis plus scene-code generation.
- **Visual runtime:** three.js 0.185, anime.js 3.2.2, and OrbitControls. The
  browser supplies `(scene, camera, THREE, anime)` to the generated code.
- **Reliability:** fence stripping, scene reset, per-frame error containment,
  and up to three model repair attempts preserve the supplied prototype’s
  execution contract.
- **Data and privacy:** World Cup 2026 operations and Q2 retail scenarios are
  clearly simulated. Optional CSV data is parsed in-browser, limited to 200
  rows / 20 columns, sent only with the current generation request, and never
  persisted.
- **Cost control:** `OPENAI_API_KEY` stays server-side. A signed, HTTP-only
  demo session protects production; an explicitly Preview-only switch supports
  truthful recording without exposing the public demo gate.

Codex accelerated the build from spec through implementation, verification,
three.js integration, documentation, and submission assets.

## Challenges we ran into

1. **Generated 3D code is powerful but brittle.** A scene can fail because of
   a fence, stale animation callback, or unsupported API. We kept the tested
   prototype contract, reset the scene between runs, and return runtime errors
   plus prior code for up to three repairs.
2. **A scene can be technically correct but visually unclear.** We constrained
   the model to render in-frame numeric labels and an obvious camera/focus cue
   in the first four seconds, then added direct orbit, zoom, and pan controls.
3. **A sports example could look like a betting product.** The World Cup demo
   is simulated aggregate internal operations data only: no individual users,
   odds, predictions, or betting advice.

## Accomplishments we’re proud of

- **2** simulated business scenarios in one deployable app.
- **104** simulated World Cup matches across **4** analyst views.
- **200 rows / 20 columns**: bounded, ephemeral CSV input with no database.
- Up to **3** automated generated-scene repair attempts per request.
- **0** client-exposed OpenAI API keys, **0** database tables, and **1** Vercel
  deployment unit.
- A production Next.js build plus server validation for valid and invalid CSV
  request shapes.

## What we learned

The hard part is not making an AI-generated chart. It is making the claim,
labels, camera movement, and viewer control agree. Motion earns its place only
when it answers “where should I look?” faster than a static chart can.

## What’s next

- Connect approved warehouse/BI sources with schema mapping and row-level access.
- Replace free-form generated JavaScript with a declarative visual grammar for
  stronger production isolation.
- Add analyst feedback, saved briefs, and evaluation against approved findings.
- Measure generation latency and visual-plan adherence across a larger corpus.

## Built With

OpenAI API, GPT-5.6 Terra, Codex, Next.js, React, TypeScript, Vercel,
three.js, anime.js.

## Try it out

- Live Preview: https://insightmotion-git-dev-jwlaiclouds-projects.vercel.app/
- Source: https://github.com/jwlai-cloud/insightmotion
- Demo video: add the final unlisted video URL after export.
