// Runs a lecture deck in the browser: shows one slide at a time and moves
// between them. This file is put into each deck's page as it is written.
//
// A visual on a slide does not run by itself. It waits at each of its
// steps, and the same keys that change the slide move it on:
//
//   Right arrow, Space, Page Down   the next step, or the next slide
//   Left arrow, Page Up             the step before, or the slide before
//   Home, End                       the first slide, the last slide
//   N                               show or hide the teacher's notes
//   F                               fill the screen, or stop filling it

const slides = [...document.querySelectorAll(".slide")];

// The word "stepped" tells a visual to wait at each step (see timeline.ts
// in the engine). It is set here, before any visual has started.
for (const visual of document.querySelectorAll("figure.visual > *")) {
  visual.setAttribute("stepped", "");
}

// Some parts of a slide start hidden and appear one press at a time, so
// that a slide is built up in front of the room:
//
//   - each point of a bulleted list after the first
//   - each line after the first of a stacked calculation (a formula
//     written with \begin{aligned})
//
// A part is a list of elements that appear together.
const HIDDEN = "later";

function partsOf(slide) {
  const points = [...slide.querySelectorAll(".slide-body > ul > li:not(:first-child)")];
  const formulas = [...slide.querySelectorAll(".slide-body .katex-display")];
  return [...points.map((point) => [point]), ...formulas.flatMap(laterLinesOf)];
}

// The lines of a stacked calculation, without the first. KaTeX draws the
// calculation as columns (left of the equals sign, and right of it), each
// holding one element for every line, so a line is one element from each.
function laterLinesOf(formula) {
  const columns = [...formula.querySelectorAll(".mtable > [class^='col-align']")].map((column) => [
    ...column.querySelectorAll(":scope > .vlist-t > .vlist-r:first-child > .vlist > span"),
  ]);
  const lineCount = columns[0]?.length ?? 0;
  const lines = [];
  for (let line = 1; line < lineCount; line += 1) {
    lines.push(columns.map((column) => column[line]).filter(Boolean));
  }
  return lines;
}

const partsBySlide = slides.map(partsOf);
for (const part of partsBySlide.flat(2)) part.classList.add(HIDDEN);
const isHidden = (part) => part[0].classList.contains(HIDDEN);

const backButton = document.querySelector(".deck-back");
const nextButton = document.querySelector(".deck-next");
const numberText = document.querySelector(".deck-number");
const stepDots = document.querySelector(".deck-steps");

// The slide to show is kept in the address, as in deck.html#4, so a
// reload stays on the same slide.
function currentIndex() {
  const number = Number(location.hash.slice(1));
  const isASlide = Number.isInteger(number) && number >= 1 && number <= slides.length;
  return isASlide ? number - 1 : 0;
}

function show(index) {
  const shown = Math.min(Math.max(index, 0), slides.length - 1);
  slides.forEach((slide, slideIndex) => slide.classList.toggle("current", slideIndex === shown));
  numberText.textContent = `${shown + 1} / ${slides.length}`;
  backButton.disabled = shown === 0;
  nextButton.disabled = shown === slides.length - 1;
  history.replaceState(null, "", `#${shown + 1}`);
  showStepDots();
  // A visual starts a moment after its slide is shown, and only then
  // knows how many steps it has.
  setTimeout(showStepDots, 400);
}

// Draws one dot for each press the current slide takes before the next
// slide, with the presses already made filled in.
function showStepDots() {
  const slide = slides[currentIndex()];
  const parts = partsBySlide[currentIndex()];
  const visualSteps = slide.querySelector("figure.visual > *")?.stepPosition?.() ?? { step: 0, count: 1 };
  const total = visualSteps.count - 1 + parts.length;
  const done = visualSteps.step + parts.filter((part) => !isHidden(part)).length;
  stepDots.innerHTML = Array.from({ length: total }, (_, index) =>
    index < done ? '<i class="done"></i>' : "<i></i>",
  ).join("");
}

// Forward moves the visual on the slide by one step. When the visual is
// at its last step, it shows the next hidden part of the slide. When
// there is nothing left to show, it moves to the next slide.
function forward() {
  const slide = slides[currentIndex()];
  const visual = slide.querySelector("figure.visual > *");
  if (visual?.nextStep?.()) return;
  const nextPart = partsBySlide[currentIndex()].find(isHidden);
  if (nextPart) nextPart.forEach((element) => element.classList.remove(HIDDEN));
  else show(currentIndex() + 1);
}

// Back undoes forward: first the parts, then the visual's steps.
function back() {
  const slide = slides[currentIndex()];
  const lastPart = partsBySlide[currentIndex()].findLast((part) => !isHidden(part));
  if (lastPart) {
    lastPart.forEach((element) => element.classList.add(HIDDEN));
    return;
  }
  const visual = slide.querySelector("figure.visual > *");
  if (visual?.previousStep?.()) return;
  show(currentIndex() - 1);
}

backButton.addEventListener("click", () => {
  back();
  showStepDots();
});
nextButton.addEventListener("click", () => {
  forward();
  showStepDots();
});

// The bar and the list of keys show while the pointer moves, and for a
// short time after.
let pointerTimer;
document.addEventListener("mousemove", () => {
  document.body.classList.add("pointer-moving");
  clearTimeout(pointerTimer);
  pointerTimer = setTimeout(() => document.body.classList.remove("pointer-moving"), 2500);
});

document.addEventListener("keydown", (event) => {
  // A key pressed on a slider or a button belongs to that control.
  const onAControl = event.target.closest("input, button, select, textarea");
  if (onAControl || event.metaKey || event.ctrlKey || event.altKey) return;

  const key = event.key;
  if (key === "ArrowRight" || key === " " || key === "PageDown") forward();
  else if (key === "ArrowLeft" || key === "PageUp") back();
  else if (key === "Home") show(0);
  else if (key === "End") show(slides.length - 1);
  else if (key === "n" || key === "N") document.body.classList.toggle("show-notes");
  else if (key === "f" || key === "F") {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();
  } else return;
  event.preventDefault();
  showStepDots();
});

// A link to another slide of this deck, such as deck.html#7, shows it.
window.addEventListener("hashchange", () => show(currentIndex()));

show(currentIndex());

// A printed deck shows every slide. The slides are all laid out just
// before printing, so that each visual can draw its still picture.
window.addEventListener("beforeprint", () => document.body.classList.add("printing"));
window.addEventListener("afterprint", () => document.body.classList.remove("printing"));
