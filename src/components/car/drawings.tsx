/*
 * Flat illustrations for Ma voiture. Each exports the hotspot positions so the
 * explorer can place tappable numbers on top. Colours come from the app tokens.
 */

const DASH = "#4f3446";
const DARK = "#26121f";
const SKY = "#dcedff";
const ROAD = "#cdbfc7";

/* ---------------- Cockpit ---------------- */

export const COCKPIT_VIEW = { w: 360, h: 330 };
export const COCKPIT_SPOTS: Record<string, { x: number; y: number }> = {
  volant: { x: 120, y: 212 },
  compteurs: { x: 120, y: 132 },
  "retro-interieur": { x: 180, y: 30 },
  "retro-exterieur": { x: 20, y: 78 },
  "commodo-gauche": { x: 34, y: 176 },
  "commodo-droit": { x: 208, y: 176 },
  warning: { x: 246, y: 140 },
  levier: { x: 286, y: 226 },
  "frein-main": { x: 330, y: 262 },
  embrayage: { x: 74, y: 300 },
  frein: { x: 118, y: 300 },
  accelerateur: { x: 160, y: 300 },
};

export function Cockpit() {
  return (
    <g>
      {/* windscreen and the road ahead */}
      <path d="M28 8 H332 L322 112 H38 Z" fill={SKY} />
      <path d="M168 44 H192 L262 112 H98 Z" fill={ROAD} />
      <path d="M180 50 V60 M180 72 V84 M180 96 V110" stroke="#fff" strokeWidth="3" />
      {/* side mirrors */}
      <rect x="2" y="64" width="34" height="30" rx="10" fill={DASH} />
      <rect x="7" y="69" width="24" height="20" rx="6" fill={SKY} />
      <rect x="324" y="64" width="34" height="30" rx="10" fill={DASH} />
      <rect x="329" y="69" width="24" height="20" rx="6" fill={SKY} />
      {/* rear-view mirror */}
      <rect x="146" y="16" width="68" height="24" rx="10" fill={DASH} />
      <rect x="152" y="21" width="56" height="14" rx="6" fill="#f7f1f4" />
      {/* dashboard */}
      <path d="M0 108 H360 V250 H0 Z" fill={DASH} />
      <rect x="58" y="116" width="124" height="44" rx="16" fill={DARK} />
      <circle cx="94" cy="138" r="15" fill="none" stroke="#f7f1f4" strokeWidth="3" />
      <path d="M94 138 L103 130" stroke="var(--rose)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="146" cy="138" r="15" fill="none" stroke="#f7f1f4" strokeWidth="3" />
      <path d="M146 138 L139 129" stroke="var(--rose)" strokeWidth="3" strokeLinecap="round" />
      {/* centre console with the hazard button */}
      <rect x="222" y="122" width="96" height="60" rx="14" fill={DARK} />
      <rect x="234" y="128" width="24" height="24" rx="6" fill="#f7f1f4" />
      <polygon
        points="246,133 255,148 237,148"
        fill="none"
        stroke="#e0312b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <rect x="266" y="132" width="42" height="6" rx="3" fill="#6b5463" />
      <rect x="266" y="144" width="42" height="6" rx="3" fill="#6b5463" />
      <rect x="234" y="160" width="74" height="14" rx="7" fill="#6b5463" />
      {/* stalks */}
      <path d="M78 188 L36 176" stroke={DARK} strokeWidth="9" strokeLinecap="round" />
      <path d="M162 188 L206 176" stroke={DARK} strokeWidth="9" strokeLinecap="round" />
      {/* steering wheel */}
      <circle cx="120" cy="212" r="60" fill="none" stroke={DARK} strokeWidth="15" />
      <path d="M64 212 H176 M120 212 V268" stroke={DARK} strokeWidth="13" />
      <circle cx="120" cy="212" r="20" fill="var(--rose)" />
      {/* gear lever and handbrake */}
      <ellipse cx="286" cy="262" rx="26" ry="10" fill={DARK} />
      <path d="M286 262 V214" stroke={DARK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="286" cy="210" r="11" fill="var(--rose)" />
      <path d="M318 286 L340 236" stroke={DARK} strokeWidth="11" strokeLinecap="round" />
      {/* footwell and pedals */}
      <path d="M0 250 H240 V330 H0 Z" fill={DARK} />
      <rect x="62" y="282" width="24" height="34" rx="6" fill="#8a7482" />
      <rect x="102" y="280" width="32" height="34" rx="6" fill="#8a7482" />
      <rect x="150" y="276" width="20" height="44" rx="6" fill="#8a7482" />
    </g>
  );
}

/* ---------------- Warning lights ---------------- */

const LIGHT_COLOR = { red: "#e0312b", orange: "#f39200", green: "#2e9e4f", blue: "#1f5fa8" };

export function LightIcon({ id, color }: { id: string; color: keyof typeof LIGHT_COLOR }) {
  const c = LIGHT_COLOR[color];
  const s = {
    stroke: c,
    strokeWidth: 3,
    fill: "none",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const icon = (() => {
    switch (id) {
      case "huile":
        return (
          <g {...s}>
            <path d="M8 22 H28 L34 16 L40 18 L30 28 H10 Z" fill={c} />
            <path d="M14 22 V17 H20" />
            <path d="M42 24 Q42 28 40 28" />
          </g>
        );
      case "temperature":
        return (
          <g {...s}>
            <path d="M24 8 V24" strokeWidth="4" />
            <circle cx="24" cy="28" r="4" fill={c} />
            <path d="M24 12 H29 M24 17 H29" />
            <path d="M8 36 Q12 33 16 36 T24 36 T32 36 T40 36" />
          </g>
        );
      case "freins":
        return (
          <g {...s}>
            <circle cx="24" cy="24" r="11" />
            <path d="M10 14 Q5 24 10 34 M38 14 Q43 24 38 34" />
            <path d="M24 17 V26" strokeWidth="3.5" />
            <circle cx="24" cy="31" r="1.6" fill={c} />
          </g>
        );
      case "batterie":
        return (
          <g {...s}>
            <rect x="8" y="16" width="32" height="20" rx="3" />
            <path d="M14 16 V12 M34 16 V12 M14 26 H20 M17 23 V29 M28 26 H34" />
          </g>
        );
      case "ceinture":
        return (
          <g {...s}>
            <circle cx="24" cy="11" r="4" fill={c} />
            <path d="M16 40 V24 Q16 18 24 18 Q32 18 32 24 V40" />
            <path d="M30 18 L18 36" strokeWidth="3.5" />
          </g>
        );
      case "moteur":
        return (
          <g {...s}>
            <path d="M10 20 H16 V16 H30 V20 H34 L38 16 V34 L34 30 H30 V34 H16 L12 30 H10 Z" />
            <path d="M20 12 H26" />
          </g>
        );
      case "abs":
        return (
          <g {...s}>
            <circle cx="24" cy="24" r="14" />
            <text
              x="24"
              y="28.5"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={c}
              stroke="none"
              fontFamily="Arial, sans-serif"
            >
              ABS
            </text>
          </g>
        );
      case "carburant":
        return (
          <g {...s}>
            <rect x="10" y="10" width="18" height="28" rx="2" />
            <path d="M13 16 H25" />
            <path d="M28 18 L34 22 V32 Q34 35 37 35 Q40 35 40 32 V18 L36 14" />
          </g>
        );
      case "pneus":
        return (
          <g {...s}>
            <path d="M12 12 Q8 24 12 36 H36 Q40 24 36 12" />
            <path d="M24 17 V27" strokeWidth="3.5" />
            <circle cx="24" cy="31.5" r="1.6" fill={c} />
          </g>
        );
      case "clignotants":
        return (
          <g fill={c}>
            <polygon points="6,24 18,14 18,34" />
            <polygon points="42,24 30,14 30,34" />
          </g>
        );
      case "croisement":
        return (
          <g {...s}>
            <path d="M22 12 Q34 12 34 24 Q34 36 22 36 Z" fill={c} />
            <path d="M18 14 L8 18 M18 22 L8 26 M18 30 L8 34" />
          </g>
        );
      case "route":
        return (
          <g {...s}>
            <path d="M26 12 Q38 12 38 24 Q38 36 26 36 Z" fill={c} />
            <path d="M22 15 H8 M22 21 H8 M22 27 H8 M22 33 H8" />
          </g>
        );
      default:
        return <circle cx="24" cy="24" r="10" fill={c} />;
    }
  })();
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden>
      {icon}
    </svg>
  );
}

/* ---------------- Blind spots ---------------- */

export function BlindSpots({ scooter }: { scooter: boolean }) {
  return (
    <svg
      viewBox="0 0 300 380"
      width="100%"
      style={{ maxWidth: 320 }}
      role="img"
      aria-label="Angles morts"
    >
      <rect width="300" height="380" rx="24" fill="#b9aab3" />
      <path d="M100 0 V380 M200 0 V380" stroke="#fff" strokeWidth="3" strokeDasharray="18 14" />
      {/* what the mirrors see */}
      <polygon points="118,150 40,380 96,380" fill="var(--lilac)" opacity="0.9" />
      <polygon points="182,150 260,380 204,380" fill="var(--lilac)" opacity="0.9" />
      <polygon points="135,215 165,215 175,380 125,380" fill="var(--lilac)" opacity="0.9" />
      {/* blind spots */}
      <polygon points="118,150 104,190 60,262 60,190" fill="var(--butter)" />
      <polygon points="182,150 196,190 240,262 240,190" fill="var(--butter)" />
      {/* the car */}
      <rect x="118" y="120" width="64" height="104" rx="18" fill="var(--rose)" />
      <rect x="126" y="140" width="48" height="22" rx="6" fill="#fff" opacity="0.85" />
      <rect x="128" y="196" width="44" height="14" rx="5" fill="#fff" opacity="0.6" />
      <rect x="108" y="146" width="12" height="8" rx="3" fill="var(--rose)" />
      <rect x="180" y="146" width="12" height="8" rx="3" fill="var(--rose)" />
      {scooter ? (
        <g transform="translate(78 214)">
          <rect x="-6" y="-18" width="12" height="36" rx="6" fill="var(--ink)" />
          <circle cx="0" cy="-6" r="7" fill="var(--ink-soft)" />
          <rect x="-11" y="-16" width="22" height="4" rx="2" fill="var(--ink)" />
        </g>
      ) : null}
    </svg>
  );
}

/* ---------------- Under the bonnet ---------------- */

export const ENGINE_VIEW = { w: 340, h: 240 };
export const ENGINE_SPOTS: Record<string, { x: number; y: number }> = {
  huile: { x: 170, y: 92 },
  refroidissement: { x: 270, y: 70 },
  frein: { x: 70, y: 66 },
  "lave-glace": { x: 276, y: 178 },
  batterie: { x: 70, y: 176 },
};

export function Engine() {
  return (
    <g>
      <rect x="0" y="0" width="340" height="240" rx="28" fill={DASH} />
      <rect x="108" y="64" width="124" height="112" rx="16" fill={DARK} />
      <path
        d="M124 88 H216 M124 112 H216 M124 136 H216"
        stroke="#6b5463"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* oil cap and dipstick */}
      <circle cx="170" cy="92" r="12" fill="var(--butter)" />
      <path d="M208 70 V150" stroke="var(--butter)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="208" cy="68" r="6" fill="var(--butter)" />
      {/* coolant tank */}
      <rect x="250" y="40" width="40" height="56" rx="10" fill="#e8f6ff" />
      <rect x="250" y="66" width="40" height="30" rx="8" fill="#ff9ec0" opacity="0.85" />
      <circle cx="270" cy="38" r="8" fill="var(--ink-soft)" />
      {/* brake fluid */}
      <rect x="54" y="48" width="32" height="38" rx="8" fill="#fff6d6" />
      <circle cx="70" cy="46" r="7" fill="var(--ink-soft)" />
      {/* washer fluid */}
      <rect x="252" y="152" width="48" height="50" rx="12" fill="#cfe6ff" />
      <circle cx="276" cy="152" r="9" fill="#1f5fa8" />
      {/* battery */}
      <rect x="40" y="152" width="62" height="46" rx="8" fill={DARK} />
      <rect x="50" y="144" width="12" height="10" rx="2" fill="#e0312b" />
      <rect x="80" y="144" width="12" height="10" rx="2" fill="#8a7482" />
    </g>
  );
}
