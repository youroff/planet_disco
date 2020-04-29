import React, { useRef, useRender } from 'react'
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Earth from './earth'
import Sky from './sky'

extend({ OrbitControls })

const Scene = () => {
  const { camera, gl } = useThree()
  camera.zoom = 0.5
  camera.setFocalLength(60)
  camera.updateProjectionMatrix()

  return (
    <>
      <ambientLight />
      <orbitControls
        rotateSpeed={1}
        minDistance={2}
        maxDistance={5}
        enablePan={false}
        enableDamping
        dampingFactor={0.5}
        zoomSpeed={1}
        args={[camera, gl.domElement]}
      />
      <Sky />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Earth position={[0, 0, 0]}/>
    </>
  )
}

export default function(props) {
  return <Canvas>
    <Scene />
  </Canvas>;
}
