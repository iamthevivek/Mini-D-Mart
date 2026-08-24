import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCw, Sun, Box, Eye, Layers, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface Product3DViewerProps {
  product: Product;
}

const Product3DViewer: React.FC<Product3DViewerProps> = ({ product }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [lightPreset, setLightPreset] = useState<'studio' | 'neon' | 'warm'>('studio');
  const [zoomLevel, setZoomLevel] = useState(1);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const objectGroupRef = useRef<THREE.Group | null>(null);
  const lightsGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 320;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    // Lights
    const lightsGroup = new THREE.Group();
    scene.add(lightsGroup);
    lightsGroupRef.current = lightsGroup;

    const updateLights = (preset: 'studio' | 'neon' | 'warm') => {
      while (lightsGroup.children.length > 0) {
        lightsGroup.remove(lightsGroup.children[0]);
      }

      if (preset === 'studio') {
        const amb = new THREE.AmbientLight(0xffffff, 1.4);
        const dir1 = new THREE.DirectionalLight(0xffffff, 2.5);
        dir1.position.set(3, 5, 4);
        const dir2 = new THREE.DirectionalLight(0x10b981, 1.2);
        dir2.position.set(-3, -2, 2);
        lightsGroup.add(amb, dir1, dir2);
      } else if (preset === 'neon') {
        const amb = new THREE.AmbientLight(0x0f172a, 1.0);
        const point1 = new THREE.PointLight(0x10b981, 6, 10);
        point1.position.set(2, 2, 2);
        const point2 = new THREE.PointLight(0xf59e0b, 5, 10);
        point2.position.set(-2, -1, 2);
        lightsGroup.add(amb, point1, point2);
      } else {
        const amb = new THREE.AmbientLight(0xffedd5, 1.2);
        const point = new THREE.PointLight(0xf97316, 5, 10);
        point.position.set(0, 3, 3);
        const fill = new THREE.DirectionalLight(0xfde68a, 2.0);
        fill.position.set(-2, 2, 1);
        lightsGroup.add(amb, point, fill);
      }
    };

    updateLights(lightPreset);

    // Main 3D Model Group
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);
    objectGroupRef.current = mainGroup;

    // Create 3D Mesh Representation based on Category or Product unit
    const catName = product.category?.name?.toLowerCase() || '';
    const isLiquid = catName.includes('dairy') || catName.includes('oil') || catName.includes('beverage');
    const isProduce = catName.includes('fruit') || catName.includes('vegetable');

    if (isProduce) {
      // 3D Organic Fruit / Produce Model
      const fruitGeo = new THREE.SphereGeometry(0.85, 32, 32);
      const fruitMat = new THREE.MeshStandardMaterial({
        color: catName.includes('fruit') ? 0xef4444 : 0x16a34a,
        roughness: 0.35,
        metalness: 0.1,
        wireframe: wireframe,
      });
      const fruitMesh = new THREE.Mesh(fruitGeo, fruitMat);
      fruitMesh.castShadow = true;
      mainGroup.add(fruitMesh);

      // Organic stem & leaf
      const stemGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.35, 12);
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x582f0e });
      const stem = new THREE.Mesh(stemGeo, stemMat);
      stem.position.y = 0.95;
      mainGroup.add(stem);

      const leafGeo = new THREE.ConeGeometry(0.2, 0.45, 16);
      leafGeo.scale(0.3, 1, 1);
      const leafMat = new THREE.MeshStandardMaterial({ color: 0x22c55e });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.rotation.z = Math.PI / 3;
      leaf.position.set(0.2, 0.9, 0);
      mainGroup.add(leaf);
    } else if (isLiquid) {
      // 3D Dairy Milk Bottle / Oil Can
      const bodyGeo = new THREE.CylinderGeometry(0.55, 0.6, 1.6, 32);
      const bodyMat = new THREE.MeshPhysicalMaterial({
        color: 0xecfdf5,
        roughness: 0.2,
        metalness: 0.1,
        transmission: 0.7,
        wireframe: wireframe,
      });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      mainGroup.add(body);

      // Gold cap
      const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 32);
      const capMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.y = 0.92;
      mainGroup.add(cap);

      // Label band
      const labelGeo = new THREE.CylinderGeometry(0.56, 0.56, 0.8, 32);
      const labelMat = new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.4 });
      const label = new THREE.Mesh(labelGeo, labelMat);
      mainGroup.add(label);
    } else {
      // 3D Premium Grocery Box / Packaging
      const boxGeo = new THREE.BoxGeometry(1.2, 1.6, 0.7);
      const boxMat = new THREE.MeshStandardMaterial({
        color: 0x047857,
        roughness: 0.3,
        metalness: 0.2,
        wireframe: wireframe,
      });
      const boxMesh = new THREE.Mesh(boxGeo, boxMat);
      mainGroup.add(boxMesh);

      // Gold Seal Ribbon
      const ribbonGeo = new THREE.BoxGeometry(1.22, 0.2, 0.72);
      const ribbonMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.2 });
      const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
      mainGroup.add(ribbon);
    }

    // Interactive Drag Orbit Controls
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !mainGroup) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      mainGroup.rotation.y += deltaX * 0.01;
      mainGroup.rotation.x += deltaY * 0.01;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Render loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (isAutoRotate && !isDragging && mainGroup) {
        mainGroup.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [product, wireframe, lightPreset, isAutoRotate]);

  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const delta = direction === 'in' ? -0.4 : 0.4;
    const newZ = Math.max(2.2, Math.min(5.5, cameraRef.current.position.z + delta));
    cameraRef.current.position.z = newZ;
    setZoomLevel(Number((3.8 / newZ).toFixed(1)));
  };

  return (
    <div className="relative w-full bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl p-4">
      {/* 3D Toolbar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-auto">
        <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl backdrop-blur-md">
          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              isAutoRotate ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Auto-Rotate"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Rotate</span>
          </button>

          <button
            onClick={() => setWireframe(!wireframe)}
            className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              wireframe ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Toggle Wireframe Mesh"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden sm:inline">Wireframe</span>
          </button>
        </div>

        {/* Lighting Selector */}
        <div className="flex items-center space-x-1 bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl backdrop-blur-md">
          {(['studio', 'neon', 'warm'] as const).map((preset) => (
            <button
              key={preset}
              onClick={() => setLightPreset(preset)}
              className={`px-2 py-1 rounded-xl text-[10px] font-bold capitalize transition ${
                lightPreset === preset
                  ? 'bg-amber-500 text-emerald-950 shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Canvas Mount Point */}
      <div
        ref={mountRef}
        className="w-full h-72 sm:h-80 cursor-grab active:cursor-grabbing flex items-center justify-center"
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-1 bg-slate-900/90 border border-slate-700/80 p-1 rounded-2xl backdrop-blur-md z-10">
        <button
          onClick={() => handleZoom('in')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-mono text-slate-400 px-1 font-bold">{zoomLevel}x</span>
        <button
          onClick={() => handleZoom('out')}
          className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="absolute bottom-3 left-3 text-[10px] text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-xl border border-slate-800 backdrop-blur-md flex items-center gap-1.5">
        <Sparkles className="w-3 h-3 text-emerald-400" />
        <span>Drag to rotate 360° | WebGL 3D Engine</span>
      </div>
    </div>
  );
};

export default Product3DViewer;
