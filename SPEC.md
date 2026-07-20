# InsightMotion MVP Specification

## Goal

Build a 1-day OpenAI Build Week Work & Productivity MVP for internal
performance analytics. A selected data slice becomes a small live,
animated, shareable snapshot rather than a static screenshot. The snapshot
re-reads the shipped simulated dataset whenever its URL is opened, generates a
visualization and one-line narrative with GPT-5.6, and renders the generated
JavaScript in a three.js/anime.js scene.

## Acceptance criteria

- [ ] `npm run dev` shows a page with: a scenario picker (World Cup 2026 post-tournament review first; retail sales as a second simulated scenario), an optional ephemeral CSV uploader limited to 200 data rows, a context-aware highlight selector, question box, and Generate button
- [ ] Generate calls `/api/generate`, which calls GPT-5.6 server-side (key never exposed to client) and returns working code + caption
- [ ] The returned code renders in a three.js/anime.js scene with no visible flicker/crash; if the generated code throws, the existing auto-repair retry logic (from the sketch-to-3D prototype) kicks in, up to 3 attempts
- [ ] The camera or highlight animation visibly draws attention to the selected region — this must be demo-visible, not just implemented
- [ ] Every live scene keeps its title and numeric labels within the initial camera frame and offers direct drag-to-orbit, scroll/pinch-to-zoom, and right-drag-to-pan controls
- [ ] Reloading the exact same URL re-triggers generation (proving "never stale," even against the same static dataset for the MVP)
- [ ] Deployed on Vercel with a real public URL
- [ ] A short caption sentence renders above/below the scene
- [ ] A user can enter a plain-language question about the selected simulated data; GPT-5.6 returns a concise visible finding and drives the generated scene's focus/animation from that question
- [ ] The UI visibly identifies each successful model run as live-generated, showing its timestamp, concise AI decision summary, and generated-code disclosure (without exposing private chain-of-thought)
- [x] The deployed demo is protected by a lightweight judge access-code gate so the public API is not freely usable (implemented and locally smoke-tested; configure production environment values before deploy)

## Explicitly out of scope

- Real data connectors
- Persistence/database
- Authentication
- Slack integration

The access-code gate is a demo cost-control measure, not user authentication or
an account system.

## Implementation decisions

### Stack and packages

- Next.js with the App Router and TypeScript.
- React for the page UI.
- `three` for the browser-rendered scene.
- `animejs` for generated animation support.
- `openai` for the server-side API call using the Chat Completions API.
- No database, auth package, state-management library, or external data source.

### Model and API

- Use model `gpt-5.6-terra` (GPT-5.6 Terra), because it meets the required
  GPT-5.6 use while balancing intelligence and cost for short live
  classification, captioning, and code-generation requests.
- `/api/generate` is a Next.js server route accepting `POST` JSON:
  `{ scenario, selection: { focus, highlight }, question }`.
- The route reads `process.env.OPENAI_API_KEY` only on the server, loads the
  shipped dataset, validates the known scenario and region, and returns
  `{ code, caption, insight, visualPlan, generatedAt }` as JSON.
- `question` is optional free text, constrained to a short length. It lets a
  viewer ask a question such as “Which region needs attention?” or “Who beat
  target, and why?” The selected data plus this question are sent to GPT-5.6
  live on every Generate request.
- `insight` is a one- or two-sentence answer for the app's visible AI decision
  panel. `visualPlan` is a short public explanation such as “Focus West;
  pulse its target gap; move camera closer.” Neither field requests or exposes
  hidden model reasoning/chain-of-thought.
- The route's system prompt will be adapted from the prototype for retail
  sales. It will require the existing execution contract: generated code
  receives `(scene, camera, THREE, anime)`, must not create a renderer/camera/
  lights, and may define `window.__sceneUpdate`.

### Prototype contract to port unchanged

- The three.js/anime.js execution contract from `sketch-to-3d.html`.
- Fence-stripping extraction: prefer JavaScript fenced blocks, otherwise trim
  stray leading/trailing backticks.
- Runtime execution through `new Function('scene', 'camera', 'THREE', 'anime', code)`.
- Clear the prior scene and stale `window.__sceneUpdate` before each run.
- Retry generation and execution up to 3 total attempts, passing the prior code
  and runtime error back to the model on repair attempts.
