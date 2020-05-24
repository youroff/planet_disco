import React, { Suspense, useRef } from 'react'
import Box from './box'

export default () => {
  const cam = useRef()

  return <scene>
    {/* <MapControls />
    <OrthographicCamera
      ref={cam}
      position={[0, 0, 50]}
      zoom={10}
      up={[0, 0, 1]}
      far={10000}
    /> */}
    <ambientLight intensity={0.3} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      shadow-mapSize-width={8192}
      shadow-mapSize-height={8192}
    />
    <Suspense fallback={null}>
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Suspense>
  </scene>
}