# Visuals

How interactive visuals look and behave. The reference is the lesson figures
on [gtcloudrobotics.com](https://gtcloudrobotics.com), the author's course
site, and visuals here are styled to match them.

## The reference

The source is the repository `EthanMBoos/gtcloudrobotics.com`, usually cloned
as a sibling folder, `../gtcloudrobotics.com`:

| File | Holds |
|---|---|
| `docs/javascripts/figures/lib.js` | The shared harness: the palette `C`, a seeded random number generator, `Fig` (sliders, toggles, buttons, readout, chart), and the drawing helpers |
| `docs/stylesheets/extra.css` | The figure styles, under "Lesson figures" |
| `docs/javascripts/figures/fusion/`, `control/`, `wm/` | One file per figure |
| `docs/sensor-fusion/intro.md`, `docs/control/intro.md`, `docs/world-models/intro.md` | Pages that show the figures in use: one idea per section, a figure in each, a short paragraph before and after |
| `AGENTS.md` | The rules those figures follow |

Read those before building a visual. The summary below is what carries over.

## What carries over

A figure has four parts, top to bottom:

1. **The canvas:** a rounded panel (8px corners) on a warm gray background,
   3:2 on a wide screen and square on a phone. Labels sit on the canvas next
   to the things they name, in small gray text.
2. **The readout:** one centered line of small text under the canvas with the
   current numbers, in tabular figures. Labels are gray and values are dark.
3. **The controls:** one centered row under the readout. Sliders show their
   value beside them. Buttons and toggles are pill-shaped outlines, and a
   toggle that is on is filled dark.
4. **The caption:** small, centered, gray. It says what each color or part
   is, then what the figure shows.

Colors mean the same thing in every figure, and the caption and labels use
the same colors as the drawing:

| Name | Hex | Meaning on gtcloudrobotics.com |
|---|---|---|
| Background | `#f2f1ed` | The canvas |
| Grid | `#dedcd5` | Grid lines and faint structure |
| Dark | `#2e2e33` | What really happened |
| Blue | `#3a74b8` | An estimate or prediction |
| Red | `#c0392b` | A measurement or an error |
| Teal | `#2f8f83` | A goal, or good |
| Brass | `#b08d3f` | Secondary |
| Muted | `#9a9aa2` | De-emphasized |

This palette is the starting point, and the colors are free to change. What
each color means in a course is not decided. Within one course a color keeps
one meaning across its visuals.

Other rules that carry over:

- Randomness is seeded, so a figure shows the same thing on every load.
- A figure shows one thing and then rests on it. It does not run on, or
  speed up to cover ground.
- Lines are thin, and fills are used the same way across a figure. No heavy
  black outlines.
- A figure appears only where it teaches something that a sentence, a table,
  or a formula does not.
- A figure that could be mistaken for something it is not (a toy model
  for a real one) says so in its caption.
- A figure that fails to start shows a plain message in its panel, not a
  broken page.

## Drawing

Visuals are drawn with three.js, the same toolset as the reference, and the
whole of it is available. A visual is 2D or 3D, whichever shows its example
best. Nothing limits a visual to flat drawing, and nothing requires depth
where a flat picture is clearer.

## Writing a visual

A visual is one TypeScript file in the course's `visuals/` folder. The file
`visuals/crowd.ts` is placed in a lesson with `::visual{name="crowd"}`. It
default-exports a class that extends `Visual` and implements `build(figure)`:

```ts
import { ball, floor, palette, Stage, Visual, type Figure } from "canon";

export default class Crowd extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 4 });
    const redBall = ball(palette.red, 0.4);
    redBall.position.copy(floor(0, 0, 0.4));
    stage.scene.add(redBall);
    figure.caption("One red ball on the floor.");
  }
}
```

- `Figure` is the frame: `slider`, `choice`, `toggle`, and `button` add
  controls, `readout` and `caption` set the text, and `label` makes a text
  label that sits on the canvas.
- `Stage` is a 3D three.js scene: a grid floor seen from above and to one
  side, soft light, and a camera the reader drags to orbit. A visual adds
  three.js objects to `stage.scene` and moves them in `stage.onFrame`.
  `floor(x, y, height)` makes a position, and `stage.label` makes a text
  label that follows a point.
- `ball`, `block`, `post`, `floorLine`, `floorPatch`, and `solid` are small
  helpers,
  and `fractionFrom`, `times`, `plus`, and the other fraction functions keep
  numbers exact.
  `THREE` is the whole of three.js for anything else.
- A visual runs by itself when it comes on screen (people arriving one
  after another), so there is motion before the reader touches a control.
- `build` is called when the visual first comes near the screen, not when
  the page loads. A visual in a closed solution starts when the solution is
  opened, so its animation begins at its first step.
- A visual that goes through steps keeps its time on
  `figure.timeline([0, 3, 6])`, a list of when each step starts, and reads
  the time with `timeline.advance(seconds)` in `onFrame`. On a lesson page
  the time runs on. On a lecture slide it stops at the end of each step
  until the teacher presses an arrow key. `evenSteps(count, seconds)` makes
  the list for steps of equal length.
- A visual for a lecture slide is a flat drawing, not a 3D scene:
  `figure.flatBox()` gives a plain box in place of the canvas, and
  `figure.steps(count, show)` calls `show(step)` to write the drawing as one
  SVG string (`svg`, `textAt`, `stackedFraction`, and the colors `ink`, in
  `drawing.ts`). A part marked `isNew` fades in. The deck's arrow keys move
  through the steps, and anywhere else the figure has Back and Next
  buttons. A flat drawing is 1600 by 780 units, the shape of a slide under
  its headline, with type of 30 units or more.
- The numbers a visual shows are constants at the top of its file. A visual
  that is reused with different numbers reads them from its `::visual` line
  with `this.getAttribute("probability")`; anything on the line besides
  `name` is handed over as written.
- Every stage has a Pause button in the corner of its canvas, so the reader
  can stop a visual at any step. A visual does nothing to get it.
- Before a page is printed, the stage runs the scene far ahead and draws it
  once, so a printed visual shows the end of its animation. A visual that
  has not started yet is started for the printout. Anything else that must
  happen before printing goes in `figure.onPrint`.

The engine source for these is `src/visual/`.

## Many visuals on one page

A visual starts only when it first comes near the screen, because a page
with many problems would otherwise open a 3D drawing for each at load, and
a browser allows a limited number. A visual that has scrolled far away is
not released; that is added when a page holds more visuals than a browser
allows.

Probability 1 has four reusable visuals so far: a probability tree and an
area square (two events in steps), a grid of equally likely outcomes
(dice), and a two-way table of counts filled with balls.

## What does not carry over

That site loads figures as plain script files with no bundler. Here a visual
is a Web Component on one base class, and the engine bundles a course's
visuals into one script.
