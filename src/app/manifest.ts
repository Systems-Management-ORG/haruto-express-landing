import type { MetadataRoute } from "next";
import { BUSINESS } from "@/shared/seo/business";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BUSINESS.name,
    short_name: "HARUTO",
    description: "Vận chuyển hàng không hai chiều Việt Nam – Nhật Bản.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8ea",
    theme_color: "#faf8ea",
    icons: [
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
