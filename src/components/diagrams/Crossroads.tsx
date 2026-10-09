import { SIGN_COLORS } from "@/components/signs/Sign";

export type Arm = "n" | "e" | "s" | "w";
export type CrossroadsProps = {
  cars?: { arm: Arm; who?: "you" | "other" }[];
  signs?: { arm: Arm; type: "stop" | "cedez" }[];
  size?: number;
};

// Each car waits on the right-hand lane of its arm, facing the centre.
const CAR: Record<Arm, { x: number; y: number; rot: number }> = {
  s: { x: 108, y: 150, rot: 0 },
  n: { x: 92, y: 50, rot: 180 },
  e: { x: 150, y: 92, rot: -90 },
  w: { x: 50, y: 108, rot: 90 },
};
// Signs stand on the right-hand verge, just before the junction.
const SIGN: Record<Arm, { x: number; y: number }> = {
  s: { x: 132, y: 140 },
  n: { x: 68, y: 60 },
  e: { x: 140, y: 68 },
  w: { x: 60, y: 132 },
};

function Car({ arm, who = "other" }: { arm: Arm; who?: "you" | "other" }) {
  const { x, y, rot } = CAR[arm];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect
        x="-7"
        y="-11"
        width="14"
        height="22"
        rx="4"
        fill={who === "you" ? "var(--rose)" : "var(--ink-soft)"}
        stroke="#fff"
        strokeWidth="1"
      />
      <rect x="-5" y="-8" width="10" height="4.5" rx="1.5" fill="#fff" opacity="0.9" />
    </g>
  );
}

function MiniSign({ arm, type }: { arm: Arm; type: "stop" | "cedez" }) {
  const { x, y } = SIGN[arm];
  return (
    <g transform={`translate(${x} ${y})`}>
      {type === "stop" ? (
        <>
          <polygon
            points="-4,-10 4,-10 10,-4 10,4 4,10 -4,10 -10,4 -10,-4"
            fill={SIGN_COLORS.red}
            stroke="#fff"
            strokeWidth="1.2"
          />
          <text
            x="0"
            y="3"
            textAnchor="middle"
            fontSize="6"
            fontWeight="700"
            fill="#fff"
            fontFamily="Arial, sans-serif"
          >
            STOP
          </text>
        </>
      ) : (
        <polygon
          points="-10,-8 10,-8 0,10"
          fill="#fff"
          stroke={SIGN_COLORS.red}
          strokeWidth="3"
          strokeLinejoin="round"
        />
      )}
    </g>
  );
}

/** A four-way junction seen from above. Your car is rose, the others plum. */
export function Crossroads({ cars = [], signs = [], size = 260 }: CrossroadsProps) {
  const road = "#b9aab3";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Carrefour">
      <rect width="200" height="200" rx="16" fill="var(--mint)" />
      <rect x="80" y="0" width="40" height="200" fill={road} />
      <rect x="0" y="80" width="200" height="40" fill={road} />
      <g stroke="#fff" strokeWidth="1.4" strokeDasharray="6 5">
        <path d="M100 0 V76 M100 124 V200 M0 100 H76 M124 100 H200" />
      </g>
      {signs.map((s, i) => (
        <MiniSign key={i} {...s} />
      ))}
      {cars.map((c, i) => (
        <Car key={i} {...c} />
      ))}
    </svg>
  );
}
