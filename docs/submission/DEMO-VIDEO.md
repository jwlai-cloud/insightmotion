# InsightMotion — 2:58 demo video

## Single claim

**A CSV is not a decision. InsightMotion turns a business question into a live,
AI-directed 3D brief that tells a team where to look.**

## Shot list — 2:58 exactly (under the three-minute limit)

| # | Time | What is shown | Narration / subtitle | Edit direction |
|---|---|---|---|---|
| 1 | 0:00–0:15 | Title card: `A CSV is not a decision.` CSV fades into a labeled 3D scene. | “A team receives a CSV, chooses a chart, and still has to explain where everyone should look. That explanation is usually a stale screenshot.” | Slow push-in; persistent lower third: `InsightMotion · GPT-directed data briefs`. |
| 2 | 0:15–0:30 | App landing on Global Football Tournament 2026 Engagement Review. Point at `simulated operations data`. | “For this demo we start with simulated aggregate tournament engagement data: 104 matches, no personal data, no wagering advice. The same flow also accepts a temporary CSV.” | Cyan box around simulated-data label; subtitle: `Predefined data for a reliable demo · CSV supported`. |
| 3 | 0:30–0:46 | Upload control briefly; then select `Global regions`, type question. | “An analyst can upload a CSV of up to 200 rows, or use a prepared scenario. I’ll ask: Which region drove post-tournament growth? There is no chart picker.” | Cursor halo on upload, then question field. |
| 4 | 0:46–1:04 | Click Generate. Capture until `1 Analyze data` / `2 Generate code`; freeze if necessary. | “Codex accelerated the build from the tested prototype into this Next.js app, scene runtime, and repair loop. Now GPT-5.6 Terra receives the current data and question, then writes the finding, visual plan, and scene code.” | Pause the clip while waiting. Circle top-left trace. On-screen: `Codex built the runtime; GPT-5.6 generates this live scene`. |
| 5 | 1:04–1:26 | Resume at live scene. Let automatic camera motion, focus ring, labels play. | “The model does not return a chart image. It returns a runnable scene. Numeric labels preserve the evidence; the camera push and gold focus tell the viewer what changed and where to look.” | Let scene move for 8 seconds. Box decision brief; then box one numeric label. |
| 6 | 1:26–1:40 | Drag orbit, scroll zoom, right-drag pan. | “The reveal is directed, but the scene remains explorable. A teammate can orbit, zoom, and pan instead of trusting a fixed screenshot.” | Cursor trail; subtitle: `Directed first view · manual inspection second`. |
| 7 | 1:40–1:57 | Open `View GPT-generated scene code → browser runtime`; show timestamp, visual direction. | “This is the proof that it is live: the timestamp, public visual direction, and generated code are in the product. We show the result, not private chain-of-thought.” | Highlight timestamp → code disclosure → `Run scene` trace. |
| 8 | 1:57–2:16 | Switch focus to markets and ask a different question; cut loading wait, reveal different scene. | “Same dataset, new question: Which engagement channel accelerated during knockouts? GPT selects a new story and writes a new scene. This is not a prerecorded animation.” | Hard cut on click; reveal with a gold callout on new focus. |
| 9 | 2:16–2:34 | Architecture diagram. | “One Vercel app keeps the OpenAI key on the server. CSV input is temporary. The browser runs a constrained three.js contract, and a runtime error goes back to GPT for up to three repairs.” | Ken Burns left-to-right across architecture then sequence diagram. |
| 10 | 2:34–2:49 | Proof card: `2 scenarios · 104 matches · 4 Global Football Tournament views · 200-row CSV limit · 3 repairs`. | “In one deployable MVP: two business scenarios, four analyst views, bounded CSV input, visible live generation, and a three-attempt repair loop.” | Animate numbers one at a time; sound-off readable. |
| 11 | 2:49–2:58 | Closing card with product, production URL, GitHub URL. | “InsightMotion: ask data, let GPT direct attention, and share a decision — not a stale screenshot.” | Hold links 9 seconds. |

## Voiceover — read at 135–145 words per minute

