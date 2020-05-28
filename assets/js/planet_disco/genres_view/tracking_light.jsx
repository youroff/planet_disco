import React from 'react'
import { useSpring, a } from '@react-spring/three/index.cjs'

export default ({ x, y, z, color }) => {

  const props = useSpring({
    x, y, z, color
  })

  return <a.pointLight
    position-x={props.x}
    position-y={props.y}
    position-z={props.z}
    color={props.color}
  />
}