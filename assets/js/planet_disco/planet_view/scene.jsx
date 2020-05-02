import React, { useState, Suspense } from 'react'
import Controls from '../common/controls'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'

export default function({currentCity}) {
  const [zoom, updateZoom] = useState(5)

  console.log(currentCity)

  return <scene>
    <Controls onZoom={updateZoom}/>
    <ambientLight intensity={0.3} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
      // color="yellow"
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
    />
    <Stars radius={10} particles={10000} />
    <Suspense fallback={null}>
      <Earth />
      <Cities zoom={zoom} />
    </Suspense>
  </scene>
}