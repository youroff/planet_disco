import React, { Suspense } from 'react'
import Effects from '../common/effects'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'
import Controls from '../common/controls'

export default () => {

  return <scene>
    <Controls />
    <ambientLight intensity={0.3} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
    <Stars radius={5} particles={30000} />
    <Suspense fallback={null}>
      <Earth />
      <Cities />
    </Suspense>
    <Effects />
  </scene>
}