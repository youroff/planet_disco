import React, { useMemo } from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three/src/Three'
import {
  atmoVertexShader as vertexShader,
  atmoFragmentShader as fragmentShader
} from '../common/shaders'

export default function() {
  // const texture = useLoader(THREE.TextureLoader, "/images/earth-night.jpg")  
  const texture = useLoader(THREE.TextureLoader, "/images/8081_earthspec10k.gif")  
  // const bump = useLoader(THREE.TextureLoader, "/images/earth-topology.png")  
  // texture.magFilter = THREE.NearestFilter

  const atmo = useMemo(() => ({
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  }))

  return <group>
    <mesh position={[0, 0, 0]} receiveShadow castShadow>
      <sphereGeometry attach="geometry" args={[1, 64, 64]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>

    <mesh position={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1.1, 64, 64]} />
      <shaderMaterial attach="material" {...atmo} />
    </mesh>
  </group>
}
