export const vertexShader = `
  attribute float instanceHeight;
  attribute vec3 instanceColor;
  varying vec3 vInstanceColor;
  
  void main() {
    vInstanceColor = instanceColor;
    mat4 sPos = mat4(vec4(1.0,0.0,0.0,0.0),
                     vec4(0.0,1.0,0.0,0.0),
                     vec4(0.0,0.0,instanceHeight,0.0),
                     vec4(0.0,0.0,0.0,1.0));

    vec4 mvPosition = modelViewMatrix * instanceMatrix * sPos * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`

export const fragmentShader = `
  varying vec3 vInstanceColor;

  void main() {
    gl_FragColor = vec4(vInstanceColor, 1.0);
  }
`
