import React, { useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import { getSplineFromCoords } from '../common/utils'
import { scaleLinear } from 'd3-scale'

const color = scaleLinear().domain([0, 1]).range(["#00ff26", "#ff9900"])

export default ({ from, to }) => {
  const spline = useMemo(() => getSplineFromCoords(from.coord, to.coord))

  const geometry = useUpdate(geometry => {
    geometry.setFromPoints(spline.getPoints(30))
  }, [])

  return <line>
    <bufferGeometry attach="geometry" ref={geometry} />
    <lineBasicMaterial
      attach="material"
      color={color(to.similarity)}
      linewidth={5.0}
    />
  </line>
}
