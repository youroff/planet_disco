import React, { useRef, useEffect, useContext, useState } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { toRad } from '../common/utils'
import { StoreContext } from '../common/store'
import * as THREE from 'three/src/Three'
import * as d3 from 'd3'

const colorParsChunk = [
  'attribute vec3 instanceColor;',
  'varying vec3 vInstanceColor;',
  '#include <common>'
].join( '\n' )

const instanceColorChunk = [
  '#include <begin_vertex>',
  '\tvInstanceColor = instanceColor;'
].join( '\n' )

const fragmentParsChunk = [
  'varying vec3 vInstanceColor;',
  '#include <common>'
].join( '\n' )

const colorChunk = [
  'vec4 diffuseColor = vec4( diffuse * vInstanceColor, opacity );'
].join( '\n' )


const CITIES = gql`{
  cities(limit: 5000) {
    entries {
      id
      city
      coord
    }
  }
}`

const dummy = new THREE.Object3D()
const defaultColor = '#ececec'

export default function({zoom}) {
  const mesh = useRef()
  const material = useRef()
  const { data } = useQuery(CITIES)
  const { dispatch } = useContext(StoreContext)
  const [weights, setWeights] = useState({})

  // This attaches and removes handler to context, which allows Genre selector
  // for updating genre weights
  useEffect(() => {
    dispatch({type: 'SET_GENRE_HANDLER', handler: setWeights})
    return () => { dispatch({type: 'SET_GENRE_HANDLER'}) }
  }, [])

  useEffect(() => {
    if (mesh.current) {

    }
  }, [weights])

  useEffect(() => {
    if (data && mesh.current) {
      if (!mesh.current.geometry.instanceColor) {
        const instanceColors = []
        for (let i = 0; i < data.cities.entries.length; i++) {
          instanceColors.push(210, 210, 210)
        }
        mesh.current.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(new Float32Array(instanceColors), 3, true))
      }
      data.cities.entries.forEach(({id, coord: {lat, lng}}, i) => {
        mesh.current.getMatrixAt(i, dummy.matrix)
        dummy.position.setFromSphericalCoords(1, toRad(lat - 90), toRad(lng - 90))
        dummy.lookAt(0, 0, 0)
        let color = new THREE.Color(210, 210, 210)
        let height = 0.001
        if (weights[id]) {
          const [c, h] = weights[id]
          height = h
          color = new THREE.Color(c)
        }
        mesh.current.geometry.attributes.instanceColor.array[i * 3] = color.r
        mesh.current.geometry.attributes.instanceColor.array[i * 3 + 1] = color.g
        mesh.current.geometry.attributes.instanceColor.array[i * 3 + 2] = color.b
        mesh.current.geometry.attributes.instanceColor.needsUpdate = true
        dummy.scale.set(zoom / 15, zoom / 15, 300 * height)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
      })

      mesh.current.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
      mesh.current.instanceMatrix.needsUpdate = true
    }
  }, [data, zoom, weights])

  return (<>
    {data && <instancedMesh
      ref={mesh}
      args={[null, null, data.cities.entries.length]}
      castShadow
    >
      <boxBufferGeometry attach="geometry" args={[0.02, 0.02, 0.002]} />
      <meshMatcapMaterial
        attach="material"
        color="#ececec"
        opacity={0.5}
        onBeforeCompile={(shader) => {
          shader.vertexShader = shader.vertexShader
            .replace( '#include <common>', colorParsChunk )
            .replace( '#include <begin_vertex>', instanceColorChunk )

          shader.fragmentShader = shader.fragmentShader
            .replace( '#include <common>', fragmentParsChunk )
            .replace( 'vec4 diffuseColor = vec4( diffuse, opacity );', colorChunk )
        }}
      />
    </instancedMesh>}
  </>)
}