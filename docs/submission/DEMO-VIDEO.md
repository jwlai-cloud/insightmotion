# InsightMotion — 3-minute demo video

## Core claim

**InsightMotion turns a data question into a live, attention-directed decision
brief—not another stale dashboard screenshot.**

## Exact shot list — 180 seconds

| # | Time | Source | On screen | Narration / text | Technique |
|---|---|---|---|---|---|
| 1 | 0:00–0:12 | Title card | “Dashboard screenshots go stale.” | “A screenshot says what was true when someone exported it. It does not tell the next person where to look.” | Fade in. Show static chart crossed out. |
| 2 | 0:12–0:26 | Browser | InsightMotion World Cup scenario; 104-match label. | “InsightMotion is an internal analytics brief for a post-tournament World Cup review.” | Slow zoom into scenario title. |
| 3 | 0:26–0:42 | Browser | Select Global regions; question: “Which region drove post-tournament growth?” | “An analyst asks a normal business question. No chart type is chosen up front.” | Cursor highlight on question. |
| 4 | 0:42–0:57 | Browser, paused capture | Click Generate; visible “Analyze data → Generate code → Run scene” trace; generated-code section opens. | “GPT-5.6 Terra receives selected simulated aggregate data. It writes the finding, public visual direction, caption, and three.js/anime.js scene code.” | Freeze during wait. Circle the live trace, then reveal the code disclosure. Overlay: “Live GPT generation — cut wait time.” |
| 5 | 0:57–1:23 | Browser | Result scene: globe/pillars; camera moves from Europe to APAC; AI decision card. | “Europe is largest by volume. GPT identifies APAC as fastest growth, then moves the camera and pulse toward that story. The motion is the explanation.” | Let animation run. Zoom into caption card. |
| 6 | 1:23–1:43 | Browser | Change focus to Betting markets; ask “Which market accelerated most during knockouts?” | “Same dataset. New question. GPT now chooses a different visual narrative.” | Hard cut before Generate; keep result reveal. |
| 7 | 1:43–1:58 | Browser | Market towers; Live in-play tower highlighted; generated timestamp and code. | “This is not prerecorded. The visible timestamp, AI finding, visual plan, and generated code prove the live model run.” | Highlight timestamp then code disclosure. |
| 8 | 1:58–2:16 | Browser | Copy/reload query-string URL; generate again. | “The share link contains selection state, not a saved image. Reloading re-asks the model against current data.” | Cut loading wait; overlay “Fresh generation on load.” |
| 9 | 2:16–2:36 | Architecture diagram | Architecture + sequence panel. | “One Vercel project keeps the API key server-side. A signed demo gate limits cost. Browser executes a constrained three.js contract and sends failures back for up to three repairs.” | Ken Burns pan architecture → sequence. |
| 10 | 2:36–2:50 | Proof card | “2 scenarios · 104-match review · 4 World Cup views · 3 repair attempts.” | “We built two simulated business scenarios, four World Cup analysis views, and a visible repair loop in one deployable app.” | Numbers appear one by one. |
| 11 | 2:50–3:00 | Closing card | Tagline, Vercel URL, repo URL. | “InsightMotion: ask data, let GPT direct attention, and share a decision—not a stale screenshot.” | Hold links for full 10 seconds. |

## Full narration

Read at conversational pace. Do not narrate loading time; use on-screen card
from Shot 4 and resume at the result.

> Dashboard screenshots go stale. They also make every viewer hunt for the
> point. InsightMotion turns a data question into a live, attention-directed
> decision brief. Here, an internal trading analyst is reviewing simulated
> aggregate data from 104 World Cup matches. I ask which region drove
> post-tournament growth. GPT-5.6 Terra receives only the selected data and
> question. It returns the insight, caption, public visual direction, and
> executable scene code. Europe is largest by volume. But APAC is the growth
> story, so GPT moves the camera there and pulses that pillar. The motion is
> not decoration; it answers where to look. Now I switch to betting markets
> and ask which market accelerated during knockouts. Same data, different
> question, different model-directed scene. The timestamp, visual plan, and
> generated code are shown in the product so this is visibly live—not a
> prerecorded animation. This link stores selection state, not an image, so a
> reload regenerates the brief. Under the hood, one Vercel app keeps the API
> key on the server, gates demo cost with a signed cookie, and retries failed
> generated scenes up to three times. InsightMotion: ask data, let GPT direct
> attention, and share a decision—not a stale screenshot.

## Recording and edit runbook

1. Deploy a recording-only Vercel Preview first. Use a real `OPENAI_API_KEY`; set `BEFORE_YOU_BELIEVE_DEMO_BYPASS=true` only in Preview to skip the judge-code entry during capture. Production still uses the demo code and session secret.
2. Record separate clips: title card, World Cup regions result, World Cup
   markets result, share/reload result, diagrams, proof/closing card.
3. Before every take: hide keys, notifications, unrelated tabs, bookmarks, and
   personal browser profile content. Use 1440p or 1080p; browser zoom 100%.
4. Do one dry run. If model wait exceeds 8 seconds, stop recording after click;
   resume capture once result is ready. Overlay “Live GPT generation — wait
   removed for pacing.” Never claim response happened instantly.
5. Normalize clips to 1920×1080, 30fps. Add text overlays only after review for
   secrets and numeric consistency.

### ffmpeg starting commands

```bash
# Normalize one capture
ffmpeg -i raw-world-cup.mp4 -vf "scale=1920:1080,fps=30" -c:v libx264 -pix_fmt yuv420p -c:a aac world-cup.mp4

# Highlight caption card from 0:57 to 1:23 (coordinates adjust after capture)
ffmpeg -i world-cup.mp4 -vf "drawbox=x=65:y=700:w=780:h=280:color=0x74e7de@0.9:t=4:enable='between(t,57,83)'" -c:a copy world-cup-highlight.mp4

# Final clips must be normalized first; then create concat_list.txt and run:
ffmpeg -f concat -safe 0 -i concat_list.txt -c copy live-snapshot-demo.mp4

# Verify duration: must be <= 180 seconds
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 live-snapshot-demo.mp4
```

## Capture blocker

A truthful live-GPT recording requires deployment or local `.env.local` with a
real API key. This repo currently has no key and no browser-recording tool
connected, so do not record a fake “live generation” clip. Once a real demo is
running, capture Shots 3–8 as separate clips and assemble per this runbook.
