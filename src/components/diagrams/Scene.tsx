/*
 * Illustrated scenes for lesson screens: flat, pastel, a little funny.
 * Mood only — anything she must learn from (signs, priorities) stays in the
 * precise diagrams. Every scene is drawn on a 320×200 canvas.
 */
import type { ReactNode } from "react";
import type { SceneName } from "./names";

const INK = "#26121f";
const PLUM = "#4f3446";
const ROSE = "#e0245e";
const SKIN = "#c98a6b";
const HAIR = "#3a2230";
const ROAD = "#b9aab3";
const WHITE = "#ffffff";
const LILAC = "#ece3ff";
const MINT = "#d3f4e2";
const BUTTER = "#fff1bf";
const PEACH = "#ffe0cf";
const SKY = "#dcedff";
const BLUSH = "#ffe4ee";
const NIGHT = "#2b2140";
const GREEN = "#7cc9a0";
const RED = "#e0312b";
const AMBER = "#f39200";
const BLUE = "#1f5fa8";

/* ---------- primitives ---------- */

function Car({
  x,
  y,
  color = ROSE,
  s = 1,
  flip = false,
  lights = false,
}: {
  x: number;
  y: number;
  color?: string;
  s?: number;
  flip?: boolean;
  lights?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M-30 -14 C-26 -26 -18 -32 -4 -32 H6 C16 -32 24 -26 28 -14 Z" fill={color} />
      <path d="M-22 -15 C-19 -23 -13 -27 -5 -27 H-2 V-15 Z" fill={WHITE} opacity="0.9" />
      <path d="M3 -27 H6 C13 -27 18 -23 21 -15 H3 Z" fill={WHITE} opacity="0.9" />
      <rect x="-44" y="-16" width="88" height="22" rx="11" fill={color} />
      <circle cx="38" cy="-8" r="3.5" fill={lights ? BUTTER : "#ffd7a0"} />
      <circle cx="-25" cy="7" r="9.5" fill={INK} />
      <circle cx="-25" cy="7" r="3.8" fill={BLUSH} />
      <circle cx="25" cy="7" r="9.5" fill={INK} />
      <circle cx="25" cy="7" r="3.8" fill={BLUSH} />
    </g>
  );
}

function Person({
  x,
  y,
  shirt = ROSE,
  s = 1,
  walking = false,
  arm = "down",
}: {
  x: number;
  y: number;
  shirt?: string;
  s?: number;
  walking?: boolean;
  arm?: "down" | "up" | "side" | "wave";
}) {
  const arms = {
    down: "M-9 -30 L-13 -14 M9 -30 L13 -14",
    up: "M-9 -30 L-13 -14 M8 -34 L10 -58",
    side: "M-9 -32 L-28 -32 M9 -32 L28 -32",
    wave: "M-9 -30 L-13 -14 M9 -32 L20 -46",
  }[arm];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none">
        {walking ? <path d="M-3 -6 L-10 8 M3 -6 L10 8" /> : <path d="M-4 -6 V8 M4 -6 V8" />}
        <path d={arms} stroke={SKIN} />
      </g>
      <rect x="-10" y="-38" width="20" height="34" rx="9" fill={shirt} />
      <circle cx="0" cy="-48" r="10" fill={SKIN} />
      <path d="M-10 -50 Q-9 -61 0 -61 Q10 -61 10 -50 Q5 -55 -10 -50 Z" fill={HAIR} />
    </g>
  );
}

function Donkey({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g stroke="#7d6b74" strokeWidth="6" strokeLinecap="round">
        <path d="M-22 0 V20 M-10 2 V20 M14 2 V20 M24 0 V20" />
      </g>
      <ellipse cx="0" cy="-4" rx="32" ry="18" fill="#a8979f" />
      <path
        d="M-30 -8 Q-42 -4 -40 10"
        stroke="#7d6b74"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M22 -12 L36 -34" stroke="#a8979f" strokeWidth="14" strokeLinecap="round" />
      <ellipse cx="44" cy="-34" rx="14" ry="10" fill="#a8979f" />
      <ellipse cx="54" cy="-31" rx="6" ry="5" fill="#d9ccd2" />
      <path d="M34 -42 L28 -66 L38 -46 Z M40 -43 L40 -68 L46 -45 Z" fill="#8f7e86" />
      <circle cx="44" cy="-37" r="2.2" fill={INK} />
    </g>
  );
}

function Sheep({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-10 6 V16 M10 6 V16" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <g fill={WHITE}>
        <circle cx="-10" cy="-2" r="10" />
        <circle cx="4" cy="-6" r="11" />
        <circle cx="14" cy="2" r="9" />
        <circle cx="-2" cy="6" r="9" />
      </g>
      <ellipse cx="22" cy="-6" rx="7" ry="8" fill={INK} />
    </g>
  );
}

function Tree({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-10" width="6" height="22" rx="3" fill="#8a6a5a" />
      <circle cx="0" cy="-22" r="18" fill={GREEN} />
    </g>
  );
}

function Palm({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0 0 Q4 -30 0 -60"
        stroke="#8a6a5a"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <g fill={GREEN}>
        <path d="M0 -60 Q-26 -70 -36 -52 Q-18 -62 0 -60 Z" />
        <path d="M0 -60 Q26 -70 36 -52 Q18 -62 0 -60 Z" />
        <path d="M0 -60 Q-12 -84 -30 -82 Q-10 -76 0 -60 Z" />
        <path d="M0 -60 Q12 -84 30 -82 Q10 -76 0 -60 Z" />
      </g>
    </g>
  );
}

