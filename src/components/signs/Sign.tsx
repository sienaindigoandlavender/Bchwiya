import type { ReactNode } from "react";
import type { SignPreset } from "@/components/diagrams/names";

export type SignShape = "triangle" | "circle" | "octagon" | "square" | "inverted-triangle";

export type SignProps = {
  shape: SignShape;
  fill?: string;
  border?: string;
  /** Pictogram drawn inside a 100×100 viewBox. */
  children?: ReactNode;
  title?: string;
  size?: number;
};

export const SIGN_COLORS = {
  red: "#c1272d",
  blue: "#1f5fa8",
  white: "#ffffff",
  black: "#1d1d1b",
} as const;

function octagonPoints(cx: number, cy: number, r: number) {
  return Array.from({ length: 8 }, (_, i) => {
    const a = ((22.5 + i * 45) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/** Generic road sign renderer: outer shape with border, plus a pictogram slot. */
export function Sign({
  shape,
  fill = SIGN_COLORS.white,
  border,
  children,
  title,
  size = 160,
}: SignProps) {
  const stroke = border ?? "none";
  const sw = border ? 9 : 0;
  let outline: ReactNode;
  switch (shape) {
    case "triangle":
      outline = (
        <polygon
          points="50,8 95,88 5,88"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
      break;
    case "inverted-triangle":
      outline = (
        <polygon
          points="5,12 95,12 50,92"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      );
      break;
    case "circle":
      outline = <circle cx="50" cy="50" r="44" fill={fill} stroke={stroke} strokeWidth={sw} />;
      break;
    case "octagon":
      outline = (
        <polygon points={octagonPoints(50, 50, 46)} fill={fill} stroke={stroke} strokeWidth={sw} />
      );
      break;
    case "square":
      outline = (
        <rect
          x="6"
          y="6"
          width="88"
          height="88"
          rx="8"
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
      break;
  }
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} role="img" aria-label={title}>
      {title ? <title>{title}</title> : null}
      {outline}
      {children}
    </svg>
  );
}

/** Three arrows turning around a centre, anticlockwise (right-hand traffic). */
export function RoundaboutArrows({
  cx,
  cy,
  r,
  color,
  width,
}: {
  cx: number;
  cy: number;
  r: number;
  color: string;
  width: number;
}) {
  // Rounded so server and client render identical attribute strings.
  const n = (v: number) => Math.round(v * 100) / 100;
  const p = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return [n(cx + r * Math.cos(a)), n(cy + r * Math.sin(a))] as const;
  };
  return (
    <g fill={color} stroke={color}>
      {[0, 120, 240].map((base) => {
        const from = base + 100;
        const to = base + 15;
        const [x1, y1] = p(from);
        const [x0, y0] = p(to);
        const a = (to * Math.PI) / 180;
        // Direction of travel when the angle decreases (anticlockwise on screen).
        const dx = Math.sin(a);
        const dy = -Math.cos(a);
        const nx = Math.cos(a);
        const ny = Math.sin(a);
        const head = width * 1.6;
        const tip = `${n(x0 + dx * head * 1.4)},${n(y0 + dy * head * 1.4)}`;
        const b1 = `${n(x0 + nx * head)},${n(y0 + ny * head)}`;
        const b2 = `${n(x0 - nx * head)},${n(y0 - ny * head)}`;
        return (
          <g key={base}>
            <path
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 0 ${x0} ${y0}`}
              fill="none"
              strokeWidth={width}
            />
            <polygon points={`${tip} ${b1} ${b2}`} stroke="none" />
          </g>
        );
      })}
    </g>
  );
}

const PRESETS: Record<SignPreset, { title: string; render: (size?: number) => ReactNode }> = {
  "cedez-le-passage": {
    title: "Cédez le passage",
    render: (size) => (
      <Sign
        shape="inverted-triangle"
        border={SIGN_COLORS.red}
        title="Cédez le passage"
        size={size}
      />
    ),
  },
  stop: {
    title: "Stop",
    render: (size) => (
      <Sign shape="octagon" fill={SIGN_COLORS.red} title="Stop" size={size}>
        <polygon
          points={octagonPoints(50, 50, 41)}
          fill="none"
          stroke={SIGN_COLORS.white}
          strokeWidth="2.5"
        />
        <text
          x="50"
          y="58"
          textAnchor="middle"
          fontSize="24"
          fontWeight="700"
          fill={SIGN_COLORS.white}
          fontFamily="Arial, sans-serif"
        >
          STOP
        </text>
      </Sign>
    ),
  },
  "sens-giratoire-obligatoire": {
    title: "Sens giratoire obligatoire",
    render: (size) => (
      <Sign shape="circle" fill={SIGN_COLORS.blue} title="Sens giratoire obligatoire" size={size}>
        <RoundaboutArrows cx={50} cy={50} r={24} color={SIGN_COLORS.white} width={6} />
      </Sign>
    ),
  },
  "giratoire-danger": {
    title: "Carrefour à sens giratoire",
    render: (size) => (
      <Sign
        shape="triangle"
        border={SIGN_COLORS.red}
        title="Carrefour à sens giratoire"
        size={size}
      >
        <RoundaboutArrows cx={50} cy={62} r={13} color={SIGN_COLORS.black} width={3.5} />
      </Sign>
    ),
  },
};

export function PresetSign({ preset, size }: { preset: SignPreset; size?: number }) {
  return <>{PRESETS[preset].render(size)}</>;
}
