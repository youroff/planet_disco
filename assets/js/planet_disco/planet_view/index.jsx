import React, { Suspense, useContext, useState, useEffect } from 'react'
import Effects from '../common/effects'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'
import ControlsTilted from '../common/controls_tilted'
import { StoreContext } from '../common/store'
import { toRad } from '../common/utils'

export default () => {
  const { state: { city } } = useContext(StoreContext)
  const [external, setExternal] = useState()

  useEffect(() => {
    if (city) {
      console.log(city.coord.lat, city.coord.lng)
    }

    setExternal(city && {
      distance: 2,
      phi: toRad(90 - city.coord.lat),
      theta: toRad(city.coord.lng + 90)
    })
  }, [city])

  return <scene>
    <ControlsTilted external={external} />
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