function Cloud({ x, y, s = 1, fill = WHITE }: { x: number; y: number; s?: number; fill?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={fill}>
      <circle cx="-14" cy="2" r="12" />
      <circle cx="2" cy="-6" r="16" />
      <circle cx="18" cy="2" r="12" />
      <rect x="-26" y="2" width="56" height="12" rx="6" />
    </g>
  );
}

function Road({ y = 150, h = 50, dashed = true }: { y?: number; h?: number; dashed?: boolean }) {
  return (
    <>
      <rect x="0" y={y} width="320" height={h} fill={ROAD} />
      {dashed ? (
        <path d={`M0 ${y + h / 2} H320`} stroke={WHITE} strokeWidth="3" strokeDasharray="18 14" />
      ) : null}
    </>
  );
}

function Lines({ d, color = PLUM, w = 4 }: { d: string; color?: string; w?: number }) {
  return <path d={d} stroke={color} strokeWidth={w} strokeLinecap="round" fill="none" />;
}

function Cross({ x, y, r = 22 }: { x: number; y: number; r?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={RED} strokeWidth="6" />
      <path
        d={`M${x - r * 0.7} ${y + r * 0.7} L${x + r * 0.7} ${y - r * 0.7}`}
        stroke={RED}
        strokeWidth="6"
      />
    </g>
  );
}

function Check({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="14" fill="#2e9e4f" />
      <path
        d="M-6 0 L-2 5 L7 -5"
        stroke={WHITE}
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
    </g>
  );
}

function Bg({ fill }: { fill: string }) {
  return <rect width="320" height="200" rx="22" fill={fill} />;
}

function WarningTriangle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <polygon
        points="0,-22 20,12 -20,12"
        fill="none"
        stroke={RED}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <path d="M0 12 V22 M-8 22 H8" stroke={INK} strokeWidth="3" />
    </g>
  );
}

/* ---------- scenes ---------- */

