# Submission diagrams

## System architecture

```mermaid
flowchart LR
  A["Analyst\nquestion + selected focus"] --> B["Next.js browser\nURL state + controls"]
  B --> C["① /api/access\nsigned demo cookie"]
  B --> D["② /api/generate\nserver route"]
  E[("Simulated JSON\nWorld Cup + retail")] --> D
  C -. authorizes .-> D
  D --> F["③ GPT-5.6 Terra\nfinding + scene code"]
  F --> D
  D --> G["④ three.js + anime.js\nlive generated scene"]
  G --> H["Caption + AI finding\nattention-directed brief"]
```

## AI component topology

```mermaid
flowchart TB
  A["Deterministic selector\nscenario, focus, highlight"] --> B["GPT-5.6 Terra\nanalysis + public visual plan"]
  B --> C["Generated scene code\nthree.js primitives + anime"]
  C --> D["Runtime executor\nnew Function contract"]
  D --> E{"Runtime valid?"}
  E -- Yes --> F["Render + camera/pulse/orbit"]
  E -- No, ≤3 --> B
  E -- No, final --> G["Visible error state"]
```

## Request handshake

```mermaid
sequenceDiagram
  autonumber
  participant A as Analyst
  participant B as Browser
  participant S as Next.js route
  participant J as Simulated JSON
  participant G as GPT-5.6 Terra
  participant R as three.js runtime

  A->>B: Select World Cup focus + ask question
  B->>S: POST /api/generate (signed cookie)
  S->>J: Validate scenario/focus/highlight
  J-->>S: Aggregate simulated data slice
  S->>G: Data + question + scene contract
  G-->>S: finding, caption, visual plan, scene code
  S-->>B: JSON response
  B->>R: Execute code(scene, camera, THREE, anime)
  R-->>A: Camera-directed live decision brief
  Note over B,G: On execution error: prior code + error -> repair, max 3 attempts
```

## One-page infographic copy

Use this as a single 16:9 submission image or video title card.

```text
INSIGHTMOTION
Ask data. GPT directs attention.

STALE SCREENSHOT  →  LIVE DECISION BRIEF

① Ask                    ② Generate                    ③ See what matters
Plain-language question   GPT-5.6 Terra returns         Camera, pulse, color,
about selected data       insight + executable scene    caption guide attention

WORLD CUP 2026 REVIEW
104 simulated matches · 4 analyst views · 2 business scenarios

Next.js → GPT-5.6 Terra → three.js + anime.js → Vercel
```
