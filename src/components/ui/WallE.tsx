import Image from "next/image";
import front from "@/assets/wall-e/front.png";
import hello from "@/assets/wall-e/hello.png";
import joy from "@/assets/wall-e/joy.png";
import keysClose from "@/assets/wall-e/keys-close.png";
import side from "@/assets/wall-e/side.png";
import sitCalm from "@/assets/wall-e/sit-calm.png";
import sitCurious from "@/assets/wall-e/sit-curious.png";
import sitGolden from "@/assets/wall-e/sit-golden.png";
import sitProud from "@/assets/wall-e/sit-proud.png";
import threeQuarter from "@/assets/wall-e/three-quarter.png";
import wave from "@/assets/wall-e/wave.png";

/** Every pose, by the moment it is meant for. */
const POSES = {
  front,
  side,
  "three-quarter": threeQuarter,
  hello, // home: waving with the car key
  wave, // holding page
  joy, // passed, lesson done
  "keys-close": keysClose, // Ma voiture
  "sit-curious": sitCurious, // before the mock exam
  "sit-calm": sitCalm, // nothing to review
  "sit-proud": sitProud,
  "sit-golden": sitGolden,
} as const;
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
