import * as THREE from "three";
import { Updateable } from "./updateable.d";
import Sparks from "./sparks";

export default class Sparkler extends THREE.Mesh implements Updateable {
  private length: number;
  private sparks!: THREE.Mesh;

  private static init = (
    radius: number,
    length: number,
    segments: number
  ): [THREE.CylinderGeometry, THREE.MeshBasicMaterial] => {
    return [
      new THREE.CylinderGeometry(radius, radius, length, segments),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    ];
  };

  constructor(radius: number, length: number, segments: number) {
    super(...Sparkler.init(radius, length, segments));
    this.length = length;
    this.setupSparks(radius * 3);
  }

  private setupSparks(radius: number) {
    this.sparks = new Sparks(radius, 1);
    this.sparks.position.y = this.length / 2;
    this.add(this.sparks);
  }

  update(t: number) {
    this.sparks.position.y = (0.5 - t) * this.length;
  }
}

