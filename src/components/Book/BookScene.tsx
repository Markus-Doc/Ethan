'use client'

import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function BookMesh() {
  const groupRef = useRef<THREE.Group>(null)
  const timeRef = useRef(0)

  // Quarter-bound book geometry:
  // Front/back boards: cloth green
  // Spine + corners: leather tan
  // 5 raised bands on spine

  const W = 1.6   // width  (front board)
  const H = 1.8   // height
  const D = 0.5   // depth  (spine thickness)

  const leather = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C2813A'),
    roughness: 0.72,
    metalness: 0.02,
  })

  const cloth = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#2C5040'),
    roughness: 0.88,
    metalness: 0.0,
  })

  const parchment = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#F5EDD8'),
    roughness: 0.95,
    metalness: 0.0,
  })

  const gold = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C9A84C'),
    roughness: 0.3,
    metalness: 0.6,
  })

  useFrame((_, delta) => {
    timeRef.current += delta
    if (groupRef.current) {
      // Gentle idle rotation
      groupRef.current.rotation.y = Math.sin(timeRef.current * 0.25) * 0.13
      groupRef.current.rotation.x = Math.sin(timeRef.current * 0.15) * 0.02
    }
  })

  return (
    <group ref={groupRef} rotation={[0.08, 0.4, 0]}>
      {/* Back board */}
      <mesh position={[0, 0, -D / 2 - 0.01]} material={cloth}>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>

      {/* Front board */}
      <mesh position={[0, 0, D / 2 + 0.01]} material={cloth}>
        <boxGeometry args={[W, H, 0.04]} />
      </mesh>

      {/* Spine */}
      <mesh position={[-W / 2 - D / 2, 0, 0]} material={leather}>
        <boxGeometry args={[D, H, D]} />
      </mesh>

      {/* Pages block */}
      <mesh position={[W / 4, 0, 0]} material={parchment}>
        <boxGeometry args={[W / 2, H - 0.04, D - 0.02]} />
      </mesh>

      {/* Corner pieces — 4 triangular leather corners */}
      {[
        [W / 2 - 0.12,  H / 2 - 0.12,  D / 2 + 0.015],
        [-0.02,          H / 2 - 0.12,  D / 2 + 0.015],
        [W / 2 - 0.12, -H / 2 + 0.12,  D / 2 + 0.015],
        [-0.02,         -H / 2 + 0.12,  D / 2 + 0.015],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} material={leather}>
          <boxGeometry args={[0.28, 0.28, 0.02]} />
        </mesh>
      ))}

      {/* 5 raised spine bands */}
      {[-0.55, -0.28, 0, 0.28, 0.55].map((y, i) => (
        <mesh key={i} position={[-W / 2 - D / 2, y, 0]} material={gold}>
          <boxGeometry args={[D + 0.02, 0.045, D + 0.02]} />
        </mesh>
      ))}
    </group>
  )
}

export default function BookScene() {
  return (
    <div style={{ width: 'var(--book-width)', height: 'var(--book-height)' }}>
      <Canvas
        camera={{ position: [0, 0, 3.4], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.35} color="#fff8f0" />
        <directionalLight
          position={[-2, 3, 3]}
          intensity={1.4}
          color="#ffe8c8"
          castShadow
        />
        <directionalLight
          position={[3, -1, 2]}
          intensity={0.3}
          color="#c8d8e8"
        />
        <BookMesh />
      </Canvas>
    </div>
  )
}
