// This is NOT a file Remotion loads automatically — it's a reference snippet.
// Open your existing src/Root.tsx and add this <Composition> inside your <Compositions> return,
// plus the two imports at the top. Your Root.tsx almost certainly already has a similar
// <Composition> block for the Hello World scaffold — just add this one alongside it.

import { Composition } from "remotion";
import { AutoVideo } from "./auto/AutoVideo";
import type { AutoVideoProps } from "./auto/types";

// --- add inside <Compositions>...</Compositions> in Root.tsx ---
<Composition
  id="AutoVideo"
  component={AutoVideo}
  durationInFrames={150} // placeholder — calculateMetadata below overrides this per project
  fps={30}
  width={1080}
  height={1920}
  defaultProps={
    {
      mode: "slideshow",
      fps: 30,
      scenes: [],
      music: null,
      totalDurationInFrames: 150,
    } as AutoVideoProps
  }
  calculateMetadata={async ({ props }) => {
    const p = props as AutoVideoProps;
    return {
      durationInFrames: p.totalDurationInFrames,
      fps: p.fps,
    };
  }}
/>;
// --- end snippet ---
