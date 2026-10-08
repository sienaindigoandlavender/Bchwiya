import { SIGN_COLORS } from "@/components/signs/Sign";

export type CarSlot =
  | "entry-n"
  | "entry-e"
  | "entry-s"
  | "entry-w"
  | "ring-n"
  | "ring-ne"
  | "ring-e"
  | "ring-se"
  | "ring-s"
  | "ring-sw"
  | "ring-w"
  | "ring-nw";

export type RoundaboutCar = { slot: CarSlot; who?: "you" | "other" };

export type RoundaboutProps = {
  variant?: "cedez" | "sans-panneau";
  cars?: RoundaboutCar[];
  size?: number;
};

const C = 100; // centre of the 200×200 viewBox
const RING = 45; // radius of the lane cars drive on

// Entry slots sit on the right-hand side of each approach road, pointing inwards.
const ENTRY: Record<string, { x: number; y: number; rot: number }> = {
  "entry-s": { x: 108, y: 172, rot: 0 },
  "entry-n": { x: 92, y: 28, rot: 180 },
  "entry-e": { x: 172, y: 92, rot: -90 },
  "entry-w": { x: 28, y: 108, rot: 90 },
};

// Ring slots by screen angle. Anticlockwise travel → rotation equals the angle.
const RING_ANGLE: Record<string, number> = {
  "ring-e": 0,
  "ring-se": 45,
  "ring-s": 90,
  "ring-sw": 135,
  "ring-w": 180,
  "ring-nw": 225,
  "ring-n": 270,
  "ring-ne": 315,
};

function slotPose(slot: CarSlot) {
  const entry = ENTRY[slot];
  if (entry) return entry;
  const deg = RING_ANGLE[slot] ?? 0;
  const a = (deg * Math.PI) / 180;
  return { x: C + RING * Math.cos(a), y: C + RING * Math.sin(a), rot: deg };
}

function Car({ slot, who = "other" }: RoundaboutCar) {
  const { x, y, rot } = slotPose(slot);
  const fill = who === "you" ? "var(--accent)" : "#8c8c8c";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x="-6" y="-10" width="12" height="20" rx="3" fill={fill} stroke="#fff" strokeWidth="1" />
      {/* windscreen marks the front */}
      <rect x="-4.5" y="-7" width="9" height="4" rx="1" fill="#fff" opacity="0.85" />
    </g>
  );
}

function YieldMark({ x, y, rot }: { x: number; y: number; rot: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <polygon points="-6,-5 6,-5 0,6" fill="#fff" stroke={SIGN_COLORS.red} strokeWidth="2" strokeLinejoin="round" />
    </g>
  );
}

/** Top-down roundabout with four arms. Placeholder art: will be redesigned. */
export function Roundabout({ variant = "sans-panneau", cars = [], size = 260 }: RoundaboutProps) {
  const road = "#9a978f";
  return (
    <svg viewBox="0 0 200 200" width={size} height={size} role="img" aria-label="Giratoire">
      <rect width="200" height="200" fill="#dfe8d6" />
      {/* arms */}
      <rect x="84" y="0" width="32" height="200" fill={road} />
      <rect x="0" y="84" width="200" height="32" fill={road} />
      {/* ring */}
      <circle cx={C} cy={C} r="60" fill={road} />
      <circle cx={C} cy={C} r={RING} fill="none" stroke="#fff" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.6" />
      <circle cx={C} cy={C} r="30" fill="#b9cfa6" stroke="#fff" strokeWidth="2" />
      {/* centre lines on the arms */}
      {[
        [100, 0, 100, 40],
        [100, 160, 100, 200],
        [0, 100, 40, 100],
        [160, 100, 200, 100],
      ].map(([x1, y1, x2, y2], i) => (
        <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1.2" strokeDasharray="5 4" />
      ))}
      {variant === "cedez" ? (
        <>
          <YieldMark x={124} y={150} rot={0} />
          <YieldMark x={76} y={50} rot={0} />
          <YieldMark x={150} y={76} rot={0} />
          <YieldMark x={50} y={124} rot={0} />
        </>
      ) : null}
      {cars.map((car, i) => (
        <Car key={i} {...car} />
      ))}
    </svg>
  );
}
