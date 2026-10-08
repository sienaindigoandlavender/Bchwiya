/**
 * Zahra's little car: a flat, round, pink side-view car. Purely decorative.
 * `facing="up"` turns it to drive up the path on the home page.
 */
export function LittleCar({
  size = 120,
  body = "var(--rose)",
  className,
}: {
  size?: number;
  body?: string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={(size * 64) / 120}
      viewBox="0 0 120 64"
      aria-hidden
      className={className}
    >
      {/* roof */}
      <path d="M30 26c4-12 12-18 28-18h8c12 0 20 6 26 18z" fill={body} />
      {/* windows */}
      <path d="M38 25c3-8 9-12 19-12h3v12z" fill="#fff" />
      <path d="M65 13h2c9 0 15 4 19 12H65z" fill="#fff" />
      {/* body */}
      <rect x="8" y="24" width="104" height="26" rx="13" fill={body} />
      {/* headlight + tail light */}
      <circle cx="105" cy="33" r="3.5" fill="var(--butter)" />
      <rect x="10" y="30" width="5" height="6" rx="2.5" fill="var(--blush)" />
      {/* door line + handle */}
      <path d="M62 27v19" stroke="#fff" strokeOpacity="0.35" strokeWidth="2" />
      <rect x="66" y="31" width="7" height="2.5" rx="1.25" fill="#fff" fillOpacity="0.6" />
      {/* wheels */}
      <circle cx="32" cy="50" r="11" fill="var(--ink)" />
      <circle cx="32" cy="50" r="4.5" fill="var(--blush)" />
      <circle cx="88" cy="50" r="11" fill="var(--ink)" />
      <circle cx="88" cy="50" r="4.5" fill="var(--blush)" />
    </svg>
  );
}
