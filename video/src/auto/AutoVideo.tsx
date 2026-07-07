// src/auto/AutoVideo.tsx
// Single composition that handles both video formats:
//  - "slideshow": background + Ken Burns zoom + animated caption (Pangiya TikTok format)
//  - "narrated":  background + character pose + voice audio, caption optional (book-summary format)
// Which one runs is decided per-scene by which files the agent found — no manual switching needed.
import React from "react";
import { Series, AbsoluteFill, Audio, staticFile } from "remotion";
import type { AutoVideoProps } from "./types";
import { KenBurnsImage } from "./KenBurnsImage";
import { AnimatedCaption } from "./AnimatedCaption";
import { CharacterPose } from "./CharacterPose";

export const AutoVideo: React.FC<AutoVideoProps> = ({ scenes, music }) => {
  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      {music && <Audio src={staticFile(music)} volume={0.5} />}
      <Series>
        {scenes.map((scene) => (
          <Series.Sequence key={scene.index} durationInFrames={scene.durationInFrames}>
            <AbsoluteFill>
              {scene.background && <KenBurnsImage src={staticFile(scene.background)} />}
              {scene.character && <CharacterPose src={staticFile(scene.character)} />}
              {scene.voice && <Audio src={staticFile(scene.voice)} />}
              {scene.text ? <AnimatedCaption text={scene.text} /> : null}
            </AbsoluteFill>
          </Series.Sequence>
        ))}
      </Series>
    </AbsoluteFill>
  );
};
