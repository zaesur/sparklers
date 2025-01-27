import * as THREE from "three";
import vertexShader from "../../shaders/sparks/vertex.glsl";
import fragmentShader from "../../shaders/sparks/fragment.glsl";

class SparksMaterial extends THREE.ShaderMaterial {
  constructor(size: number, resolution: THREE.Vector2, texture: THREE.Texture, color = new THREE.Color("white")) {
    super({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader,
      fragmentShader,
      uniforms: {
        uSize: new THREE.Uniform(size),
        uResolution: new THREE.Uniform(resolution),
        uDuration: new THREE.Uniform(0.007),
        uTexture: new THREE.Uniform(texture),
        uColor: new THREE.Uniform(color),
        uProgress: new THREE.Uniform(0)
      },
    });
  }
}

export default SparksMaterial;
