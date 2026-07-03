import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { z } from "zod";
import { LightOverlay } from "./LightOverlay";
import { Mountains } from "./Mountains";
import { PALETTE, VIEWBOX_HEIGHT, VIEWBOX_WIDTH } from "./palette";
import { RicePaddies } from "./RicePaddies";
import { RoadAndCanal } from "./RoadAndCanal";
import { Sky } from "./Sky";
import { UtilityPoles } from "./UtilityPoles";

export const countryRoadBackgroundSchema = z.object({
  // Fraction of the scene width the cloud layer drifts over one full loop.
  cloudSpeed: z.number().min(0),
  // 0 = still air, 1 = full sway on grass and wires.
  windIntensity: z.number().min(0).max(1),
  // How many soft light sweeps play per loop.
  lightSweepSpeed: z.number().min(0),
});

// A seamlessly looping rural-road background: drifting clouds, swaying rice
// paddies, a shimmering canal, and wind-flexed utility wires, all animated
// from useCurrentFrame so it tiles cleanly when played on repeat.
export const CountryRoadBackground: React.FC<
  z.infer<typeof countryRoadBackgroundSchema>
> = ({ cloudSpeed, windIntensity, lightSweepSpeed }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.skyTop }}>
      <svg
        viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="skyGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={PALETTE.skyTop} />
            <stop offset="100%" stopColor={PALETTE.skyHorizon} />
          </linearGradient>
          <filter id="cloudBlur">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <radialGradient id="lightGlow">
            <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />
            <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
          </radialGradient>
        </defs>

        <Sky
          frame={frame}
          durationInFrames={durationInFrames}
          cloudSpeed={cloudSpeed}
        />
        <Mountains frame={frame} durationInFrames={durationInFrames} />
        <RicePaddies
          frame={frame}
          durationInFrames={durationInFrames}
          windIntensity={windIntensity}
        />
        <RoadAndCanal frame={frame} durationInFrames={durationInFrames} />
        <UtilityPoles
          frame={frame}
          durationInFrames={durationInFrames}
          windIntensity={windIntensity}
        />
        <LightOverlay
          frame={frame}
          durationInFrames={durationInFrames}
          speed={lightSweepSpeed}
        />
      </svg>
    </AbsoluteFill>
  );
};
