// src/auto/CharacterPose.tsx
// Overlays a character pose (Joon or Pangiya) anchored to the bottom of the frame.
// Used in narrated mode alongside a background and a voice clip.
import React from "react";
import { useCurrentFrame, useVideoConfig, Img, spring } from "remotion";

export const CharacterPose: React.FC<{ src: string }> = ({ src }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({ frame, fps, config: { damping: 14, stiffness: 100 } });

  return (
    <Img
      src={src}
      style={{
        position: "absolute",
        bottom: 0,
        left: "2%",
        height: "42%",
        transform: `translateY(${(1 - entrance) * 40}px)`,
        opacity: entrance,
        objectFit: "contain",
        objectPosition: "left bottom",
        // Ground him in the scene instead of reading as a flat pasted sticker:
        // darken slightly + cast a soft contact shadow like the ambient light would.
        filter:
          "brightness(0.9) contrast(1.05) drop-shadow(10px 14px 16px rgba(0,0,0,0.55)) drop-shadow(0px 0px 30px rgba(0,0,0,0.25))",
      }}
    />
  );
};
