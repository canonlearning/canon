// Helpers for a flat drawing: a visual drawn as SVG and not on a 3D stage.
// A flat drawing is made for a slide. It has few colors and large type,
// and it changes in steps:
//
//   const box = figure.flatBox();
//   figure.steps(4, (step) => {
//     box.innerHTML = svg(1600, 780, drawingAt(step));
//   });
//
// The whole drawing is written again at each step, as one string. A part
// with class="new" fades in, so the part added by a step can be marked.

export const ink = {
  text: "#1d2433",
  muted: "#7b8394",
  faint: "#d7dce5",
  wash: "#f3f4f7",
  blue: "#3a74b8",
  blueTint: "#dfe9f6",
  red: "#c0392b",
  redTint: "#f6d9d4",
};

// An SVG that is `width` by `height` in its own units and as wide as its
// box on the page.
export function svg(width: number, height: number, content: string): string {
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
}

export type TextOptions = {
  size?: number;
  fill?: string;
  // Where the point (x, y) is on the text: its start, middle, or end.
  anchor?: "start" | "middle" | "end";
  bold?: boolean;
  // True for a part that the current step has added.
  isNew?: boolean;
};

export function textAt(x: number, y: number, words: string, options: TextOptions = {}): string {
  const { size = 32, fill = ink.text, anchor = "middle", bold = false, isNew = false } = options;
  return (
    `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"` +
    ` font-weight="${bold ? 600 : 400}"${isNew ? ' class="new"' : ""}>${escapeText(words)}</text>`
  );
}

// A fraction with its top over its bottom. The bar is centered on (x, y).
export function stackedFraction(
  x: number,
  y: number,
  top: { words: string; fill?: string },
  bottom: { words: string; fill?: string },
  options: { size?: number; isNew?: boolean } = {},
): string {
  const { size = 80, isNew = false } = options;
  const longest = Math.max(top.words.length, bottom.words.length);
  const halfBar = longest * size * 0.31 + size * 0.15;
  return (
    `<g${isNew ? ' class="new"' : ""}>` +
    textAt(x, y - size * 0.3, top.words, { size, fill: top.fill, bold: true }) +
    `<line x1="${x - halfBar}" y1="${y}" x2="${x + halfBar}" y2="${y}" stroke="${ink.text}" stroke-width="${size * 0.05}"/>` +
    textAt(x, y + size * 1.02, bottom.words, { size, fill: bottom.fill, bold: true }) +
    `</g>`
  );
}

// A share as a whole percentage: percentText(344, 711) is "48%".
export function percentText(top: number, bottom: number): string {
  return `${Math.round((100 * top) / bottom)}%`;
}

function escapeText(words: string): string {
  return words.replaceAll("&", "&amp;").replaceAll("<", "&lt;");
}
