import React from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three/src/Three'

export default function() {
  // const texture = useLoader(THREE.TextureLoader, "/images/earth4.jpg")  
  const texture = useLoader(THREE.TextureLoader, "/images/8081_earthspec10k.gif")  
  texture.magFilter = THREE.NearestFilter

  return (
    <mesh position={[0, 0, 0]} receiveShadow castShadow>
      <sphereGeometry attach="geometry" args={[1, 64, 64]} />
      <meshStandardMaterial attach="material" map={texture} />
    </mesh>
  )
}
