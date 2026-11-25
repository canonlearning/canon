// The page for one lecture deck. Unlike a lesson page, a deck is a single
// HTML file that holds everything it needs: the styles, the math fonts,
// the script that moves between slides, and the script that draws the
// visuals. A teacher can copy the one file to another computer and open it
// with no network.

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Course } from "../content/course.ts";
import type { Lecture, Slide } from "../content/lecture.ts";
import { escapeHtml, LIVE_RELOAD_SCRIPT } from "./page.ts";

const SITE_DIR = fileURLToPath(new URL(".", import.meta.url));

export type DeckOptions = {
  // In dev mode the deck reloads itself when the site is rebuilt.
  liveReload: boolean;
  // The script that draws the course's visuals, as text. Undefined when
  // the lecture uses none.
  visualsScript: string | undefined;
};

export function deckPage(course: Course, lecture: Lecture, options: DeckOptions): string {
  const styles = [
    mathStylesheetWithFonts(),
    readFileSync(path.join(SITE_DIR, "style.css"), "utf8"),
    readFileSync(path.join(SITE_DIR, "deck.css"), "utf8"),
  ].join("\n");
  const deckScript = readFileSync(path.join(SITE_DIR, "deck.js"), "utf8");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(`${lecture.title} | ${course.title}`)}</title>
  <style>${styles}</style>
</head>
<body class="deck">
  <main>${lecture.slides.map(slideSection).join("")}
  </main>
  <p class="deck-keys">Arrow keys to step and move · N for notes · F to fill the screen</p>
  <div class="deck-steps"></div>
  <nav class="deck-bar">
    <button type="button" class="deck-back" aria-label="The slide before">&larr;</button>
    <span class="deck-number"></span>
    <button type="button" class="deck-next" aria-label="The next slide">&rarr;</button>
  </nav>
  <script>${insideScriptTag(deckScript)}</script>
  ${options.visualsScript ? `<script type="module">${insideScriptTag(options.visualsScript)}</script>` : ""}
  ${options.liveReload ? LIVE_RELOAD_SCRIPT : ""}
</body>
</html>
`;
}

function slideSection(slide: Slide): string {
  return `
    <section class="slide">
      <header class="slide-head">${slide.headlineHtml}</header>
      <div class="slide-body">${slide.html}</div>
      <aside class="notes">${slide.notesHtml}</aside>
    </section>`;
}

// A script written into a page ends at the first "</script", even inside
// a string, so that text is written another way.
function insideScriptTag(script: string): string {
  return script.replaceAll("</script", "<\\/script");
}

// The stylesheet for the math, with each font written into it. The
// stylesheet names three files for each font; only the .woff2 one is
// kept, because every current browser uses it.
function mathStylesheetWithFonts(): string {
  const katexDir = path.dirname(fileURLToPath(import.meta.resolve("katex/dist/katex.min.css")));
  const stylesheet = readFileSync(path.join(katexDir, "katex.min.css"), "utf8");
  return stylesheet.replace(
    /src:url\((fonts\/[^)]+\.woff2)\) format\("woff2"\)[^;}]*/g,
    (_rule, fontFile: string) => {
      const font = readFileSync(path.join(katexDir, fontFile)).toString("base64");
      return `src:url(data:font/woff2;base64,${font}) format("woff2")`;
    },
  );
}
