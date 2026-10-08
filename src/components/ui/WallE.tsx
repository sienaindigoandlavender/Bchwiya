import Image from "next/image";
import front from "@/assets/wall-e/front.png";
import side from "@/assets/wall-e/side.png";
import threeQuarter from "@/assets/wall-e/three-quarter.png";

const POSES = { front, side, "three-quarter": threeQuarter } as const;
export type WallEPose = keyof typeof POSES;

/** Wall-E, Zahra's guide: the riad's young ginger cat. Decorative only. */
export function WallE({
  pose = "front",
  height = 260,
  className,
  priority,
}: {
  pose?: WallEPose;
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const img = POSES[pose];
  const width = Math.round((img.width / img.height) * height);
  return (
    <Image
      src={img}
      alt=""
      width={width}
      height={height}
      priority={priority}
      className={className}
      sizes={`${width}px`}
    />
  );
}
