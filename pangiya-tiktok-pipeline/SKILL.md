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
- **Recurring format > one-offs.** The algorithm favors series it recognizes; viewers who know they usually like a format watch longer, reinforcing distribution. Pangiya's visual identity (grass/blue-sky, chill tone) already does this — keep it consistent rather than refreshing it per-segment.

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

### Project shape
Remotion Studio runs from the project root (where `remotion.config.ts` lives). The composition for Pangiya slides should live as its own component, driven by a typed data array — not hand-placed clips — so new segments are just new data, not new code.

### Slide data shape
```ts
// src/pangiya/slides.ts
export interface Slide {
  text: string;          // 2-5 word line, matches caption rules above
  imagePath: string;      // local path to sourced Pexels/Unsplash image
  durationInFrames: number; // pacing control per-slide
}

export const segmentSlides: Slide[] = [
  { text: "Nobody warns you", imagePath: "public/images/slide1.jpg", durationInFrames: 75 },
  { text: "about this part", imagePath: "public/images/slide2.jpg", durationInFrames: 75 },
  // ...
];
```

### Composition pattern using `<Series>`
`<Series>` sequences slides back-to-back without manual offset math — each `<Series.Sequence>` just declares its own duration.

```tsx
// src/pangiya/PangiyaSlideshow.tsx
import { Series, AbsoluteFill, Img, staticFile } from "remotion";
import { segmentSlides } from "./slides";
import { KenBurnsImage } from "./KenBurnsImage";
import { AnimatedCaption } from "./AnimatedCaption";

export const PangiyaSlideshow: React.FC = () => {
  return (
    <Series>
      {segmentSlides.map((slide, i) => (
        <Series.Sequence key={i} durationInFrames={slide.durationInFrames}>
          <AbsoluteFill>
            <KenBurnsImage src={staticFile(slide.imagePath)} />
            <AnimatedCaption text={slide.text} />
          </AbsoluteFill>
        </Series.Sequence>
      ))}
    </Series>
  );
};
```

### Ken Burns zoom (subtle, not swimmy)
Drive scale off the current frame within the sequence — use `useCurrentFrame()` from inside the sequence, not the parent timeline, so each slide's zoom restarts cleanly.

```tsx
// src/pangiya/KenBurnsImage.tsx
import { useCurrentFrame, useVideoConfig, Img, interpolate } from "remotion";

export const KenBurnsImage: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  return (
    <Img
      src={src}
      style={{ width: "100%", height: "100%", objectFit: "cover", transform: `scale(${scale})` }}
    />
  );
};
```

### Spring-based caption entrance
Use `spring()` for the text pop so captions feel snappy rather than linear — this matches the punchy tone the format needs.

```tsx
// src/pangiya/AnimatedCaption.tsx
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export const AnimatedCaption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        bottom: "15%",
        width: "100%",
        textAlign: "center",
        fontFamily: "sans-serif",
        fontWeight: 800,
        fontSize: 64,
        color: "white",
        textShadow: "0 2px 12px rgba(0,0,0,0.6)",
        transform: `scale(${progress})`,
        opacity: progress,
      }}
    >
      {text}
    </div>
  );
};
```

### Rendering
```bash
npx remotion render src/index.ts PangiyaSlideshow out/segment.mp4
```

### Workflow this enables
1. Claude generates the slide array (text + Pexels/Unsplash search terms) per the content rules in Part 1.
2. Nabil sources images, drops them into `public/images/`, fills in `imagePath` fields.
3. Remotion renders the full segment automatically — no manual CapCut assembly.
4. Music gets added as a post-step (Remotion supports `<Audio>` too, if Nabil wants to fold that in later — ask before assuming, since current workflow may add music in CapCut after render).

### When something's off
- If Ken Burns feels too aggressive/swimmy on mobile playback, reduce the scale range (e.g. `[1, 1.04]`) rather than changing duration.
- If captions feel like they're popping in too hard, soften the spring config (`stiffness: 80`) before touching duration or text length.
- Studio not reflecting changes: check that the dev server picked up the file save — Windows file-watching in Remotion Studio occasionally needs a manual refresh.