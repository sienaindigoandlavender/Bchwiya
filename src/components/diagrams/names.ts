// Names of the SVG components that content files may reference via `media.component`.
// Kept free of React imports so the content validator can use it.
export const DIAGRAM_NAMES = ["Roundabout", "Sign"] as const;
export type DiagramName = (typeof DIAGRAM_NAMES)[number];

export const SIGN_PRESETS = [
  "cedez-le-passage",
  "stop",
  "sens-giratoire-obligatoire",
  "giratoire-danger",
] as const;
export type SignPreset = (typeof SIGN_PRESETS)[number];
