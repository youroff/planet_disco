import React, { useRef, useRender } from 'react'
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Earth from './earth'

extend({ OrbitControls })

// const Controls = props => {
//   const { camera } = useThree()
//   const controls = useRef()
//   useRender(() => controls.current && controls.current.update())
//   return <orbitControls ref={controls} args={[camera]} {...props} />
// }

const Scene = () => {
  const {
    camera,
    gl: { domElement }
  } = useThree()
  // camera.zoom = 0.5
  // camera.setFocalLength(35)
  // camera.updateProjectionMatrix()
  // console.log(camera)

  return (
    <>
      <ambientLight />
      <orbitControls
        // rotateSpeed={0.1}
        // minZoom={0.2}
        // maxZoom={1.0}
        // minDistance={0.1}
        // maxDistance={1.5}
        enableDamping dampingFactor={0.1} rotateSpeed={0.01}
        zoomSpeed={0.5}
        args={[camera, domElement]}
      />
      {/* <pointLight position={[10, 10, 10]} /> */}
      <Earth position={[0, 0, 0]}/>
      <orbitControls args={[camera, domElement]} />
    </>
  )
}

export default function(props) {
  return <Canvas>
    <Scene />
  </Canvas>;
}
