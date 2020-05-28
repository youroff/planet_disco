import React, { useRef, useEffect } from 'react'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Quaternion } from 'three/src/math/Quaternion'
import { useThree, useFrame } from 'react-three-fiber'
import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from '@react-spring/three/index.cjs'
import { MathUtils } from 'three/src/math/MathUtils'

const maxSpeed = 20

export default ({
  speed = 5,
  maxDistance = 4,
  minDistance = 1.5,
  distance,
  phi = Math.PI / 2,
  theta = 2 * Math.PI,
  x = 0,
  y = 0,
  z = 0
}) => {
  const camera = useRef()
  const { gl, setDefaultCamera } = useThree()

  useEffect(() => {
    set({ props: [distance || maxDistance, phi, theta, x, y, z] })
  }, [distance, phi, theta, x, y, z])

  const [{ props }, set] = useSpring(() => ({
    props: [distance || maxDistance, phi, theta, x, y, z]
  }))

  const bind = useGesture({
    onDrag: ({ dragging, velocities: [xV, yV], event }) => {
      if (dragging) {
        const [distance, phi, theta, x, y, z] = props.get()
        const k = Math.sqrt(distance + 100) / speed
        const p = MathUtils.clamp(phi - yV / k, 0.1, Math.PI - 0.1)
        // Handle wrapping somehow
        const t = theta - xV / k
        set({ props: [distance, p, t, x, y, z] })
        event.stopPropagation()
      }
    },
    onWheel: ({ velocities: [_, yV] }) => {
      const [distance, phi, theta, x, y, z] = props.get()
      const k = 1 + Math.sign(yV) * Math.min(8 * Math.abs(yV), maxSpeed) / (maxSpeed + 10)
      const d = MathUtils.clamp(k * distance, minDistance, maxDistance)
      set({ props: [d, phi, theta, x, y, z] })
    }
  }, {
    drag: {
      capture: true
    },
    domTarget: gl.domElement
  })
  useEffect(bind, [bind])

  useEffect(() => void setDefaultCamera(camera.current), [])
  useFrame(() => camera.current.updateMatrixWorld())

  const getPosition = (distance, phi, theta, x, y, z) => {
    const p = new Vector3().setFromSphericalCoords(distance, phi, theta)
    const m = new Matrix4().makeTranslation(x, y, z)
    p.applyMatrix4(m)
    return p.toArray()
  }

  const getQuaternion = (distance, phi, theta, x, y, z) => {
    const p = getPosition(distance, phi, theta, x, y, z)
    const m = new Matrix4().lookAt(new Vector3(...p), new Vector3(x, y, z), new Vector3(0, 1, 0))
    return new Quaternion().setFromRotationMatrix(m).toArray()
  }

  return <animated.perspectiveCamera
    ref={camera}
    position={props.to(getPosition)}
    quaternion={props.to(getQuaternion)}
  />
}