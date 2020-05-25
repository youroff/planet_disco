import React, { useEffect } from 'react'
import { useUpdate, useThree} from 'react-three-fiber'
import { HTML } from 'drei'
import { Quaternion } from 'three/src/math/Quaternion'
import { Vector3 } from 'three/src/math/Vector3'
import { Matrix4 } from 'three/src/math/Matrix4'
import { Color } from 'three/src/math/Color'
import { InstancedBufferAttribute } from 'three/src/core/InstancedBufferAttribute'
import { DynamicDrawUsage } from 'three/src/constants'
import { scalePow } from 'd3-scale'
import { shaderPatch } from '../shaders/genres'

const radScale = scalePow().domain([0.0001, 0.007]).range([0.2, 1.5])

export default ({ genres, centroids, colorMap, selectedCluster, selectCluster, selectGenre, currentGenre }) => {

  // This helluva nightmare is only to tell click from drag and drop cluster
  // on click on space or spheres from other clusters 
  const { gl: { domElement: canvas }, raycaster, scene } = useThree()
  useEffect(() => {
    let drag = false
    const dragFalse = () => drag = false
    const dragTrue = () => drag = true
    const listener = () => {
      if(!drag && selectedCluster) {
        const inCluster = raycaster.intersectObject(mesh.current).some(o => {
          const genre = genres[o.instanceId]
          return genre.masterGenreId === selectedCluster
        })

        if (!inCluster) { selectCluster() }
      }
    } 
    canvas.addEventListener('mousedown', dragFalse)
    canvas.addEventListener('mousemove', dragTrue)
    canvas.addEventListener('mouseup', listener)
    return () => {
      canvas.removeEventListener('mousedown', dragFalse)
      canvas.removeEventListener('mousemove', dragTrue)
      canvas.removeEventListener('mouseup', listener)
    }
  }, [selectedCluster])

  useEffect(() => {
    genres.forEach(({ masterGenreId }, i) => {
      let color = new Color(colorMap[masterGenreId])
      let emissive = new Color(0, 0, 0)
      let alpha = 1.0
      if (selectedCluster && masterGenreId !== selectedCluster) {
        color = new Color(0.2, 0.2, 0.2)
        alpha = 0.8
      }
      if (selectedCluster && masterGenreId === selectedCluster) {
        emissive = new Color(colorMap[masterGenreId])
      }
      color.toArray(mesh.current.geometry.attributes.color.array, i * 3)
      emissive.toArray(mesh.current.geometry.attributes.emissiveColor.array, i * 3)
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

  return <instancedMesh
    ref={mesh}
    args={[null, null, genres.length]}
    onClick={(e) => {
      const genre = genres[e.instanceId]
      if (selectedCluster) {
        if (selectedCluster === genre.masterGenreId) selectGenre(genre)
      } else {
        selectCluster(genre.masterGenreId)
      }
    }}
  >
    <sphereBufferGeometry attach="geometry" args={[1, 32, 32]} />
    <meshPhysicalMaterial
      attach="material"
      transparent={true}
      vertexColors
      onBeforeCompile={shaderPatch}
    />

    {selectedCluster && genres.map(({ genreId, masterGenreId, name, coord: { x, y, z } }, i) => {
      if (selectedCluster === masterGenreId) {
        const title = selectedCluster == genreId ? 'genre-title' : 'genre-subtitle'
        const selected = currentGenre && currentGenre.genreId === genreId ? 'selected-genre' : ''
        return <HTML
          key={i}
          position={[x, y, z]}
          className={`${title} ${selected}`}
        >
          {name}
        </HTML>
      }
    })}

    {!selectedCluster && genres.map(({ genreId, masterGenreId, name }, i) => {
      if (genreId === masterGenreId) {
        const { x, y, z } = centroids[masterGenreId]
        return <HTML
          key={i}
          position={[x, y, z]}
          className='genre-title'
        >
          {name}
        </HTML>
      }
    })}

  </instancedMesh>
}