const SCENES: Record<SceneName, () => ReactNode> = {
  "road-users": () => (
    <>
      <Bg fill={SKY} />
      <rect x="0" y="118" width="320" height="10" fill="#e8dde3" />
      <Road y={128} h={56} />
      <Person x={30} y={116} shirt={AMBER} walking />
      <g transform="translate(70 172)">
        <rect x="-50" y="-48" width="100" height="44" rx="10" fill={BLUE} />
        <rect x="-42" y="-40" width="80" height="16" rx="4" fill={SKY} />
        <circle cx="-30" cy="-2" r="8" fill={INK} />
        <circle cx="30" cy="-2" r="8" fill={INK} />
      </g>
      <Car x={190} y={168} />
      <g transform="translate(272 168)">
        <circle cx="-16" cy="0" r="9" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="16" cy="0" r="9" fill="none" stroke={INK} strokeWidth="4" />
        <path d="M-16 0 L0 -14 L16 0 M0 -14 V-22" stroke={PLUM} strokeWidth="4" fill="none" />
        <Person x={0} y={-14} shirt={MINT} s={0.6} />
      </g>
      <Cloud x={250} y={40} />
    </>
  ),
  "donkey-cart": () => (
    <>
      <Bg fill={PEACH} />
      <circle cx="270" cy="44" r="20" fill={BUTTER} />
      <Road y={140} h={60} dashed={false} />
      <g transform="translate(96 150)">
        <rect x="-62" y="-30" width="70" height="26" rx="4" fill="#c8a07a" />
        <path
          d="M-56 -30 V-44 M-44 -30 V-50 M-32 -30 V-46"
          stroke={GREEN}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="-26" cy="0" r="14" fill="none" stroke="#8a6a5a" strokeWidth="5" />
        <path d="M8 -18 H40" stroke="#8a6a5a" strokeWidth="4" />
      </g>
      <Donkey x={170} y={142} />
      <Tree x={286} y={136} />
    </>
  ),
  "sheep-herd": () => (
    <>
      <Bg fill={MINT} />
      <path d="M0 120 Q80 96 160 116 T320 108 V200 H0 Z" fill={GREEN} opacity="0.5" />
      <Road y={150} h={50} dashed={false} />
      <Sheep x={70} y={150} />
      <Sheep x={120} y={160} s={0.9} />
      <Sheep x={168} y={150} />
      <Sheep x={214} y={162} s={0.85} />
      <Person x={262} y={170} shirt={PLUM} />
      <path d="M272 120 V176" stroke="#8a6a5a" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  vulnerable: () => (
    <>
      <Bg fill={BLUSH} />
      <Person x={70} y={170} shirt={AMBER} walking />
      <g transform="translate(160 168)">
        <circle cx="-18" cy="0" r="12" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="18" cy="0" r="12" fill="none" stroke={INK} strokeWidth="4" />
        <path d="M-18 0 L0 -18 L18 0 M0 -18 V-26" stroke={PLUM} strokeWidth="4" fill="none" />
        <Person x={0} y={-18} shirt={MINT} s={0.7} />
      </g>
      <g transform="translate(252 168)">
        <circle cx="-20" cy="0" r="11" fill={INK} />
        <circle cx="22" cy="0" r="11" fill={INK} />
        <path
          d="M-22 -6 H18 L26 -24"
          stroke={ROSE}
          strokeWidth="9"
          strokeLinecap="round"
          fill="none"
        />
        <Person x={-2} y={-12} shirt={LILAC} s={0.7} />
        <circle cx="-2" cy="-46" r="9" fill={BLUE} />
      </g>
      <path d="M160 34 C150 20 128 26 136 46 L160 66 L184 46 C192 26 170 20 160 34 Z" fill={ROSE} />
    </>
  ),
  ambulance: () => (
    <>
      <Bg fill={SKY} />
      <Road y={150} h={50} />
      <g transform="translate(150 166)">
        <rect x="-62" y="-58" width="96" height="58" rx="10" fill={WHITE} />
        <path d="M34 -40 H50 Q62 -40 66 -24 V0 H34 Z" fill={WHITE} />
        <rect x="40" y="-34" width="16" height="12" rx="3" fill={SKY} />
        <rect x="-62" y="-20" width="128" height="8" fill={RED} />
        <path d="M-20 -44 H-4 M-12 -52 V-36" stroke={RED} strokeWidth="6" />
        <rect x="-20" y="-70" width="20" height="12" rx="4" fill={BLUE} />
        <circle cx="-38" cy="4" r="10" fill={INK} />
        <circle cx="40" cy="4" r="10" fill={INK} />
      </g>
      <Lines d="M118 88 L104 72 M140 84 L140 64 M162 88 L176 72" color={BLUE} w={5} />
      <Lines d="M236 104 Q250 120 236 136 M252 96 Q272 120 252 144" color={PLUM} />
    </>
  ),
  "police-calm": () => (
    <>
      <Bg fill={LILAC} />
      <Road y={150} h={50} />
      <Car x={160} y={168} color={BLUE} s={1.3} />
      <rect x="146" y="112" width="28" height="10" rx="4" fill={PLUM} />
      <text
        x="250"
        y="70"
        fontSize="30"
        fontWeight="700"
        fill={PLUM}
        fontFamily="Arial, sans-serif"
      >
        z z
      </text>
    </>
  ),
  crosswalk: () => (
    <>
      <Bg fill={SKY} />
      <Road y={110} h={90} dashed={false} />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={i} x={132} y={118 + i * 16} width="70" height="9" fill={WHITE} />
      ))}
      <Person x={168} y={178} shirt={AMBER} walking />
      <Car x={56} y={170} />
      <rect x="96" y="112" width="5" height="80" fill={WHITE} />
    </>
  ),
  "kids-ball": () => (
    <>
      <Bg fill={BUTTER} />
      <Road y={140} h={60} />
      <circle cx="150" cy="168" r="13" fill={ROSE} />
      <path d="M140 160 Q150 170 160 160" stroke={WHITE} strokeWidth="3" fill="none" />
      <Person x={100} y={150} shirt={BLUE} s={0.75} walking arm="wave" />
      <Car x={258} y={172} flip />
      <Tree x={40} y={130} />
    </>
  ),
  "road-parts": () => (
    <>
      <Bg fill={MINT} />
      <rect x="0" y="120" width="60" height="80" fill="#e8dde3" />
      <rect x="60" y="120" width="200" height="80" fill={ROAD} />
      <rect x="260" y="120" width="60" height="80" fill="#cbb89b" />
      <path d="M160 120 V200" stroke={WHITE} strokeWidth="3" strokeDasharray="14 10" />
      <path d="M64 120 V200 M256 120 V200" stroke={WHITE} strokeWidth="2" />
      <Person x={30} y={150} shirt={AMBER} />
      <Car x={110} y={170} s={0.8} />
      <Car x={210} y={170} s={0.8} color={BLUE} flip />
      <Tree x={290} y={104} />
    </>
  ),
  motorway: () => (
    <>
      <Bg fill={SKY} />
      <path d="M120 40 H200 L300 200 H20 Z" fill={ROAD} />
      <path d="M160 40 V200" stroke={WHITE} strokeWidth="3" strokeDasharray="14 10" />
      <path d="M186 40 L266 200" stroke={WHITE} strokeWidth="3" />
      <path d="M134 40 L54 200" stroke={WHITE} strokeWidth="3" />
      <path d="M200 40 L300 200" stroke={WHITE} strokeWidth="3" />
      <rect x="132" y="150" width="22" height="34" rx="6" fill={ROSE} />
      <rect x="168" y="96" width="16" height="24" rx="5" fill={BLUE} />
      <rect x="146" y="70" width="12" height="18" rx="4" fill={PLUM} />
    </>
  ),
  "exam-screen": () => (
    <>
      <Bg fill={LILAC} />
      <rect x="80" y="26" width="160" height="150" rx="14" fill={INK} />
      <rect x="90" y="36" width="140" height="130" rx="8" fill={WHITE} />
      <rect x="100" y="46" width="120" height="48" rx="6" fill={SKY} />
      <Car x={160} y={80} s={0.45} />
      {[106, 126, 146].map((y, i) => (
        <g key={y}>
          <rect x="102" y={y} width="12" height="12" rx="3" fill={i === 1 ? ROSE : "#f0e6eb"} />
          <rect x="120" y={y + 3} width={i === 1 ? 70 : 88} height="6" rx="3" fill="#e2d6dc" />
        </g>
      ))}
    </>
  ),
  licence: () => (
    <>
      <Bg fill={PEACH} />
      <rect x="70" y="50" width="180" height="110" rx="14" fill={WHITE} />
      <rect x="70" y="50" width="180" height="26" rx="12" fill={ROSE} />
      <rect x="86" y="88" width="48" height="56" rx="8" fill={BLUSH} />
      <circle cx="110" cy="108" r="11" fill={SKIN} />
      <path d="M94 140 Q110 120 126 140 Z" fill={ROSE} />
      <rect x="146" y="92" width="88" height="8" rx="4" fill="#e2d6dc" />
      <rect x="146" y="108" width="64" height="8" rx="4" fill="#e2d6dc" />
      <text
        x="190"
        y="146"
        textAnchor="middle"
        fontSize="26"
        fontWeight="700"
        fill={ROSE}
        fontFamily="Arial, sans-serif"
      >
        B
      </text>
    </>
  ),
  "cake-18": () => (
    <>
      <Bg fill={BLUSH} />
      <rect x="100" y="100" width="120" height="64" rx="12" fill={WHITE} />
      <path d="M100 116 Q130 130 160 116 T220 116" stroke={ROSE} strokeWidth="10" fill="none" />
      <rect x="92" y="160" width="136" height="10" rx="5" fill={PLUM} />
      <text
        x="160"
        y="152"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill={PLUM}
        fontFamily="Arial, sans-serif"
      >
        18
      </text>
      <path
        d="M138 98 V76 M160 98 V72 M182 98 V76"
        stroke={AMBER}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M138 66 Q134 60 138 54 Q142 60 138 66 Z M160 62 Q156 56 160 50 Q164 56 160 62 Z M182 66 Q178 60 182 54 Q186 60 182 66 Z"
        fill={AMBER}
      />
    </>
  ),
  "crazy-driver": () => (
    <>
      <Bg fill={BUTTER} />
      <Road y={140} h={60} />
      <g transform="rotate(-8 170 150)">
        <Car x={170} y={160} s={1.2} />
      </g>
      <Lines d="M40 130 H96 M24 148 H90 M50 166 H100" w={5} />
      <Cloud x={70} y={180} s={0.5} fill="#e2d6dc" />
      <Cloud x={40} y={170} s={0.35} fill="#e2d6dc" />
      <path d="M232 92 Q236 84 240 92 Q236 100 232 92 Z" fill={SKY} />
      <text x="250" y="70" fontSize="34" fontWeight="700" fill={RED} fontFamily="Arial, sans-serif">
        !!
      </text>
    </>
  ),
  speedometer: () => (
    <>
      <Bg fill={MINT} />
      <path
        d="M80 150 A80 80 0 0 1 240 150"
        fill="none"
        stroke={WHITE}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path
        d="M80 150 A80 80 0 0 1 132 76"
        fill="none"
        stroke={GREEN}
        strokeWidth="22"
        strokeLinecap="round"
      />
      <path d="M160 150 L118 98" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="160" cy="150" r="12" fill={ROSE} />
    </>
  ),
  "two-seconds": () => (
    <>
      <Bg fill={SKY} />
      <Road y={140} h={60} />
      <rect x="150" y="70" width="6" height="82" fill={PLUM} />
      <circle cx="153" cy="66" r="8" fill={AMBER} />
      <Car x={240} y={172} color={BLUE} />
      <Car x={70} y={172} />
      <text
        x="110"
        y="110"
        fontSize="22"
        fontWeight="700"
        fill={PLUM}
        fontFamily="Arial, sans-serif"
      >
        1… 2
      </text>
    </>
  ),
  overtake: () => (
    <>
      <Bg fill={PEACH} />
      <Road y={110} h={90} />
      <Car x={210} y={182} color={PLUM} />
      <Car x={110} y={140} />
      <path
        d="M70 182 Q110 140 160 140"
        stroke={ROSE}
        strokeWidth="4"
        strokeDasharray="8 8"
        fill="none"
      />
      <path
        d="M260 140 Q290 160 300 182"
        stroke={ROSE}
        strokeWidth="4"
        strokeDasharray="8 8"
        fill="none"
      />
      <polygon points="300,190 292,176 306,178" fill={ROSE} />
    </>
  ),
  rain: () => (
    <>
      <Bg fill="#d6dbe8" />
      <Cloud x={110} y={46} s={1.4} fill="#9aa3b8" />
      <Cloud x={220} y={36} s={1.1} fill="#aeb6c8" />
      <g stroke={BLUE} strokeWidth="3" strokeLinecap="round">
        {[70, 100, 130, 160, 190, 220, 250].map((x, i) => (
          <path key={x} d={`M${x} ${80 + (i % 2) * 10} l-6 14`} />
        ))}
      </g>
      <Road y={150} h={50} />
      <Car x={160} y={168} lights />
    </>
  ),
  aquaplaning: () => (
    <>
      <Bg fill="#d6dbe8" />
      <Road y={140} h={60} />
      <ellipse cx="160" cy="180" rx="90" ry="12" fill="#9fc3ea" />
      <Car x={160} y={166} />
      <path
        d="M90 168 Q76 150 66 162 M230 168 Q246 150 256 162"
        stroke="#9fc3ea"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="58" cy="150" r="4" fill="#9fc3ea" />
      <circle cx="264" cy="150" r="4" fill="#9fc3ea" />
    </>
  ),
  night: () => (
    <>
      <Bg fill={NIGHT} />
      <circle cx="260" cy="46" r="20" fill={BUTTER} />
      <circle cx="268" cy="40" r="18" fill={NIGHT} />
      {[
        [40, 30],
        [90, 60],
        [150, 26],
        [200, 70],
        [300, 90],
      ].map(([x, y]) => (
        <circle key={`${x}`} cx={x} cy={y} r="2.5" fill={WHITE} />
      ))}
      <Road y={150} h={50} />
      <polygon points="200,158 320,130 320,196" fill={BUTTER} opacity="0.55" />
      <Car x={160} y={170} lights />
    </>
  ),
  glare: () => (
    <>
      <Bg fill={NIGHT} />
      <Road y={130} h={70} />
      <polygon points="230,150 40,110 40,190" fill={BUTTER} opacity="0.8" />
      <Car x={262} y={160} color={BLUE} flip lights />
      <Car x={70} y={186} s={0.8} />
      <path d="M150 40 Q160 30 170 40 Q160 50 150 40 Z" fill={WHITE} />
      <path
        d="M144 32 L138 24 M160 28 V18 M176 32 L182 24"
        stroke={WHITE}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </>
  ),
  fog: () => (
    <>
      <Bg fill="#e6e2e6" />
      <Road y={140} h={60} />
      <Car x={160} y={166} lights />
      <g fill={WHITE} opacity="0.85">
        <rect x="-20" y="60" width="240" height="22" rx="11" />
        <rect x="120" y="96" width="240" height="22" rx="11" />
        <rect x="-20" y="128" width="200" height="18" rx="9" />
      </g>
    </>
  ),
  wind: () => (
    <>
      <Bg fill={SKY} />
      <Road y={150} h={50} />
      <g transform="rotate(14 60 140)">
        <Tree x={60} y={140} />
      </g>
      <Car x={190} y={170} />
      <Lines
        d="M20 60 Q70 48 120 60 Q150 68 170 56 M40 90 Q100 78 160 90 M200 40 Q240 30 280 44"
        color={WHITE}
        w={6}
      />
    </>
  ),
  "mint-tea": () => (
    <>
      <Bg fill={MINT} />
      <g transform="translate(120 150)">
        <path d="M-40 0 Q-46 -50 0 -54 Q46 -50 40 0 Z" fill="#d9c27a" />
        <path d="M-12 -54 Q0 -72 12 -54" fill="#c4ab60" />
        <circle cx="0" cy="-74" r="5" fill="#c4ab60" />
        <path
          d="M38 -34 Q68 -40 74 -62"
          stroke="#c4ab60"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <path d="M-40 -34 Q-60 -30 -54 -6" stroke="#c4ab60" strokeWidth="6" fill="none" />
        <rect x="-46" y="0" width="92" height="8" rx="4" fill="#c4ab60" />
      </g>
      <g transform="translate(232 150)">
        <path d="M-18 0 L-22 -46 H22 L18 0 Z" fill={WHITE} opacity="0.85" />
        <path d="M-20 -26 H20 L18 0 H-18 Z" fill="#b0702e" opacity="0.8" />
        <path d="M-4 -46 Q4 -60 14 -56 Q6 -50 -4 -46 Z" fill={GREEN} />
      </g>
    </>
  ),
  "no-alcohol": () => (
    <>
      <Bg fill={BLUSH} />
      <g transform="translate(160 104)">
        <path d="M-20 -40 H20 Q22 -6 0 0 Q-22 -6 -20 -40 Z" fill={WHITE} />
        <path d="M-19 -24 H19 Q18 -6 0 -2 Q-18 -6 -19 -24 Z" fill="#b5445f" />
        <path d="M0 0 V34 M-16 36 H16" stroke={WHITE} strokeWidth="5" strokeLinecap="round" />
      </g>
      <Cross x={160} y={104} r={62} />
    </>
  ),
  clock: () => (
    <>
      <Bg fill={LILAC} />
      <circle cx="160" cy="100" r="64" fill={WHITE} />
      <circle cx="160" cy="100" r="64" fill="none" stroke={PLUM} strokeWidth="8" />
      <path d="M160 100 V60 M160 100 L188 116" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <circle cx="160" cy="100" r="7" fill={ROSE} />
    </>
  ),
  nap: () => (
    <>
      <Bg fill={NIGHT} />
      <circle cx="80" cy="56" r="22" fill={BUTTER} />
      <circle cx="90" cy="50" r="20" fill={NIGHT} />
      <rect x="90" y="110" width="160" height="56" rx="26" fill={LILAC} />
      <circle cx="122" cy="110" r="18" fill={SKIN} />
      <path
        d="M114 108 Q118 112 122 108 M126 108 Q130 112 134 108"
        stroke={INK}
        strokeWidth="2.5"
        fill="none"
      />
      <rect x="140" y="100" width="100" height="40" rx="20" fill={ROSE} />
      <text
        x="200"
        y="76"
        fontSize="26"
        fontWeight="700"
        fill={WHITE}
        fontFamily="Arial, sans-serif"
      >
        z Z z
      </text>
    </>
  ),
  pills: () => (
    <>
      <Bg fill={PEACH} />
      <rect x="96" y="54" width="70" height="104" rx="14" fill={WHITE} />
      <rect x="92" y="40" width="78" height="22" rx="8" fill={ROSE} />
      <rect x="108" y="84" width="46" height="8" rx="4" fill="#e2d6dc" />
      <rect x="108" y="100" width="36" height="8" rx="4" fill="#e2d6dc" />
      <rect
        x="190"
        y="70"
        width="70"
        height="90"
        rx="8"
        fill={WHITE}
        transform="rotate(8 225 115)"
      />
      <path
        d="M202 92 H246 M202 106 H246 M202 120 H232"
        stroke="#e2d6dc"
        strokeWidth="6"
        strokeLinecap="round"
        transform="rotate(8 225 115)"
      />
      <rect
        x="60"
        y="150"
        width="30"
        height="14"
        rx="7"
        fill={LILAC}
        transform="rotate(-20 75 157)"
      />
    </>
  ),
  "phone-off": () => (
    <>
      <Bg fill={LILAC} />
      <rect x="130" y="38" width="60" height="112" rx="12" fill={INK} />
      <rect x="136" y="48" width="48" height="88" rx="6" fill={SKY} />
      <path d="M150 80 Q160 70 170 80" stroke={ROSE} strokeWidth="4" fill="none" />
      <Cross x={160} y={94} r={70} />
    </>
  ),
  seatbelt: () => (
    <>
      <Bg fill={SKY} />
      <rect x="104" y="40" width="112" height="160" rx="30" fill={PLUM} />
      <rect x="132" y="14" width="56" height="34" rx="14" fill={PLUM} />
      <circle cx="160" cy="68" r="22" fill={SKIN} />
      <path d="M138 64 Q140 42 160 42 Q182 42 182 62 Q166 52 138 64 Z" fill={HAIR} />
      <rect x="124" y="92" width="72" height="108" rx="26" fill={LILAC} />
      <path d="M132 96 L190 180" stroke={ROSE} strokeWidth="12" strokeLinecap="round" />
      <path d="M126 168 H194" stroke={ROSE} strokeWidth="12" strokeLinecap="round" />
      <rect x="180" y="160" width="16" height="16" rx="4" fill="#cfc3ca" />
      <Check x={252} y={60} />
    </>
  ),
  "child-seat": () => (
    <>
      <Bg fill={MINT} />
      <path d="M100 176 V70 Q100 44 130 44 H190 Q220 44 220 70 V176 Z" fill={PLUM} />
      <path d="M120 170 V84 Q120 64 140 64 H180 Q200 64 200 84 V170 Z" fill={ROSE} />
      <Person x={160} y={150} shirt={BUTTER} s={0.8} />
      <path
        d="M140 108 L160 128 L180 108"
        stroke={INK}
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  breakdown: () => (
    <>
      <Bg fill={BUTTER} />
      <Road y={140} h={60} />
      <Car x={214} y={164} />
      <g fill={AMBER}>
        <circle cx="252" cy="158" r="6" />
        <circle cx="176" cy="158" r="6" />
      </g>
      <Lines d="M262 146 L272 138 M262 170 L272 178" color={AMBER} />
      <WarningTriangle x={80} y={162} />
      <Person x={290} y={126} shirt={MINT} s={0.8} />
    </>
  ),
  "dashboard-lights": () => (
    <>
      <Bg fill={INK} />
      {[
        [90, RED],
        [160, AMBER],
        [230, "#2e9e4f"],
      ].map(([x, c]) => (
        <g key={String(x)}>
          <circle cx={Number(x)} cy="100" r="34" fill={String(c)} opacity="0.25" />
          <circle cx={Number(x)} cy="100" r="22" fill={String(c)} />
        </g>
      ))}
    </>
  ),
  tyre: () => (
    <>
      <Bg fill={LILAC} />
      <circle cx="140" cy="104" r="66" fill={INK} />
      <circle cx="140" cy="104" r="34" fill="#cbbfc6" />
      <circle cx="140" cy="104" r="10" fill={PLUM} />
      <g stroke="#5a4552" strokeWidth="6">
        <path d="M140 38 V48 M140 160 V170 M74 104 H84 M196 104 H206" />
      </g>
      <g transform="translate(240 120)">
        <circle r="26" fill={WHITE} />
        <path d="M0 0 L10 -14" stroke={ROSE} strokeWidth="4" strokeLinecap="round" />
        <path d="M-26 0 H-60" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      </g>
    </>
  ),
  documents: () => (
    <>
      <Bg fill={PEACH} />
      <rect
        x="70"
        y="60"
        width="120"
        height="80"
        rx="10"
        fill={WHITE}
        transform="rotate(-8 130 100)"
      />
      <rect
        x="110"
        y="70"
        width="120"
        height="80"
        rx="10"
        fill={MINT}
        transform="rotate(4 170 110)"
      />
      <rect x="150" y="84" width="110" height="74" rx="10" fill={WHITE} />
      <rect x="150" y="84" width="110" height="20" rx="9" fill={ROSE} />
      <rect x="162" y="114" width="34" height="34" rx="6" fill={BLUSH} />
      <rect x="204" y="118" width="46" height="7" rx="3.5" fill="#e2d6dc" />
      <rect x="204" y="132" width="34" height="7" rx="3.5" fill="#e2d6dc" />
    </>
  ),
  town: () => (
    <>
      <Bg fill={SKY} />
      <rect x="10" y="50" width="70" height="100" rx="6" fill={PEACH} />
      <rect x="86" y="70" width="60" height="80" rx="6" fill={BLUSH} />
      <rect x="230" y="40" width="80" height="110" rx="6" fill={LILAC} />
      {[
        [24, 66],
        [50, 66],
        [24, 96],
        [50, 96],
        [100, 86],
        [124, 86],
        [244, 56],
        [278, 56],
        [244, 90],
        [278, 90],
      ].map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="16" height="18" rx="3" fill={WHITE} />
      ))}
      <Palm x={188} y={150} />
      <Road y={150} h={50} />
      <Car x={110} y={176} s={0.8} />
      <g transform="translate(250 180)">
        <circle cx="-14" cy="0" r="8" fill={INK} />
        <circle cx="16" cy="0" r="8" fill={INK} />
        <path
          d="M-16 -4 H12 L18 -18"
          stroke={BLUE}
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <Person x={-2} y={-8} shirt={AMBER} s={0.55} />
      </g>
    </>
  ),
  "door-cyclist": () => (
    <>
      <Bg fill={BLUSH} />
      <Road y={140} h={60} dashed={false} />
      <Car x={110} y={166} color={PLUM} />
      <path d="M126 128 L164 112 L164 150 L126 150 Z" fill={PLUM} opacity="0.9" />
      <g transform="translate(232 170)">
        <circle cx="-18" cy="0" r="12" fill="none" stroke={INK} strokeWidth="4" />
        <circle cx="18" cy="0" r="12" fill="none" stroke={INK} strokeWidth="4" />
        <path d="M-18 0 L0 -18 L18 0 M0 -18 V-26" stroke={ROSE} strokeWidth="4" fill="none" />
        <Person x={0} y={-18} shirt={MINT} s={0.7} />
      </g>
      <text x="196" y="88" fontSize="32" fontWeight="700" fill={RED} fontFamily="Arial, sans-serif">
        !
      </text>
    </>
  ),
  horn: () => (
    <>
      <Bg fill={LILAC} />
      <Car x={120} y={130} s={1.3} />
      <Lines
        d="M196 96 Q208 110 196 124 M212 88 Q230 110 212 132 M228 80 Q252 110 228 140"
        color={PLUM}
        w={5}
      />
    </>
  ),
  "parking-good": () => (
    <>
      <Bg fill={MINT} />
      <rect x="40" y="120" width="240" height="80" fill={ROAD} />
      <path d="M60 120 V200 M160 120 V200 M260 120 V200" stroke={WHITE} strokeWidth="4" />
      <Car x={110} y={170} s={0.9} />
      <Check x={210} y={160} />
      <rect x="234" y="40" width="44" height="44" rx="8" fill={BLUE} />
      <text
        x="256"
        y="74"
        textAnchor="middle"
        fontSize="30"
        fontWeight="700"
        fill={WHITE}
        fontFamily="Arial, sans-serif"
      >
        P
      </text>
    </>
  ),
  "double-parking": () => (
    <>
      <Bg fill={BUTTER} />
      <Road y={110} h={90} />
      <Car x={100} y={190} color={PLUM} />
      <Car x={130} y={150} />
      <Cross x={250} y={70} r={30} />
    </>
  ),
  countryside: () => (
    <>
      <Bg fill={SKY} />
      <path d="M0 110 Q60 70 130 100 T260 80 T320 96 V200 H0 Z" fill={GREEN} opacity="0.6" />
      <path
        d="M150 200 Q170 150 220 120 Q250 104 320 100 V116 Q260 120 236 134 Q196 158 190 200 Z"
        fill={ROAD}
      />
      <Car x={210} y={140} s={0.55} />
      <Donkey x={70} y={164} s={0.7} />
      <Sheep x={120} y={176} s={0.7} />
      <Tree x={280} y={70} s={0.8} />
    </>
  ),
  "slow-truck": () => (
    <>
      <Bg fill={PEACH} />
      <Road y={140} h={60} />
      <g transform="translate(210 170)">
        <rect x="-60" y="-56" width="90" height="56" rx="6" fill={PLUM} />
        <path d="M30 -40 H46 Q58 -40 62 -24 V0 H30 Z" fill={BLUE} />
        <circle cx="-38" cy="4" r="10" fill={INK} />
        <circle cx="42" cy="4" r="10" fill={INK} />
      </g>
      <Car x={70} y={172} s={0.85} />
    </>
  ),
  "motorway-merge": () => (
    <>
      <Bg fill={MINT} />
      <rect x="0" y="70" width="320" height="70" fill={ROAD} />
      <path d="M0 105 H320" stroke={WHITE} strokeWidth="3" strokeDasharray="16 12" />
      <path d="M0 200 Q120 170 200 140 L320 140 V150 L206 150 Q130 180 30 200 Z" fill={ROAD} />
      <Car x={230} y={100} color={BLUE} s={0.6} />
      <Car x={110} y={172} s={0.6} />
      <path
        d="M150 160 Q190 146 220 142"
        stroke={ROSE}
        strokeWidth="4"
        strokeDasharray="7 7"
        fill="none"
      />
    </>
  ),
  "no-u-turn": () => (
    <>
      <Bg fill={BLUSH} />
      <path
        d="M190 160 V90 Q190 56 160 56 Q130 56 130 90 V120"
        stroke={INK}
        strokeWidth="14"
        fill="none"
        strokeLinecap="round"
      />
      <polygon points="114,116 146,116 130,144" fill={INK} />
      <Cross x={160} y={100} r={74} />
    </>
  ),
  "safety-barrier": () => (
    <>
      <Bg fill={MINT} />
      <rect x="0" y="120" width="190" height="80" fill={ROAD} />
      <Car x={100} y={160} />
      <path d="M200 110 H320 M200 128 H320" stroke="#a9b3bf" strokeWidth="8" />
      <path d="M214 104 V150 M262 104 V150 M306 104 V150" stroke="#8d97a3" strokeWidth="6" />
      <Person x={248} y={100} shirt={ROSE} s={0.8} />
      <Person x={286} y={100} shirt={BLUE} s={0.7} />
      <Check x={276} y={40} />
    </>
  ),
  pas: () => (
    <>
      <Bg fill={BUTTER} />
      <WarningTriangle x={70} y={100} s={1.5} />
      <g transform="translate(160 100)">
        <rect x="-22" y="-40" width="44" height="80" rx="10" fill={INK} />
        <rect x="-17" y="-32" width="34" height="58" rx="5" fill={SKY} />
        <text
          y="4"
          textAnchor="middle"
          fontSize="18"
          fontWeight="700"
          fill={ROSE}
          fontFamily="Arial, sans-serif"
        >
          15
        </text>
      </g>
      <path
        d="M250 84 C240 70 218 76 226 96 L250 116 L274 96 C282 76 260 70 250 84 Z"
        fill={ROSE}
      />
    </>
  ),
  "first-aid": () => (
    <>
      <Bg fill={BLUSH} />
      <g transform="translate(130 120)">
        <path d="M-50 10 Q-50 -50 0 -50 Q50 -50 50 10 Z" fill={PLUM} />
        <path d="M-40 -6 H30 Q36 -6 36 0 V10 H-40 Z" fill={SKY} />
      </g>
      <Check x={130} y={160} />
      <path
        d="M240 84 C230 70 208 76 216 96 L240 116 L264 96 C272 76 250 70 240 84 Z"
        fill={ROSE}
      />
    </>
  ),
  magnifier: () => (
    <>
      <Bg fill={LILAC} />
      <rect x="50" y="40" width="160" height="110" rx="10" fill={WHITE} />
      <rect x="60" y="50" width="140" height="90" rx="6" fill={SKY} />
      <rect x="60" y="110" width="140" height="30" fill={ROAD} />
      <Car x={110} y={124} s={0.4} />
      <circle cx="210" cy="110" r="38" fill={WHITE} opacity="0.5" stroke={INK} strokeWidth="9" />
      <path d="M238 138 L272 172" stroke={INK} strokeWidth="12" strokeLinecap="round" />
    </>
  ),
  checklist: () => (
    <>
      <Bg fill={MINT} />
      <rect x="90" y="24" width="140" height="160" rx="14" fill={WHITE} />
      {[52, 92, 132].map((y, i) => (
        <g key={y}>
          {i < 2 ? (
            <Check x={118} y={y} />
          ) : (
            <circle cx="118" cy={y} r="13" fill="none" stroke={PLUM} strokeWidth="3" />
          )}
          <rect x="142" y={y - 5} width="70" height="10" rx="5" fill="#e2d6dc" />
        </g>
      ))}
    </>
  ),
  "sleep-night": () => (
    <>
      <Bg fill={NIGHT} />
      <circle cx="250" cy="50" r="22" fill={BUTTER} />
      <circle cx="260" cy="44" r="20" fill={NIGHT} />
      <rect x="50" y="120" width="200" height="40" rx="12" fill={LILAC} />
      <rect x="50" y="104" width="54" height="30" rx="12" fill={WHITE} />
      <rect x="96" y="112" width="150" height="30" rx="14" fill={ROSE} />
      <path d="M50 160 V180 M250 160 V180" stroke={LILAC} strokeWidth="8" strokeLinecap="round" />
      <text
        x="120"
        y="80"
        fontSize="24"
        fontWeight="700"
        fill={WHITE}
        fontFamily="Arial, sans-serif"
      >
        z z
      </text>
    </>
  ),
  agent: () => (
    <>
      <Bg fill={SKY} />
      <Road y={150} h={50} dashed={false} />
      <rect x="130" y="150" width="60" height="10" rx="5" fill={WHITE} />
      <Person x={160} y={150} shirt={BLUE} s={1.5} arm="up" />
      <rect x="146" y="44" width="28" height="10" rx="4" fill={INK} />
    </>
  ),
  "agent-side": () => (
    <>
      <Bg fill={SKY} />
      <Road y={150} h={50} dashed={false} />
      <Person x={160} y={150} shirt={BLUE} s={1.5} arm="side" />
      <rect x="146" y="44" width="28" height="10" rx="4" fill={INK} />
    </>
  ),
  "lane-change": () => (
    <>
      <Bg fill={MINT} />
      <rect x="70" y="0" width="180" height="200" fill={ROAD} />
      <path d="M160 0 V200" stroke={WHITE} strokeWidth="3" strokeDasharray="14 10" />
      <rect x="186" y="120" width="30" height="50" rx="8" fill={ROSE} />
      <rect x="100" y="150" width="30" height="50" rx="8" fill={PLUM} />
      <path
        d="M200 116 Q196 80 130 60"
        stroke={ROSE}
        strokeWidth="4"
        strokeDasharray="7 7"
        fill="none"
      />
      <polygon points="122,56 138,52 134,68" fill={ROSE} />
    </>
  ),
  "eyes-shoulder": () => (
    <>
      <Bg fill={PEACH} />
      <circle cx="150" cy="96" r="44" fill={SKIN} />
      <path d="M106 90 Q110 46 150 46 Q192 46 196 84 Q170 66 106 90 Z" fill={HAIR} />
      <circle cx="172" cy="96" r="5" fill={INK} />
      <path
        d="M196 120 Q240 110 270 80"
        stroke={ROSE}
        strokeWidth="4"
        strokeDasharray="7 7"
        fill="none"
      />
      <polygon points="276,72 262,78 274,90" fill={ROSE} />
      <rect x="110" y="140" width="80" height="50" rx="20" fill={ROSE} />
    </>
  ),
  "exam-day": () => (
    <>
      <Bg fill={BUTTER} />
      <circle cx="80" cy="60" r="26" fill={AMBER} />
      <rect x="140" y="40" width="130" height="120" rx="12" fill={WHITE} />
      <rect x="140" y="40" width="130" height="28" rx="12" fill={ROSE} />
      <text
        x="205"
        y="128"
        textAnchor="middle"
        fontSize="44"
        fontWeight="700"
        fill={PLUM}
        fontFamily="Arial, sans-serif"
      >
        J
      </text>
      <Check x={250} y={150} />
    </>
  ),
  "points-20": () => (
    <>
      <Bg fill={LILAC} />
      <rect x="80" y="50" width="160" height="100" rx="14" fill={WHITE} />
      <text
        x="160"
        y="118"
        textAnchor="middle"
        fontSize="54"
        fontWeight="700"
        fill={ROSE}
        fontFamily="Arial, sans-serif"
      >
        20
      </text>
      <path d="M100 66 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill={AMBER} />
    </>
  ),
  "points-30": () => (
    <>
      <Bg fill={MINT} />
      <rect x="80" y="50" width="160" height="100" rx="14" fill={WHITE} />
      <text
        x="160"
        y="118"
        textAnchor="middle"
        fontSize="54"
        fontWeight="700"
        fill="#2e9e4f"
        fontFamily="Arial, sans-serif"
      >
        30
      </text>
      <path d="M100 66 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill={AMBER} />
      <path d="M216 66 l4 8 9 1 -7 6 2 9 -8 -5 -8 5 2 -9 -7 -6 9 -1 Z" fill={AMBER} />
    </>
  ),
};

export function Scene({ name, size = 300 }: { name: SceneName; size?: number }) {
  const draw = SCENES[name];
  if (!draw) return null;
  return (
    <svg viewBox="0 0 320 200" width="100%" style={{ maxWidth: size }} aria-hidden>
      <defs>
        <clipPath id={`scene-${name}`}>
          <rect width="320" height="200" rx="22" />
        </clipPath>
      </defs>
      <g clipPath={`url(#scene-${name})`}>{draw()}</g>
    </svg>
  );
}
