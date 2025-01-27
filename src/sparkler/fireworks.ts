import * as THREE from "three";
import FireworksMaterial from "../shaders/fireworks/fireworksmaterial";
import { ensureArray } from "../utils";

class Fireworks extends THREE.Points<THREE.BufferGeometry, FireworksMaterial> {
  constructor(
    geometry: THREE.BufferGeometry,
    size: number,
    resolution: THREE.Vector2,
    texture: THREE.Texture,
    color = new THREE.Color("white")
  ) {
    super(geometry, new FireworksMaterial(size, resolution, texture, color));
    this.geometry.setIndex(null);
    this.#initialize();
  }

  #initalizeAttributes() {
    const count = this.geometry.getAttribute("position").count;
    const sizes = new Float32Array(count);
    const offsets = new Float32Array(count);
    const rotations = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      sizes[i] = Math.random();
      offsets[i] = Math.random();
      rotations[i] = Math.random();
    }

    this.geometry.setAttribute(
      "aSize",
      new THREE.Float32BufferAttribute(sizes, 1)
    );
    this.geometry.setAttribute(
      "aOffset",
      new THREE.Float32BufferAttribute(offsets, 1)
    );
    this.geometry.setAttribute(
      "aRotation",
      new THREE.Float32BufferAttribute(rotations, 1)
    );
  }

  #initialize() {
    this.#initalizeAttributes();
  }

  dispose() {
    for (const material of ensureArray(this.material)) {
      material.dispose();
    }
  }
}

export default Fireworks;
