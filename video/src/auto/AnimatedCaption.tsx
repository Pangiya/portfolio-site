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
        padding: "0 40px",
      }}
    >
      {text}
    </div>
  );
};
