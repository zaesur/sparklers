import * as THREE from "three";

export default class Sparks extends THREE.Mesh {
  private static init = (
    radius: number,
    detail: number = 1
  ): [THREE.IcosahedronGeometry, THREE.MeshBasicMaterial] => {
    return [
      new THREE.IcosahedronGeometry(radius, detail),
      new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
    ];
  };

  constructor(radius: number, detail: number = 1) {
    super(...Sparks.init(radius, detail));
  }
}
