# InsightMotion

**InsightMotion turns a data question into a live, attention-directed decision brief—not another stale dashboard screenshot.**

## Inspiration

Teams share dashboard screenshots because links and full BI dashboards are too
heavy for a quick conversation. But screenshots go stale immediately and make
viewers hunt for the actual anomaly. We wanted a better artifact for a data
analyst: ask a question, get a concise answer, and let the visual itself guide
attention to what matters.

## What it does

InsightMotion converts a question about selected internal data into a live,
shareable visual brief.

1. An analyst selects a simulated scenario, analysis focus, highlight, and
   plain-language question.
2. GPT-5.6 Terra receives only that selected simulated dataset and question.
3. It returns a short finding, caption, public visual direction, and executable
   three.js/anime.js scene code.
4. The browser runs that code in a live scene. Camera movement, color, pulse,
   and context dimming direct the viewer to the insight.
5. The query-string URL preserves selection state. Reopening it generates a
   fresh snapshot rather than displaying a saved image.

Unlike an AI chat answer beside a normal chart, InsightMotion makes the model's
visual decision part of the deliverable: GPT both explains what matters and
directs where the viewer looks.

## How we built it

- **App:** Next.js 16.2 App Router, React 19, TypeScript, deployed as one
  Vercel project.
- **Model:** OpenAI Chat Completions with `gpt-5.6-terra`, selected for live
  short-form analysis/code generation with lower demo cost than the flagship
  tier.
- **Visual runtime:** three.js 0.185 and anime.js 3.2.2. Generated code gets
  `(scene, camera, THREE, anime)` and can define `window.__sceneUpdate`.
- **Reliability:** code-fence extraction, scene reset, and up to three
  generation/repair attempts ported from the supplied prototype.
- **Cost control:** server-only `OPENAI_API_KEY`; shared demo code produces a
  short-lived signed HTTP-only cookie before `/api/generate` can invoke GPT.
- **Data:** two clearly labeled simulated aggregate scenarios: a 104-match
  World Cup 2026 post-tournament trading review and retail Q2 regional sales.

Codex accelerated the build from spec through Next.js implementation,
three.js runtime integration, verification, architecture docs, and submission
assets.

## Challenges we ran into

1. **Live code generation can fail at runtime.** We kept the supplied
   prototype's execution contract intact, reset stale scene state before each
   run, stripped accidental markdown fences, and send runtime error plus prior
   code back for up to three repairs.
2. **A sports dataset could accidentally look like a consumer betting tool.**
   We framed it as internal aggregate sportsbook operations review; data is
   simulated, contains no individual bettor information, and the model prompt
   forbids odds, prediction, or betting advice.
3. **One-day scope.** We used static JSON and URL state rather than connectors,
   database, accounts, or cached generations.

## Accomplishments we’re proud of

- 2 simulated, question-driven business scenarios in one app.
- 104-match World Cup post-tournament review dataset with 4 analyst views:
  regions, markets, top matches, and tournament stages.
- Up to 3 automated scene-repair attempts per request.
- 0 database tables, 0 client-exposed API keys, 1 Vercel deployment unit.
- Production `npm run build` passes.

## What we learned

The memorable part of AI analytics is not merely generating a chart. It is
making the analytical claim and the viewer’s attention path inseparable.
Motion earns its place only when it answers “where should I look?” faster than
a static chart can.

## What’s next

- Connect approved BI/data-warehouse sources with row-level permission checks.
- Replace free-form executable scene code with a constrained declarative visual
  grammar for production isolation.
- Add team comments, decision handoff, and share-link history.
- Evaluate model-generated scenes against analyst-approved visual plans.

## Built With

OpenAI GPT-5.6 Terra, Codex, Next.js, React, TypeScript, Vercel, three.js,
anime.js, OpenAI API.

## Try it out

- Live demo: `ADD_VERCEL_URL`
- Demo video: `ADD_UNLISTED_YOUTUBE_URL`
- Source: `ADD_REPOSITORY_URL`
