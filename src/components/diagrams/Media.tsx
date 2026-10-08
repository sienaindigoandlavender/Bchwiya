import type { Media as MediaSpec } from "@/content/schema";
import { PresetSign } from "@/components/signs/Sign";
import { Roundabout, type RoundaboutProps } from "./Roundabout";
import { SIGN_PRESETS, type SignPreset } from "./names";

/** Renders a content `media` block: named SVG component, image, or nothing. */
export function Media({ media }: { media?: MediaSpec }) {
  if (!media || media.kind === "none") return null;

  if (media.kind === "image") {
    return (
      // Content images have unknown sizes; a plain img keeps this simple.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={`/images/${media.src}`} alt={media.alt ?? ""} className="mx-auto max-h-64 w-auto" />
    );
  }

  const props = media.props ?? {};
  let node: React.ReactNode = null;
  switch (media.component) {
    case "Roundabout":
      node = <Roundabout {...(props as RoundaboutProps)} />;
      break;
    case "Sign": {
      const preset = props.preset as SignPreset;
      node = SIGN_PRESETS.includes(preset) ? <PresetSign preset={preset} /> : null;
      break;
    }
  }
  return <div className="flex justify-center py-2">{node}</div>;
}
