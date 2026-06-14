"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float, Sparkles } from "@react-three/drei";
import * as THREE from "three";

interface EcoHabitatProps {
  progressPercent: number; // 0 to 100
  isHealthy: boolean; // true if under goal
}

// Low-poly Tree Component
function Tree({ position, scale, isHealthy }: { position: [number, number, number], scale: number, isHealthy: boolean }) {
  const leafColor = isHealthy ? "#39ff14" : "#ff4500";
  const trunkColor = isHealthy ? "#8B4513" : "#4A3B32";

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 1, 5]} />
        <meshStandardMaterial color={trunkColor} roughness={0.9} />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.6, 1.5, 5]} />
        <meshStandardMaterial color={leafColor} roughness={0.7} emissive={isHealthy ? "#0f3308" : "#330808"} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

// Main Island
function FloatingIsland({ isHealthy }: { isHealthy: boolean }) {
  const islandRef = useRef<THREE.Group>(null);
  
  // Slowly rotate the island
  useFrame(() => {
    if (islandRef.current) {
      islandRef.current.rotation.y += 0.002;
    }
  });

  const soilColor = isHealthy ? "#1a2e1a" : "#2e1a1a";

  return (
    <group ref={islandRef}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Base Earth */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[2, 1.5, 1, 6]} />
          <meshStandardMaterial color={soilColor} roughness={1} />
        </mesh>
        
        {/* Grass Top */}
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[2.05, 2, 0.1, 6]} />
          <meshStandardMaterial color={isHealthy ? "#228b22" : "#5c4033"} roughness={0.8} />
        </mesh>

        {/* Trees */}
        <Tree position={[-0.8, 0, 0.5]} scale={1.2} isHealthy={isHealthy} />
        <Tree position={[0.5, 0, -1]} scale={0.8} isHealthy={isHealthy} />
        <Tree position={[1, 0, 0.8]} scale={1} isHealthy={isHealthy} />

        {/* Dynamic Particles based on health */}
        <Sparkles 
          count={isHealthy ? 60 : 100} 
          scale={5} 
          size={isHealthy ? 4 : 2} 
          speed={isHealthy ? 0.4 : 2} 
          opacity={isHealthy ? 0.8 : 0.6} 
          color={isHealthy ? "#39ff14" : "#ff007f"} 
        />
      </Float>
    </group>
  );
}

export default function EcoHabitat({ progressPercent, isHealthy }: EcoHabitatProps) {
  const [shouldRender, setShouldRender] = useState(false);

  // Defer heavy 3D rendering to avoid blocking the main thread during initial load
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRender(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden bg-[#050505]">
      {shouldRender ? (
        <Canvas camera={{ position: [0, 3, 6], fov: 45 }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
          <ambientLight intensity={isHealthy ? 0.6 : 0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1.5} color={isHealthy ? "#ffffff" : "#ffaa88"} />
          <pointLight position={[-5, 5, -5]} intensity={1} color={isHealthy ? "#39ff14" : "#ff007f"} />
          
          <FloatingIsland isHealthy={isHealthy} />
          
          {/* Environment and Background effects */}
          <Stars radius={100} depth={50} count={isHealthy ? 800 : 300} factor={4} saturation={0} fade speed={isHealthy ? 1 : 4} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} minPolarAngle={0} />
        </Canvas>
      ) : (
        <div className="w-full h-full min-h-[300px] bg-[#050505] animate-pulse"></div>
      )}
      
      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-sm ${isHealthy ? 'bg-[rgba(57,255,20,0.1)] text-[var(--primary)] border-[rgba(57,255,20,0.3)]' : 'bg-[rgba(255,0,127,0.1)] text-[#ff007f] border-[rgba(255,0,127,0.3)] shadow-[0_0_15px_rgba(255,0,127,0.2)]'}`}>
          {isHealthy ? "Habitat: Thriving 🌱" : "Habitat: Critical ⚠️"}
        </div>
      </div>
      <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Interactive 3D Simulation</p>
      </div>
    </div>
  );
}
