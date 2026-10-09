// Names of the SVG components that content files may reference via `media.component`.
// Kept free of React imports so the content validator can use it.
export const DIAGRAM_NAMES = [
  "Roundabout",
  "Sign",
  "Crossroads",
  "TrafficLight",
  "RoadLines",
] as const;
export type DiagramName = (typeof DIAGRAM_NAMES)[number];

export const SIGN_PRESETS = [
  // priority
  "cedez-le-passage",
  "stop",
  "route-prioritaire",
  "fin-route-prioritaire",
  "danger-intersection-droite",
  "danger-intersection-prioritaire",
  // danger
  "giratoire-danger",
  "danger-virage-droite",
  "danger-virage-gauche",
  "danger-pietons",
  "danger-enfants",
  "danger-feux",
  "danger-ralentisseur",
  "danger-autre",
  // prohibition
  "sens-interdit",
  "interdit-circulation",
  "vitesse-60",
  "vitesse-90",
  "vitesse-100",
  "vitesse-120",
  "depassement-interdit",
  "interdit-tourner-gauche",
  "stationnement-interdit",
  "arret-stationnement-interdit",
  "fin-interdictions",
  // obligation
  "sens-giratoire-obligatoire",
  "obligation-tout-droit",
  "obligation-droite",
  // indication
  "parking",
  "sens-unique",
  "impasse",
  "passage-pietons",
  "hopital",
  "autoroute",
  "fin-autoroute",
] as const;
export type SignPreset = (typeof SIGN_PRESETS)[number];