> A team receives a CSV, chooses a chart, and still has to explain where
> everyone should look. That explanation is usually a stale screenshot.
> InsightMotion changes the deliverable itself. It turns a business question
> into a live, AI-directed 3D decision brief.
>
> This demo uses simulated aggregate tournament engagement data: 104 matches,
> no personal data, and no wagering advice. Analysts can also upload a
> temporary CSV, up to 200 rows, used only for the current request.
>
> I select global regions and ask a normal question: which region drove
> post-tournament growth? Notice what I do not do: I never choose a chart.
>
> Codex accelerated the build from a tested prototype into this Next.js app,
> scene runtime, and repair loop. When I click Generate, GPT-5.6 Terra analyzes
> the current data, writes a finding, public visual direction, and runnable
> three.js and anime.js code. The browser runs that code as a live scene. We
> cut waiting for pacing, not to fake speed.
>
> The result is not a chart image. It is a labeled scene. The numeric labels
> preserve the evidence. The camera push, gold focus, and pulse answer a more
> useful question than a dashboard can: where should the team look first?
> And after the directed reveal, a teammate can orbit, zoom, and pan to inspect
> the scene themselves.
>
> The timestamp, public visual direction, and generated-code disclosure make
> the live run visible without exposing private chain-of-thought. Now I change
> only the question to ask which market accelerated during knockouts. Same
> dataset, new model-directed story, new generated scene. That is the point:
> this is not a prerecorded animation.
>
> Under the hood, one Vercel app keeps the OpenAI key server-side. Temporary
> CSV input is never persisted. The browser executes a constrained visual
> contract, and if generated code fails at runtime, InsightMotion sends the
> error and prior code back for up to three repairs.
>
> In one deployable MVP, we built two business scenarios, four analyst views,
> bounded CSV input, visible live generation, and an attention-directed 3D
> brief. InsightMotion: ask data, let GPT direct attention, and share a
> decision — not a stale screenshot.

## Capture protocol

1. Use an isolated recording deployment with the latest scene-control commit.
   Configure `OPENAI_API_KEY` plus `BEFORE_YOU_BELIEVE_DEMO_BYPASS=true` for
   Preview, or the explicitly temporary `DEMO_ACCESS_BYPASS=true` if a
   controlled production capture is necessary. Remove the override immediately
   after recording.
2. Record each shot as a separate 1080p, 30fps clip. Keep 2 seconds of clean
   buffer at both ends. Hide notifications, keys, bookmarks, and other tabs.
3. For each model call, record the click and visible trace. Stop capture while
   the request is pending; resume only after a real result appears. Add the
   exact overlay: `Live GPT generation — wait removed for pacing`.
4. Record Shot 6 manually with a visible cursor. Use drag orbit, scroll zoom,
   and right-drag pan after the initial automatic reveal completes.
5. Watch every raw clip once for secrets and numeric consistency before editing.
6. Watch the final export with sound off. The title, trace, labels, decision
   card, code disclosure, and captions must still tell the story.

## FFmpeg edit template

```bash
# Normalize each raw clip first.
ffmpeg -i raw/shot-05.mp4 -vf "scale=1920:1080,fps=30" -c:v libx264 -pix_fmt yuv420p -c:a aac clips/shot-05.mp4

# Test the generation-trace callout on a short clip before using it in the edit.
ffmpeg -ss 0 -t 5 -i clips/shot-04.mp4 -vf "drawbox=x=18:y=82:w=390:h=42:color=0x74e7de@0.95:t=4,drawtext=text='Live GPT generation — wait removed for pacing':fontcolor=white:fontsize=28:box=1:boxcolor=0x07111e@0.82:boxborderw=12:x=(w-text_w)/2:y=h-110" -c:v libx264 -pix_fmt yuv420p tests/shot-04-trace.mp4

# Add a decision-card highlight to the full result clip. Tune coordinates only after capture.
ffmpeg -i clips/shot-05.mp4 -vf "drawbox=x=36:y=760:w=650:h=270:color=0x74e7de@0.92:t=4:enable='between(t,4,15)'" -c:a copy edits/shot-05-highlight.mp4

# Build concat_list.txt from normalized/finalized shots, then stitch.
ffmpeg -f concat -safe 0 -i concat_list.txt -c copy insightmotion-demo.mp4

# Final hard limit check: must be under 180 seconds (target: 178 seconds).
ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 insightmotion-demo.mp4
```

## Truthfulness rule

Never fake a live model response. Pausing the recording while a real request
runs is allowed; the visible trace, result timestamp, generated code, and
caption must all come from the actual completed request.
