// The one section heading of the service and info pages: an H2 in the heading-2 style, with an
// optional intro paragraph. `tone="dark"` is for headings on the deep green bands.
export function SectionHead({
  title,
  intro,
  align = "center",
  tone = "light",
}: {
  title: string;
  intro?: string;
  align?: "center" | "start";
  tone?: "light" | "dark";
}) {
  const center = align === "center";
  const dark = tone === "dark";
  return (
    <div className={center ? "text-center" : undefined}>
      <h2 data-reveal className={dark ? "heading-2 text-white" : "heading-2"}>
        {title}
      </h2>
      {intro && (
        <p
          data-reveal
          className={`mt-4 max-w-[44rem] sm:text-lg${center ? " mx-auto" : ""}${dark ? " text-ivory/85" : ""}`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
