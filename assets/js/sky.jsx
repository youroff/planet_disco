import React, { useRef, useState, useMemo } from 'react'
import * as THREE from 'three/src/Three'
import { useFrame } from 'react-three-fiber'

const radius = 10
const particles = 10000

const vertexShader = `
  attribute float size;
  varying vec3 vColor;

  void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 0.5);
    gl_PointSize = size * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const fragmentShader = `
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
    gl_FragColor = gl_FragColor * texture2D(pointTexture, gl_PointCoord);
  }
`
const genStar = (r1, r2) => {
  const r = r1 + Math.random() * (r2 - r1)
  const theta = Math.random() * 2 * Math.PI
  const phi = Math.acos(1 - Math.random() * 2)
  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.sin(phi) * Math.sin(theta),
    z: r * Math.cos(phi)
  }
}

export default function() {
  const geometry = useRef()
  const gInit = useMemo(() => {
    const positions = []
    const colors = []
    const sizes = []

    const color = new THREE.Color();

    for ( var i = 0; i < particles; i ++ ) {
      const {x, y, z} = genStar(radius, radius + 50)
      positions.push(x)
      positions.push(y)
      positions.push(z)
      color.setHSL(i / particles, 1.0, 0.9)
      colors.push(color.r, color.g, color.b)
      sizes.push(0.5)
    }

    return {
      positions: new Float32Array(positions),
      colors: new Float32Array(colors),
      sizes: new Float32Array(sizes)
    }
  })

  const material = useMemo(() => ({
    uniforms: {
      pointTexture: {
        value: new THREE.TextureLoader().load("/images/spark1.png")
      }
    },
    fragmentShader,
    vertexShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: false,
    vertexColors: true  
  }), [])

  useFrame((state) => {
    if (geometry.current) {
      let sizes = geometry.current.attributes.size.array
      for ( var i = 0; i < particles; i ++ ) {
        sizes[i] = 0.4 + 0.2 * Math.sin(0.1 * i + 2 * state.clock.elapsedTime)
      }
      geometry.current.attributes.size.needsUpdate = true  
    }
  })

  return (
    <points>
      <bufferGeometry ref={geometry} attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={gInit.positions.length / 3}
          array={gInit.positions}
          itemSize={3} 
        />
        <bufferAttribute
          attachObject={['attributes', 'color']}
          count={gInit.colors.length / 3}
          array={gInit.colors}
          itemSize={3} 
        />
        <bufferAttribute
          attachObject={['attributes', 'size']}
          count={gInit.sizes.length}
          array={gInit.sizes}
          itemSize={1}
          usage={THREE.DynamicDrawUsage}
        />
      </bufferGeometry>
      <shaderMaterial attach="material" {...material} />
    </points>
  )
}