import React, { useState, Suspense, useEffect, useContext, useRef } from 'react'
import { useThree } from 'react-three-fiber'
import { PerspectiveCamera, OrbitControls } from 'drei'
import Effects from '../common/effects'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'
import { StoreContext } from '../common/store'
import { toRad } from '../common/utils'


export default () => {
  const [zoom, updateZoom] = useState(5)
  const camera = useRef()
  // const { camera } = useThree()
  const { currentCity } = useContext(StoreContext).state

  useEffect(() => {
    if (currentCity && camera.current) {
      const { lat, lng } = currentCity.coord
      camera.current.position.setFromSphericalCoords(zoom, toRad(lat - 90), toRad(lng - 90))
      camera.current.lookAt(0, 0, 0)
      camera.current.updateProjectionMatrix()
    }
  }, [currentCity])

  return <scene>
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[6, 0, 0]}
      zoom={2}
      up={[0, 1, 0]}
      far={100}
    />
    <OrbitControls
      change={console.log}
    />
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