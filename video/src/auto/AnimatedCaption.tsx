// src/auto/AnimatedCaption.tsx
import React from "react";
import { useCurrentFrame, useVideoConfig, spring } from "remotion";

export const AnimatedCaption: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  return (
    <div
      style={{
        position: "absolute",
        top: "8%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transform: `scale(${progress})`,
        opacity: progress,
        padding: "0 48px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          fontWeight: 700,
          fontSize: 60,
          lineHeight: 1.3,
          color: "white",
          textShadow:
            "0 2px 6px rgba(0,0,0,0.85), 0 4px 18px rgba(0,0,0,0.6), 0 0 2px rgba(0,0,0,0.9)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
