// A 3D scene inside a figure's canvas, in the style of the lesson figures
// on gtcloudrobotics.com: a grid floor seen from above and to one side,
// soft light, and a camera the reader can drag to orbit.
//
// Positions are given as a point on the floor, (x, y), and a height above
// it. three.js itself uses (x, height, y), so use floor() to make a
// three.js position:
//
//   ball.position.copy(floor(2, 1))         on the floor at x = 2, y = 1
//   ball.position.copy(floor(2, 1, 0.5))    half a unit above that point
//
// A visual adds three.js objects to `stage.scene` and sets `stage.onFrame`
// to move them. The stage draws a frame whenever the canvas is on screen.
//
// Every stage has a Pause button in the corner of its canvas. While it is
// paused, onFrame is called with 0 seconds, so nothing moves on, but a
// slider or a Replay button still takes effect and the view still turns.

import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Figure } from "./figure.ts";
import { palette } from "./palette.ts";

export type StageOptions = {
  // Half the width of the view, in floor units. The scene always fits
  // across the canvas, whatever the size of the canvas.
  halfWidth: number;
  // The point the camera looks at: [x, y, height]. Defaults to the origin.
  lookAt?: [number, number, number];
  // Where the camera sits around that point, in degrees. Azimuth turns it
  // around the scene and elevation raises it. Defaults to 20 and 35.
  azimuth?: number;
  elevation?: number;
  // The width of the grid drawn on the floor, in floor units. 0 for none.
  gridSize?: number;
};

export function floor(x: number, y: number, height = 0): THREE.Vector3 {
  return new THREE.Vector3(x, height, y);
}

// A text label that follows a point in the scene. Set `position` with
// floor(), and set `shown` to hide it.
export type StageLabel = {
  element: HTMLElement;
  position: THREE.Vector3;
  shown: boolean;
};

export class Stage {
  readonly scene = new THREE.Scene();

  // Called before each frame is drawn, with the seconds since the last one.
  onFrame: (seconds: number) => void = () => {};

  private readonly figure: Figure;
  // The drawing buffer is kept so that the canvas shows up in a printout.
  private readonly renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  private readonly camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
  private readonly labels: StageLabel[] = [];

  constructor(figure: Figure, options: StageOptions) {
    this.figure = figure;
    const { halfWidth, lookAt = [0, 0, 0], azimuth = 20, elevation = 35, gridSize = 20 } = options;

    const box = figure.canvasBox;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(palette.background);
    box.prepend(this.renderer.domElement);

    // The camera sits far from the point it looks at, in the direction
    // given by the two angles.
    const target = floor(lookAt[0], lookAt[1], lookAt[2]);
    const around = THREE.MathUtils.degToRad(azimuth);
    const above = THREE.MathUtils.degToRad(elevation);
    this.camera.position.set(
      target.x + 80 * Math.cos(above) * Math.sin(around),
      target.y + 80 * Math.sin(above),
      target.z + 80 * Math.cos(above) * Math.cos(around),
    );
    this.camera.lookAt(target);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0xb9b5aa, 1.5));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(6, 12, 5);
    this.scene.add(sun);
    if (gridSize > 0) {
      this.scene.add(new THREE.GridHelper(gridSize, gridSize, palette.grid, palette.grid));
    }

    // Dragging turns the camera around the scene. Zooming and panning are
    // off, and a vertical swipe on a phone still scrolls the page.
    const orbit = new OrbitControls(this.camera, this.renderer.domElement);
    orbit.target.copy(target);
    orbit.enableZoom = false;
    orbit.enablePan = false;
    orbit.enableDamping = true;
    orbit.maxPolarAngle = Math.PI / 2 - 0.06;
    this.renderer.domElement.style.touchAction = "pan-y";
    this.renderer.domElement.style.cursor = "grab";

    const resize = () => {
      const canvasWidth = Math.max(box.clientWidth, 1);
      const canvasHeight = Math.max(box.clientHeight, 1);
      this.renderer.setSize(canvasWidth, canvasHeight, false);
      const halfHeight = halfWidth * (canvasHeight / canvasWidth);
      this.camera.left = -halfWidth;
      this.camera.right = halfWidth;
      this.camera.top = halfHeight;
      this.camera.bottom = -halfHeight;
      this.camera.updateProjectionMatrix();
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(box);
    resize();

    // Frames are drawn only while the canvas is on screen.
    let onScreen = true;
    const visibilityObserver = new IntersectionObserver((entries) => {
      onScreen = entries[0].isIntersecting;
    });
    visibilityObserver.observe(box);

    let paused = false;
    const pauseButton = document.createElement("button");
    pauseButton.type = "button";
    pauseButton.className = "fig-pause";
    const showPauseState = () => {
      pauseButton.textContent = paused ? "\u25B6 Play" : "\u275A\u275A Pause";
      pauseButton.setAttribute("aria-pressed", String(paused));
    };
    pauseButton.addEventListener("click", () => {
      paused = !paused;
      showPauseState();
    });
    showPauseState();
    box.append(pauseButton);

    let lastTime = performance.now();
    let frameRequest = 0;
    const drawFrame = (time: number) => {
      frameRequest = requestAnimationFrame(drawFrame);
      const seconds = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      if (!onScreen) return;
      this.onFrame(paused ? 0 : seconds);
      orbit.update();
      this.renderer.render(this.scene, this.camera);
      this.placeLabels();
    };
    frameRequest = requestAnimationFrame(drawFrame);

    // A printed page cannot move, so before printing the scene is run far
    // ahead, to the end of whatever it was doing, and drawn once. A browser
    // does not reliably print a 3D canvas, so the drawing is copied into an
    // ordinary image, which the print stylesheet shows in its place.
    const printImage = document.createElement("img");
    printImage.className = "fig-print";
    printImage.alt = "";
    box.prepend(printImage);
    const drawForPrint = () => {
      this.onFrame(1000);
      this.renderer.render(this.scene, this.camera);
      this.placeLabels();
      printImage.src = this.renderer.domElement.toDataURL("image/png");
    };
    window.addEventListener("beforeprint", drawForPrint);

    figure.onDispose(() => {
      window.removeEventListener("beforeprint", drawForPrint);
      cancelAnimationFrame(frameRequest);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      orbit.dispose();
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    });
  }

  // Makes a text label that follows a point in the scene. The label sits
  // centered just above its point.
  label(html: string, className = ""): StageLabel {
    const element = this.figure.label(className);
    element.innerHTML = html;
    const label = { element, position: new THREE.Vector3(), shown: true };
    this.labels.push(label);
    return label;
  }

  // Moves each label to where its point appears on the canvas. The place
  // is a percentage of the canvas, so it stays right when the canvas
  // changes size, as it does on a printed page.
  private placeLabels(): void {
    const onCanvas = new THREE.Vector3();
    for (const label of this.labels) {
      onCanvas.copy(label.position).project(this.camera);
      label.element.style.left = `${((onCanvas.x * 0.5 + 0.5) * 100).toFixed(2)}%`;
      label.element.style.top = `${((1 - (onCanvas.y * 0.5 + 0.5)) * 100).toFixed(2)}%`;
      label.element.style.opacity = label.shown ? "1" : "0";
    }
  }
}
