---
name: pangiya-tiktok-pipeline
description: Use this skill whenever Nabil is planning, writing, scripting, or reviewing content for the Pangiya TikTok/Instagram channel, or working on the Remotion automation pipeline for producing it. Trigger this for requests like "write the next Pangiya segment," "help me plan this week's slides," "check if this hook is strong enough," "help me with the Remotion composition," "why isn't this video performing," or any request touching Pangiya's content strategy, caption writing, posting cadence, or the slideshow video pipeline — even if the user doesn't say "TikTok" or "Remotion" explicitly. Also use it any time algorithm strategy, completion rate, loop-ability, or community-building tactics come up in the context of short-form video.
---

# Pangiya TikTok Pipeline

Covers two things that go together: (1) the content strategy rules for the Pangiya channel, and (2) the Remotion setup used to automate turning scripted slides into finished video.

## Part 1 — Content Strategy

### How distribution actually works right now
New videos go to a small pool of existing followers first as a test audience. If that pool completes and engages quickly, TikTok expands in waves — each wave has to perform for the next one to trigger. This means: **early followers matter more than raw follower count.** Treat comments and replies from Pangiya's existing audience as the thing that decides whether a video goes wide, not a nice-to-have.

### Ranking signals, heaviest to lightest
1. **Completion rate / watch time** — the single heaviest signal. Aim for 70%+ completion. This is the main lever for slideshow pacing and caption length.
2. **Re-watches / loops** — TikTok counts every loop. This is the highest-leverage, most underused lever for slideshow content.
3. **Shares to DMs** — weighted roughly 3x a like.
4. **Saves** — a stronger intent signal than likes; "value" content (which Pangiya's format is) tends to over-index here.
5. **Comment depth** — a two-sentence comment counts for more than a fire emoji. Replying to comments (ideally with a video reply) compounds this.
6. **Follow conversion** — % of viewers who follow after watching one video.

### Concrete tactics for the slideshow format
- **Design for the loop.** End on a line that makes someone want to reread the sequence — a callback to slide 1, or a twist that recontextualizes an earlier line. This is worth more per-view than almost anything else on the list above.
- **Optimize for saves, not just likes.** Robert Greene concepts framed as personal truths are inherently saveable. A closing line like "save this for when you need it" is a legitimate, non-cheesy save prompt when it fits Pangiya's voice.
- **Keep the hook in slide 1.** First 1-3 seconds decide the completion-rate ceiling for the whole video — don't bury the emotional hook on slide 2 or 3.
- **Recurring format > one-offs.** The algorithm favors series it recognizes; viewers who know they usually like a format watch longer, reinforcing distribution. Keep the visual house style (below) consistent rather than refreshing it per-segment.
- **Steal mechanics, not content, from niche neighbors.** When starting a new series, look at what similarly-positioned accounts (e.g. official Robert Greene, law-by-law numbered-series creators, niche-applied spins) do structurally — numbered/finite series, real referents instead of "some people," front-loaded claims — and reframe the mechanic in Pangiya's own warm, non-lecturing voice rather than copying their content or tone directly.
- **Tone check before shipping any script:** read it back and cut anything that explains *why* a feeling happens (sociological "we're taught to..." framing reads as lecturing). Keep only lines that observe or sit with the feeling — that's the difference between Pangiya's warm-elder voice and a psych-lecture voice.

### Visual house style (current, as of the "Things People Never Say Out Loud" series)
- **Character (Pangiya):** anchored bottom-left, ~42% of frame height so he never reaches into the vertically-centered caption band. Rendered with `filter: brightness(0.9) contrast(1.05) drop-shadow(...)` — a grounding contact shadow plus slight darkening so he reads as part of the scene rather than a flat pasted sticker. Only use his transparent-cutout poses (`Standing`, `Standing Back`, `Standing Explaining`, etc. — check for checkerboard transparency, not a baked-in background) as overlays; opaque full-scene art (baked-in background) isn't usable as a character overlay and should go in `backgrounds/` directly instead, or not be used as `characters/` input.
- **Captions:** centered dead-center of the frame (`top: 50%`, translateY(-50%)), bold (`fontWeight: 800`), white fill with a black `WebkitTextStroke` (~3px) plus a soft drop shadow for depth — a meme-style stroke look, not a soft-glow/bottom-bar look. No background box behind the text.
- **Caption font reference (remember this):** the target look is a bold geometric sans, all-caps, heavy weight (~800-900), thick *uniform* black outline (~4-5% of cap-height) plus a subtle drop shadow — the classic word-by-word TikTok/CapCut karaoke-caption look. Closest free-webfont matches: **Montserrat ExtraBold/Black** or **Poppins ExtraBold**. `AnimatedCaption.tsx` currently approximates this shape with the browser default sans-serif + `WebkitTextStroke`; if a closer match is ever needed, load one of those two webfonts into the Remotion composition rather than guessing a new stroke/weight combo.
- These are implemented in `video/src/auto/CharacterPose.tsx` and `video/src/auto/AnimatedCaption.tsx` and apply automatically to every episode built through the agent — don't reintroduce a bottom-anchored caption or a full-height centered character unless explicitly asked to change the house style again.

### Community building (distinct from audience growth)
- Reply to comments, ideally with video replies — it signals engagement to the algorithm and surfaces new segment ideas directly from what people ask.
- Comment on other creators' content in the same psychology/self-improvement space — cross-pollinates audiences without competing directly.
- A private space (Discord, close-friends story, etc.) for the most engaged followers is a real lever once the channel has traction, not just a vanity feature.

### Posting cadence
3-5 videos/week is the sustainable sweet spot — enough for the algorithm to get signal, not so much quality erodes. Batch scripting and Remotion rendering (Part 2) exists specifically to make this cadence sustainable without manual CapCut burnout.

### Content rules for Pangiya specifically
- Captions: warm and personal, never statistical or teacherly. Flag and rewrite anything that sounds like "most people..." — Pangiya observes, he doesn't lecture.
- Pangiya never talks down to anyone, including other characters referenced in the content.
- Deliver exactly what's asked for a given segment — no unsolicited analysis, no revisiting a psychological concept already covered. Check with Nabil (or his own record) on which segments are already done before drafting a new one, since repeats waste a content slot.
- Slide text: short lines, 2-5 words per line, punchy — not full sentences stacked on a slide.
- When generating a segment, pair each slide's text with a Pexels/Unsplash search term suggestion so Nabil can source imagery fast.

---

## Part 2 — Remotion Pipeline

### Project shape (actual, current)
The Remotion project lives in `video/` (Remotion Studio runs from there, where `remotion.config.ts` lives). The real pipeline is the **video agent**, not hand-written compositions per segment:

- `video/src/auto/AutoVideo.tsx` — the single composition that handles every episode. Detects "slideshow" vs "narrated" mode per-scene based on which files exist.
- `video/src/auto/KenBurnsImage.tsx`, `CharacterPose.tsx`, `AnimatedCaption.tsx` — the shared building blocks (see visual house style above for current CharacterPose/AnimatedCaption specifics).
- `video/agent/scanProject.js` + `video/agent/buildVideo.js` — reads a `video-projects/<name>/` folder, builds the scene data automatically, copies assets into `public/generated/`, and renders via `npx remotion render`.
- `video/VIDEO-AGENT-README.md` — full folder-layout reference (`backgrounds/`, `characters/`, `voice/`, `captions.txt`, `music.mp3`).

New episodes are **just new data**, never new components: create `video-projects/<episode-name>/`, drop in `backgrounds/01.jpg...`, `characters/01.png...` (optional, matched by sort order), and a `captions.txt` (one line per scene, `text|seconds` to override the default 3s duration).

### Sourcing images
Pexels/Unsplash direct fetches are often blocked by sandbox network policy — ask Nabil to upload photos directly into the repo (e.g. into the relevant `video-projects/<name>/backgrounds/` folder on the working branch) rather than assuming a URL will be fetchable.

### Rendering
```bash
cd video
export REMOTION_BROWSER_EXECUTABLE=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell  # sandbox-only: no access to remotion.media's browser auto-download
node agent/buildVideo.js <episode-name>
```
Output lands at `video/out/<episode-name>.mp4`. If it's over ~30MB, re-encode with Remotion's bundled ffmpeg (`video/node_modules/@remotion/compositor-linux-x64-gnu/ffmpeg`, `-crf 27 -preset medium`) before sending — there's no system ffmpeg in this sandbox.

### Workflow this enables
1. Claude generates the slide script (text + mood/image search term per line) per the content rules in Part 1, in Pangiya's warm-elder voice.
2. Nabil sources images, drops them into the project's `backgrounds/` (and optionally `characters/`), matched by sort order to the caption lines.
3. `node agent/buildVideo.js <name>` renders the full episode automatically — no manual CapCut assembly.
4. Music gets added as a post-step (`music.mp3` in the project folder, mixed automatically) — ask before assuming Nabil wants it in-pipeline vs. added later in CapCut.

### When something's off
- If Ken Burns feels too aggressive/swimmy on mobile playback, reduce the scale range in `KenBurnsImage.tsx` (e.g. `[1, 1.04]`) rather than changing duration.
- If captions feel like they're popping in too hard, soften the spring config (`stiffness: 80`) in `AnimatedCaption.tsx` before touching duration or text length.
- If the character overlaps the caption, it's almost always because `CharacterPose`'s `height` percentage is too tall for wherever the caption is currently anchored — shrink the character rather than moving the caption off-center.
- Studio not reflecting changes: check that the dev server picked up the file save — Windows file-watching in Remotion Studio occasionally needs a manual refresh.