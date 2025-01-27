import * as THREE from "three";
import { Updateable } from "./updateable.d";
import { ensureArray } from "../utils";
import Fireworks from "./fireworks";

export default class Sparkler extends THREE.Mesh implements Updateable {
  private length: number;
  private sparks!: Fireworks;

  private static init = (
    radius: number,
    length: number,
    segments: number
  ): [THREE.CylinderGeometry, THREE.MeshBasicMaterial] => {
    return [
      new THREE.CylinderGeometry(radius, radius, length, segments),
      new THREE.MeshBasicMaterial({ color: "grey" }),
    ];
  };

  constructor(radius: number, length: number, segments: number) {
    super(...Sparkler.init(radius, length, segments));
    this.length = length;
    this.geometry.translate(0, this.length / 2, 0);
    this.setupSparks(radius * 10);
  }

  private setupSparks(radius: number) {
    const geometry = new THREE.IcosahedronGeometry(radius * 4, 2);
    const resolution = new THREE.Vector2(
      window.innerWidth * Math.min(window.devicePixelRatio, 2),
      window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    const texture = new THREE.TextureLoader().load("./particles/1.png");
    const color = new THREE.Color().setHSL(0.1, 0.7, 0.5);
    const sparks = new Fireworks(geometry, 0.2, resolution, texture, color);

    this.sparks = sparks;
    this.add(this.sparks);
    this.update(0);
  }

  update(t: number) {
    // Map the interval [0, 1] along the length of the sparkler.
    this.sparks.position.y = this.length * (1 - t);
    this.sparks.material.uniforms.uProgress.value = t;
  }

  dispose() {
    this.sparks.dispose();
    this.geometry.dispose();

    for (const material of ensureArray(this.material)) {
      material.dispose();
    }
  }
}
