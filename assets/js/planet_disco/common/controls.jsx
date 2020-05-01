import * as THREE from 'three/src/Three'
import React, { useRef, useEffect, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { useThree, useFrame, extend } from 'react-three-fiber'

extend({OrbitControls})

export default function({onZoom, onRotate}) {
  const controls = useRef()
  const [zoom, setZoom] = useState()
  const [rotation, setRotation] = useState()
  const {camera, gl} = useThree()
  camera.zoom = 0.5
  camera.setFocalLength(60)
  camera.updateProjectionMatrix()

  useFrame(() => controls.current.update())

  useEffect(() => {
    onZoom && zoom && onZoom(zoom)
  }, [zoom])

  useEffect(() => {
    onRotate && onRotate(rotation)
  }, [rotation])

  useEffect(() => {
    if (controls.current) {
      controls.current.addEventListener('change', (e) => {
        const coord = new THREE.Spherical()
        coord.setFromVector3(e.target.object.position)
        const {radius, phi, theta} = coord
        setZoom(radius.toFixed(2))
        setRotation({phi: phi.toFixed(3), theta: theta.toFixed(3)})
      })
    }
  }, [controls])

  return (
    <orbitControls
      ref={controls}
      rotateSpeed={1}
      minDistance={1.3}
      maxDistance={5}
      enablePan={false}
      enableDamping
      dampingFactor={0.1}
      zoomSpeed={1}
      args={[camera, gl.domElement]}
    />
  )
}