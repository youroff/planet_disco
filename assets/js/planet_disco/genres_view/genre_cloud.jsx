import React, { useEffect, useMemo, useRef } from 'react'
import { useUpdate } from 'react-three-fiber'
import { Quaternion } from 'three/src/math/Quaternion'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Color } from 'three/src/math/Color'
import { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute'
import { NormalBlending, DynamicDrawUsage } from 'three/src/constants'
import { scalePow } from 'd3-scale'
import { vertexShader, fragmentShader } from '../shaders/genres_advanced'

const radScale = scalePow().domain([0.0001, 0.007]).range([0.2, 1.5])

export default ({ genres, colorMap, selectedCluster }) => {

  useEffect(() => {
    genres.forEach(({ masterGenreId }, i) => {
      let color = new Color(colorMap[masterGenreId])
      let emissive = new Color(0, 0, 0)
      let alpha = 1.0
      if (selectedCluster && masterGenreId !== selectedCluster) {
        color = new Color(0.9, 0.9, 0.9)
        alpha = 0.3
      }
      if (selectedCluster && masterGenreId === selectedCluster) {
        emissive = new Color(colorMap[masterGenreId])
      }
      mesh.current.geometry.attributes.color.array[i * 3] = color.r
      mesh.current.geometry.attributes.color.array[i * 3 + 1] = color.g
      mesh.current.geometry.attributes.color.array[i * 3 + 2] = color.b
      mesh.current.geometry.attributes.emissiveColor.array[i * 3] = emissive.r
      mesh.current.geometry.attributes.emissiveColor.array[i * 3 + 1] = emissive.g
      mesh.current.geometry.attributes.emissiveColor.array[i * 3 + 2] = emissive.b
      mesh.current.geometry.attributes.instanceAlpha.array[i] = alpha
      mesh.current.geometry.attributes.color.needsUpdate = true
      mesh.current.geometry.attributes.emissiveColor.needsUpdate = true
      mesh.current.geometry.attributes.instanceAlpha.needsUpdate = true
    })
  }, [selectedCluster])

  const mesh = useUpdate((mesh) => {
    const colors = []
    const emissive = []
    const matrix = new Matrix4()
    genres.forEach(({ pagerank, masterGenreId, coord: {x, y, z} }, i) => {
      const s = radScale(pagerank)
      colors.push(...new Color(colorMap[masterGenreId]).toArray())
      emissive.push(0, 0, 0)
      matrix.compose(new Vector3(x, y, z), new Quaternion(), new Vector3(s, s, s))
      mesh.setMatrixAt(i, matrix)
    })
    mesh.geometry.setAttribute('color', new InstancedBufferAttribute(new Float32Array(colors), 3, true))
    mesh.geometry.setAttribute('emissiveColor', new InstancedBufferAttribute(new Float32Array(emissive), 3, true))
    mesh.geometry.setAttribute('instanceAlpha', new InstancedBufferAttribute(new Float32Array(new Array(genres.length).fill(1.0)), 1, true))
    mesh.instanceMatrix.setUsage(DynamicDrawUsage)
  }, [])

  return <instancedMesh ref={mesh} args={[null, null, genres.length]} castShadow>
    <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
    <meshPhysicalMaterial
      attach="material"

      // ref={material}
      transparent={true}
      emissive='white'
      emissiveIntensity={0.3}
      // transparency={0.3}
      vertexColors
      onBeforeCompile={(shader) => {
        shader.vertexShader = [
          'attribute float instanceAlpha;',
          'varying float vInstanceAlpha;',
          'attribute vec3 emissiveColor;',
          'varying vec3 vEmissiveColor;',
          shader.vertexShader
        ].join('\n').replace(
          '#include <begin_vertex>',
          [
            '#include <begin_vertex>;',
            'vInstanceAlpha = instanceAlpha;',
            'vEmissiveColor = emissiveColor;'
          ].join('\n')
        )
        
        shader.fragmentShader = [
          'varying float vInstanceAlpha;',
          'varying vec3 vEmissiveColor;',
          shader.fragmentShader
        ].join('\n').replace(
          'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
          [
            'diffuseColor.a *= saturate( vInstanceAlpha + linearToRelativeLuminance( reflectedLight.directSpecular + reflectedLight.indirectSpecular ) );',
            'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'
          ].join('\n')
        ).replace(
          'vec3 totalEmissiveRadiance = emissive;',
          'vec3 totalEmissiveRadiance = vEmissiveColor * 0.8;'
        );


        console.log(shader)
      }}
      // {...material}
    />
  </instancedMesh>
}
