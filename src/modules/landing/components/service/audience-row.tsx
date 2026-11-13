import type { ServiceCopy } from "../../service-copy";
import type { ServicePageConfig } from "../../service-pages";
import { ItemVisual } from "./visual";

type Audience = NonNullable<ServiceCopy["audience"]>;
type Config = NonNullable<ServicePageConfig["audience"]>;

// Who the service is for: one ruled panel, two columns on small screens, four on large ones.
export function AudienceRow({ copy, config }: { copy: Audience; config: Config }) {
  return (
    <ul data-reveal-group className="svc-audience">
      {Object.entries(copy.items).map(([id, item]) => (
        <li key={id} className="svc-audience__item">
          <ItemVisual
            visual={config.visuals[id]}
            iconClass="svc-audience__icon"
            imageClass="svc-audience__img"
            iconSize={44}
            sizes="5rem"
          />
          <h3 className="svc-audience__title">{item.title}</h3>
          {item.body && <p className="mt-1 text-sm text-muted">{item.body}</p>}
        </li>
      ))}
    </ul>
  );
}
