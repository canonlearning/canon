// What a course's visuals import: import { Visual, Stage } from "canon".

export * as THREE from "three";
export { ink, percentText, stackedFraction, svg, textAt, type TextOptions } from "./drawing.ts";
export { Figure } from "./figure.ts";
export {
  dividedBy,
  fractionFrom,
  fractionText,
  oneMinus,
  plus,
  reduce,
  sumText,
  times,
  toNumber,
  type Fraction,
} from "./fraction.ts";
export { cssColor, palette } from "./palette.ts";
export { seededRandom } from "./random.ts";
export { ball, block, floorLine, floorPatch, post, solid } from "./shapes.ts";
export { floor, Stage, type StageLabel, type StageOptions } from "./stage.ts";
export { evenSteps, Timeline } from "./timeline.ts";
export { Visual } from "./visual.ts";
