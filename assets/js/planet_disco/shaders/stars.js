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
    gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor *= texture2D(pointTexture, gl_PointCoord);
  }
`
