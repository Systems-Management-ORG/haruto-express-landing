import Image from "next/image";
import type { Visual } from "../../service-pages";

// An item's picture: a Phosphor icon in a round badge, or one of HARUTO's small artwork images.
// Always decorative (the item title carries the meaning). Never `priority`: only the hero art is.
export function ItemVisual({
  visual,
  iconClass,
  imageClass,
  iconSize = 30,
  sizes,
}: {
  visual: Visual | undefined;
  iconClass: string;
  imageClass: string;
  iconSize?: number;
  sizes: string;
}) {
  if (!visual) return null;
  if ("Icon" in visual) {
    const { Icon } = visual;
    return (
      <span className={iconClass} aria-hidden>
        <Icon size={iconSize} weight="duotone" />
      </span>
    );
  }
  return <Image src={visual.src} alt="" width={visual.width} height={visual.height} sizes={sizes} className={imageClass} />;
}
