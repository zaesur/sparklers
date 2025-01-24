import * as THREE from "three";
import { Updateable } from "./updateable.d";
import Sparks from "./sparks";
import constants from "../constants";
import { ensureArray } from "../utils";

export default class Sparkler extends THREE.Mesh implements Updateable {
  private length: number;
  private sparks!: Sparks;

  private static init = (
    radius: number,
    length: number,
    segments: number
  ): [THREE.CylinderGeometry, THREE.MeshBasicMaterial] => {
    return [
      new THREE.CylinderGeometry(radius, radius, length, segments),
      new THREE.MeshBasicMaterial({ color: constants.color }),
    ];
  };

  constructor(radius: number, length: number, segments: number) {
    super(...Sparkler.init(radius, length, segments));
    this.length = length;
    
    // Set the position of the sparkler to the center of the cylinder.
    const translate = new THREE.Matrix4().makeTranslation(0, this.length / 2, 0);
    this.geometry.applyMatrix4(translate);

    this.setupSparks(radius * 10);
  }

  private setupSparks(radius: number) {
    this.sparks = new Sparks(radius, 1);
    this.add(this.sparks);
    this.update(0);
  }

  update(t: number) {
    // Map the interval [0, 1] along the length of the sparkler.
    this.sparks.position.y = this.length * (1 - t);
  }

  dispose() {
    this.sparks.dispose();
    this.geometry.dispose();
    
    for (const material of ensureArray(this.material)) {
      material.dispose();
    }
  }
}
