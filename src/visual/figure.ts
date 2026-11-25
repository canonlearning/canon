// The frame that every visual sits in. Top to bottom:
//
//   canvas    the drawing, with text labels laid over it
//   readout   one line with the current numbers
//   controls  one row of sliders and buttons
//   caption   what each color or part is, then what the figure shows
//
// A visual asks the figure for its controls and writes the readout and the
// caption. The scene itself goes on a Stage (stage.ts).

export class Figure {
  readonly canvasBox = element("div", "fig-canvas");
  private readonly labelBox = element("div", "fig-labels");
  private readonly readoutBox = element("div", "fig-readout");
  private readonly controlsBox = element("div", "fig-controls");
  private readonly captionBox = element("figcaption", "fig-caption");
  private cleanups: (() => void)[] = [];
  private printSteps: (() => void)[] = [];

  constructor(host: HTMLElement) {
    this.canvasBox.append(this.labelBox);
    host.replaceChildren(this.canvasBox, this.readoutBox, this.controlsBox, this.captionBox);
  }

  // A slider with its current value shown beside it. `onChange` is called
  // with the new value each time the slider moves.
  slider(
    label: string,
    options: { min: number; max: number; step: number; value: number; format: (value: number) => string },
    onChange: (value: number) => void,
  ): void {
    const input = element("input");
    input.type = "range";
    input.min = String(options.min);
    input.max = String(options.max);
    input.step = String(options.step);
    input.value = String(options.value);

    const output = element("output");
    output.textContent = options.format(options.value);

    input.addEventListener("input", () => {
      output.textContent = options.format(Number(input.value));
      onChange(Number(input.value));
    });

    const wrapper = element("label", "fig-slider");
    wrapper.append(element("span", "", label), input, output);
    this.controlsBox.append(wrapper);
  }

  // A row of buttons where exactly one is chosen. `options` is a list of
  // [value, label] pairs.
  choice<Value extends string>(
    options: [Value, string][],
    chosen: Value,
    onChange: (value: Value) => void,
  ): void {
    const box = element("div", "fig-choice");
    const buttons = options.map(([value, label]) => {
      const button = element("button", "fig-btn", label);
      button.type = "button";
      button.setAttribute("aria-pressed", String(value === chosen));
      button.addEventListener("click", () => {
        for (const other of buttons) other.setAttribute("aria-pressed", "false");
        button.setAttribute("aria-pressed", "true");
        onChange(value);
      });
      return button;
    });
    box.append(...buttons);
    this.controlsBox.append(box);
  }

  button(label: string, onClick: () => void): void {
    const button = element("button", "fig-btn", label);
    button.type = "button";
    button.addEventListener("click", onClick);
    this.controlsBox.append(button);
  }

  // A button that is either on or off. `onChange` is called with the new
  // state each time it is clicked.
  toggle(label: string, on: boolean, onChange: (on: boolean) => void): void {
    const button = element("button", "fig-btn", label);
    button.type = "button";
    button.setAttribute("aria-pressed", String(on));
    button.addEventListener("click", () => {
      on = !on;
      button.setAttribute("aria-pressed", String(on));
      onChange(on);
    });
    this.controlsBox.append(button);
  }

  // The readout and the caption take HTML, so a value can be bold or
  // colored: figure.readout("<i>positive</i> <b>117</b>").
  readout(html: string): void {
    this.readoutBox.innerHTML = html;
  }

  caption(html: string): void {
    this.captionBox.innerHTML = html;
  }

  // A text label laid over the canvas. Stage.label() makes one that follows
  // a point in the scene, which is what a visual normally wants.
  label(className = ""): HTMLElement {
    const label = element("div", `fig-label ${className}`);
    this.labelBox.append(label);
    return label;
  }

  // Shown in place of the drawing when a visual fails to start.
  showError(message: string): void {
    this.canvasBox.replaceChildren(element("div", "fig-error", message));
  }

  // `step` is called just before the page is printed. A stage uses it to
  // draw the end of its animation as a still picture.
  onPrint(step: () => void): void {
    this.printSteps.push(step);
  }

  prepareForPrint(): void {
    for (const step of this.printSteps) step();
  }

  onDispose(cleanup: () => void): void {
    this.cleanups.push(cleanup);
  }

  dispose(): void {
    for (const cleanup of this.cleanups.reverse()) cleanup();
    this.cleanups = [];
  }
}

function element<Tag extends keyof HTMLElementTagNameMap>(
  tag: Tag,
  className = "",
  text = "",
): HTMLElementTagNameMap[Tag] {
  const created = document.createElement(tag);
  if (className) created.className = className;
  if (text) created.textContent = text;
  return created;
}
