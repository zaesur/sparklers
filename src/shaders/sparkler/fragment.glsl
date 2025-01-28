uniform float uProgress;
uniform vec3 uBaseColor;
uniform vec3 uBurnColor;
uniform vec3 uTrailColor;
uniform vec3 uBurntColor;
uniform float uTrailWidth;
uniform float uBurnWidth;
uniform float uBurnIntensity;
varying vec2 vUv;

void main() {
    vec3 color = uBaseColor;

    // Burnt
    float hasBurned = step(vUv.y, uProgress);
    color = mix(color, uBurntColor, hasBurned);

    // Trail
    float isTrail = hasBurned * smoothstep(uProgress - uTrailWidth, uProgress, vUv.y);
    color = mix(color, uTrailColor, isTrail);

    // Burn
    float isBurning = hasBurned * smoothstep(uProgress - uBurnWidth, uProgress, vUv.y);
    color = mix(color, uBurnColor * uBurnIntensity, isBurning);

    gl_FragColor = vec4(color, 1.0);
}