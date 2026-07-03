import {
  HORIZON_Y,
  PALETTE,
  ROAD_BOTTOM_LEFT_X,
  CANAL_BOTTOM_RIGHT_X,
  VANISHING_POINT,
  VIEWBOX_HEIGHT,
  VIEWBOX_WIDTH,
} from "./palette";

const WIND_CYCLES = 3;
const ROW_COUNT = 14;

// Perspective-spaced rows: dense near the horizon, sparse near the camera.
const rowYPositions = Array.from({ length: ROW_COUNT }, (_, i) => {
  const t = i / (ROW_COUNT - 1);
  return HORIZON_Y + (VIEWBOX_HEIGHT - HORIZON_Y) * Math.pow(t, 1.6);
});

const Field: React.FC<{
  clipId: string;
  polygonPoints: string;
  sway: number;
  transformOriginX: number;
}> = ({ clipId, polygonPoints, sway, transformOriginX }) => (
  <g
    style={{
      transform: `skewX(${sway}deg)`,
      transformOrigin: `${transformOriginX}px ${VIEWBOX_HEIGHT}px`,
    }}
  >
    <clipPath id={clipId}>
      <polygon points={polygonPoints} />
    </clipPath>
    <polygon points={polygonPoints} fill={PALETTE.fieldFill} />
    <g clipPath={`url(#${clipId})`}>
      {rowYPositions.map((y, i) => (
        <line
          key={i}
          x1={0}
          x2={VIEWBOX_WIDTH}
          y1={y}
          y2={y}
          stroke={PALETTE.fieldStripe}
          strokeWidth={1 + (i / ROW_COUNT) * 3}
          opacity={0.35}
        />
      ))}
    </g>
  </g>
);

export const RicePaddies: React.FC<{
  frame: number;
  durationInFrames: number;
  windIntensity: number;
}> = ({ frame, durationInFrames, windIntensity }) => {
  const phase = (2 * Math.PI * WIND_CYCLES * frame) / durationInFrames;
  const swayLeft = windIntensity * 0.7 * Math.sin(phase);
  const swayRight = windIntensity * 0.7 * Math.sin(phase + 0.9);

  const leftField = `${VANISHING_POINT.x},${VANISHING_POINT.y} 0,${VANISHING_POINT.y} 0,${VIEWBOX_HEIGHT} ${ROAD_BOTTOM_LEFT_X},${VIEWBOX_HEIGHT}`;
  const rightField = `${VANISHING_POINT.x},${VANISHING_POINT.y} ${VIEWBOX_WIDTH},${VANISHING_POINT.y} ${VIEWBOX_WIDTH},${VIEWBOX_HEIGHT} ${CANAL_BOTTOM_RIGHT_X},${VIEWBOX_HEIGHT}`;

  return (
    <>
      <Field
        clipId="leftFieldClip"
        polygonPoints={leftField}
        sway={swayLeft}
        transformOriginX={ROAD_BOTTOM_LEFT_X / 2}
      />
      <Field
        clipId="rightFieldClip"
        polygonPoints={rightField}
        sway={swayRight}
        transformOriginX={(CANAL_BOTTOM_RIGHT_X + VIEWBOX_WIDTH) / 2}
      />
    </>
  );
};
