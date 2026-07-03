import { HORIZON_Y, PALETTE } from "./palette";

const HAZE_CYCLES = 2;

export const Mountains: React.FC<{
  frame: number;
  durationInFrames: number;
}> = ({ frame, durationInFrames }) => {
  const haze =
    0.92 +
    0.06 * Math.sin((2 * Math.PI * HAZE_CYCLES * frame) / durationInFrames);

  return (
    <g opacity={haze}>
      <polygon
        points={`0,${HORIZON_Y - 40} 140,${HORIZON_Y - 90} 300,${
          HORIZON_Y - 50
        } 480,${HORIZON_Y - 110} 640,${HORIZON_Y - 60} 820,${
          HORIZON_Y - 100
        } 1080,${HORIZON_Y - 55} 1080,${HORIZON_Y} 0,${HORIZON_Y}`}
        fill={PALETTE.mountainFar}
        opacity={0.7}
      />
      <polygon
        points={`0,${HORIZON_Y - 10} 200,${HORIZON_Y - 60} 380,${
          HORIZON_Y - 20
        } 560,${HORIZON_Y - 70} 760,${HORIZON_Y - 15} 1080,${
          HORIZON_Y - 45
        } 1080,${HORIZON_Y} 0,${HORIZON_Y}`}
        fill={PALETTE.mountainMid}
        opacity={0.85}
      />
      <polygon
        points={`0,${HORIZON_Y} 160,${HORIZON_Y - 25} 420,${HORIZON_Y} 700,${
          HORIZON_Y - 20
        } 1080,${HORIZON_Y} 0,${HORIZON_Y}`}
        fill={PALETTE.mountainNear}
      />
    </g>
  );
};
