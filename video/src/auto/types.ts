// src/auto/types.ts
export interface AutoVideoScene {
  index: number;
  background: string | null; // path relative to public/, used with staticFile()
  character: string | null; // Joon / Pangiya pose overlay, or null
  voice: string | null; // narration clip for this scene, or null
  text: string; // caption/subtitle text, or "" if none
  durationInFrames: number;
}

export interface AutoVideoProps {
  mode: "slideshow" | "narrated";
  fps: number;
  scenes: AutoVideoScene[];
  music: string | null; // background music path relative to public/, or null
  totalDurationInFrames: number;
}
