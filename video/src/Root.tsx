import "./index.css";
import { Composition } from "remotion";
import { HelloWorld, myCompSchema } from "./HelloWorld";
import { Logo, myCompSchema2 } from "./HelloWorld/Logo";
import { AutoVideo } from "./auto/AutoVideo";
import type { AutoVideoProps } from "./auto/types";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        // You can take the "id" to render a video:
        // npx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        schema={myCompSchema}
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
          logoColor1: "#91EAE4",
          logoColor2: "#86A8E7",
        }}
      />

      {/* Mount any React component to make it show up in the sidebar and work on it individually! */}
      <Composition
        id="OnlyLogo"
        component={Logo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        schema={myCompSchema2}
        defaultProps={{
          logoColor1: "#91dAE2" as const,
          logoColor2: "#86A8E7" as const,
        }}
      />
<Composition
        id="AutoVideo"
        component={AutoVideo}
        durationInFrames={150}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={
          {
            mode: "slideshow",
            fps: 30,
            scenes: [],
            music: null,
            totalDurationInFrames: 150,
          } as AutoVideoProps
        }
        calculateMetadata={async ({ props }) => {
          const p = props as AutoVideoProps;
          return {
            durationInFrames: p.totalDurationInFrames,
            fps: p.fps,
          };
        }}
      />
    </>
  );
};
