import { interpolate } from "remotion";
import { VIEWBOX_HEIGHT, VIEWBOX_WIDTH, lerp } from "./palette";

export const LightOverlay: React.FC<{
  frame: number;
  durationInFrames: number;
  speed: number;
}> = ({ frame, durationInFrames, speed }) => {
  // One soft glow sweep per loop. It fades in/out with the sin envelope so
  // it's invisible at both the start and end frame, making the wrap seamless.
  const cycleFrames = durationInFrames / Math.max(speed, 0.01);
  const t = (frame % cycleFrames) / cycleFrames;
  const x = lerp(-VIEWBOX_WIDTH * 0.2, VIEWBOX_WIDTH * 1.2, t);
  const opacity = interpolate(Math.sin(Math.PI * t), [0, 1], [0, 0.22], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <ellipse
      cx={x}
      cy={VIEWBOX_HEIGHT * 0.35}
      rx={VIEWBOX_WIDTH * 0.5}
      ry={VIEWBOX_HEIGHT * 0.5}
      fill="url(#lightGlow)"
      opacity={opacity}
      style={{ mixBlendMode: "overlay" }}
    />
  );
};
