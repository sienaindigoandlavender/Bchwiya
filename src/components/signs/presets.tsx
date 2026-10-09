import type { ReactNode } from "react";
import type { SignPreset } from "@/components/diagrams/names";
import { RoundaboutArrows, Sign, SIGN_COLORS as C, octagonPoints } from "./Sign";

/*
 * The sign library. Every pictogram is drawn on a 100×100 grid.
 * Shapes and colours follow the Moroccan convention (Vienna system, French layout).
 */

const YELLOW = "#f2b705";
const ORANGE = "#f08c00";
const GREEN = "#2e9e4f";
const ink = { stroke: C.black, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

/** A simple walking figure, standing at (x, y) = feet level. */
function Walker({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const k = (v: number) => Math.round(v * s * 100) / 100;
  return (
    <g {...ink} strokeWidth={k(3.4)} fill="none">
      <circle cx={x + k(1)} cy={y - k(30)} r={k(3.6)} fill={C.black} stroke="none" />
      <path d={`M${x + k(1)} ${y - k(25)} L${x - k(1)} ${y - k(12)}`} />
      <path d={`M${x - k(1)} ${y - k(12)} L${x - k(6)} ${y}`} />
      <path d={`M${x - k(1)} ${y - k(12)} L${x + k(5)} ${y - k(5)} L${x + k(7)} ${y}`} />
      <path d={`M${x + k(0.5)} ${y - k(22)} L${x - k(6)} ${y - k(15)}`} />
      <path d={`M${x + k(0.5)} ${y - k(22)} L${x + k(6)} ${y - k(17)}`} />
    </g>
  );
}

/** Rear view of a car, for the "no overtaking" sign. */
function CarRear({ x, color }: { x: number; color: string }) {
  return (
    <g fill={color}>
      <path
        d={`M${x} 60 L${x + 3} 46 Q${x + 4} 43 ${x + 7} 43 L${x + 13} 43 Q${x + 16} 43 ${x + 17} 46 L${x + 20} 60 Z`}
      />
      <rect x={x - 1} y={58} width={22} height={12} rx={3} />
      <rect x={x + 1} y={69} width={5} height={5} rx={1} />
      <rect x={x + 14} y={69} width={5} height={5} rx={1} />
    </g>
  );
}

function arrowHead(x: number, y: number, dir: "up" | "right" | "left", w = 9) {
  const pts =
    dir === "up"
      ? `${x},${y - w} ${x - w},${y + 2} ${x + w},${y + 2}`
      : dir === "right"
        ? `${x + w},${y} ${x - 2},${y - w} ${x - 2},${y + w}`
        : `${x - w},${y} ${x + 2},${y - w} ${x + 2},${y + w}`;
  return <polygon points={pts} />;
}

const triangle = (title: string, children: ReactNode, size?: number) => (
  <Sign shape="triangle" border={C.red} title={title} size={size}>
    {children}
  </Sign>
);
const prohibition = (title: string, children: ReactNode, size?: number) => (
  <Sign shape="circle" border={C.red} title={title} size={size}>
    {children}
  </Sign>
);
const obligation = (title: string, children: ReactNode, size?: number) => (
  <Sign shape="circle" fill={C.blue} title={title} size={size}>
    {children}
  </Sign>
);
const info = (title: string, children: ReactNode, size?: number) => (
  <Sign shape="square" fill={C.blue} title={title} size={size}>
    {children}
  </Sign>
);
const speed = (n: number) => (size?: number) =>
  prohibition(
    `Vitesse limitée à ${n} km/h`,
    <text
      x="50"
      y={n >= 100 ? 60 : 62}
      textAnchor="middle"
      fontSize={n >= 100 ? 30 : 38}
      fontWeight="700"
      fill={C.black}
      fontFamily="Arial, sans-serif"
    >
      {n}
    </text>,
    size,
  );
const motorwayPictogram = (
  <g fill="none" stroke={C.white} strokeWidth="5" strokeLinecap="round">
    <path d="M36 84 L46 46 M64 84 L54 46" />
    <path d="M22 50 Q50 24 78 50" />
    <path d="M30 42 V56 M70 42 V56" />
  </g>
);

const PRESETS: Record<SignPreset, { title: string; render: (size?: number) => ReactNode }> = {
  /* ---------- Priority ---------- */
  "cedez-le-passage": {
    title: "Cédez le passage",
    render: (size) => (
      <Sign shape="inverted-triangle" border={C.red} title="Cédez le passage" size={size} />
    ),
  },
  stop: {
    title: "Stop",
    render: (size) => (
      <Sign shape="octagon" fill={C.red} title="Stop" size={size}>
        <polygon
          points={octagonPoints(50, 50, 41)}
          fill="none"
          stroke={C.white}
          strokeWidth="2.5"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill={C.white}
          fontFamily="Arial, sans-serif"
        >
          STOP
        </text>
      </Sign>
    ),
  },
  "route-prioritaire": {
    title: "Route prioritaire",
    render: (size) => (
      <Sign shape="diamond" fill={C.white} border={C.black} title="Route prioritaire" size={size}>
        <polygon points="50,20 80,50 50,80 20,50" fill={YELLOW} />
      </Sign>
    ),
  },
  "fin-route-prioritaire": {
    title: "Fin de route prioritaire",
    render: (size) => (
      <Sign
        shape="diamond"
        fill={C.white}
        border={C.black}
        title="Fin de route prioritaire"
        size={size}
      >
        <polygon points="50,20 80,50 50,80 20,50" fill={YELLOW} />
        <g stroke={C.black} strokeWidth="3">
          <path d="M28 64 L64 28 M34 70 L70 34 M40 76 L76 40" />
        </g>
      </Sign>
    ),
  },
  "danger-intersection-droite": {
    title: "Intersection : priorité à droite",
    render: (size) =>
      triangle(
        "Intersection : priorité à droite",
        <path d="M39 48 L61 78 M61 48 L39 78" {...ink} strokeWidth="6.5" />,
        size,
      ),
  },
  "danger-intersection-prioritaire": {
    title: "Intersection avec une route non prioritaire",
    render: (size) =>
      triangle(
        "Intersection avec une route non prioritaire",
        <g {...ink}>
          <path d="M50 44 V80" strokeWidth="9" strokeLinecap="butt" />
          <path d="M35 63 H65" strokeWidth="3.5" />
        </g>,
        size,
      ),
  },

  /* ---------- Danger ---------- */
  "giratoire-danger": {
    title: "Carrefour à sens giratoire",
    render: (size) =>
      triangle(
        "Carrefour à sens giratoire",
        <RoundaboutArrows cx={50} cy={62} r={13} color={C.black} width={3.5} />,
        size,
      ),
  },
  "danger-virage-droite": {
    title: "Virage à droite",
    render: (size) =>
      triangle(
        "Virage à droite",
        <path d="M44 82 V64 Q44 50 60 46" fill="none" {...ink} strokeWidth="7" />,
        size,
      ),
  },
  "danger-virage-gauche": {
    title: "Virage à gauche",
    render: (size) =>
      triangle(
        "Virage à gauche",
        <path d="M56 82 V64 Q56 50 40 46" fill="none" {...ink} strokeWidth="7" />,
        size,
      ),
  },
  "danger-pietons": {
    title: "Passage pour piétons",
    render: (size) => triangle("Passage pour piétons", <Walker x={50} y={80} />, size),
  },
  "danger-enfants": {
    title: "Endroit fréquenté par les enfants",
    render: (size) =>
      triangle(
        "Endroit fréquenté par les enfants",
        <>
          <Walker x={42} y={80} />
          <Walker x={60} y={80} s={0.75} />
        </>,
        size,
      ),
  },
  "danger-feux": {
    title: "Feux tricolores",
    render: (size) =>
      triangle(
        "Feux tricolores",
        <g stroke={C.black} strokeWidth="1.5">
          <circle cx="50" cy="46" r="6" fill={C.red} />
          <circle cx="50" cy="61" r="6" fill={ORANGE} />
          <circle cx="50" cy="76" r="6" fill={GREEN} />
        </g>,
        size,
      ),
  },
  "danger-ralentisseur": {
    title: "Ralentisseur (dos d'âne)",
    render: (size) =>
      triangle(
        "Ralentisseur (dos d'âne)",
        <path d="M26 76 H38 Q50 54 62 76 H74" fill="none" {...ink} strokeWidth="6" />,
        size,
      ),
  },
  "danger-autre": {
    title: "Autre danger",
    render: (size) =>
      triangle(
        "Autre danger",
        <>
          <rect x="46.5" y="42" width="7" height="24" rx="2" fill={C.black} />
          <circle cx="50" cy="74" r="4" fill={C.black} />
        </>,
        size,
      ),
  },

  /* ---------- Prohibition ---------- */
  "sens-interdit": {
    title: "Sens interdit",
    render: (size) => (
      <Sign shape="circle" fill={C.red} title="Sens interdit" size={size}>
        <rect x="20" y="42" width="60" height="16" fill={C.white} />
      </Sign>
    ),
  },
  "interdit-circulation": {
    title: "Circulation interdite à tous les véhicules",
    render: (size) => prohibition("Circulation interdite à tous les véhicules", null, size),
  },
  "vitesse-60": { title: "Vitesse limitée à 60 km/h", render: speed(60) },
  "vitesse-90": { title: "Vitesse limitée à 90 km/h", render: speed(90) },
  "vitesse-100": { title: "Vitesse limitée à 100 km/h", render: speed(100) },
  "vitesse-120": { title: "Vitesse limitée à 120 km/h", render: speed(120) },
  "depassement-interdit": {
    title: "Interdiction de dépasser",
    render: (size) =>
      prohibition(
        "Interdiction de dépasser",
        <>
          <CarRear x={25} color={C.red} />
          <CarRear x={55} color={C.black} />
        </>,
        size,
      ),
  },
  "interdit-tourner-gauche": {
    title: "Interdiction de tourner à gauche",
    render: (size) =>
      prohibition(
        "Interdiction de tourner à gauche",
        <>
          <g fill={C.black}>
            <path d="M60 78 V50 H42" fill="none" {...ink} strokeWidth="7" strokeLinecap="butt" />
            {arrowHead(38, 50, "left")}
          </g>
          <path d="M24 24 L76 76" stroke={C.red} strokeWidth="8" />
        </>,
        size,
      ),
  },
  "stationnement-interdit": {
    title: "Stationnement interdit",
    render: (size) => (
      <Sign shape="circle" fill={C.blue} border={C.red} title="Stationnement interdit" size={size}>
        <path d="M22 22 L78 78" stroke={C.red} strokeWidth="9" />
      </Sign>
    ),
  },
  "arret-stationnement-interdit": {
    title: "Arrêt et stationnement interdits",
    render: (size) => (
      <Sign
        shape="circle"
        fill={C.blue}
        border={C.red}
        title="Arrêt et stationnement interdits"
        size={size}
      >
        <path d="M22 22 L78 78 M78 22 L22 78" stroke={C.red} strokeWidth="9" />
      </Sign>
    ),
  },
  "fin-interdictions": {
    title: "Fin de toutes les interdictions",
    render: (size) => (
      <Sign shape="circle" border={C.black} title="Fin de toutes les interdictions" size={size}>
        <g stroke={C.black} strokeWidth="2.5">
          <path d="M26 66 L66 26 M30 70 L70 30 M34 74 L74 34" />
        </g>
      </Sign>
    ),
  },

  /* ---------- Obligation ---------- */
  "sens-giratoire-obligatoire": {
    title: "Sens giratoire obligatoire",
    render: (size) =>
      obligation(
        "Sens giratoire obligatoire",
        <RoundaboutArrows cx={50} cy={50} r={24} color={C.white} width={6} />,
        size,
      ),
  },
  "obligation-tout-droit": {
    title: "Direction obligatoire : tout droit",
    render: (size) =>
      obligation(
        "Direction obligatoire : tout droit",
        <g fill={C.white}>
          <rect x="45" y="40" width="10" height="38" />
          {arrowHead(50, 34, "up", 13)}
        </g>,
        size,
      ),
  },
  "obligation-droite": {
    title: "Direction obligatoire : à droite",
    render: (size) =>
      obligation(
        "Direction obligatoire : à droite",
        <g fill={C.white}>
          <path
            d="M42 80 V52 Q42 46 48 46 H60"
            fill="none"
            stroke={C.white}
            strokeWidth="10"
            strokeLinejoin="round"
          />
          {arrowHead(66, 46, "right", 12)}
        </g>,
        size,
      ),
  },

  /* ---------- Indication ---------- */
  parking: {
    title: "Parking",
    render: (size) =>
      info(
        "Parking",
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fontSize="58"
          fontWeight="700"
          fill={C.white}
          fontFamily="Arial, sans-serif"
        >
          P
        </text>,
        size,
      ),
  },
  "sens-unique": {
    title: "Sens unique",
    render: (size) =>
      info(
        "Sens unique",
        <g fill={C.white}>
          <rect x="44" y="38" width="12" height="44" />
          {arrowHead(50, 30, "up", 15)}
        </g>,
        size,
      ),
  },
  impasse: {
    title: "Impasse",
    render: (size) =>
      info(
        "Impasse",
        <>
          <rect x="43" y="38" width="14" height="46" fill={C.white} />
          <rect x="26" y="22" width="48" height="16" fill={C.red} />
        </>,
        size,
      ),
  },
  "passage-pietons": {
    title: "Passage pour piétons",
    render: (size) =>
      info(
        "Passage pour piétons",
        <>
          <polygon points="50,16 86,82 14,82" fill={C.white} />
          <Walker x={50} y={76} s={0.95} />
        </>,
        size,
      ),
  },
  hopital: {
    title: "Hôpital",
    render: (size) =>
      info(
        "Hôpital",
        <text
          x="50"
          y="70"
          textAnchor="middle"
          fontSize="56"
          fontWeight="700"
          fill={C.white}
          fontFamily="Arial, sans-serif"
        >
          H
        </text>,
        size,
      ),
  },
  autoroute: {
    title: "Entrée d'autoroute",
    render: (size) => info("Entrée d'autoroute", motorwayPictogram, size),
  },
  "fin-autoroute": {
    title: "Fin d'autoroute",
    render: (size) =>
      info(
        "Fin d'autoroute",
        <>
          {motorwayPictogram}
          <path d="M18 82 L82 18" stroke={C.red} strokeWidth="8" />
        </>,
        size,
      ),
  },
};

export function PresetSign({ preset, size }: { preset: SignPreset; size?: number }) {
  return <>{PRESETS[preset].render(size)}</>;
}

export function presetTitle(preset: SignPreset): string {
  return PRESETS[preset].title;
}
