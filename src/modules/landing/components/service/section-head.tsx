// The one section heading of the service pages: an H2 in the heading-2 style, with an optional
// intro paragraph.
export function SectionHead({
  title,
  intro,
  align = "center",
}: {
  title: string;
  intro?: string;
  align?: "center" | "start";
}) {
  const center = align === "center";
  return (
    <div className={center ? "text-center" : undefined}>
      <h2 data-reveal className="heading-2">
        {title}
      </h2>
      {intro && (
        <p data-reveal className={`mt-4 max-w-[44rem] sm:text-lg${center ? " mx-auto" : ""}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
