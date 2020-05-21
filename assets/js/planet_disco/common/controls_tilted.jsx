import * as THREE from 'three/src/Three'
import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from '@react-spring/three'
import { MathUtils } from 'three/src/math/MathUtils'

const maxSpeed = 20

export default ({ maxDistance = 4, minDistance = 1.5, external }) => {
  const camera = useRef()
  const { gl, setDefaultCamera } = useThree()

  useEffect(() => {
    if (external) {
      set({ props: [external.distance, external.phi, 2 * Math.PI + external.theta] })
    } else {
      set({ props: [maxDistance, Math.PI / 2, 2 * Math.PI] })
    }
  }, [external])

  const [{ props }, set] = useSpring(() => ({
    props: [maxDistance, Math.PI / 2, 2 * Math.PI]
  }))

  const bind = useGesture({
    onDrag: ({ dragging, velocities: [x, y] }) => {
      if (dragging) {
        const [distance, phi, theta] = props.get()
        const p = MathUtils.clamp(phi - y / distance, 0.1, Math.PI - 0.1)
        // Handle wrapping somehow
        const t = theta - x / distance
        set({ props: [distance, p, t] })
      }
    },
    onWheel: ({ velocities: [_, y] }) => {
      const [distance, phi, theta] = props.get()
      const k = 1 + Math.sign(y) * Math.min(8 * Math.abs(y), maxSpeed) / (maxSpeed + 10)
      const d = MathUtils.clamp(k * distance, minDistance, maxDistance)
      set({ props: [d, phi, theta] })
    }
  }, { domTarget: gl.domElement })
  useEffect(bind, [bind])

  useEffect(() => void setDefaultCamera(camera.current), [])
  useFrame(() => camera.current.updateMatrixWorld())

  const getPoi = (phi, theta) => new THREE.Vector3().setFromSphericalCoords(1, phi, theta)

  const calcPosition = (distance, phi, theta) => {
    const poi = getPoi(phi, theta)
    const ext = new THREE.Vector3().setFromSphericalCoords(
      distance - 1,
      phi + (1 - (distance - minDistance) / (maxDistance - minDistance)) * Math.PI / 3,
      theta
    )
    return poi.add(ext).toArray()
  }

  return <animated.perspectiveCamera
    ref={camera}
    position={props.interpolate(calcPosition)}

    quaternion={props.interpolate((distance, phi, theta) => {
      const poi = getPoi(phi, theta)
      const pos = calcPosition(distance, phi, theta)
      const m = new THREE.Matrix4().lookAt(new THREE.Vector3(...pos), poi, new THREE.Vector3(0, 1, 0))
      return new THREE.Quaternion().setFromRotationMatrix(m).toArray()
    })}
  />
}