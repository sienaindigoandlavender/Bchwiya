/** Small flat line icons. 24×24, currentColor, decorative by default. */
type IconProps = { className?: string; size?: number };

function Svg({ size = 22, className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {children}
    </svg>
  );
}

/** A winding road: the learning path. */
export const RoadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 3c0 5 10 4 10 9s-10 4-10 9" />
    <path d="M12 6.5v1M12 11.5v1M12 16.5v1" />
  </Svg>
);

export const ReviewIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 12a8 8 0 1 1-2.4-5.7" />
    <path d="M20 4v4h-4" />
  </Svg>
);

export const ExamIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 21V4" />
    <path d="M5 4h12l-2 4 2 4H5" />
  </Svg>
);

export const CarIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 16v-3l2-5h14l2 5v3z" />
    <circle cx="7.5" cy="16.5" r="1.8" />
    <circle cx="16.5" cy="16.5" r="1.8" />
  </Svg>
);

export const ChevronIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9 6 6 6-6 6" className="rtl:origin-center rtl:-scale-x-100" />
  </Svg>
);

export const BackIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m15 6-6 6 6 6" className="rtl:origin-center rtl:-scale-x-100" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Svg>
);

export const LockIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="5" y="11" width="14" height="10" rx="3" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Svg>
);

export const ChartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 20V10M12 20V4M19 20v-7" />
  </Svg>
);

/** A four-point sparkle, filled. */
export const Sparkle = ({ size = 16, className }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={className}>
    <path
      d="M12 1c.6 5.4 5.6 10.4 11 11-5.4.6-10.4 5.6-11 11-.6-5.4-5.6-10.4-11-11C6.4 11.4 11.4 6.4 12 1z"
      fill="currentColor"
    />
  </svg>
);
