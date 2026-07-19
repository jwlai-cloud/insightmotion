# Progress

## Done

- Created spec-driven MVP scope and architecture decision record.
- Built Next.js App Router frontend, server-only access/generation routes, and
  two static simulated datasets: World Cup 2026 post-tournament operations
  review plus retail sales.
- Ported execution contract, fence stripping, stale-update reset, render loop,
  and three-attempt runtime repair logic from provided prototype.
- Added free-text data question, query-string sharing, visible live-generation
  metadata, AI finding, visual direction, and generated-code disclosure.
- Added signed demo access cookie and verified locally.
- `npm run build` passes on 2026-07-19.
- Added Devpost story, Mermaid architecture/topology/sequence diagrams, and
  exact 180-second demo script + recording/edit runbook.

## Next

1. Set real environment values in `.env.local` and perform one live OpenAI
   generation / visual browser pass.
2. Deploy to Vercel, configure production environment values, and record public
   URL.
3. Capture three-minute demo video using `docs/submission/DEMO-VIDEO.md`, then
   add deployment/video/repository URLs to `docs/submission/DEVPOST.md`.

## Open questions

- None for code. Public URL and real-model smoke test await deployment/API key.
