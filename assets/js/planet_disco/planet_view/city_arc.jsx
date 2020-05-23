import React, { useMemo } from 'react'
import { getSplineFromCoords } from '../common/utils'
import { scaleLinear } from 'd3-scale'

const color = scaleLinear().domain([0, 1]).range(["#00ff26", "#ff9900"])

export default ({ from, to }) => {
  const spline = useMemo(() => getSplineFromCoords(from.coord, to.coord))

  return <mesh>
    <tubeGeometry attach="geometry" args={[spline, 64, 0.0012]}/>
    <meshBasicMaterial
      attach="material"
      color={color(to.similarity)}
    />
  </mesh>
}
