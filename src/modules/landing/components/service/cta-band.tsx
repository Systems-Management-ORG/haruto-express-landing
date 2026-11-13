import Image from "next/image";
import type { ServiceCopy } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ContactCta } from "./contact-cta";

// Closing call to action of every service page, on the deep green band.
export function CtaBand({ copy, config }: { copy: ServiceCopy["cta"]; config: ServicePageConfig["cta"] }) {
  return (
    <section className="section svc-cta text-ivory">
      <div className="wrap text-center">
        <Image src="/logo/haruto-mark.png" alt="" width={92} height={80} className="mx-auto h-14 w-auto" />
        <h2 data-reveal className="heading-2 mx-auto mt-6 max-w-[40rem] text-white">
          {copy.title}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-[40rem] text-ivory/85 sm:text-lg">
          {copy.body}
        </p>
        {copy.note && (
          <p data-reveal className="mx-auto mt-3 max-w-[40rem] text-ivory/75">
            {copy.note}
          </p>
        )}
        <div data-reveal className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ContactCta
            action={config.primary}
            label={config.primary === "zalo" ? copy.primary : undefined}
            variant="gold"
          />
          {config.secondary && <ContactCta action={config.secondary} variant="onDark" />}
        </div>
      </div>
    </section>
  );
}
