import React, { useState, Suspense, useRef, useEffect } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import Controls from '../common/controls'
import Panel from '../common/panel'
import Stars from './stars'
import Earth from './earth'
import Cities from './cities'


const Main = () => {
  const [zoom, updateZoom] = useState(5)
  // console.log(zoom)
  const scene = useRef()
  const { camera } = useThree()
  useFrame(({ gl }) => void ((gl.autoClear = true), gl.render(scene.current, camera)), 100)
  return <scene ref={scene}>
    <Controls onZoom={updateZoom} camera={camera}/>
    <ambientLight intensity={0.3} />
    <spotLight
      castShadow
      intensity={1}
      angle={Math.PI / 8}
      position={[20, 10, 20]}
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

export default function() {
  // const camera = useRef()
  // const { size, setDefaultCamera } = useThree()
  // useEffect(() => void setDefaultCamera(camera.current), [])
  // useFrame(() => camera.current.updateMatrixWorld())

  return (<>
    {/* <perspectiveCamera
      ref={camera}
      aspect={size.width / size.height}
      radius={(size.width + size.height) / 4}
      onUpdate={self => self.updateProjectionMatrix()}
    /> */}
    <Main/>
    <Panel/>
  </>)
}