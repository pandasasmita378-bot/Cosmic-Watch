import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei"; 
import * as THREE from "three";

const TEXTURES = {
  map: 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
  normal: 'https://unpkg.com/three-globe/example/img/earth-topology.png',
  specular: 'https://unpkg.com/three-globe/example/img/earth-water.png',
  clouds: 'https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'
};

const Asteroid = ({ data, isFocused }) => {
  const meshRef = useRef();
  
  const position = useMemo(() => {
    const distance = 4 + Math.random() * 4; 
    const theta = Math.random() * Math.PI * 2; 
    const phi = (Math.random() - 0.5) * Math.PI; 
    return [
      distance * Math.cos(theta) * Math.cos(phi),
      distance * Math.sin(phi),
      distance * Math.sin(theta) * Math.cos(phi)
    ];
  }, []);

  const size = useMemo(() => {
    const realSize = data.estimated_diameter.meters.estimated_diameter_max; 
    return Math.max(0.1, realSize / 1000); 
  }, [data]);

  useFrame(() => {
    if(meshRef.current) {
        meshRef.current.rotation.x += 0.01;
        meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[size, 0]} /> 
        <meshStandardMaterial 
          color={data.is_potentially_hazardous_asteroid ? "#ff4444" : "#888888"} 
          roughness={0.8}
        />
      </mesh>
      {isFocused && (
        <Html distanceFactor={10}>
          <div className="bg-black/80 text-white text-xs p-1 rounded border border-blue-500 whitespace-nowrap">
            {data.name}
          </div>
        </Html>
      )}
    </group>
  );
};

const Earth = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(
    THREE.TextureLoader,
    [TEXTURES.map, TEXTURES.normal, TEXTURES.specular, TEXTURES.clouds]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if(earthRef.current) earthRef.current.rotation.y = t / 15;
    if(cloudsRef.current) cloudsRef.current.rotation.y = t / 12;
  });

  return (
    <group>
      <mesh ref={earthRef} scale={[2.5, 2.5, 2.5]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhongMaterial
          map={colorMap}
          normalMap={normalMap}
          specularMap={specularMap}
          specular={new THREE.Color(0x333333)}
          shininess={15}
          emissive={new THREE.Color("#00349c")}
          emissiveIntensity={0.15}
        />
      </mesh>
      <mesh ref={cloudsRef} scale={[2.53, 2.53, 2.53]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

const CameraController = ({ focusedId }) => {
  useFrame((state) => {
    if (!focusedId) {
      state.camera.position.lerp(new THREE.Vector3(0, 0, 8), 0.05);
      state.camera.lookAt(0, 0, 0);
    } 
  });
  return null;
};

const Earth3D = ({ asteroids = [], focusedId }) => {
  return (
    <div className="w-full h-full bg-transparent">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        onCreated={({ gl }) => { 
            gl.setClearColor(new THREE.Color('#000000'), 0); 
        }}
      >
        <CameraController focusedId={focusedId} />
        
        <ambientLight intensity={1.5} color="#ffffff" /> 
        <pointLight position={[10, 10, 10]} intensity={2.0} color="#ffdcb4" /> 
        <pointLight position={[-10, -10, -5]} intensity={5.0} color="#3355ff" />

        <React.Suspense fallback={null}>
          <Earth />
          {asteroids.map((asteroid) => (
             <Asteroid 
                key={asteroid.id} 
                data={asteroid} 
                isFocused={focusedId === asteroid.id}
             />
          ))}
        </React.Suspense>

        <OrbitControls 
          enableZoom={true} 
          autoRotate={!focusedId}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};

export default Earth3D;