// Objects to put in a Stage. Each returns a three.js object to add to
// stage.scene. Sizes are in floor units.

import * as THREE from "three";

// The material of a solid object: it is shaded by the stage's light.
export function solid(color: number, opacity = 1): THREE.MeshLambertMaterial {
  return new THREE.MeshLambertMaterial({
    color,
    opacity,
    transparent: opacity < 1,
    depthWrite: opacity >= 1,
  });
}

export function ball(color: number, radius: number): THREE.Mesh {
  return new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), solid(color));
}

// A thin post with a ball on top, standing on the floor at (x, y).
export function post(x: number, y: number, options: { color: number; height: number }): THREE.Group {
  const material = solid(options.color);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, options.height, 16), material);
  stem.position.y = options.height / 2;
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.11, 20, 14), material);
  top.position.y = options.height;

  const group = new THREE.Group();
  group.add(stem, top);
  group.position.set(x, 0, y);
  return group;
}

// A straight line painted on the floor from one point to another.
export function floorLine(
  from: { x: number; y: number },
  to: { x: number; y: number },
  options: { color: number; width: number },
): THREE.Mesh {
  const length = Math.hypot(to.x - from.x, to.y - from.y);
  const strip = new THREE.PlaneGeometry(length, options.width);
  strip.rotateX(-Math.PI / 2); // lay it flat on the floor
  const mesh = new THREE.Mesh(strip, new THREE.MeshBasicMaterial({ color: options.color }));
  mesh.position.set((from.x + to.x) / 2, 0.012, (from.y + to.y) / 2);
  mesh.rotation.y = -Math.atan2(to.y - from.y, to.x - from.x);
  return mesh;
}

// A tinted rectangle painted on the floor, e.g. to mark out an area.
export function floorPatch(
  center: { x: number; y: number },
  size: { width: number; depth: number },
  options: { color: number; opacity: number },
): THREE.Mesh {
  const rectangle = new THREE.PlaneGeometry(size.width, size.depth);
  rectangle.rotateX(-Math.PI / 2);
  const material = new THREE.MeshBasicMaterial({
    color: options.color,
    opacity: options.opacity,
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(rectangle, material);
  mesh.position.set(center.x, 0.006, center.y);
  return mesh;
}
