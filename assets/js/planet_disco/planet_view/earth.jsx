import React, { useMemo } from 'react'
import { useLoader } from 'react-three-fiber'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import { BackSide, AdditiveBlending } from 'three/src/constants'
import { vertexShader, fragmentShader } from '../shaders/atmo'

export default function() {
  const texture = useLoader(TextureLoader, "/images/earth-night.jpg")  
  // const texture = useLoader(TextureLoader, "/images/8081_earthspec10k.gif")  
  const bump = useLoader(TextureLoader, "/images/earth-topology.png")  

  const atmo = useMemo(() => ({
    vertexShader,
    fragmentShader,
    side: BackSide,
    blending: AdditiveBlending,
    transparent: true
  }))

  return <group>
    <mesh position={[0, 0, 0]} receiveShadow castShadow>
      <sphereGeometry attach="geometry" args={[1, 64, 64]} />
      <meshStandardMaterial attach="material" map={texture} bumpMap={bump} roughness={0.8} />
    </mesh>

    <mesh position={[0, 0, 0]}>
      <sphereGeometry attach="geometry" args={[1.2, 64, 64]} />
      <shaderMaterial attach="material" {...atmo} />
    </mesh>
  </group>
}
