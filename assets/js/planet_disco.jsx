import React, { useRef, useEffect, Suspense, useState } from 'react'
import * as THREE from 'three/src/Three'
import { Canvas, extend, useThree } from 'react-three-fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Earth } from './earth'
import { Cities } from './cities'
import Sky from './sky'
import { ApolloConsumer, ApolloProvider } from '@apollo/react-hooks'

extend({ OrbitControls })

const Scene = () => {
  const controls = useRef()
  const [zoom, setZoom] = useState(5)
  const { camera, gl } = useThree()
  camera.zoom = 0.5
  camera.setFocalLength(60)
  camera.updateProjectionMatrix()

  useEffect(() => {
    if (controls.current) {
      controls.current.addEventListener('change', (e) => {
        // setZoom(Math.round(e.target.object.position.distanceTo(new THREE.Vector3(0, 0, 0))))
        setZoom(e.target.object.position.distanceTo(new THREE.Vector3(0, 0, 0)))
      })
    }
    // return () => controls.current.removeEventListener('change')
  }, [controls])

  return (
    <>
      <ambientLight intensity={0.3} />
      {/* <pointLight intensity={20} position={[-2, -3, -2]} color="#200f20" /> */}
      <spotLight
        castShadow
        intensity={1}
        angle={Math.PI / 8}
        position={[20, 10, 20]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
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
        <Earth />
        <Cities zoom={zoom} />
      </Suspense>
    </>
  )
}

export default () => {
  return <ApolloConsumer client>
    {client => (
      <Canvas
        onCreated={({ gl }) => {
          gl.gammaInput = true
          gl.toneMapping = THREE.ACESFilmicToneMapping
        }}
        shadowMap>
        <ApolloProvider client={client}>
          <Scene />
        </ApolloProvider>
      </Canvas>
    )}
  </ApolloConsumer>
}
