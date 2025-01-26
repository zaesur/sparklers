uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;
attribute float aSize;

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

void main()
{
    float progress = mod(uProgress + aSize, 1.0);

    vec3 newPosition = position;
    float newSize = aSize;

    // Exploding
    // float explodingProgress = remap(progress, 0.0, 0.1, 0.0, 1.0);
    float explodingProgress = progress;
    explodingProgress = clamp(explodingProgress, 0.0, 1.0);
    explodingProgress = 1.0 - pow(1.0 - explodingProgress, 3.0);
    newPosition = mix(vec3(0.0), newPosition, explodingProgress);

    // Falling
    float fallingProgress = remap(progress, 0.1, 1.0, 0.0, 1.0);
    fallingProgress = clamp(fallingProgress, 0.0, 1.0);
    fallingProgress = 1.0 - pow(1.0 - fallingProgress, 3.0);
    // newPosition.y -= fallingProgress * 0.2;

    // Scaling
    float sizeOpeningProgress = remap(progress, 0.0, 0.7, 0.0, 1.0);
    float sizeClosingProgress = remap(progress, 0.7, 1.0, 1.0, 0.0);
    float sizeProgress = min(sizeOpeningProgress, sizeClosingProgress);
    // newSize *= clamp(sizeProgress, 0.0, 1.0);

    // Twinkling
    float twinklingProgress = remap(progress, 0.2, 0.8, 0.0, 1.0);
    twinklingProgress = clamp(twinklingProgress, 0.0, 1.0);
    float sizeTwinkling = sin(uProgress * 30.0) * 0.5 + 0.5;
    // newSize *= 1.0 - sizeTwinkling + twinklingProgress;

    // Final position
    vec4 modelPosition = modelMatrix * vec4(newPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final size
    gl_PointSize = uSize * uResolution.y * newSize;
    gl_PointSize *= 1.0 / - viewPosition.z;
}