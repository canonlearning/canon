// The base class of every visual. A visual is a custom HTML element: the
// lesson line ::visual{name="crowd"} becomes <visual-crowd>, and the class
// in the course's visuals/crowd.ts draws inside it.
//
// A visual implements one method, build(figure). It is called when the
// element first comes near the screen, and not before. A page can hold many
// visuals (one in each solution), and a browser allows only a limited
// number of 3D drawings at once, so a visual that has not been seen yet
// has not been started. A visual inside a closed solution starts when the
// solution is opened.

import { Figure } from "./figure.ts";

// How far below or above the screen a visual is when it starts.
const START_DISTANCE = "300px";

export abstract class Visual extends HTMLElement {
  private figure: Figure | undefined;
  private stopWaiting: () => void = () => {};

  protected abstract build(figure: Figure): void;

  connectedCallback(): void {
    const nearScreen = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) this.start();
      },
      { rootMargin: START_DISTANCE },
    );
    nearScreen.observe(this);

    // A printed page shows every visual on it, seen or not, so printing
    // starts the ones that are still waiting. Then each draws itself as a
    // still picture. A visual inside a closed solution is not printed, so
    // it is left alone.
    const prepareForPrint = () => {
      const isOnThePage = this.getClientRects().length > 0;
      if (isOnThePage) this.start();
      this.figure?.prepareForPrint();
    };
    window.addEventListener("beforeprint", prepareForPrint);

    this.stopWaiting = () => {
      nearScreen.disconnect();
      window.removeEventListener("beforeprint", prepareForPrint);
    };
  }

  disconnectedCallback(): void {
    this.stopWaiting();
    this.figure?.dispose();
    this.figure = undefined;
  }

  private start(): void {
    if (this.figure) return;
    this.figure = new Figure(this);
    try {
      this.build(this.figure);
    } catch (error) {
      console.error(error);
      this.figure.showError("This visual could not start.");
    }
  }
}
