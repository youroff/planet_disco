import React, { useMemo } from 'react'
import { useLoader } from 'react-three-fiber'
import * as THREE from 'three/src/Three'


const fromGPS = ({lat, lng}, r = 1) => {
  const phi = (lat - 90) * Math.PI / 180
  const theta = (180 - lng) * Math.PI / 180

  return {
    x: r * Math.sin(phi) * Math.cos(theta),
    y: r * Math.cos(phi),
    z: r * Math.sin(phi) * Math.sin(theta)
  }
}

export function City({coord}) {
  const { x, y, z } = fromGPS(coord)
  
  // console.log()
  const material = useMemo(() => ({
    color: 0xff3333//,
    // vertexColors: THREE.FaceColors,
    // morphTargets: false
  }))


  const positions = useMemo(() => new Float32Array([x, y, z]))

  // console.log(positions)
  return (
    <mesh position={[x, y, z]} castShadow>
      <sphereBufferGeometry attach="geometry" args={[0.005, 8, 8]} />
      {/* <boxGeometry attach="geometry" args={[1.1, 0.005, 0.005]}> */}
        {/* <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        /> */}
      {/* </boxGeometry> */}
      <meshBasicMaterial opacity={0.5} attach="material" {...material} />
    </mesh>
  )
}