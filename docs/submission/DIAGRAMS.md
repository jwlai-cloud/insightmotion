# InsightMotion submission diagrams

Use the same palette throughout: cyan for browser/user actions, blue for
server/model flow, gold for the generated focus, and slate for temporary data.

## System architecture

```mermaid
flowchart LR
  A["① Analyst\nquestion + optional CSV"]:::user --> B["Browser\ncontrols + URL state"]:::user
  B --> C["② /api/access\nsigned demo session"]:::server
  B --> D["③ /api/generate\nvalidate + construct prompt"]:::server
  E[("Simulated JSON\nTournament + retail")]:::data --> D
  F[("Temporary CSV\n≤200 rows, ≤20 columns\nnot persisted")]:::data --> D
  C -. authorizes .-> D
  D --> G["④ GPT-5.6 Terra\nfinding + visual plan + code"]:::model
  G --> D
  D --> H["⑤ three.js + anime.js\nOrbitControls + runtime repair"]:::runtime
  H --> I["Labeled 3D decision brief\ncaption + timestamp + code"]:::output
  classDef user fill:#0d3347,stroke:#74e7de,color:#f3f8ff;
  classDef server fill:#183d72,stroke:#79adff,color:#f3f8ff;
  classDef data fill:#263548,stroke:#91a6bd,color:#f3f8ff;
  classDef model fill:#2a3769,stroke:#8badff,color:#f3f8ff;
  classDef runtime fill:#4a3a13,stroke:#ffd166,color:#f3f8ff;
  classDef output fill:#214442,stroke:#74e7de,color:#f3f8ff;
```

## AI component topology

```mermaid
flowchart TB
  A["Deterministic input layer\nvalidate scenario or bounded CSV"] --> B["GPT-5.6 Terra\nanalysis + public visual plan"]
  B --> C["Structured response\nfinding, caption, code"]
  C --> D["Browser executor\nnew Function(scene, camera, THREE, anime)"]
  D --> E{"Runtime valid?"}
  E -- "yes" --> F["Render labels + motion\nviewer can orbit/zoom/pan"]
  E -- "error, ≤3" --> B
  E -- "final error" --> G["Visible retry/error state"]
```

## Request handshake

```mermaid
sequenceDiagram
  autonumber
  participant A as Analyst
  participant B as Browser
  participant S as Next.js server
  participant D as Simulated JSON or temporary CSV
  participant G as GPT-5.6 Terra
  participant R as three.js runtime

  A->>B: Ask a business question
  B->>S: POST /api/generate (demo session)
  S->>D: Validate and select current data source
  D-->>S: Bounded data payload
  S->>G: Data + question + scene contract
  G-->>S: finding, visual plan, scene code
  S-->>B: Structured JSON
  B->>R: Execute scene code
  R-->>A: Labeled animated brief + manual controls
  Note over B,G: On runtime failure: prior code + error → repair, up to 3 attempts
```

## One-page infographic copy

```text
INSIGHTMOTION
A CSV is not a decision.

UPLOAD OR CHOOSE DEMO DATA  →  ASK A QUESTION  →  GPT DIRECTS ATTENTION
Temporary CSV ≤200 rows        Plain language     Insight + code + 3D motion
Never stored                   No chart picker    Labels + camera + controls

104 simulated tournament matches · 4 analyst views · 2 business scenarios

Next.js → GPT-5.6 Terra → three.js + anime.js → Vercel
```
