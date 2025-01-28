import * as THREE from "three";
import { Updateable } from "./updateable.d";
import { ensureArray } from "../utils";
import Sparks from "./sparks";
import SparklerMaterial from "./sparklerMaterial";

const sparksColor = new THREE.Color().setHSL(0.1, 0.7, 0.5);

export default class Sparkler
  extends THREE.Mesh<THREE.BufferGeometry, SparklerMaterial>
  implements Updateable
{
  private length: number;
  private sparks!: Sparks;
  duration = 20;
  isSparkling = false;

  private static init = (
    radius: number,
    length: number,
    segments: number
  ): [THREE.BufferGeometry, SparklerMaterial] => {
    return [
      new THREE.CylinderGeometry(radius, radius, length, segments),
      new SparklerMaterial(),
    ];
  };

  constructor(radius: number, length: number, segments: number) {
    super(...Sparkler.init(radius, length, segments));
    this.length = length;
    this.setupGeometry();
    this.setupUVs();
    this.setupSparks(radius * 10);

    const folder = window.gui.addFolder("Sparkler");
    folder.add(this, "duration", 1, 100, 1);
    folder.addColor(this.material, "baseColor");
    folder.add(this.material, "burnWidth", 0, 0.2, 0.01);
    folder.addColor(this.material, "burnColor").setValue(sparksColor);
    folder.add(this.material, "trailWidth", 0, 0.5, 0.01);
    folder.addColor(this.material, "trailColor");
    folder.addColor(this.material, "burntColor");
  }

  private setupGeometry() {
    this.geometry.translate(0, this.length / 2, 0);
  }

  private setupUVs() {
    const position = this.geometry.getAttribute("position");
    const uv = this.geometry.getAttribute("uv");

    for (let i = 0; i < position.count; i++) {
      const uvIndex = i * uv.itemSize + 1;
      const posIndex = i * position.itemSize + 1;

      uv.array[uvIndex] = 1 - position.array[posIndex] / this.length;
    }
  }

  private setupSparks(radius: number) {
    const geometry = new THREE.IcosahedronGeometry(radius * 4, 2);
    const resolution = new THREE.Vector2(
      window.innerWidth * Math.min(window.devicePixelRatio, 2),
      window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    const texture = new THREE.TextureLoader().load("./particles/4.png");
    const sparks = new Sparks(geometry, 0.2, resolution, texture, sparksColor);

    this.sparks = sparks;
    this.add(this.sparks);
    this.update(0);

    const folder = window.gui.addFolder("Sparks");
    folder.addColor(this.sparks.material, "color");
    folder.add(this.sparks.material, "size", 0, 1, 0.01);
    folder.add(this.sparks.material, "duration", 0, 0.1, 0.001);
  }

  setResolution(width: number, height: number) {
    this.sparks.material.resolution.set(width, height);
  }

  play() {
    this.isSparkling = true;
    this.sparks.visible = true;
    this.material.progress = 0;
    this.update(0);
  }

  stop() {
    this.isSparkling = false;
    this.sparks.visible = false;
    this.material.progress = 0;
  }

  update(delta: number) {
    if (!this.isSparkling || this.material.progress > 1) {
      return this.stop()
    }

    const t = this.material.progress + delta / this.duration;
    this.material.progress = t;
    this.sparks.material.progress = t;
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
