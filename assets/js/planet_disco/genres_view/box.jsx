import React, { useRef, useState } from 'react'
import { useFrame, applyProps } from 'react-three-fiber'

export default (props) => {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  
  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      onClick={e => setActive(!active)}
      onPointerOver={e => setHover(true)}
      onPointerOut={e => setHover(false)}>
      <sphereBufferGeometry attach="geometry" args={[props.raduis, 16, 16]} />
      {/* <meshStandardMaterial attach="material" color={hovered ? 'hotpink' : 'orange'} /> */}

      <meshStandardMaterial
        attach="material"
        color={props.color}
        // emissive="white"
        // emissiveIntensity={0.1}
        // opacity={0.5}
        // onBeforeCompile={(shader) => {
        //   shader.vertexShader = shader.vertexShader
        //     .replace( '#include <common>', colorParsChunk )
        //     .replace( '#include <begin_vertex>', instanceColorChunk )

        //   shader.fragmentShader = shader.fragmentShader
        //     .replace( '#include <common>', fragmentParsChunk )
        //     .replace( 'vec4 diffuseColor = vec4( diffuse, opacity );', colorChunk )
        // }}
      />

    </mesh>
  )
}