export const vertexShader = `
  uniform float time;
  attribute float size;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
    gl_PointSize = size * (30.0 / -mvPosition.z) * (3.0 + sin(mvPosition.x + 2.0 * size * time + 100.0 * size));
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fragmentShader = `
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  void main() {

    // Distance from 0.0 to 0.5 from the center of the point
    float d = distance(gl_PointCoord, vec2(0.5, 0.5));

    // Applying sigmoid to smoothen the border
    float opacity = 1.0 / (1.0 + exp(16.0 * (d - 0.25)));

    gl_FragColor = vec4(vColor, opacity);
  }
`
