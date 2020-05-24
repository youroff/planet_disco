import React, { useEffect, useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import { toRad } from '../common/utils'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Color } from 'three/src/math/Color'
import { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute'
import { AdditiveBlending } from 'three/src/constants'
import { vertexShader, fragmentShader } from '../shaders/cities'

export default ({ cities, weights }) => {
  const material = useMemo(() => ({
    fragmentShader,
    vertexShader,
    blending: AdditiveBlending,
    depthTest: true,
    transparent: false,
    vertexColors: false  
  }))

  const mesh = useUpdate((mesh) => {
    const instanceColors = new Array(cities.length * 3).fill(0.5)
    const instanceHeights = new Array(cities.length).fill(0.001)
    mesh.geometry.setAttribute('instanceColor', new InstancedBufferAttribute(new Float32Array(instanceColors), 3, true))
    mesh.geometry.setAttribute('instanceHeight', new InstancedBufferAttribute(new Float32Array(instanceHeights), 1, true))

    const matrix = new Matrix4()
    cities.forEach(({coord: {lat, lng}}, i) => {
      const pos = new Vector3().setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
      matrix.setPosition(pos)
      matrix.lookAt(new Vector3(0, 0, 0), pos, new Vector3(0, 1, 0))
      mesh.setMatrixAt(i, matrix)
    })
  }, [])

  useEffect(() => {
    cities.forEach(({id}, i) => {
      let color = weights[id] ? new Color(weights[id][0]) : new Color(210, 210, 210)
      let height = weights[id] ? weights[id][1] : 0.001
      mesh.current.geometry.attributes.instanceHeight.array[i] = height * 200
      color.toArray(mesh.current.geometry.attributes.instanceColor.array, i * 3)
      mesh.current.geometry.attributes.instanceHeight.needsUpdate = true
      mesh.current.geometry.attributes.instanceColor.needsUpdate = true
    })
  }, [weights])

  return <instancedMesh ref={mesh} args={[null, null, cities.length]} castShadow>
    <boxBufferGeometry attach="geometry" args={[0.005, 0.005, 0.005]} />
    <shaderMaterial
      attach="material"
      // color="#ececec"
      // opacity={1}
      {...material}
    />
  </instancedMesh>
}
