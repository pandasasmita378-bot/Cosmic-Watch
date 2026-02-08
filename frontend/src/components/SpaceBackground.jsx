import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SpaceBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 20;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
      mountRef.current.appendChild(renderer.domElement);
    }

    const getTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        
        const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
        gradient.addColorStop(0, 'rgba(255,255,255,1)'); 
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(0,0,0,0)'); 
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 32, 32);
        
        const texture = new THREE.Texture(canvas);
        texture.needsUpdate = true;
        return texture;
    };

    const count = 4000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
      const val = (Math.random() - 0.5) * 100; 
      positions[i] = val;
      originalPositions[i] = val;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      size: 0.5, 
      color: 0xffffff, 
      map: getTexture(), 
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false, 
      sizeAttenuation: true,
    });

    const stars = new THREE.Points(geometry, material);
    scene.add(stars);

    const mouse = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onMouseMove = (event) => {
      target.x = (event.clientX / window.innerWidth) * 2 - 1;
      target.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);

      mouse.x += (target.x - mouse.x) * 0.1;
      mouse.y += (target.y - mouse.y) * 0.1;

      const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      const positions = geometry.attributes.position.array;

      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const x = positions[i3];
        const y = positions[i3 + 1];

        const ox = originalPositions[i3];
        const oy = originalPositions[i3 + 1];

        const dx = x - pos.x;
        const dy = y - pos.y;
        const d = Math.sqrt(dx * dx + dy * dy);

        const repelRadius = 8;

        if (d < repelRadius) {
          const force = (repelRadius - d) / repelRadius;
          const angle = Math.atan2(dy, dx);
          positions[i3] += Math.cos(angle) * force * 0.5;
          positions[i3 + 1] += Math.sin(angle) * force * 0.5;
        } else {
          positions[i3] += (ox - x) * 0.02;
          positions[i3 + 1] += (oy - y) * 0.02;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      stars.rotation.z += 0.0002;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      if (mountRef.current) mountRef.current.innerHTML = '';
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, 
        background: 'radial-gradient(circle at center, #111119 0%, #000000 100%)',
        pointerEvents: 'none'
      }}
    />
  );
};

export default SpaceBackground;