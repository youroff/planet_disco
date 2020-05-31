import React, { useMemo } from 'react'
import { useFrame, useUpdate } from 'react-three-fiber'
import { Vector3 } from 'three/src/math/Vector3'
import { Spherical } from 'three/src/math/Spherical'
import { Color } from 'three/src/math/Color'
import { BufferAttribute } from 'three/src/core/BufferAttribute'
import { AdditiveBlending as Blending } from 'three/src/constants'
import { vertexShader, fragmentShader } from '../shaders/stars'

const genStar = (r) => {
  return new Vector3().setFromSpherical(new Spherical(
    r,
    Math.acos(1 - Math.random() * 2),
    Math.random() * 2 * Math.PI
  ))
}

export default ({ radius, depth = 50, particles }) => {

  const uniforms = useMemo(() => ({
    time: { value: 0.0 }
  }), [])

  useFrame((state) => {
    uniforms.time.value = state.clock.elapsedTime
  })

  const geometry = useUpdate(geo => {
    const positions = []
    const colors = []
    const sizes = Array.from({length: particles}, () => 0.5 + 0.5 * Math.random())
    const color = new Color()
    let r = radius + depth
    const increment = depth / particles
    for ( var i = 0; i < particles; i ++ ) {
      r -= increment * Math.random()
      positions.push(...genStar(r).toArray())
      color.setHSL(i / particles, 1.0, 0.9)
      colors.push(color.r, color.g, color.b)
    }
    geo.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
    geo.setAttribute('color', new BufferAttribute(new Float32Array(colors), 3))
    geo.setAttribute('size', new BufferAttribute(new Float32Array(sizes), 1))
  }, [])

  return <points>
    <bufferGeometry ref={geometry} attach="geometry" />
    <shaderMaterial attach="material"
        uniforms={uniforms}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        blending={Blending}
        // depthTest={false}
        transparent
        vertexColors
    />
  </points>
}