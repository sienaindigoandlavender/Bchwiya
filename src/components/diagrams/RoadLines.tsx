export type RoadLinesProps = {
  variant?: "continue" | "discontinue" | "rabattement" | "mixte";
  size?: number;
};

/**
 * A straight stretch of two-way road seen from above, with your car (rose)
 * driving up on the right. The centre line changes with the variant.
 */
export function RoadLines({ variant = "continue", size = 280 }: RoadLinesProps) {
  const center = (() => {
    switch (variant) {
      case "continue":
        return <path d="M100 0 V200" stroke="#fff" strokeWidth="3" />;
      case "discontinue":
        return <path d="M100 0 V200" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />;
      case "mixte":
        return (
          <>
            <path d="M97 0 V200" stroke="#fff" strokeWidth="2.5" />
            <path d="M103 0 V200" stroke="#fff" strokeWidth="2.5" strokeDasharray="14 12" />
          </>
        );
      case "rabattement":
        return (
          <>
            <path d="M100 0 V80" stroke="#fff" strokeWidth="3" />
            <path d="M100 80 V200" stroke="#fff" strokeWidth="3" strokeDasharray="14 12" />
            {[100, 145].map((y) => (
              <g key={y} fill="#fff" stroke="#fff" strokeLinejoin="round">
                <path d={`M100 ${y + 26} L114 ${y + 4}`} strokeWidth="4" strokeLinecap="round" />
                <polygon
                  points={`${118},${y - 2} ${108},${y + 2} ${116},${y + 9}`}
                  strokeWidth="1"
                />
              </g>
            ))}
          </>
        );
    }
  })();
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={(size * 200) / 200}
      role="img"
      aria-label="Lignes au sol"
    >
      <rect width="200" height="200" rx="16" fill="var(--mint)" />
      <rect x="50" y="0" width="100" height="200" fill="#b9aab3" />
      <path d="M54 0 V200 M146 0 V200" stroke="#fff" strokeWidth="2" />
      {center}
      <g transform="translate(125 150)">
        <rect
          x="-8"
          y="-13"
          width="16"
          height="26"
          rx="4"
          fill="var(--rose)"
          stroke="#fff"
          strokeWidth="1"
        />
        <rect x="-6" y="-10" width="12" height="5" rx="1.5" fill="#fff" opacity="0.9" />
      </g>
      <g transform="translate(75 50) rotate(180)">
        <rect
          x="-8"
          y="-13"
          width="16"
          height="26"
          rx="4"
          fill="var(--ink-soft)"
          stroke="#fff"
          strokeWidth="1"
        />
        <rect x="-6" y="-10" width="12" height="5" rx="1.5" fill="#fff" opacity="0.9" />
      </g>
    </svg>
  );
}
