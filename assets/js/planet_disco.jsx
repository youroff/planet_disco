import React, { useRef, useEffect, Suspense } from 'react'
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Earth } from './earth'
import Sky from './sky'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'

extend({ OrbitControls })

const Scene = () => {
  const controls = useRef()
  useEffect(() => {
    if (controls.current) {
      controls.current.addEventListener('change', (e) => {
        // Do stuff on camera move
        // console.log(e)
      })
    }
    // return () => ___cleanup___
  }, [controls])


  const { camera, gl } = useThree()
  camera.zoom = 0.5
  camera.setFocalLength(60)
  camera.updateProjectionMatrix()

  return (
    <>
      <ambientLight />
      <orbitControls
        ref={controls}
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
      <Suspense fallback={null}>
        <Earth position={[0, 0, 0]}/>
      </Suspense>
    </>
  )
}

export default () => {
  return <ApolloConsumer client>
    {client => (
      <Canvas>
        <ApolloProvider client={client}>
          <Scene />
        </ApolloProvider>
      </Canvas>
    )}
  </ApolloConsumer>
}
