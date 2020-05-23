export const vertexShader = `
  attribute vec3 instanceColor;
  varying vec3 vInstanceColor;

  attribute float instanceAlpha;
  varying float vInstanceAlpha;
  
  void main() {
    vInstanceColor = instanceColor;
    vInstanceAlpha = instanceAlpha;
    vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fragmentShader = `
  varying vec3 vInstanceColor;
  varying float vInstanceAlpha;

  void main() {
    gl_FragColor = vec4( vInstanceColor, vInstanceAlpha );
  }
`
