#!/usr/bin/env bash
set -euo pipefail

# Capture the browser shots from the 180-second runbook, trim each to the exact
# listed duration, and save them under video/raw/. Large source/export/audio
# files are intentionally gitignored.
# Required raw clips: 02-context, 03-question, 04-generation, 05-reveal,
# 06-controls, 07-code-proof, 08-second-question, 09-architecture.

root="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root"
# Defaults target macOS; set FONT_BOLD and FONT_REGULAR for another system.
font_bold="${FONT_BOLD:-/System/Library/Fonts/Supplemental/Arial Bold.ttf}"
font_regular="${FONT_REGULAR:-/System/Library/Fonts/Supplemental/Arial.ttf}"

if [[ ! -f "$font_bold" || ! -f "$font_regular" ]]; then
  echo "Set FONT_BOLD and FONT_REGULAR to valid font files before rendering." >&2
  exit 1
fi

mkdir -p video/cards video/exports video/normalized

card() {
  local out="$1" duration="$2" headline="$3" subline="$4"
  ffmpeg -y -f lavfi -i "color=c=0x07111e:s=1920x1080:d=${duration}" \
    -vf "drawbox=x=0:y=0:w=1920:h=10:color=0x74e7de:t=fill,drawtext=fontfile='${font_bold}':text='INSIGHTMOTION':fontcolor=0x74e7de:fontsize=38:x=120:y=170,drawtext=fontfile='${font_bold}':text='${headline}':fontcolor=white:fontsize=82:x=(w-text_w)/2:y=430,drawtext=fontfile='${font_regular}':text='${subline}':fontcolor=0xb8cadc:fontsize=34:x=(w-text_w)/2:y=550" \
    -r 30 -c:v libx264 -pix_fmt yuv420p -an "$out"
}

card video/cards/01-title.mp4 15 "A CSV is not a decision." "InsightMotion turns questions into live, AI-directed 3D briefs."
card video/cards/10-proof.mp4 15 "2 scenarios · 104 matches · 4 views" "200-row CSV input · visible live generation · up to 3 scene repairs"
card video/cards/11-close.mp4 11 "Ask data. Let GPT direct attention." "insightmotion-git-dev-jwlaiclouds-projects.vercel.app  ·  github.com/jwlai-cloud/insightmotion"

for name in 02-context 03-question 04-generation 05-reveal 06-controls 07-code-proof 08-second-question 09-architecture; do
  case "$name" in
    02-context) duration=15 ;;
    03-question) duration=16 ;;
    04-generation) duration=18 ;;
    05-reveal) duration=22 ;;
    06-controls) duration=14 ;;
    07-code-proof) duration=17 ;;
    08-second-question) duration=19 ;;
    09-architecture) duration=18 ;;
  esac
  ffmpeg -y -i "video/raw/${name}.mp4" -t "$duration" -vf "scale=1920:1080,fps=30" -c:v libx264 -pix_fmt yuv420p -an "video/normalized/${name}.mp4"
done

cat > video/normalized/concat.txt <<'EOF'
file '../cards/01-title.mp4'
file '02-context.mp4'
file '03-question.mp4'
file '04-generation.mp4'
file '05-reveal.mp4'
file '06-controls.mp4'
file '07-code-proof.mp4'
file '08-second-question.mp4'
file '09-architecture.mp4'
file '../cards/10-proof.mp4'
file '../cards/11-close.mp4'
EOF

ffmpeg -y -f concat -safe 0 -i video/normalized/concat.txt -i video/audio/insightmotion-voiceover-180.m4a \
  -vf "subtitles=video/subtitles/insightmotion.en.srt:force_style='FontName=Arial,FontSize=22,PrimaryColour=&H00FFFFFF,OutlineColour=&H00111E2B,BorderStyle=1,Outline=2,Shadow=0,MarginV=56'" \
  -map 0:v:0 -map 1:a:0 -t 180 -c:v libx264 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart video/exports/insightmotion-demo-1080p.mp4

ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1 video/exports/insightmotion-demo-1080p.mp4
