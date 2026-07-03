import {
  CANAL_BOTTOM_RIGHT_X,
  PALETTE,
  ROAD_BOTTOM_LEFT_X,
  ROAD_BOTTOM_RIGHT_X,
  VANISHING_POINT,
  VIEWBOX_HEIGHT,
  lerp,
} from "./palette";

const SHIMMER_CYCLE_FRAMES_DIVISOR = 3;

export const RoadAndCanal: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  const road = `${VANISHING_POINT.x},${VANISHING_POINT.y} ${ROAD_BOTTOM_RIGHT_X},${VIEWBOX_HEIGHT} ${ROAD_BOTTOM_LEFT_X},${VIEWBOX_HEIGHT}`;
  const canal = `${VANISHING_POINT.x},${VANISHING_POINT.y} ${CANAL_BOTTOM_RIGHT_X},${VIEWBOX_HEIGHT} ${ROAD_BOTTOM_RIGHT_X},${VIEWBOX_HEIGHT}`;

  // A soft highlight sweeps down the canal on a loop-safe cycle: it fades
  // in and out (sin envelope) so it never pops at the wrap point.
  const cycleFrames = durationInFrames / SHIMMER_CYCLE_FRAMES_DIVISOR;
  const t = (frame % cycleFrames) / cycleFrames;
  const shimmerY = lerp(VANISHING_POINT.y, VIEWBOX_HEIGHT, t);
  const shimmerOpacity = Math.max(0, Math.sin(Math.PI * t)) * 0.6;
  const shimmerWidth = lerp(4, 70, t);
  const shimmerX = lerp(
    VANISHING_POINT.x,
    (CANAL_BOTTOM_RIGHT_X + ROAD_BOTTOM_RIGHT_X) / 2,
    t,
  );

  return (
    <>
      <polygon points={road} fill={PALETTE.road} />
      <polygon points={canal} fill={PALETTE.canal} />
      <clipPath id="canalClip">
        <polygon points={canal} />
      </clipPath>
      <g clipPath="url(#canalClip)">
        <ellipse
          cx={shimmerX}
          cy={shimmerY}
          rx={shimmerWidth}
          ry={18}
          fill={PALETTE.canalShimmer}
          opacity={shimmerOpacity}
        />
      </g>

      {/* Converging centerline */}
      <polygon
        points={`${VANISHING_POINT.x - 2},${VANISHING_POINT.y} ${
          VANISHING_POINT.x + 2
        },${VANISHING_POINT.y} ${
          (ROAD_BOTTOM_LEFT_X + ROAD_BOTTOM_RIGHT_X) / 2 + 4
        },${VIEWBOX_HEIGHT} ${
          (ROAD_BOTTOM_LEFT_X + ROAD_BOTTOM_RIGHT_X) / 2 - 4
        },${VIEWBOX_HEIGHT}`}
        fill={PALETTE.roadCenterline}
        opacity={0.5}
      />

      {/* Static manhole covers */}
      <ellipse
        cx={lerp(VANISHING_POINT.x, ROAD_BOTTOM_LEFT_X, 0.55)}
        cy={lerp(VANISHING_POINT.y, VIEWBOX_HEIGHT, 0.55)}
        rx={22}
        ry={7}
        fill="none"
        stroke={PALETTE.roadCenterline}
        strokeWidth={2}
        opacity={0.4}
      />
      <ellipse
        cx={lerp(VANISHING_POINT.x, ROAD_BOTTOM_RIGHT_X, 0.85)}
        cy={lerp(VANISHING_POINT.y, VIEWBOX_HEIGHT, 0.85)}
        rx={34}
        ry={11}
        fill="none"
        stroke={PALETTE.roadCenterline}
        strokeWidth={3}
        opacity={0.4}
      />
    </>
  );
};
