// The smallest visual: one ball on the floor, a label, a readout, and a
// caption.

import { ball, floor, palette, Stage, Visual, type Figure } from "canon";

export default class ExampleVisual extends Visual {
  protected build(figure: Figure): void {
    const stage = new Stage(figure, { halfWidth: 4 });

    const redBall = ball(palette.red, 0.4);
    redBall.position.copy(floor(0, 0, 0.4));
    stage.scene.add(redBall);

    stage.label("a ball").position.copy(floor(0, 0, 0.9));
    figure.readout("<b>1</b> ball");
    figure.caption("One red ball on the floor.");
  }
}
