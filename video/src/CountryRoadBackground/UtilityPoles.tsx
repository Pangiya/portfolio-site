import {
  PALETTE,
  ROAD_BOTTOM_LEFT_X,
  VANISHING_POINT,
  VIEWBOX_HEIGHT,
  lerp,
} from "./palette";

const POLE_COUNT = 7;
const WIND_CYCLES = 4;

type Pole = {
  x: number;
  topY: number;
  baseY: number;
  strokeWidth: number;
  t: number;
};

const POLES: Pole[] = Array.from({ length: POLE_COUNT }, (_, i) => {
  // Raise to a power > 1 so poles bunch up near the vanishing point, the
  // way real evenly-spaced poles appear to compress with distance.
  const t = Math.pow(i / (POLE_COUNT - 1), 1.4);
  const x = lerp(ROAD_BOTTOM_LEFT_X - 40, VANISHING_POINT.x - 6, t);
  const baseY = lerp(VIEWBOX_HEIGHT, VANISHING_POINT.y, t);
  const height = lerp(560, 15, t);
  return {
    x,
    baseY,
    topY: baseY - height,
    strokeWidth: lerp(14, 1, t),
    t,
  };
});

export const UtilityPoles: React.FC<{
  frame: number;
  durationInFrames: number;
  windIntensity: number;
}> = ({ frame, durationInFrames, windIntensity }) => {
  const wires = POLES.slice(0, -1).map((pole, i) => {
    const next = POLES[i + 1];
    const span = next.x - pole.x;
    const baseSag = Math.min(30, Math.abs(span) * 0.12);
    const phase =
      (2 * Math.PI * WIND_CYCLES * frame) / durationInFrames + i * 0.9;
    const sag = baseSag * (1 + windIntensity * 0.5 * Math.sin(phase));
    const midX = (pole.x + next.x) / 2;
    const midY = (pole.topY + next.topY) / 2 + sag;

    return (
      <path
        key={i}
        d={`M ${pole.x} ${pole.topY + 6} Q ${midX} ${midY} ${next.x} ${
          next.topY + 6
        }`}
        stroke={PALETTE.wire}
        strokeWidth={1.5}
        fill="none"
        opacity={0.7}
      />
    );
  });

  return (
    <>
      {wires}
      {POLES.map((pole, i) => (
        <g key={i}>
          <line
            x1={pole.x}
            y1={pole.baseY}
            x2={pole.x}
            y2={pole.topY}
            stroke={PALETTE.pole}
            strokeWidth={pole.strokeWidth}
          />
          {pole.t < 0.35 && (
            <line
              x1={pole.x - pole.strokeWidth * 2.2}
              y1={pole.topY + 14}
              x2={pole.x + pole.strokeWidth * 2.2}
              y2={pole.topY + 8}
              stroke={PALETTE.pole}
              strokeWidth={Math.max(2, pole.strokeWidth * 0.4)}
            />
          )}
          {i === 0 && (
            <>
              <line
                x1={pole.x}
                y1={pole.topY + 60}
                x2={pole.x - 46}
                y2={pole.topY + 40}
                stroke={PALETTE.pole}
                strokeWidth={4}
              />
              <ellipse
                cx={pole.x - 52}
                cy={pole.topY + 38}
                rx={9}
                ry={6}
                fill={PALETTE.lamp}
                opacity={0.9}
              />
            </>
          )}
        </g>
      ))}
    </>
  );
};
