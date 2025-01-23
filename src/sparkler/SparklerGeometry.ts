import * as THREE from "three";

export default class SparklerGeometry extends THREE.BufferGeometry {
  constructor(geometry?: THREE.BufferGeometry, angle?: number) {
    super();

    if (geometry && angle) {
      this.createSparklerFromGeometry(geometry, angle);
    }
  }

  createSparklerFromGeometry(geometry: THREE.BufferGeometry, angle: number) {
    if (this.index) {
      // This geometry is indexed, so we can't connect to the origin.
      throw new Error("Geometry is indexed!");
    }

    this.copy(geometry);
    const positions = this.getAttribute("position");
    const uvs = this.getAttribute("uv");
    const faceCount = positions.count / 3;

    let a = new THREE.Vector3();
    let b = new THREE.Vector3();
    let c = new THREE.Vector3();
    let p = new THREE.Vector3();

    for (let i = 0; i < faceCount; i++) {
      const positionIndex = i * 3 * positions.itemSize;
      const uvIndex = i * 3 * uvs.itemSize;

      const v1 = positionIndex + positions.itemSize * 0;
      const v2 = positionIndex + positions.itemSize * 1;
      const v3 = positionIndex + positions.itemSize * 2;
      const uv1 = uvIndex + uvs.itemSize * 0;
      const uv2 = uvIndex + uvs.itemSize * 1;
      const uv3 = uvIndex + uvs.itemSize * 2;

      a.set(
        positions.array[v1 + 0],
        positions.array[v1 + 1],
        positions.array[v1 + 2]
      );

      let arbitrary = new THREE.Vector3(1, 0, 0);
      if (Math.abs(a.dot(arbitrary)) > 1e-6) {
        arbitrary.set(0, 1, 0);
      }
      p.copy(a).cross(arbitrary).normalize();

      const cosine = Math.cos(angle);
      const length = a.length() * Math.sqrt((1 - cosine) / (1 + cosine));
      p.multiplyScalar(length);

      b.copy(a).sub(p);
      positions.array[v1 + 0] = b.x;
      positions.array[v1 + 1] = b.y;
      positions.array[v1 + 2] = b.z;
      uvs.array[uv1 + 0] = 0;
      uvs.array[uv1 + 1] = 1;

      c.copy(a).add(p);
      positions.array[v2 + 0] = c.x;
      positions.array[v2 + 1] = c.y;
      positions.array[v2 + 2] = c.z;
      uvs.array[uv2 + 0] = 1;
      uvs.array[uv2 + 1] = 1;

      positions.array[v3 + 0] = 0;
      positions.array[v3 + 1] = 0;
      positions.array[v3 + 2] = 0;
      uvs.array[uv3 + 0] = 0.5;
      uvs.array[uv3 + 1] = 0;
    }
  }
}
