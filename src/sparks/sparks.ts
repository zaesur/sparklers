import * as THREE from "three";
import SparksMaterial from "./sparksMaterial";
import { ensureArray } from "../utils";

class Sparks extends THREE.Points<THREE.BufferGeometry, SparksMaterial> {
  constructor(
    geometry: THREE.BufferGeometry,
    resolution: THREE.Vector2,
    texture: THREE.Texture,
  ) {
    super(geometry, new SparksMaterial(resolution, texture, { size: 0.6, radius: 1.2 }));
    this.initialize();
  }
  private initalizeAttributes() {
    this.geometry.setIndex(null);
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

  private initialize() {
    this.initalizeAttributes();
  }

  dispose() {
    for (const material of ensureArray(this.material)) {
      material.dispose();
    }
  }
}

export default Sparks;
