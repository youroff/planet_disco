import React, { useState, Suspense, useEffect } from 'react'
import { useThree } from 'react-three-fiber'
import Controls from '../common/controls'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'
import { toRad } from '../common/utils'


export default function ({ currentCity }) {
  const [zoom, updateZoom] = useState(5)

  const { camera } = useThree()

  const updateCity = () => {
    if (currentCity) {
      const { lat, lng } = currentCity.coord
      camera.position.setFromSphericalCoords(zoom, toRad(lat - 90), toRad(lng - 90))
      camera.lookAt(0, 0, 0)
      camera.updateProjectionMatrix()
    }
  }

  useEffect(() => {
   updateCity() 
  })

  return <scene>
    <Controls onZoom={updateZoom} />
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