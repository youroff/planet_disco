import React, { useRef, useState } from 'react'
import { useFrame, useUpdate } from 'react-three-fiber'
import * as THREE from 'three/src/Three'

export default function(props) {
  // This reference will give us direct access to the mesh
  // const mesh = useRef()
  
  // Set up state for the hovered and active state
  // const [hovered, setHover] = useState(false)
  // const [active, setActive] = useState(false)
  
  // Rotate mesh every frame, this is outside of React without overhead
  // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))
  
  const vertices = new Float32Array([
    -1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
  ]);

  const ref = useUpdate(geometry => {
    // geometry.setAttribute( 'position', new BufferAttribute( vertices, 3 ) );
    // geometry.setFromPoints(vertices)
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3))
  }, [])

  return (
    <mesh
      {...props}
      // ref={mesh}
      // scale={active ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      // onClick={e => setActive(!active)}
      // onPointerOver={e => setHover(true)}
      // onPointerOut={e => setHover(false)}
    >
      <bufferGeometry attach="geometry" ref={ref} />
      {/* <sphereGeometry attach="geometry" args={[1, 1, 1]} /> */}
      {/* <boxBufferGeometry attach="geometry" args={[1, 1, 1]} /> */}
      <meshStandardMaterial attach="material" color='orange' />
    </mesh>
  )
}