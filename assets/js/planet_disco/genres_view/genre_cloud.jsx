import React, { useEffect, useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import { Quaternion } from 'three/src/math/Quaternion'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Color } from 'three/src/math/Color'
import { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute'
import { NormalBlending, DynamicDrawUsage } from 'three/src/constants'
import { scalePow } from 'd3-scale'
import { vertexShader, fragmentShader } from '../shaders/genres'

const radScale = scalePow().domain([0.0001, 0.007]).range([0.2, 1.5])

export default ({ genres, colorMap, selectedCluster }) => {

  const material = useMemo(() => ({
    fragmentShader,
    vertexShader,
    blending: NormalBlending,
    depthTest: true,
    transparent: true,
    vertexColors: false  
  }))

  useEffect(() => {
    genres.forEach(({ masterGenreId }, i) => {
      let color = new Color(colorMap[masterGenreId])
      let alpha = 1.0
      if (selectedCluster && masterGenreId !== selectedCluster) {
        color = new Color(210, 210, 210)
        alpha = 0.5
      }
      mesh.current.geometry.attributes.instanceColor.array[i * 3] = color.r
      mesh.current.geometry.attributes.instanceColor.array[i * 3 + 1] = color.g
      mesh.current.geometry.attributes.instanceColor.array[i * 3 + 2] = color.b
      mesh.current.geometry.attributes.instanceAlpha.array[i] = alpha
      mesh.current.geometry.attributes.instanceColor.needsUpdate = true
      mesh.current.geometry.attributes.instanceAlpha.needsUpdate = true
    })

  }, [selectedCluster])

  const mesh = useUpdate((mesh) => {
    const instanceColors = []
    const matrix = new Matrix4()
    genres.forEach(({ pagerank, masterGenreId, coord: {x, y, z} }, i) => {
      const s = radScale(pagerank)
      instanceColors.push(...new Color(colorMap[masterGenreId]).toArray())
      matrix.compose(new Vector3(x, y, z), new Quaternion(), new Vector3(s, s, s))
      mesh.setMatrixAt(i, matrix)
    })
    mesh.geometry.setAttribute('instanceColor', new InstancedBufferAttribute(new Float32Array(instanceColors), 3, true))
    mesh.geometry.setAttribute('instanceAlpha', new InstancedBufferAttribute(new Float32Array(new Array(genres.length).fill(1.0)), 1, true))
    mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  }, [])

  return <instancedMesh ref={mesh} args={[null, null, genres.length]} castShadow>
    <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
    <shaderMaterial
      attach="material"
      color="white"
      {...material}
    />
  </instancedMesh>
}
