uniform float uProgress;
uniform vec3 uBaseColor;
uniform vec3 uBurnColor;
uniform vec3 uTrailColor;
uniform vec3 uBurntColor;
varying vec2 vUv;

void main() {
    vec3 color = uBaseColor;

    // Burnt
    float hasBurned = step(vUv.y, uProgress);
    color = mix(color, uBurntColor, hasBurned);

    // Trail
    float trailWidth = 0.15;
    float isTrail = hasBurned * smoothstep(uProgress - trailWidth, uProgress, vUv.y);
    color = mix(color, uTrailColor, isTrail);

    // Burn
    float burnWidth = 0.05;
    float burnFactor = 1.5;
    float isBurning = smoothstep(uProgress - burnWidth / 2.0, uProgress, vUv.y) *
        smoothstep(uProgress + burnWidth / 2.0, uProgress, vUv.y);
    color = mix(color, uBurnColor * burnFactor, isBurning);

    gl_FragColor = vec4(color, 1.0);
}