import { interpolate } from "remotion";
import { HORIZON_Y, PALETTE, VIEWBOX_WIDTH } from "./palette";

type CloudDef = {
  x: number;
  y: number;
  rx: number;
  ry: number;
  opacity: number;
};

const CLOUDS: CloudDef[] = [
  { x: 120, y: 140, rx: 160, ry: 46, opacity: 0.75 },
  { x: 430, y: 90, rx: 200, ry: 55, opacity: 0.65 },
  { x: 760, y: 200, rx: 140, ry: 40, opacity: 0.7 },
  { x: 950, y: 320, rx: 110, ry: 32, opacity: 0.55 },
  { x: 260, y: 380, rx: 130, ry: 34, opacity: 0.5 },
];

export const Sky: React.FC<{
  frame: number;
  durationInFrames: number;
  cloudSpeed: number;
}> = ({ frame, durationInFrames, cloudSpeed }) => {
  // Clouds tile every VIEWBOX_WIDTH and drift left by exactly one tile width
  // over the loop's duration, so frame 0 and the final frame line up exactly.
  const drift = interpolate(frame, [0, durationInFrames], [
    0,
    -VIEWBOX_WIDTH * cloudSpeed,
  ]);
  const wrapped = ((drift % VIEWBOX_WIDTH) + VIEWBOX_WIDTH) % VIEWBOX_WIDTH;

  const renderClouds = (offsetX: number) =>
    CLOUDS.map((c, i) => (
      <ellipse
        key={`${offsetX}-${i}`}
        cx={c.x + offsetX}
        cy={c.y}
        rx={c.rx}
        ry={c.ry}
        fill={PALETTE.cloud}
        opacity={c.opacity}
        filter="url(#cloudBlur)"
      />
    ));

  return (
    <>
      <rect
        x={0}
        y={0}
        width={VIEWBOX_WIDTH}
        height={HORIZON_Y + 20}
        fill="url(#skyGradient)"
      />
      <g transform={`translate(${-VIEWBOX_WIDTH + wrapped}, 0)`}>
        {renderClouds(0)}
        {renderClouds(VIEWBOX_WIDTH)}
        {renderClouds(VIEWBOX_WIDTH * 2)}
      </g>
    </>
  );
};
