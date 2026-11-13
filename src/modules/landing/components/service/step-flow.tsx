import { Info } from "@phosphor-icons/react/dist/ssr";
import type { CSSProperties } from "react";
import type { ServiceCopy } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ItemVisual } from "@/shared/ui/item-visual";

type Steps = NonNullable<ServiceCopy["steps"]>;
type Config = NonNullable<ServicePageConfig["steps"]>;

// Numbered steps joined by a dashed rail: a vertical list on small screens, one row with a column
// per step (--n) on large ones. The optional note sits under the row as a pill.
export function StepFlow({ copy, config }: { copy: Steps; config: Config }) {
  const entries = Object.entries(copy.items);

  return (
    <>
      <ol data-reveal-group className="svc-steps" style={{ "--n": entries.length } as CSSProperties}>
        {entries.map(([id, step], index) => (
          <li key={id} className="svc-step">
            <span className="svc-step__visual">
              <ItemVisual
                visual={config.visuals[id]}
                iconClass="svc-step__icon"
                imageClass="svc-step__img"
                sizes="5rem"
              />
              <span className="svc-step__no" aria-hidden>
                {index + 1}
              </span>
            </span>
            <div className="svc-step__text">
              <h3 className="svc-step__title">{step.title}</h3>
              {step.body && <p className="svc-step__body">{step.body}</p>}
            </div>
          </li>
        ))}
      </ol>
      {copy.note && (
        <p data-reveal className="svc-note">
          <Info size={20} weight="fill" aria-hidden className="shrink-0" />
          {copy.note}
        </p>
      )}
    </>
  );
}
