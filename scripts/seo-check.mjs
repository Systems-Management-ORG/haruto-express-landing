// SEO QA crawler: builds the site, starts `next start`, crawls every URL in the sitemap,
// and checks status, headings, title/description length, canonical, hreflang symmetry,
// JSON-LD validity, and internal links for 404s.
//
// Usage:
//   node scripts/seo-check.mjs            # full: build + start + crawl
//   SEO_CHECK_SKIP_BUILD=1 node ...       # reuse the existing .next build (faster iteration)
//   SEO_CHECK_PORT=4123 node ...          # override the local port

import { spawn } from "node:child_process";
import { once } from "node:events";

const PORT = Number(process.env.SEO_CHECK_PORT ?? 4123);
const BASE = `http://localhost:${PORT}`;
const NEXT_BIN = "node_modules/next/dist/bin/next";

const TITLE_MAX = 60;
const TITLE_MIN = 10;
const DESC_MAX = 160;
const DESC_MIN = 50;
const DESC_IDEAL_MIN = 140;

const errors = [];
const warnings = [];
const fail = (url, message) => errors.push(`${url} — ${message}`);
const warn = (url, message) => warnings.push(`${url} — ${message}`);

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    child.on("error", reject);
  });
}

async function waitForServer(timeoutMs = 90_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/sitemap.xml`);
      if (res.ok) return;
    } catch {
      // server not up yet
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error("Server did not become ready in time");
}

const pathOf = (href) => {
  try {
    return new URL(href, BASE).pathname.replace(/\/$/, "") || "/";
  } catch {
    return null;
  }
};
const local = (pathname) => `${BASE}${pathname}`;

async function getSitemapPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`sitemap.xml returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => pathOf(m[1]));
  return [...new Set(locs.filter(Boolean))];
}

function extractAll(regex, html) {
  return [...html.matchAll(regex)];
}

function attr(tag, name) {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"));
  return m ? m[1] : null;
}

