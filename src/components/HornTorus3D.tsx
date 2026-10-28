import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PsychicMark, BahnungEdge, PartialDrive } from '../types';
import { Eye, EyeOff, Scissors, Sparkles, ZoomIn, RefreshCw, Layers } from 'lucide-react';

interface HornTorus3DProps {
  marks: PsychicMark[];
  edges: BahnungEdge[];
  partialDrives: PartialDrive[];
  selectedMarkId: string | null;
  onSelectMark: (id: string) => void;
  onSurgeryMark?: (id: string) => void;
  isRicciFlowing: boolean;
  driveFlowRate: number; // Q flow multiplier
  viewMode: 'curvature' | 'solid' | 'wireframe';
  showDrives: boolean;
  showEdges: boolean;
  showCuspCutaway: boolean;
  rRatio: number; // r / R, default 0.98 or 1.0
}

export const HornTorus3D: React.FC<HornTorus3DProps> = ({
  marks,
  edges,
  partialDrives,
  selectedMarkId,
  onSelectMark,
  onSurgeryMark,
  isRicciFlowing,
  driveFlowRate,
  viewMode,
  showDrives,
  showEdges,
  showCuspCutaway,
  rRatio
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const torusMeshRef = useRef<THREE.Mesh | null>(null);
  const markObjectsRef = useRef<Map<string, THREE.Group>>(new Map());
  const driveLinesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const edgeLinesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const flowParticlesGroupRef = useRef<THREE.Group>(new THREE.Group());
  const cuspGroupRef = useRef<THREE.Group>(new THREE.Group());
  const animationFrameRef = useRef<number>(0);
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  // Helper to map (u, v) on torus of R = 3, r = 3 * rRatio
  const R = 3.0;
  const r = R * Math.min(0.995, Math.max(0.7, rRatio));

  const getTorusPosition = (u: number, v: number): THREE.Vector3 => {
    const x = (R + r * Math.cos(v)) * Math.cos(u);
    const z = (R + r * Math.cos(v)) * Math.sin(u);
    const y = r * Math.sin(v);
    return new THREE.Vector3(x, y, z);
  };

  // Helper for curvature K(u, v)
  const getGaussianCurvature = (v: number): number => {
    const cosV = Math.cos(v);
    const denom = r * (R + r * cosV);
    if (Math.abs(denom) < 0.05) return -10.0;
    return cosV / denom;
  };

  // Generate Parametric BufferGeometry for Horn Torus
  const createTorusGeometry = (uSegments: number = 80, vSegments: number = 80, cutaway: boolean = false) => {
    const geom = new THREE.BufferGeometry();
    const positions: number[] = [];
    const colors: number[] = [];
    const normals: number[] = [];
    const indices: number[] = [];

    const maxU = cutaway ? Math.PI * 1.5 : Math.PI * 2; // cutaway reveals cusp orifice

    for (let i = 0; i <= uSegments; i++) {
      const u = (i / uSegments) * maxU;
      for (let j = 0; j <= vSegments; j++) {
        const v = (j / vSegments) * Math.PI * 2;
        const pos = getTorusPosition(u, v);
        positions.push(pos.x, pos.y, pos.z);

        // Surface Normal
        const nx = Math.cos(v) * Math.cos(u);
        const nz = Math.cos(v) * Math.sin(u);
        const ny = Math.sin(v);
        normals.push(nx, ny, nz);

        // Curvature Color: blue for K < 0 (saddle / near cusp), red/amber for K > 0 (outer perimeter)
        const K = getGaussianCurvature(v);
        const color = new THREE.Color();
        if (K > 0) {
          // Positive curvature: orange to gold
          const t = Math.min(1, K * 2.5);
          color.setRGB(0.85 + 0.15 * t, 0.45 + 0.4 * t, 0.1);
        } else {
          // Negative curvature: deep indigo/violet to cyan near cusp
          const t = Math.min(1, Math.abs(K) * 0.4);
          color.setRGB(0.1 + 0.2 * t, 0.15 + 0.5 * (1 - t), 0.6 + 0.4 * t);
        }
        colors.push(color.r, color.g, color.b);
      }
    }

    for (let i = 0; i < uSegments; i++) {
      for (let j = 0; j < vSegments; j++) {
        const a = i * (vSegments + 1) + j;
        const b = (i + 1) * (vSegments + 1) + j;
        const c = (i + 1) * (vSegments + 1) + (j + 1);
        const d = i * (vSegments + 1) + (j + 1);
        indices.push(a, b, d);
        indices.push(b, c, d);
      }
    }

    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geom.setIndex(indices);
    return geom;
  };

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x07090e); // deep obsidian metapsychic void
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5.5, 7.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 20;
    controls.minDistance = 2;
    controlsRef.current = controls;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xe0e7ff, 1.2);
    dirLight1.position.set(6, 10, 6);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-6, -4, -6);
    scene.add(dirLight2);

    const cuspLight = new THREE.PointLight(0xec4899, 1.5, 5);
    cuspLight.position.set(0, 0, 0); // illuminates the cusp interior
    scene.add(cuspLight);

    // 6. Torus Mesh
    const geometry = createTorusGeometry(80, 80, showCuspCutaway);
    const material = new THREE.MeshStandardMaterial({
      vertexColors: viewMode === 'curvature',
      color: viewMode === 'solid' ? 0x2563eb : (viewMode === 'wireframe' ? 0x38bdf8 : 0xffffff),
      wireframe: viewMode === 'wireframe',
      roughness: 0.35,
      metalness: 0.2,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: viewMode === 'wireframe' ? 0.75 : 0.92
    });
    const torusMesh = new THREE.Mesh(geometry, material);
    scene.add(torusMesh);
    torusMeshRef.current = torusMesh;

    // 7. Add Groups
    scene.add(driveLinesGroupRef.current);
    scene.add(edgeLinesGroupRef.current);
    scene.add(flowParticlesGroupRef.current);
    scene.add(cuspGroupRef.current);

    // Cusp Indicator (Point (0,0,0) where two horns touch)
    const cuspPointGeom = new THREE.SphereGeometry(0.12, 16, 16);
    const cuspPointMat = new THREE.MeshStandardMaterial({
      color: 0xec4899,
      emissive: 0xec4899,
      emissiveIntensity: 0.8
    });
    const cuspPointMesh = new THREE.Mesh(cuspPointGeom, cuspPointMat);
    cuspPointMesh.position.set(0, 0, 0);
    cuspGroupRef.current.add(cuspPointMesh);

    // Two rings for the Upper & Lower Horn boundary B_+ and B_-
    const ringGeom = new THREE.TorusGeometry(0.28, 0.02, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf43f5e, wireframe: true });
    const upperHornRing = new THREE.Mesh(ringGeom, ringMat);
    upperHornRing.rotation.x = Math.PI / 2;
    upperHornRing.position.set(0, 0.35, 0);
    const lowerHornRing = new THREE.Mesh(ringGeom, ringMat);
    lowerHornRing.rotation.x = Math.PI / 2;
    lowerHornRing.position.set(0, -0.35, 0);
    cuspGroupRef.current.add(upperHornRing);
    cuspGroupRef.current.add(lowerHornRing);

    // Handle Resize
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const delta = clockRef.current.getDelta();
      const elapsedTime = clockRef.current.getElapsedTime();

      // Slow majestic rotation
      if (torusMeshRef.current) {
        torusMeshRef.current.rotation.y += 0.0012;
      }

      // Pulse marks based on charge and active state
      markObjectsRef.current.forEach((group, id) => {
        const mark = marks.find(m => m.id === id);
        if (mark && mark.state === 'activo') {
          const pulse = 1 + 0.15 * Math.sin(elapsedTime * 4 + mark.charge);
          group.scale.set(pulse, pulse, pulse);
        }
      });

      // Animate drive flow particles
      flowParticlesGroupRef.current.children.forEach((child, idx) => {
        if (child instanceof THREE.Mesh) {
          const speed = (0.5 + (idx % 3) * 0.3) * driveFlowRate;
          child.userData.progress = ((child.userData.progress || 0) + delta * speed) % 1;
          const curve: THREE.Curve<THREE.Vector3> = child.userData.curve;
          if (curve) {
            const pt = curve.getPoint(child.userData.progress);
            child.position.copy(pt);
          }
        }
      });

      // Animate Invocative Drive threading through cusp
      const invDrive = driveLinesGroupRef.current.getObjectByName('invocative_orb');
      if (invDrive && invDrive.userData.curve) {
        const t = (elapsedTime * 0.25 * driveFlowRate) % 1;
        const pt = invDrive.userData.curve.getPoint(t);
        invDrive.position.copy(pt);
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update Torus Geometry on ViewMode, rRatio, Cutaway
  useEffect(() => {
    if (!torusMeshRef.current || !sceneRef.current) return;
    const geom = createTorusGeometry(80, 80, showCuspCutaway);
    torusMeshRef.current.geometry.dispose();
    torusMeshRef.current.geometry = geom;

    const mat = torusMeshRef.current.material as THREE.MeshStandardMaterial;
    mat.vertexColors = viewMode === 'curvature';
    mat.color = new THREE.Color(
      viewMode === 'solid' ? 0x2563eb : (viewMode === 'wireframe' ? 0x38bdf8 : 0xffffff)
    );
    mat.wireframe = viewMode === 'wireframe';
    mat.needsUpdate = true;
  }, [viewMode, showCuspCutaway, rRatio]);

  // Update Marks on 3D Surface
  useEffect(() => {
    if (!sceneRef.current) return;
    const scene = sceneRef.current;

    // Clean old marks
    markObjectsRef.current.forEach(group => scene.remove(group));
    markObjectsRef.current.clear();

    marks.forEach(mark => {
      if (mark.state === 'quirurgico_removido') return; // surgical excised

      const group = new THREE.Group();
      const pos = getTorusPosition(mark.u, mark.v);
      group.position.copy(pos);

      // Core sphere
      const size = mark.isPrimary ? 0.24 : 0.16 + (mark.charge / 15) * 0.08;
      const sphereGeom = new THREE.SphereGeometry(size, 24, 24);
      const isSelected = mark.id === selectedMarkId;

      let color = 0x3b82f6; // default blue
      if (mark.isPrimary) color = 0xec4899; // primary core n: magenta
      else if (mark.state === 'activo') color = 0xef4444; // active: red
      else color = 0x94a3b8; // latent: slate

      const sphereMat = new THREE.MeshStandardMaterial({
        color: isSelected ? 0xfacc15 : color,
        emissive: isSelected ? 0xfacc15 : (mark.state === 'activo' || mark.isPrimary ? color : 0x000000),
        emissiveIntensity: isSelected ? 0.6 : (mark.state === 'activo' ? 0.4 : 0.1),
        roughness: 0.3
      });
      const sphereMesh = new THREE.Mesh(sphereGeom, sphereMat);
      group.add(sphereMesh);

      // Aureole / Boundary circle showing geodesic curvature k_g = h(a_i)
      const ringRadius = mark.isPrimary ? 0.45 : 0.28 + (mark.charge / 20) * 0.15;
      const ringGeom = new THREE.RingGeometry(ringRadius - 0.02, ringRadius, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: mark.isPrimary ? 0xf43f5e : (mark.state === 'activo' ? 0xf97316 : 0x64748b),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      // Orient tangent to surface
      ringMesh.lookAt(pos.clone().multiplyScalar(1.2));
      group.add(ringMesh);

      // If neck is thin and separable, render surgical dashed neck loop
      if (mark.separable && mark.neckLength < 1.2) {
        const neckGeom = new THREE.TorusGeometry(ringRadius + 0.05, 0.012, 8, 24);
        const neckMat = new THREE.MeshBasicMaterial({
          color: 0x10b981,
          wireframe: true
        });
        const neckMesh = new THREE.Mesh(neckGeom, neckMat);
        group.add(neckMesh);
      }

      // Add to scene and register
      scene.add(group);
      markObjectsRef.current.set(mark.id, group);
    });
  }, [marks, selectedMarkId, rRatio]);

  // Update Bahnung Edges and Drive Particle Flow
  useEffect(() => {
    if (!sceneRef.current) return;

    // Clear edge lines & flow particles
    while (edgeLinesGroupRef.current.children.length > 0) {
      edgeLinesGroupRef.current.remove(edgeLinesGroupRef.current.children[0]);
    }
    while (flowParticlesGroupRef.current.children.length > 0) {
      flowParticlesGroupRef.current.remove(flowParticlesGroupRef.current.children[0]);
    }

    if (!showEdges) return;

    edges.forEach(edge => {
      const src = marks.find(m => m.id === edge.sourceId);
      const tgt = marks.find(m => m.id === edge.targetId);
      if (!src || !tgt) return;
      if (src.state === 'quirurgico_removido' || tgt.state === 'quirurgico_removido') return;

      const p1 = getTorusPosition(src.u, src.v);
      const p2 = getTorusPosition(tgt.u, tgt.v);

      // Geodesic curve interpolation along the surface
      const points: THREE.Vector3[] = [];
      const steps = 24;
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        const u = src.u + (tgt.u - src.u) * t;
        const v = src.v + (tgt.v - src.v) * t;
        // Lift slightly above surface to prevent z-fighting
        const pt = getTorusPosition(u, v).multiplyScalar(1.02);
        points.push(pt);
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeom = new THREE.TubeGeometry(curve, 20, 0.02 * (edge.weight / 3), 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: edge.activeFlow > 1.5 ? 0xef4444 : 0x6366f1,
        emissive: edge.activeFlow > 1.5 ? 0xef4444 : 0x312e81,
        emissiveIntensity: 0.35,
        roughness: 0.4
      });
      const tubeMesh = new THREE.Mesh(tubeGeom, tubeMat);
      edgeLinesGroupRef.current.add(tubeMesh);

      // Particle dots streaming along active edges
      if (edge.activeFlow > 0) {
        for (let p = 0; p < 3; p++) {
          const particleGeom = new THREE.SphereGeometry(0.04, 8, 8);
          const particleMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
          const particle = new THREE.Mesh(particleGeom, particleMat);
          particle.userData = { curve, progress: p / 3 };
          flowParticlesGroupRef.current.add(particle);
        }
      }
    });
  }, [edges, marks, showEdges, rRatio]);

  // Update Partial Drives & Fantasy Limit Cycles around n
  useEffect(() => {
    if (!sceneRef.current) return;

    while (driveLinesGroupRef.current.children.length > 0) {
      driveLinesGroupRef.current.remove(driveLinesGroupRef.current.children[0]);
    }

    if (!showDrives) return;

    const primaryMark = marks.find(m => m.isPrimary);
    if (!primaryMark) return;

    const nPos = getTorusPosition(primaryMark.u, primaryMark.v);

    partialDrives.forEach(drive => {
      if (drive.passesThroughCusp) {
        // Invocative Drive: loop around n AND through the cusp c=(0,0,0)
        const cuspPos = new THREE.Vector3(0, 0, 0);
        const midPoint1 = nPos.clone().lerp(cuspPos, 0.4).add(new THREE.Vector3(0, 0.6, 0.4));
        const midPoint2 = cuspPos.clone().lerp(nPos, 0.5).add(new THREE.Vector3(0, -0.6, -0.4));

        const invPoints = [
          nPos.clone().add(new THREE.Vector3(drive.radius, 0, 0)),
          midPoint1,
          new THREE.Vector3(0, 0.2, 0), // enters upper horn B_+
          cuspPos, // passes through the cusp singular contact point!
          new THREE.Vector3(0, -0.2, 0), // exits lower horn B_-
          midPoint2,
          nPos.clone().add(new THREE.Vector3(-drive.radius, 0, 0)),
          nPos.clone().add(new THREE.Vector3(0, 0, drive.radius)),
          nPos.clone().add(new THREE.Vector3(drive.radius, 0, 0))
        ];

        const invCurve = new THREE.CatmullRomCurve3(invPoints, true);
        const invTube = new THREE.TubeGeometry(invCurve, 64, 0.025, 8, true);
        const invMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(drive.color),
          transparent: true,
          opacity: 0.85
        });
        const invMesh = new THREE.Mesh(invTube, invMat);
        driveLinesGroupRef.current.add(invMesh);

        // Invocative traveling orb
        const orbGeom = new THREE.SphereGeometry(0.08, 12, 12);
        const orbMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const orbMesh = new THREE.Mesh(orbGeom, orbMat);
        orbMesh.name = 'invocative_orb';
        orbMesh.userData = { curve: invCurve };
        driveLinesGroupRef.current.add(orbMesh);
      } else {
        // Concentric drive cycles C_k around n
        const curvePoints: THREE.Vector3[] = [];
        const count = 36;
        for (let i = 0; i <= count; i++) {
          const angle = (i / count) * Math.PI * 2;
          const u = primaryMark.u + Math.cos(angle) * (drive.radius * 0.4);
          const v = primaryMark.v + Math.sin(angle) * (drive.radius * 0.4);
          const pt = getTorusPosition(u, v).multiplyScalar(1.025);
          curvePoints.push(pt);
        }
        const driveCurve = new THREE.CatmullRomCurve3(curvePoints, true);
        const driveTube = new THREE.TubeGeometry(driveCurve, 40, 0.018, 8, true);
        const driveMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(drive.color),
          transparent: true,
          opacity: 0.75
        });
        const driveMesh = new THREE.Mesh(driveTube, driveMat);
        driveLinesGroupRef.current.add(driveMesh);
      }
    });
  }, [partialDrives, marks, showDrives, rRatio]);

  // Click Raycasting to Select Marks
  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!rendererRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = rendererRef.current.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);

    const markMeshes: THREE.Object3D[] = [];
    markObjectsRef.current.forEach(group => {
      group.children.forEach(c => markMeshes.push(c));
    });

    const intersects = raycaster.intersectObjects(markMeshes, false);
    if (intersects.length > 0) {
      const hit = intersects[0].object;
      for (const [id, group] of markObjectsRef.current.entries()) {
        if (group.children.includes(hit)) {
          onSelectMark(id);
          const mark = marks.find(m => m.id === id);
          if (mark) {
            setTooltip({
              x: event.clientX - rect.left,
              y: event.clientY - rect.top,
              text: `${mark.name} (${mark.freudConcept})`
            });
            setTimeout(() => setTooltip(null), 3000);
          }
          break;
        }
      }
    }
  };

  const handleResetCamera = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 5.5, 7.5);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleFocusCusp = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    cameraRef.current.position.set(0, 2.2, 2.8);
    controlsRef.current.target.set(0, 0, 0);
    controlsRef.current.update();
  };

  const handleFocusInvocative = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    // Position camera to look down the throat of the cusp and see the looping C_inv
    cameraRef.current.position.set(1.5, 2.5, 2.2);
    controlsRef.current.target.set(0.5, 0.2, 0.5);
    controlsRef.current.update();
  };

  const handleFocusFantasyCore = () => {
    const primary = marks.find(m => m.isPrimary);
    if (!primary || !cameraRef.current || !controlsRef.current) return;
    const pos = getTorusPosition(primary.u, primary.v);
    cameraRef.current.position.set(pos.x * 1.6, pos.y + 2, pos.z * 1.6);
    controlsRef.current.target.copy(pos);
    controlsRef.current.update();
  };

  const selectedMark = marks.find(m => m.id === selectedMarkId);

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col">
      {/* 3D Canvas Mount */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Floating Tooltip */}
      {tooltip && (
        <div
          className="absolute z-20 px-3 py-1.5 rounded-lg bg-slate-900/95 text-slate-100 text-xs font-mono border border-slate-700 shadow-xl pointer-events-none -translate-x-1/2 -translate-y-8 backdrop-blur"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.text}
        </div>
      )}

      {/* Top Left Overlay: Manifold & Ricci HUD */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 max-w-xs pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 shadow-xl pointer-events-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 font-mono">
              Variedad S = T_{rRatio.toFixed(2)}
            </span>
            <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Horn Torus
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            Soporte del <strong className="text-amber-300 font-medium">Real / Ding</strong> (irreductible a representacin). Cspide singular en <code className="text-pink-400 font-mono text-[11px]">(0,0,0)</code>.
          </p>
          <div className="mt-2.5 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Flujo de Ricci:</span>
            <span className={`font-mono font-medium ${isRicciFlowing ? 'text-emerald-400 flex items-center gap-1' : 'text-slate-500'}`}>
              {isRicciFlowing && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
              {isRicciFlowing ? '∂g/∂t = -R g (activo)' : 'Equilibrio / Pausado'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Right Overlay: Quick Camera Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-800 shadow-xl">
        <button
          onClick={handleFocusInvocative}
          title="Ver Pulsión Invocante C_inv atravesando la Cúspide"
          className="px-2.5 py-1 text-xs text-rose-300 hover:text-rose-200 hover:bg-rose-950/60 rounded-lg transition-colors font-mono flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Pulsión Invocante C_inv
        </button>
        <button
          onClick={handleFocusCusp}
          title="Enfocar Cúspide c (Puerto de la Voz y Superyó)"
          className="px-2.5 py-1 text-xs text-pink-300 hover:text-pink-200 hover:bg-pink-950/60 rounded-lg transition-colors font-mono flex items-center gap-1"
        >
          Cúspide c
        </button>
        <button
          onClick={handleFocusFantasyCore}
          title="Enfocar Núcleo Primario de la Fantasía n"
          className="px-2.5 py-1 text-xs text-indigo-300 hover:text-indigo-200 hover:bg-indigo-950/60 rounded-lg transition-colors font-mono flex items-center gap-1"
        >
          <ZoomIn className="w-3.5 h-3.5" />
          Núcleo n
        </button>
        <button
          onClick={handleResetCamera}
          title="Restablecer vista general"
          className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Center: Selected Mark Context Banner */}
      {selectedMark && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 max-w-lg w-11/12 bg-slate-900/95 backdrop-blur-md p-3.5 rounded-xl border border-indigo-500/40 shadow-2xl flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${selectedMark.isPrimary ? 'bg-pink-500' : (selectedMark.state === 'activo' ? 'bg-red-500' : 'bg-slate-400')}`} />
              <h4 className="text-xs font-semibold text-slate-100 truncate">{selectedMark.name}</h4>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                Carga a_{selectedMark.id} = {selectedMark.charge.toFixed(1)}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {selectedMark.clinicalDescription}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {selectedMark.separable && onSurgeryMark ? (
              <button
                onClick={() => onSurgeryMark(selectedMark.id)}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg shadow transition flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5" />
                Ciruga Perelman
              </button>
            ) : selectedMark.isPrimary ? (
              <span className="text-[11px] font-mono px-2.5 py-1 bg-pink-950/70 border border-pink-700/60 text-pink-300 rounded-lg">
                Indestructible (Axioma 6 y 10)
              </span>
            ) : null}
          </div>
        </div>
      )}

      {/* Curvature Color Legend (when in curvature mode) */}
      {viewMode === 'curvature' && (
        <div className="absolute bottom-4 right-4 z-10 bg-slate-900/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 text-[10px] font-mono text-slate-400 flex flex-col gap-1">
          <span className="font-semibold text-slate-300 mb-0.5">Curvatura de Gauss K(u,v)</span>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded-sm bg-amber-500 inline-block" />
            <span>K &gt; 0 (Permetro externo)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded-sm bg-indigo-600 inline-block" />
            <span>K &lt; 0 (Cuello hiperblico)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded-sm bg-pink-500 inline-block" />
            <span>K → -∞ (Cspide c = (0,0,0))</span>
          </div>
        </div>
      )}
    </div>
  );
};
