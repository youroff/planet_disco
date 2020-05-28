import React, { useMemo } from 'react'
import { useFrame, useUpdate } from 'react-three-fiber'
import { Vector3 } from 'three/src/math/Vector3'
import { Spherical } from 'three/src/math/Spherical'
import { Color } from 'three/src/math/Color'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { BufferAttribute } from 'three/src/core/BufferAttribute'
import { AdditiveBlending, DynamicDrawUsage } from 'three/src/constants'
import { vertexShader, fragmentShader } from '../shaders/stars'

const genStar = (r1, r2) => {
  return new Vector3().setFromSpherical(new Spherical(
    r1 + Math.random() * (r2 - r1),
    Math.acos(1 - Math.random() * 2),
    Math.random() * 2 * Math.PI
  ))
}

export default ({ radius, particles }) => {
  const material = useMemo(() => ({
    uniforms: {
      time: { value: 0.0 },
      pointTexture: { value: new TextureLoader().load("/images/spark1.png") }
    },
    fragmentShader,
    vertexShader,
    blending: AdditiveBlending,
    depthTest: false,
    transparent: false,
    vertexColors: true  
  }))

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime
  })

  const geometry = useUpdate(geo => {
    const positions = []
    const colors = []
    const sizes = Array.from({length: particles}, () => 0.5 + 0.5 * Math.random())
    const color = new Color()
    for ( var i = 0; i < particles; i ++ ) {
      positions.push(...genStar(radius, radius + 50).toArray())
      color.setHSL(i / particles, 1.0, 0.9)
      colors.push(color.r, color.g, color.b)
    }

    geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
    geo.setAttribute('size', new BufferAttribute(new Float32Array(sizes), 1).setUsage(DynamicDrawUsage))
  }, [])

  return <points>
    <bufferGeometry ref={geometry} attach="geometry" />
    <shaderMaterial attach="material" {...material} />
  </points>
}