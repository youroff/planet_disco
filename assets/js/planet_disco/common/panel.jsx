import * as THREE from 'three/src/Three'
import React, { useState, useRef } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
// import { Dom } from 'react-three-fiber'

// export default () => {
//   return <Dom>
//     <div style={{ color: 'white', transform: 'translate3d(-100%,100%,0)', background: "white" }}>ХУЙ</div>
//   </Dom>  
// }

export default () => {
  const scene = useRef()
  const {camera} = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = false), gl.clearDepth(), gl.render(scene.current, camera)), 10)
  
  return <scene ref={scene}>
    <mesh position={[1, 1, 1]}>
      <sphereBufferGeometry attach="geometry" args={[3, 64, 64]} />
      <meshBasicMaterial attach="material" color='hotpink' />
    </mesh>
  </scene>
}