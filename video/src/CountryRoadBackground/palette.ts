// Shared geometry + color constants for the CountryRoadBackground scene.
// The scene is authored in a fixed 1080x1920 SVG viewBox and scaled to fit
// whatever composition size it's rendered at (see index.tsx).

export const VIEWBOX_WIDTH = 1080;
export const VIEWBOX_HEIGHT = 1920;
export const HORIZON_Y = 760;
export const VANISHING_POINT = { x: 540, y: HORIZON_Y };

// Road/canal/field edges at the bottom of the frame, all converging to
// VANISHING_POINT at the top so every layer shares one consistent perspective.
export const ROAD_BOTTOM_LEFT_X = 390;
export const ROAD_BOTTOM_RIGHT_X = 700;
export const CANAL_BOTTOM_RIGHT_X = 760;

export const PALETTE = {
  skyTop: "#6fb2e0",
  skyHorizon: "#eef6f9",
  cloud: "#ffffff",
  mountainFar: "#a7bdcd",
  mountainMid: "#83a0b6",
  mountainNear: "#5f7f9a",
  fieldFill: "#568c46",
  fieldStripe: "#3f6f36",
  road: "#948f85",
  roadCenterline: "#c9c4b8",
  canal: "#a9cdd8",
  canalShimmer: "#ffffff",
  pole: "#4a4640",
  wire: "#332f2a",
  lamp: "#f4e9c9",
} as const;

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
