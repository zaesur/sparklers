uniform float uProgress;
uniform vec3 uBaseColor;
uniform vec3 uBurnColor;
uniform vec3 uTrailColor;
uniform float uTrailWidth;
uniform float uBurnWidth;
uniform float uBurnIntensity;
uniform float uDarkenFactor;
varying vec2 vUv;

void main() {
    vec3 color = uBaseColor;

    // Burnt
    float hasBurned = step(vUv.y, uProgress);
    color = mix(color, color * uDarkenFactor, hasBurned);

    // Trail
    float isTrail = hasBurned * smoothstep(uProgress - uTrailWidth, uProgress, vUv.y);
    color = mix(color, uTrailColor, isTrail);

    csm_DiffuseColor = vec4(color, 1.0);

    // Burn
    float isBurning = hasBurned * smoothstep(uProgress - uBurnWidth, uProgress, vUv.y);
    color = mix(color, uBurnColor * uBurnIntensity, isBurning);

    float smallFlickerFactor = (2.0 + sin(uProgress * 999.0)) * 0.5;
    float largeFlickerFactor = (2.0 + sin(uProgress * 137.0)) * 0.5;
    float flickerFactor = smallFlickerFactor * largeFlickerFactor * uBurnIntensity;

    csm_Emissive = mix(vec3(0.0), uBurnColor * flickerFactor, isBurning);

}