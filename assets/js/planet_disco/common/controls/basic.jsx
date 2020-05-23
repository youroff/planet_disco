import React, { useRef, useEffect } from 'react'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Quaternion } from 'three/src/math/Quaternion'
import { useThree, useFrame } from 'react-three-fiber'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from '@react-spring/three'
import { MathUtils } from 'three/src/math/MathUtils'

const maxSpeed = 20
const def_phi = Math.PI / 2 * 0.7
const def_theta = 2 * Math.PI * 1.3

export default ({ speed = 5, maxDistance = 4, minDistance = 1.5, external }) => {
  const camera = useRef()
  const { gl, setDefaultCamera } = useThree()

  useEffect(() => {
    if (external) {
      set({ props: [external.distance, external.phi, 2 * Math.PI + external.theta] })
    } else {
      set({ props: [maxDistance, def_phi, def_theta] })
    }
  }, [external])

  const [{ props }, set] = useSpring(() => ({
    props: [maxDistance, def_phi, def_theta]
  }))

  const bind = useGesture({
    onDrag: ({ dragging, velocities: [x, y] }) => {
      if (dragging) {
        const [distance, phi, theta] = props.get()
        const k = Math.sqrt(distance + 100) / speed
        const p = MathUtils.clamp(phi - y / k, 0.1, Math.PI - 0.1)
        // Handle wrapping somehow
        const t = theta - x / k
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

  const getPoi = (phi, theta) => new Vector3().setFromSphericalCoords(1, phi, theta)

  const calcPosition = (distance, phi, theta) => {
    const poi = getPoi(phi, theta)
    const ext = new Vector3().setFromSphericalCoords(
      distance - 1,
      phi + (1 - (distance - minDistance) / (maxDistance - minDistance)) * Math.PI / 3,
      theta
    )
    return poi.add(ext).toArray()
  }

  return <animated.perspectiveCamera
    ref={camera}
    position={props.to((distance, phi, theta) => {
      return new Vector3().setFromSphericalCoords(distance, phi, theta).toArray()
    })}

    quaternion={props.to((distance, phi, theta) => {
      const p = new Vector3().setFromSphericalCoords(distance, phi, theta)
      const m = new Matrix4().lookAt(p, new Vector3(0, 0, 0), new Vector3(0, 1, 0))
      return new Quaternion().setFromRotationMatrix(m).toArray()
    })}
  />
}