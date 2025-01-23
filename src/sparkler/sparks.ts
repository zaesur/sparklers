import * as THREE from "three";
import constants from "../constants";
import { ensureArray } from "../utils";

export default class Sparks extends THREE.Mesh {
  private static init = (
    radius: number,
    detail: number = 1
  ): [THREE.IcosahedronGeometry, THREE.MeshBasicMaterial] => {
    return [
      new THREE.IcosahedronGeometry(radius, detail),
      new THREE.MeshBasicMaterial({ color: constants.color, wireframe: true }),
    ];
  };

  constructor(radius: number, detail: number = 1) {
    super(...Sparks.init(radius, detail));
  }

  public dispose() {
    this.geometry.dispose();

    for (const material of ensureArray(this.material)) {
      material.dispose();
    }
  }
}
