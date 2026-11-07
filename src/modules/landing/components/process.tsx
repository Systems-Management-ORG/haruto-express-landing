import { useTranslations } from "next-intl";

type Step = { title: string; body: string };

export function Process() {
  const t = useTranslations("process");
  const steps = t.raw("steps") as Step[];

  return (
    <section id="process" className="section bg-sage">
      <div className="wrap">
        <h2 data-reveal className="heading-2">{t("title")}</h2>
        <ol data-reveal-group className="mt-10 grid gap-8 md:grid-cols-2 md:gap-6 lg:mt-14 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="ruled">
              <span aria-hidden className="font-display text-5xl leading-none text-forest">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl leading-snug text-forest">{step.title}</h3>
              <p className="mt-2">{step.body}</p>
            </li>
          ))}
        </ol>

        <div data-reveal id="cargo-notes" className="mt-12 grid gap-2 border-t border-line pt-5 lg:mt-16 lg:grid-cols-12 lg:gap-6">
          <h3 className="text-xl text-forest lg:col-span-3">{t("notes.title")}</h3>
          <p className="max-w-[48rem] lg:col-span-9">{t("notes.body")}</p>
        </div>
      </div>
    </section>
  );
}
