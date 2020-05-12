import React, { Suspense } from 'react'
import Controls from '../common/controls'
import Box from './box'

export default () => {
  return <scene>
    <Controls />
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