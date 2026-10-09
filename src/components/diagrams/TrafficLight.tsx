export type TrafficLightProps = {
  state?: "rouge" | "orange" | "vert" | "orange-clignotant" | "eteint";
  size?: number;
};

const ON = { rouge: "#e0312b", orange: "#f39200", vert: "#2e9e4f" } as const;
const OFF = "#4a3a44";

/** A three-lamp traffic light. "orange-clignotant" shows the amber lamp with flash marks. */
export function TrafficLight({ state = "rouge", size = 200 }: TrafficLightProps) {
  const lit = (lamp: keyof typeof ON) =>
    state === lamp || (lamp === "orange" && state === "orange-clignotant") ? ON[lamp] : OFF;
  const flashing = state === "orange-clignotant";
  return (
    <svg
      viewBox="0 0 120 200"
      width={(size * 120) / 200}
      height={size}
      role="img"
      aria-label="Feu de circulation"
    >
      <rect x="30" y="10" width="60" height="160" rx="18" fill="var(--ink)" />
      <rect x="56" y="170" width="8" height="26" fill="var(--ink)" />
      <circle cx="60" cy="42" r="17" fill={lit("rouge")} />
      <circle cx="60" cy="90" r="17" fill={lit("orange")} />
      <circle cx="60" cy="138" r="17" fill={lit("vert")} />
      {flashing ? (
        <g stroke="#f39200" strokeWidth="4" strokeLinecap="round">
          <path d="M14 90 H22 M98 90 H106 M18 72 L25 77 M102 72 L95 77 M18 108 L25 103 M102 108 L95 103" />
        </g>
      ) : null}
    </svg>
  );
}
