uniform float uSize;
uniform vec2 uResolution;
uniform float uProgress;
attribute float aSize;
attribute float aOffset;
attribute float aRotation;
varying float vRotation;

#define PI 3.1415926535897932384626433832795

float remap(float value, float originMin, float originMax, float destinationMin, float destinationMax)
{
    return destinationMin + (value - originMin) * (destinationMax - destinationMin) / (originMax - originMin);
}

float easeOutCubic(float t) {
    return 1.0 - pow(1.0 - t, 3.0);
}

float easeOutSine(float t) {
    return sin((t * PI) / 2.0);
}

float calcualateIndiviualProgress(float globalProgress, float start, float duration) {
    // Make sure all animations finish at 1.0.
    float newStart = remap(start, 0.0, 1.0, 0.0, 1.0 - duration);

    float isActive = step(newStart, globalProgress) * step(globalProgress, newStart + duration);
    float individualProgress = remap(globalProgress, newStart, newStart + duration, 0.0, 1.0);

    return isActive * individualProgress;
}

void main()
{
    vRotation = aRotation;
    float duration = 0.007;
    float individualProgress = calcualateIndiviualProgress(uProgress, aOffset, duration);

    float targetSize = uSize * aSize;
    vec3 targetPosition = position;

    // Explode
    targetPosition *= individualProgress * aSize;

    // Scale
    targetSize *= easeOutSine(individualProgress);


    // Final position
    vec4 modelPosition = modelMatrix * vec4(targetPosition, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    // Final size
    gl_PointSize = uResolution.y * targetSize;
    gl_PointSize *= 1.0 / - viewPosition.z;
}