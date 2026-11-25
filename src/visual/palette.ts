// The colors every visual draws with. They match the lesson figures on
// gtcloudrobotics.com (see docs/VISUALS.md). Within one course a color
// keeps one meaning across its visuals.

export const palette = {
  background: 0xf2f1ed,
  grid: 0xdedcd5,
  dark: 0x2e2e33,
  blue: 0x3a74b8,
  red: 0xc0392b,
  teal: 0x2f8f83,
  brass: 0xb08d3f,
  muted: 0x9a9aa2,
};

// 0xc0392b -> "#c0392b", for use in HTML and CSS.
export function cssColor(color: number): string {
  return "#" + color.toString(16).padStart(6, "0");
}
