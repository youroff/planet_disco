import React, { useEffect, useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { DynamicDrawUsage } from 'three/src/constants'
import { scalePow, scaleLinear } from 'd3-scale'

// const radScale = scalePow().domain([0.0001, 0.0062]).range([0.09, 0.7, 1])
const radScale = scalePow().domain([0.0001, 0.007]).range([0.8, 1])

export default ({ genres, color }) => {

  const mesh = useUpdate((mesh) => {
    const matrix = new Matrix4()
    genres.forEach(({ pagerank, coord: {x, y, z} }, i) => {
      console.log(x, y, z)
      matrix.setPosition(x, y, z)
      matrix.scale = new Vector3(1, 1, 1)
      // const s = radScale(pagerank)
      // const m = 
      // matrix.makeScale(s, s, s)
      // console.log(matrix.makeScale(s, s, s))
      // matrix.scale(matrix.makeScale(s, s, s))
      mesh.setMatrixAt(i, matrix)
    })
    // mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  }, [])

  return <instancedMesh ref={mesh} args={[null, null, genres.length]} castShadow>
    <sphereBufferGeometry attach="geometry" args={[1, 8, 8]} />
    <meshBasicMaterial attach="material" color={color} />
  </instancedMesh>
}
