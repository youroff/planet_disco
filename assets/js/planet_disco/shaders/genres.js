export const shaderPatch = (shader) => {
  shader.vertexShader = [
    'attribute float instanceAlpha;',
    'varying float vInstanceAlpha;',
    'attribute vec3 emissiveColor;',
    'varying vec3 vEmissiveColor;',
    shader.vertexShader
  ].join('\n').replace(
    '#include <begin_vertex>',
    [
      '#include <begin_vertex>;',
      'vInstanceAlpha = instanceAlpha;',
      'vEmissiveColor = emissiveColor;'
    ].join('\n')
  )
  
  shader.fragmentShader = [
    'varying float vInstanceAlpha;',
    'varying vec3 vEmissiveColor;',
    shader.fragmentShader
  ].join('\n').replace(
    'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
    [
      'diffuseColor.a *= saturate( vInstanceAlpha + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );',
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'
    ].join('\n')
  ).replace(
    'vec3 totalEmissiveRadiance = emissive;',
    'vec3 totalEmissiveRadiance = vEmissiveColor * 0.1;'
  )
}

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
