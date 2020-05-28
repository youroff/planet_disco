export const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize( normalMatrix * normal );
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }
`

export const fragmentShader = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow( 0.6 - dot( vNormal, vec3( 0, 0, 1.0 ) ), 5.0 );
    gl_FragColor = vec4( 0.81, 0.87, 1.0, 0.4 ) * intensity;
  }
`
