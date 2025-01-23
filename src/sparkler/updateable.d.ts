export interface Updateable extends THREE.Object3D {
  update: (t: number) => void;
}
