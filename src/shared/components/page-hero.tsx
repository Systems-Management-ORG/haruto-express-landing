import Image from "next/image";
import { useTranslations } from "next-intl";
import { PAGE_IMAGES } from "@/shared/seo/page-media";
import type { PageKey } from "@/shared/seo/pages";
import { Breadcrumbs } from "./breadcrumbs";

// Static hero for a subpage: breadcrumb + the single H1 + a short intro, with the page's topical
// image beside it (below it on small screens). No carousel.
export function PageHero({ page }: { page: Exclude<PageKey, "home"> }) {
  const t = useTranslations(`pages.${page}`);
  const image = PAGE_IMAGES[page];

  return (
    <section className="page-hero">
      <div className="wrap grid items-center gap-8 py-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-14 lg:py-16">
        <div>
          <Breadcrumbs page={page} />
          <h1 className="heading-1 mt-4 max-w-[22ch] text-forest">{t("title")}</h1>
          <p className="mt-5 max-w-[40rem] text-base leading-[1.6] sm:text-lg">{t("intro")}</p>
        </div>
        <div className="page-hero__frame">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 45vw"
            className="object-cover"
            style={{ objectPosition: image.position ?? "50% 50%" }}
          />
        </div>
      </div>
    </section>
  );
}
