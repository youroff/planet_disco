import React from 'react'
// import { useUpdate } from 'react-three-fiber'
import { useSpring, a } from '@react-spring/three'

export default ({ x, y, z, color }) => {

  const props = useSpring({
    x, y, z, color
    // props: [x, y, z, color]
  })

  return <a.pointLight
    position-x={props.x}
    position-y={props.y}
    position-z={props.z}
    color={props.color}

    // position={[x, y, z]}
    // color={color}
  />
}