import Image from "next/image";
import { type CtaAction, ContactCta } from "./contact-cta";

// Closing call to action of the service and info pages, on the deep green band. `primaryLabel`
// is a page's own wording for its Zalo button.
export function CtaBand({
  title,
  body,
  note,
  primary,
  secondary,
  primaryLabel,
}: {
  title: string;
  body: string;
  note?: string;
  primary: CtaAction;
  secondary?: CtaAction;
  primaryLabel?: string;
}) {
  return (
    <section className="section svc-cta text-ivory">
      <div className="wrap text-center">
        <Image src="/logo/haruto-mark.png" alt="" width={92} height={80} className="mx-auto h-14 w-auto" />
        <h2 data-reveal className="heading-2 mx-auto mt-6 max-w-[40rem] text-white">
          {title}
        </h2>
        <p data-reveal className="mx-auto mt-4 max-w-[40rem] text-ivory/85 sm:text-lg">
          {body}
        </p>
        {note && (
          <p data-reveal className="mx-auto mt-3 max-w-[40rem] text-ivory/75">
            {note}
          </p>
        )}
        <div data-reveal className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ContactCta action={primary} label={primary === "zalo" ? primaryLabel : undefined} variant="gold" />
          {secondary && <ContactCta action={secondary} variant="onDark" />}
        </div>
      </div>
    </section>
  );
}
