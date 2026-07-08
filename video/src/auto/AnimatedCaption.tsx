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
        top: "50%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        transform: `translateY(-50%) scale(${progress})`,
        opacity: progress,
        padding: "0 48px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          fontWeight: 800,
          fontSize: 58,
          lineHeight: 1.5,
          color: "white",
          WebkitTextStroke: "3px black",
          textShadow: "0 6px 12px rgba(0,0,0,0.4)",
        }}
      >
        {text}
      </div>
    </div>
  );
};
