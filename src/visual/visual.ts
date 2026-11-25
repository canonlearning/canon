// The base class of every visual. A visual is a custom HTML element: the
// lesson line ::visual{name="crowd"} becomes <visual-crowd>, and the class
// in the course's visuals/crowd.ts draws inside it.
//
// A visual implements one method, build(figure). It is called when the
// element appears on the page.

import { Figure } from "./figure.ts";

export abstract class Visual extends HTMLElement {
  private figure: Figure | undefined;

  protected abstract build(figure: Figure): void;

  connectedCallback(): void {
    this.figure = new Figure(this);
    try {
      this.build(this.figure);
    } catch (error) {
      console.error(error);
      this.figure.showError("This visual could not start.");
    }
  }

  disconnectedCallback(): void {
    this.figure?.dispose();
    this.figure = undefined;
  }
}
