uniform sampler2D uTexture;
uniform vec3 uColor;
varying float vRotation;

#define PI 3.1415926535897932384626433832795

void main() {
    float rotation = vRotation * PI * 2.0;
    vec2 center = vec2(0.5);
    mat2 rotationMatrix = mat2(
        cos(rotation), -sin(rotation),
        sin(rotation), cos(rotation)
    );
    vec2 rotatedCoord = rotationMatrix * (gl_PointCoord - center) + center;
    float textureAlpha = texture(uTexture, rotatedCoord).r;

    // Final color
    gl_FragColor = vec4(uColor, textureAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}