async function crawl() {
  const paths = await getSitemapPaths();
  console.log(`\nSitemap URLs (${paths.length}): ${paths.join(", ")}\n`);
  if (paths.length === 0) fail("sitemap.xml", "no URLs found");

  const pages = new Map();
  const linkStatusCache = new Map();

  for (const pathname of paths) {
    const url = local(pathname);
    let res;
    try {
      res = await fetch(url);
    } catch (err) {
      fail(pathname, `fetch failed: ${err.message}`);
      continue;
    }
    if (res.status !== 200) fail(pathname, `status ${res.status} (expected 200)`);
    const html = await res.text();
    pages.set(pathname, html);

    // Exactly one H1.
    const h1s = extractAll(/<h1[\s>]/gi, html);
    if (h1s.length !== 1) fail(pathname, `found ${h1s.length} <h1> (expected 1)`);

    // Glued H1: a heading built from several elements must keep whitespace between them, or its
    // text (what search engines and the Service schema read) runs words together ("NhậtBản").
    // Case is compared with Unicode properties: a literal [a-zà-ỹ][A-ZÀ-Ỹ] range also spans
    // Vietnamese lowercase letters (U+00E0–U+1EF9 mixes both cases) and would flag every H1.
    const h1Html = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] ?? "";
    if (/<\/[a-z][a-z0-9]*>(?:<!--[\s\S]*?-->)*<[a-z]/i.test(h1Html))
      fail(pathname, "H1 child elements with no whitespace between them");
    const h1Text = h1Html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'");
    const glued = h1Text.match(/\p{Ll}\p{Lu}/u);
    if (glued) fail(pathname, `H1 text looks glued at "${glued[0]}": "${h1Text.trim()}"`);

    // Heading order inside <main>: an H3 needs an H2 somewhere before it, an H4 an H3, and so on
    // (e.g. a section that renders its card titles as H3 with no H2 above them).
    const mainHtml = html.match(/<main[\s\S]*<\/main>/i)?.[0] ?? "";
    const seenLevels = new Set();
    for (const heading of mainHtml.matchAll(/<h([1-6])[\s>]/gi)) {
      const level = Number(heading[1]);
      if (level >= 3 && !seenLevels.has(level - 1)) {
        fail(pathname, `heading order: <h${level}> before any <h${level - 1}> in <main>`);
        break;
      }
      seenLevels.add(level);
    }

    // Title length.
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    if (!title) fail(pathname, "missing <title>");
    else if (title.length > TITLE_MAX || title.length < TITLE_MIN)
      fail(pathname, `title length ${title.length} (want ${TITLE_MIN}-${TITLE_MAX}): "${title}"`);

    // Meta description length.
    const descTag = extractAll(/<meta[^>]+>/gi, html).find(
      (m) => /name\s*=\s*"description"/i.test(m[0]),
    );
    const desc = descTag ? attr(descTag[0], "content") ?? "" : "";
    if (!desc) fail(pathname, "missing meta description");
    else if (desc.length > DESC_MAX || desc.length < DESC_MIN)
      fail(pathname, `description length ${desc.length} (want ${DESC_MIN}-${DESC_MAX})`);
    else if (desc.length < DESC_IDEAL_MIN)
      warn(pathname, `description length ${desc.length} (ideal ${DESC_IDEAL_MIN}-${DESC_MAX})`);

    // Canonical self-reference.
    const links = extractAll(/<link[^>]+>/gi, html).map((m) => m[0]);
    const canonicalTag = links.find((l) => /rel\s*=\s*"canonical"/i.test(l));
    const canonical = canonicalTag ? pathOf(attr(canonicalTag, "href")) : null;
    if (!canonical) fail(pathname, "missing canonical");
    else if (canonical !== pathname) fail(pathname, `canonical points to ${canonical}, not self`);

    // Collect hreflang alternates.
    const hreflangs = {};
    for (const l of links) {
      if (!/rel\s*=\s*"alternate"/i.test(l) || !/hreflang/i.test(l)) continue;
      const lang = attr(l, "hreflang");
      const href = pathOf(attr(l, "href"));
      if (lang && href) hreflangs[lang.toLowerCase()] = href;
    }
    pages.set(`${pathname}::hreflang`, hreflangs);

    // JSON-LD must parse.
    const ldBlocks = extractAll(
      /<script[^>]+type\s*=\s*"application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
      html,
    );
    if (ldBlocks.length === 0) warn(pathname, "no JSON-LD found");
    for (const block of ldBlocks) {
      try {
        JSON.parse(block[1]);
      } catch (err) {
        fail(pathname, `invalid JSON-LD: ${err.message}`);
      }
    }

    // Internal links must not 404.
    const hrefs = extractAll(/<a\b[^>]*href\s*=\s*"([^"]+)"/gi, html).map((m) => m[1]);
    for (const href of hrefs) {
      if (/^(mailto:|tel:|#)/i.test(href)) continue;
      const p = pathOf(href);
      if (!p) continue;
      const isInternal = href.startsWith("/") || href.startsWith(BASE) || href.includes("harutoexpress.com");
      if (!isInternal) continue;
      if (!linkStatusCache.has(p)) {
        try {
          const r = await fetch(local(p), { redirect: "manual" });
          linkStatusCache.set(p, r.status);
        } catch {
          linkStatusCache.set(p, 0);
        }
      }
      const status = linkStatusCache.get(p);
      if (status === 404 || status === 0) fail(pathname, `internal link ${p} returned ${status}`);
    }
  }

  // hreflang symmetry: every page advertises all locales + x-default, and each target is reachable.
  const expected = new Set();
  for (const pathname of paths) {
    const map = pages.get(`${pathname}::hreflang`) ?? {};
    Object.keys(map).forEach((lang) => expected.add(lang));
  }
  for (const pathname of paths) {
    const map = pages.get(`${pathname}::hreflang`) ?? {};
    for (const lang of expected) {
      if (!map[lang]) fail(pathname, `missing hreflang "${lang}"`);
    }
    for (const [lang, target] of Object.entries(map)) {
      if (!linkStatusCache.has(target)) {
        try {
          const r = await fetch(local(target), { redirect: "manual" });
          linkStatusCache.set(target, r.status);
        } catch {
          linkStatusCache.set(target, 0);
        }
      }
      const status = linkStatusCache.get(target);
      if (status !== 200) fail(pathname, `hreflang "${lang}" → ${target} returned ${status}`);
      // Reciprocity: the target page must point back to this page for its own locale.
      if (lang !== "x-default" && target !== pathname) {
        const targetMap = pages.get(`${target}::hreflang`);
        if (targetMap && !Object.values(targetMap).includes(pathname))
          fail(pathname, `hreflang "${lang}" → ${target} does not link back (not symmetric)`);
      }
    }
  }
}

async function main() {
  if (!process.env.SEO_CHECK_SKIP_BUILD) {
    console.log("▶ Building…");
    await run("node", [NEXT_BIN, "build"]);
  } else {
    console.log("▶ Skipping build (SEO_CHECK_SKIP_BUILD set)");
  }

  console.log(`▶ Starting next start on :${PORT}…`);
  const server = spawn("node", [NEXT_BIN, "start", "-p", String(PORT)], { stdio: "ignore" });
  const cleanup = () => {
    if (!server.killed) server.kill();
  };
  process.on("exit", cleanup);

  try {
    await waitForServer();
    await crawl();
  } finally {
    cleanup();
    // Give the process a tick to release the port.
    await Promise.race([once(server, "exit"), new Promise((r) => setTimeout(r, 2000))]);
  }

  console.log("\n─────────── SEO CHECK ───────────");
  if (warnings.length) {
    console.log(`\n⚠ ${warnings.length} warning(s):`);
    warnings.forEach((w) => console.log(`  • ${w}`));
  }
  if (errors.length) {
    console.log(`\n✖ ${errors.length} error(s):`);
    errors.forEach((e) => console.log(`  • ${e}`));
    console.log("");
    process.exitCode = 1;
  } else {
    console.log("\n✓ All checks passed.\n");
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
