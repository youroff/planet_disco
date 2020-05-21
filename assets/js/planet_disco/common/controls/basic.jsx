import React, { useRef, useEffect } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Quaternion } from 'three/src/math/Quaternion'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring/three'
import { MathUtils } from 'three/src/math/MathUtils'

const max_speed = 20

export default ({ maxDistance = 4, minDistance = 1.5}) => {
  const camera = useRef()
  const { gl, setDefaultCamera } = useThree()

  const [{ props }, set] = useSpring(() => ({
    props: [maxDistance, Math.PI / 2, 2 * Math.PI]
  }))

  const bind = useGesture({
    onDrag: ({ dragging, velocities: [x, y] }) => {
      if (dragging) {
        const [distance, phi, theta] = props.payload
        const p = MathUtils.clamp(phi.value - y / distance.value, 0.1, Math.PI - 0.1)
        // Handle wrapping somehow
        const t = theta.value - x / distance.value
        set({ props: [distance.value, p, t] })
      }
    },
    onWheel: ({ velocities: [_, y] }) => {
      const [distance, phi, theta] = props.payload
      const k = 1 + Math.sign(y) * Math.min(8 * Math.abs(y), max_speed) / (max_speed + 10)
      const d = MathUtils.clamp(k * distance.value, minDistance, maxDistance)
      set({ props: [d, phi.value, theta.value] })
    }
  }, { domTarget: gl.domElement })
  useEffect(bind, [bind])

  useEffect(() => void setDefaultCamera(camera.current), [])
  useFrame(() => camera.current.updateMatrixWorld())

  return <animated.perspectiveCamera
    ref={camera}
    position={props.interpolate((distance, phi, theta) => {
      return new Vector3().setFromSphericalCoords(distance, phi, theta).toArray()
    })}

    quaternion={props.interpolate((distance, phi, theta) => {
      const p = new Vector3().setFromSphericalCoords(distance, phi, theta)
      const m = new Matrix4().lookAt(p, new Vector3(0, 0, 0), new Vector3(0, 1, 0))
      return new Quaternion().setFromRotationMatrix(m).toArray()
    })}
  />
}