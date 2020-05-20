import React, { useEffect, useMemo } from 'react'
import { useUpdate } from 'react-three-fiber'
import { toRad } from '../common/utils'
import * as THREE from 'three/src/Three'
import { vertexShader, fragmentShader } from '../shaders/cities'

export default ({ cities, weights }) => {
  const material = useMemo(() => ({
    fragmentShader,
    vertexShader,
    blending: THREE.AdditiveBlending,
    depthTest: true,
    transparent: false,
    vertexColors: false  
  }))

  const mesh = useUpdate((mesh) => {
    const dummy = new THREE.Object3D()
    const instanceColors = new Array(cities.length * 3).fill(210)
    const instanceHeights = new Array(cities.length).fill(0.001)
    mesh.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(new Float32Array(instanceColors), 3, true))
    mesh.geometry.setAttribute('instanceHeight', new THREE.InstancedBufferAttribute(new Float32Array(instanceHeights), 1, true))

    cities.forEach(({coord: {lat, lng}}, i) => {
      dummy.position.setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
      dummy.lookAt(0, 0, 0)
      dummy.updateMatrix()
      mesh.setMatrixAt(i, dummy.matrix)
    })
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  }, [])

  useEffect(() => {
    cities.forEach(({id}, i) => {
      let color = new THREE.Color(210, 210, 210)
      let height = 0.001
      if (weights[id]) {
        const [c, h] = weights[id]
        height = h
        color = new THREE.Color(c)
      }
      mesh.current.geometry.attributes.instanceHeight.array[i] = height * 200
      mesh.current.geometry.attributes.instanceColor.array[i * 3] = color.r
      mesh.current.geometry.attributes.instanceColor.array[i * 3 + 1] = color.g
      mesh.current.geometry.attributes.instanceColor.array[i * 3 + 2] = color.b
      mesh.current.geometry.attributes.instanceHeight.needsUpdate = true
      mesh.current.geometry.attributes.instanceColor.needsUpdate = true
    })
  }, [weights])

  return <instancedMesh ref={mesh} args={[null, null, cities.length]} castShadow>
    <boxBufferGeometry attach="geometry" args={[0.005, 0.005, 0.005]} />
    <shaderMaterial
      attach="material"
      color="#ececec"
      opacity={1}
      {...material}
    />
  </instancedMesh>
}
