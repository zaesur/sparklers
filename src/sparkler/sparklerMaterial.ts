import * as THREE from "three";
import vertexShader from "../shaders/sparkler/vertex.glsl";
import fragmentShader from "../shaders/sparkler/fragment.glsl";

type Params = {
  baseColor?: THREE.ColorRepresentation;
  burnColor?: THREE.ColorRepresentation;
  trailColor?: THREE.ColorRepresentation;
  burnIntensity?: number;
  darkenFactor?: number;
  trailWidth?: number;
  burnWidth?: number;
};

class SparklerMaterial extends THREE.ShaderMaterial {
  constructor({
    baseColor = "dimgrey",
    burnColor = "cornsilk",
    trailColor = "orangered",
    burnIntensity = 1.5,
    darkenFactor = 0.1,
    trailWidth = 0.3,
    burnWidth = 0.05,
  }: Params = {}) {
    super({
      uniforms: {
        uBaseColor: new THREE.Uniform(new THREE.Color(baseColor)),
        uBurnColor: new THREE.Uniform(new THREE.Color(burnColor)),
        uTrailColor: new THREE.Uniform(new THREE.Color(trailColor)),
        uBurnIntensity: new THREE.Uniform(burnIntensity),
        uDarkenFactor: new THREE.Uniform(darkenFactor),
        uProgress: new THREE.Uniform(0),
        uTrailWidth: new THREE.Uniform(trailWidth),
        uBurnWidth: new THREE.Uniform(burnWidth),
      },
      vertexShader,
      fragmentShader,
    });
  }

  get progress() {
    return this.uniforms.uProgress.value;
  }
  set progress(value: number) {
    this.uniforms.uProgress.value = value;
  }

  get trailWidth() {
    return this.uniforms.uTrailWidth.value;
  }
  set trailWidth(value: number) {
    this.uniforms.uTrailWidth.value = value;
  }

  get burnWidth() {
    return this.uniforms.uBurnWidth.value;
  }
  set burnWidth(value: number) {
    this.uniforms.uBurnWidth.value = value;
  }

  get baseColor() {
    return this.uniforms.uBaseColor.value;
  }

  get burnColor() {
    return this.uniforms.uBurnColor.value;
  }

  get trailColor() {
    return this.uniforms.uTrailColor.value;
  }

  get burnIntensity() {
    return this.uniforms.uBurnIntensity.value;
  }
  set burnIntensity(value: number) {
    this.uniforms.uBurnIntensity.value = value;
  }

  get darkenFactor() {
    return this.uniforms.uDarkenFactor.value;
  }
  set darkenFactor(value: number) {
    this.uniforms.uDarkenFactor.value = value;
  }
}

class SparklerStandardMaterial extends THREE.MeshStandardMaterial {
    constructor({
    baseColor = "dimgrey",
    burnColor = "cornsilk",
    trailColor = "orangered",
    burnIntensity = 1.5,
    darkenFactor = 0.1,
    trailWidth = 0.3,
    burnWidth = 0.05,
  }: Params = {}) { 
    super({ color: baseColor });

    this.userData.progress = new THREE.Uniform(0);
    this.userData.burnColor = new THREE.Uniform(new THREE.Color(burnColor));
    this.userData.trailColor = new THREE.Uniform(new THREE.Color(trailColor));
    this.userData.burnIntensity = new THREE.Uniform(burnIntensity);
    this.userData.darkenFactor = new THREE.Uniform(darkenFactor);
    this.userData.trailWidth = new THREE.Uniform(trailWidth);
    this.userData.burnWidth = new THREE.Uniform(burnWidth);

    this.onBeforeCompile = (shader) => {
      shader.uniforms.uProgress = this.userData.progress;
      shader.uniforms.uBurnColor = this.userData.burnColor;
      shader.uniforms.uTrailColor = this.userData.trailColor;
      shader.uniforms.uBurnIntensity = this.userData.burnIntensity;
      shader.uniforms.uDarkenFactor = this.userData.darkenFactor;
      shader.uniforms.uTrailWidth = this.userData.trailWidth;
      shader.uniforms.uBurnWidth = this.userData.burnWidth;

      // Inject varying to pass UVs to the fragment shader
      shader.vertexShader = `
          varying vec2 vUv;
          ${shader.vertexShader}
      `.replace(
        `#include <uv_vertex>`,
        `
          #include <uv_vertex>
          vUv = uv;
        `
      );

      // Modify the fragment shader
      shader.fragmentShader = `
          uniform float uProgress;
          uniform vec3 uBurnColor;
          uniform vec3 uTrailColor;
          uniform float uBurnWidth;
          uniform float uTrailWidth;
          uniform float uDarkenFactor;
          uniform float uBurnIntensity;
          varying vec2 vUv;
          ${shader.fragmentShader}
      `.replace(
        `#include <map_fragment>`,
        `
          // Darken everything below uProgress.
          float hasBurned = step(vUv.y, uProgress);
          vec3 burnedColor = 
            mix(diffuseColor.rgb, diffuseColor.rgb * uDarkenFactor, hasBurned);
  
          // Add a burning band.
          float bandStart = uProgress - uBurnWidth * 0.9;
          float bandEnd = uProgress + uBurnWidth * 0.1;
          float blendFactor =
            smoothstep(bandStart, uProgress, vUv.y) * 
            smoothstep(bandEnd, uProgress, vUv.y);
          
          diffuseColor.rgb = mix(burnedColor, uTrailColor, blendFactor);

          #include <map_fragment>
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <emissivemap_fragment>",
        `
          float emissiveBandStart = uProgress - uTrailWidth / 2.0;
          float emissiveBandEnd = uProgress + uTrailWidth / 2.0;
          float emissiveBlendFactor =
            smoothstep(emissiveBandStart, uProgress, vUv.y) *
            smoothstep(emissiveBandEnd, uProgress, vUv.y);
          
          float progress = 10.0 * uProgress;
          float flickerFactor = (2.0 + sin(progress * 7.0)) * (2.0 + sin(progress * 17.0)) / 3.0;
          vec3 burnColor = uBurnColor * flickerFactor;
          totalEmissiveRadiance = mix(totalEmissiveRadiance, burnColor, emissiveBlendFactor);
          #include <emissivemap_fragment>
        `
      );
    };
  }

  get progress() {
    return this.userData.progress.value;
  }
  set progress(value: number) {
    this.userData.progress.value = value;
  }

  get baseColor() {
    return this.color;
  }

  get trailColor() {
    return this.userData.trailColor.value;
  }

  get burnColor() {
    return this.userData.burnColor.value;
  }

  get burnWidth() {
    return this.userData.burnWidth.value;
  }
  set burnWidth(value: number) {
    this.userData.burnWidth.value = value;
  }

  get burnIntensity() {
    return this.userData.burnIntensity.value;
  }
  set burnIntensity(value: number) {
    this.userData.burnIntensity.value = value;
  }

  get darkenFactor() {
    return this.userData.darkenFactor.value;
  }
  set darkenFactor(value: number) {
    this.userData.darkenFactor.value = value;
  }

  get trailWidth() {
    return this.userData.trailWidth.value;
  }
  set trailWidth(value: number) {
    this.userData.trailWidth.value = value;
  }
}

export default SparklerStandardMaterial;