- Swallow per-frame animation errors in the render loop so a transient update
  failure does not crash the visible scene.

### Data and URL behavior

- Keep the two shipped datasets as the default demo data. Add an optional CSV upload that is parsed in-browser, limited to 200 data rows and 20 columns, sent only with the current generation request, and never stored.
- Add `data/retail-sales.json` and `data/world-cup-2026-review.json` as valid
  JSON with `_comment` fields clearly labeling contents as simulated data
  (JSON has no native comments).
- Ship two scenarios only: retail Q2 2026 with West/East/Central sales data,
  plus World Cup 2026 post-tournament sportsbook operations data. The World
  Cup scenario is a simulated internal analytics review of 104 matches,
  aggregate regional volume, betting-market mix, top-match volume, and
  tournament-time series—not real bettor data, betting advice, odds, or a
  prediction service.
- Use URL query parameters `scenario`, `focus`, and `highlight` as the complete
  shareable state, plus `question` when present. The page initializes controls
  from them and updates the URL before generation.
- On initial page load, if valid selection query parameters exist, automatically
  trigger generation. Therefore reloading the exact URL calls `/api/generate`
  again rather than displaying a cached image or persisted result.
- The scenario picker defaults to “World Cup 2026 Trading Review” and also
  offers “Retail performance · Q2 2026.” The highlight selector changes with
  scenario. The app includes an “Ask this data” text box with three preset
  prompt chips per scenario for reliable demo beats.

### Visualization behavior

- The prompt will direct the model to choose a compact, data-appropriate scene
  (for example regional volume pillars, market-mix towers, or a tournament
  timeline) and make the selected insight visually obvious via color, pulse,
  camera movement, and/or orbit. The generated caption states the selected
  takeaway in one plain-language sentence. The user question may change the
  finding and visual priority; it does not use a prerecorded scene.
- The browser will provide the prototype's base scene lighting, a bounded initial camera, and OrbitControls for manual orbit, zoom, and pan. Generated code is responsible for objects and the attention cue within the prototype's compact scene bounds; its labels must remain in the visible frame.
- The UI will show loading, repair-attempt, success, and final-error states,
  plus the caption, AI decision panel, live-generation timestamp, and an
  optional generated-code disclosure for demo/debug visibility.

### Demo access-code gate

- Add a minimal `/api/access` server route. A visitor enters a shared judge
  code; the route compares it with `process.env.DEMO_ACCESS_CODE` and sets a
  short-lived, HTTP-only signed cookie.
- `/api/generate` checks that cookie before calling OpenAI. Requests without a
  valid demo session return `401` and do not incur model cost.
- Signing uses Node's built-in `crypto` and
  `process.env.DEMO_SESSION_SECRET`; no database, account record, or auth
  provider is used.
- The UI describes this only as “Demo access,” never as full authentication.
- Temporary Preview capture bypass: setting `BEFORE_YOU_BELIEVE_DEMO_BYPASS=true` skips the judge-code cookie only when Vercel sets `VERCEL_ENV=preview`. Production cannot use this bypass; GPT generation still requires `OPENAI_API_KEY`.

### File layout

```text
app/
  api/generate/route.ts
  api/access/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  snapshot-stage.tsx
  controls.tsx
lib/
  prototype-runtime.ts
  retail-data.ts
data/
  retail-sales.json
public/
  (no required assets)
docs/
  ARCHITECTURE.md
  LEARNING.md
  PROGRESS.md
  adr/0001-mvp-architecture.md
```

### Cut for time

- No streaming model output; wait for one complete JSON response.
- No image/sketch input from the prototype; retail selectors are the only
  structured input needed for this MVP. One short optional natural-language
  question is supported for the live AI demo.
- No persistent generated-code cache; URL query parameters are the shareable
  state and generation runs on every load.
- No interaction controls inside the scene beyond the generated attention
  animation.
- No custom 3D asset pipeline; use primitive three.js geometry only.
- No automated browser test suite; verify with `npm run build` and a manual
  local demo, then verify the deployed public URL if deployment access is
  available.
- No display of private model reasoning. The app shows only concise,
  user-facing AI findings and visual decisions.

## Verification and completion tracking

The checklist above is the source of truth. During implementation, each item
will be checked off only after evidence is available. Any newly identified
requirement will be added here before implementation rather than silently
expanded into scope.
