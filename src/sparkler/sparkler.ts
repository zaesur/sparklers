import * as THREE from "three";
import { Updateable } from "./updateable.d";
import { ensureArray } from "../utils";
import SparklerMaterial from "./sparklerMaterial";
import { SimplexNoise } from "three/examples/jsm/Addons.js";
import AudioPlayer from "../audioPlayer";
import Sparks from "../sparks";
export default class Sparkler
  extends THREE.Mesh<THREE.BufferGeometry, SparklerMaterial>
  implements Updateable
{
  private length: number;
  private sparks!: Sparks;
  private handle!: THREE.Mesh;
  audioPlayer!: AudioPlayer;
  duration = 20;
  isSparkling = false;

  private static init = (
    radius: number,
    length: number
  ): [THREE.BufferGeometry, SparklerMaterial] => {
    return [
      new THREE.CylinderGeometry(radius, radius, length, 15, 100),
      new SparklerMaterial(),
    ];
  };

  constructor(radius: number, length: number) {
    super(...Sparkler.init(radius, length));
    this.length = length;
    this.setupGeometry();
    this.setupUVs();
    this.setupAudio();
    this.setupSparks();
    this.setupHandle(radius * 0.5, length * 1.15);

    const folder = window.gui.addFolder("Sparkler");
    folder.add(this, "duration", 1, 100, 1);
    folder
      .addColor(this.handle.material as THREE.MeshBasicMaterial, "color")
      .name("handleColor");
    folder.addColor(this.material, "baseColor");
    folder.addColor(this.material, "burnColor");
    folder.addColor(this.material, "trailColor");
    folder.add(this.material, "burnWidth", 0, 0.2, 0.01);
    folder.add(this.material, "trailWidth", 0, 0.5, 0.01);
    folder.add(this.material, "burnIntensity", 0, 5, 0.1);
    folder.add(this.material, "darkenFactor", 0.01, 0.5, 0.01);
  }

  private setupGeometry() {
    this.geometry.translate(0, this.length / 2, 0);

    const frequency = 75;
    const amplitude = 0.01;
    const simplex = new SimplexNoise();

    const uv = this.geometry.attributes.uv;
    const normal = this.geometry.attributes.normal;
    const position = this.geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);
      const z = position.getZ(i);

      const normalX = normal.getX(i);
      const normalZ = normal.getZ(i);
      const uvY = uv.getY(i);

      // Apply noise only if the vertex belongs to the side
      if (uvY > 0 && uvY < 1) {
        const noise =
          simplex.noise3d(x * frequency, y * frequency, z * frequency) *
          amplitude;
        position.setX(i, x + noise * normalX);
        position.setZ(i, z + noise * normalZ);
      }
    }

    this.geometry.computeVertexNormals();
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

  private setupHandle(radius: number, length: number) {
    const geometry = new THREE.CylinderGeometry(radius, radius, length, 16);
    const material = new THREE.MeshStandardMaterial({
      color: "grey",
      roughness: 0.1,
      metalness: 1,
    });
    const handle = new THREE.Mesh(geometry, material);
    this.handle = handle;
    this.add(handle);
  }

  private setupSparks() {
    const radius = 1;
    const detail = 5;
    const geometry = new THREE.IcosahedronGeometry(radius, detail);
    const resolution = new THREE.Vector2(
      window.innerWidth * Math.min(window.devicePixelRatio, 2),
      window.innerHeight * Math.min(window.devicePixelRatio, 2)
    );
    const texture = new THREE.TextureLoader().load("./particles/6.png");
    const sparks = new Sparks(geometry, 0.2, resolution, texture);

    this.sparks = sparks;
    this.add(this.sparks);
    this.update(0);

    const folder = window.gui.addFolder("Sparks");
    folder.addColor(this.sparks.material, "color");
    folder.add(this.sparks.material, "size", 0, 1, 0.01);
    folder.add(this.sparks.material, "radius", 0.5, 5, 0.1);
    folder.add(this.sparks.material, "duration", 0, 0.1, 0.001);
  }

  setupAudio() {
    this.audioPlayer = new AudioPlayer("sparkler.mp3");
  }

  setResolution(width: number, height: number) {
    this.sparks.material.resolution.set(width, height);
  }

  play() {
    this.isSparkling = true;
    this.sparks.visible = true;
    this.material.progress = 0;
    this.update(0);
    this.audioPlayer.play();
  }

  stop() {
    this.isSparkling = false;
    this.sparks.visible = false;
    this.material.progress = 0;
    this.audioPlayer.stop();
  }

  update(delta: number) {
    if (!this.isSparkling || this.material.progress > 1) {
      return this.stop();
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
