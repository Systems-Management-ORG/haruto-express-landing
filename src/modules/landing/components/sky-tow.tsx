import Image from "next/image";
import { FlagCanvas } from "./flag-canvas";

// A Haruto plane towing a "HARUTO EXPRESS" banner, in the strip between the hero and the next
// section. The strip takes the screen height the hero leaves, so hero + strip fill the screen.
// Both pictures are rendered from the Blender scene with the same camera; the boxes below are
// where each one sits inside the shared frame (percent of a 4146 x 614 px frame).
// The banner waves on a canvas (see FlagCanvas).
const PLANE_BOX = { left: 47.805, top: 0, width: 52.195, height: 100 };
const FLAG_BOX = { left: 0.024, top: 49.511, width: 47.829, height: 47.72 };

const box = (b: typeof PLANE_BOX) => ({
  left: `${b.left}%`,
  top: `${b.top}%`,
  width: `${b.width}%`,
  height: `${b.height}%`,
});

export function SkyTow() {
  return (
    <div className="sky-tow" aria-hidden>
      <div className="sky-tow__stage">
        <div className="sky-tow__flag" style={box(FLAG_BOX)}>
          <FlagCanvas />
        </div>
        <div className="sky-tow__plane" style={box(PLANE_BOX)}>
          <Image
            src="/images/haruto/sky-banner/may-bay-keo-co-canh-xanh.webp"
            alt=""
            fill
            sizes="(min-width: 64rem) 50vw, 55vw"
            quality={90}
            // decoration: never compete with the hero picture (the page's LCP) for bandwidth
            fetchPriority="low"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
