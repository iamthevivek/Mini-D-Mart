import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 1.5, 6.5);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D floating grocery objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0x34d399, 3.5);
    mainLight.position.set(5, 8, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const warmLight = new THREE.PointLight(0xfbbf24, 4, 15);
    warmLight.position.set(-4, 3, 2);
    scene.add(warmLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 3, 15);
    cyanLight.position.set(3, -2, 3);
    scene.add(cyanLight);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.85,
      roughness: 0.15,
    });

    const emeraldMaterial = new THREE.MeshStandardMaterial({
      color: 0x059669,
      metalness: 0.3,
      roughness: 0.2,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.9,
      ior: 1.5,
    });

    const redAppleMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.25,
      metalness: 0.1,
    });

    const orangeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf97316,
      roughness: 0.4,
      metalness: 0.05,
    });

    const leafMaterial = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      roughness: 0.3,
    });

    // 1. Central 3D Grocery Basket / Container
    const basketGroup = new THREE.Group();

    // Basket base
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.3, 1.2, 32, 1, false);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x047857,
      roughness: 0.3,
      metalness: 0.4,
    });
    const basketBase = new THREE.Mesh(baseGeo, baseMat);
    basketBase.position.y = -0.5;
    basketGroup.add(basketBase);

    // Gold rim
    const rimGeo = new THREE.TorusGeometry(1.62, 0.08, 16, 64);
    const rimMesh = new THREE.Mesh(rimGeo, goldMaterial);
    rimMesh.rotation.x = Math.PI / 2;
    rimMesh.position.y = 0.1;
    basketGroup.add(rimMesh);

    // 2. Floating 3D Produce in Basket
    // Fresh Apple
    const appleGeo = new THREE.SphereGeometry(0.48, 32, 32);
    const apple = new THREE.Mesh(appleGeo, redAppleMaterial);
    apple.position.set(-0.5, 0.4, 0.3);
    const stemGeo = new THREE.CylinderGeometry(0.02, 0.03, 0.18, 8);
    const stemMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.48, 0);
    stem.rotation.z = 0.2;
    apple.add(stem);
    basketGroup.add(apple);

    // Fresh Orange
    const orangeGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const orange = new THREE.Mesh(orangeGeo, orangeMaterial);
    orange.position.set(0.6, 0.35, -0.2);
    basketGroup.add(orange);

    // Glass Milk Bottle
    const bottleGeo = new THREE.CylinderGeometry(0.28, 0.32, 1.1, 24);
    const bottle = new THREE.Mesh(bottleGeo, glassMaterial);
    bottle.position.set(0.1, 0.7, 0.2);
    const capGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.15, 24);
    const cap = new THREE.Mesh(capGeo, goldMaterial);
    cap.position.y = 0.6;
    bottle.add(cap);
    basketGroup.add(bottle);

    // 3. Floating 3D Geometric Coins / Grocery Icons around
    const floatingItems: { mesh: THREE.Object3D; speed: number; rotSpeed: number; yOffset: number }[] = [];

    // Gold Discount Badge Star
    const coinGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.08, 32);
    const coin1 = new THREE.Mesh(coinGeo, goldMaterial);
    coin1.rotation.x = Math.PI / 3;
    coin1.position.set(-2.2, 1.2, 0.5);
    mainGroup.add(coin1);
    floatingItems.push({ mesh: coin1, speed: 1.8, rotSpeed: 0.02, yOffset: 1.2 });

    const coin2 = new THREE.Mesh(coinGeo, goldMaterial);
    coin2.rotation.y = Math.PI / 4;
    coin2.position.set(2.4, -0.6, 0.8);
    mainGroup.add(coin2);
    floatingItems.push({ mesh: coin2, speed: 2.2, rotSpeed: -0.015, yOffset: -0.6 });

    // Floating Fresh Avocados / Green Spheres
    const avoGeo = new THREE.SphereGeometry(0.32, 24, 24);
    avoGeo.scale(1, 1.3, 1);
    const avo = new THREE.Mesh(avoGeo, emeraldMaterial);
    avo.position.set(2.1, 1.4, -0.5);
    mainGroup.add(avo);
    floatingItems.push({ mesh: avo, speed: 1.5, rotSpeed: 0.018, yOffset: 1.4 });

    const smallBerry = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), redAppleMaterial);
    smallBerry.position.set(-1.8, -1.0, 0.4);
    mainGroup.add(smallBerry);
    floatingItems.push({ mesh: smallBerry, speed: 2.0, rotSpeed: 0.025, yOffset: -1.0 });

    mainGroup.add(basketGroup);

    // 4. Sparkle Particle Field
    const particlesCount = 70;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 10;
      particlePositions[i + 1] = (Math.random() - 0.5) * 8;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Mouse Parallax Interaction
    let targetRotationX = 0;
    let targetRotationY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX = x;
      mouseY = y;
      targetRotationY = x * 0.6;
      targetRotationX = y * 0.4;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth central basket floating rotation
      basketGroup.rotation.y = elapsedTime * 0.35;
      basketGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.12;

      // Produce bobbing
      apple.rotation.y = elapsedTime * 0.5;
      orange.rotation.y = -elapsedTime * 0.4;
      bottle.rotation.y = elapsedTime * 0.2;

      // Floating ambient items
      floatingItems.forEach((item, idx) => {
        item.mesh.position.y = item.yOffset + Math.sin(elapsedTime * item.speed + idx) * 0.2;
        item.mesh.rotation.y += item.rotSpeed;
        item.mesh.rotation.x += item.rotSpeed * 0.5;
      });

      // Particle subtle rotation
      particleSystem.rotation.y = elapsedTime * 0.04;

      // Mouse Parallax Lerp
      mainGroup.rotation.y += (targetRotationY - mainGroup.rotation.y) * 0.05;
      mainGroup.rotation.x += (targetRotationX - mainGroup.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-full relative flex items-center justify-center pointer-events-auto">
      <div ref={mountRef} className="w-full h-72 sm:h-96 cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-2 text-center text-[10px] text-emerald-300/80 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-md">
        ✦ Interactive 3D Supermarket Showcase (Hover to Orbit)
      </div>
    </div>
  );
};

export default Hero3DCanvas;
