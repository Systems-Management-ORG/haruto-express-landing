// Keeps the visitor's place when they switch language. The page is rebuilt in the new language,
// and the text is longer or shorter there, so a plain scroll offset would land somewhere else.
// Instead we note which block of the page sits under the top of the screen and how far into it
// the reader is, then scroll to the same point of the same block. Every language renders the same
// blocks in the same order, so the block's index matches across languages.

const KEY = "haruto:reading-spot";
const LINE = 96; // px from the top of the screen, just under the sticky header

type Spot = { path: string; index: number; ratio: number; count: number; y: number };

const blocks = () => Array.from(document.querySelectorAll<HTMLElement>("main section, main > *"));

export function rememberReadingSpot(targetPath: string) {
  if (window.scrollY < 1) return; // at the top already: the new page opens there anyway
  const list = blocks();
  let index = -1;
  let ratio = 0;
  list.forEach((el, i) => {
    const r = el.getBoundingClientRect();
    // the last match is the innermost block under the line
    if (r.height > 0 && r.top <= LINE && r.bottom > LINE) {
      index = i;
      ratio = (LINE - r.top) / r.height;
    }
  });
  const spot: Spot = { path: targetPath, index, ratio, count: list.length, y: window.scrollY };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(spot));
  } catch {
    // storage unavailable (private mode, blocked): the new page just opens at the top
  }
}

export function restoreReadingSpot(pathname: string) {
  let spot: Spot | null = null;
  try {
    const raw = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    spot = raw ? (JSON.parse(raw) as Spot) : null;
  } catch {
    return;
  }
  if (!spot || spot.path !== pathname) return;
  const target = spot;

  const apply = () => {
    const list = blocks();
    const el = target.index >= 0 && list.length === target.count ? list[target.index] : null;
    const y = el ? el.getBoundingClientRect().top + window.scrollY + target.ratio * el.offsetHeight - LINE : target.y;
    window.scrollTo({ top: Math.max(0, y), behavior: "instant" });
  };
  // after the new page has laid out, and once more when late images or fonts have settled
  requestAnimationFrame(() => requestAnimationFrame(apply));
  const timer = window.setTimeout(apply, 400);
  return () => window.clearTimeout(timer);
}
