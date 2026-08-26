import React, { useEffect, useRef, useState } from 'react';
import type { WorldState } from '../../engine/types';
import * as THREE from 'three';
import { Box, Eye, Sparkles, Layers, MapPin, Clock, Coffee, Bus } from 'lucide-react';

interface Classroom3DViewProps {
  world: WorldState;
}

export const Classroom3DView: React.FC<Classroom3DViewProps> = ({ world }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'classroom' | 'geomap' | 'dag3d'>('classroom');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0f17);

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 22, 30);
    camera.lookAt(0, 0, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x00f2fe, 1.2);
    dirLight.position.set(15, 25, 15);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 1.5, 40);
    pointLight.position.set(-15, 15, -15);
    scene.add(pointLight);

    const arch = world.architecture;
    const students = world.students;

    if (viewMode === 'classroom') {
      // --- 3D CLASSROOM LAYOUT ---
      const gridHelper = new THREE.GridHelper(40, 20, 0x00f2fe, 0x1f293d);
      scene.add(gridHelper);

      // Teacher Desk / Podium
      const teacherGeo = new THREE.BoxGeometry(4, 1.2, 2);
      const teacherMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3 });
      const teacherDesk = new THREE.Mesh(teacherGeo, teacherMat);
      teacherDesk.position.set(0, 0.6, -12);
      scene.add(teacherDesk);

      // Teacher Avatar
      const teacherHeadGeo = new THREE.SphereGeometry(0.7, 16, 16);
      const teacherHeadMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x8b5cf6, emissiveIntensity: 0.4 });
      const teacherHead = new THREE.Mesh(teacherHeadGeo, teacherHeadMat);
      teacherHead.position.set(0, 2.3, -12);
      scene.add(teacherHead);

      const cols = arch.presetId === 'montessori' ? 5 : 6;
      const spacingX = 3.5;
      const spacingZ = 3.5;

      students.forEach((s, idx) => {
        const row = Math.floor(idx / cols);
        const col = idx % cols;

        let posX = (col - (cols - 1) / 2) * spacingX;
        let posZ = (row - 1) * spacingZ;

        if (arch.presetId === 'montessori') {
          const cluster = Math.floor(idx / 4);
          const cIdx = idx % 4;
          const cx = (cluster % 3 - 1) * 9;
          const cz = (Math.floor(cluster / 3) - 1) * 9;
          posX = cx + (cIdx % 2 === 0 ? -1.8 : 1.8);
          posZ = cz + (cIdx < 2 ? -1.8 : 1.8);
        }

        // Student Desk
        const deskGeo = new THREE.BoxGeometry(1.8, 0.8, 1.2);
        const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
        const desk = new THREE.Mesh(deskGeo, deskMat);
        desk.position.set(posX, 0.4, posZ);
        scene.add(desk);

        // Student Color based on Stress vs Energy
        let agentColor = 0x00f2fe; // Cyan = Low stress
        if (s.stress > 65) agentColor = 0xef4444; // Red = High stress
        else if (s.energy < 45) agentColor = 0xf59e0b; // Amber = Commute fatigue

        const studentHeadGeo = new THREE.SphereGeometry(0.55, 16, 16);
        const studentHeadMat = new THREE.MeshStandardMaterial({ color: agentColor, roughness: 0.2 });
        const studentHead = new THREE.Mesh(studentHeadGeo, studentHeadMat);
        studentHead.position.set(posX, 1.6, posZ);
        scene.add(studentHead);

        // AI Tutor Hologram
        if (arch.aiIntegrationLevel > 50 && idx % 2 === 0) {
          const aiGeo = new THREE.OctahedronGeometry(0.35);
          const aiMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, wireframe: true });
          const aiHolo = new THREE.Mesh(aiGeo, aiMat);
          aiHolo.position.set(posX, 2.7, posZ);
          scene.add(aiHolo);
        }
      });
    } else if (viewMode === 'geomap') {
      // --- FULL PHYSICAL GEOGRAPHICAL MAP 3D ---
      const mapGrid = new THREE.GridHelper(60, 30, 0x10b981, 0x111827);
      scene.add(mapGrid);

      // School Central Building (3D Model)
      const schoolBuildingGeo = new THREE.BoxGeometry(8, 5, 8);
      const schoolMat = new THREE.MeshStandardMaterial({ color: 0x8b5cf6, roughness: 0.3, emissive: 0x8b5cf6, emissiveIntensity: 0.2 });
      const schoolBuilding = new THREE.Mesh(schoolBuildingGeo, schoolMat);
      schoolBuilding.position.set(0, 2.5, 0);
      scene.add(schoolBuilding);

      // Render Student Residential Nodes & Transit Lines to School
      students.forEach((s) => {
        const homeX = s.geoCoordinates.x * 2;
        const homeZ = s.geoCoordinates.y * 2;

        // Student Home Marker
        const homeGeo = new THREE.CylinderGeometry(0.6, 0.6, 1.5, 8);
        const homeMat = new THREE.MeshStandardMaterial({
          color: s.transportMode === 'walk' ? 0x10b981 : s.transportMode === 'bike' ? 0x00f2fe : 0xf59e0b
        });
        const homeMesh = new THREE.Mesh(homeGeo, homeMat);
        homeMesh.position.set(homeX, 0.75, homeZ);
        scene.add(homeMesh);

        // Transit Beam Line connecting Home to School
        const points = [
          new THREE.Vector3(homeX, 0.8, homeZ),
          new THREE.Vector3(homeX * 0.5, 2.5, homeZ * 0.5),
          new THREE.Vector3(0, 1.5, 0)
        ];
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.1, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.45 });
        const tube = new THREE.Mesh(tubeGeo, tubeMat);
        scene.add(tube);
      });
    } else {
      // --- 3D KNOWLEDGE DAG MODEL ---
      const nodes = world.knowledgeGraph.nodes;
      const nodeMeshes: Record<string, THREE.Mesh> = {};

      nodes.forEach((node, i) => {
        const phi = Math.acos(-1 + (2 * i) / nodes.length);
        const theta = Math.sqrt(nodes.length * Math.PI) * phi;
        const radius = 10;

        const x = radius * Math.cos(theta) * Math.sin(phi);
        const y = radius * Math.sin(theta) * Math.sin(phi);
        const z = radius * Math.cos(phi);

        const nodeGeo = new THREE.SphereGeometry(1.1, 16, 16);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: node.category === 'STEM' ? 0x00f2fe : 0x8b5cf6,
          emissive: 0x00f2fe,
          emissiveIntensity: 0.3
        });
        const mesh = new THREE.Mesh(nodeGeo, nodeMat);
        mesh.position.set(x, y, z);
        scene.add(mesh);
        nodeMeshes[node.id] = mesh;
      });

      nodes.forEach(node => {
        const targetMesh = nodeMeshes[node.id];
        if (!targetMesh) return;

        node.prerequisiteIds.forEach(prereqId => {
          const sourceMesh = nodeMeshes[prereqId];
          if (sourceMesh) {
            const points = [sourceMesh.position, targetMesh.position];
            const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            const lineMat = new THREE.LineBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
            const line = new THREE.Line(lineGeo, lineMat);
            scene.add(line);
          }
        });
      });
    }

    // Animation Loop
    let animationFrameId: number;
    let angle = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      angle += 0.0025;
      camera.position.x = 28 * Math.sin(angle);
      camera.position.z = 28 * Math.cos(angle);
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [world, viewMode]);

  return (
    <div className="classroom-3d-container">
      <div className="c3d-header">
        <div className="title-group">
          <Box className="icon-cyan" size={24} />
          <div>
            <h2>3D Spatial Classroom & Physical Geographical Map</h2>
            <p className="subtitle">
              Interactive 3D WebGL renderer modeling classroom interiors, transit lines, commute distance, and break recovery routines.
            </p>
          </div>
        </div>

        <div className="c3d-mode-switcher">
          <button
            onClick={() => setViewMode('classroom')}
            className={`c3d-btn ${viewMode === 'classroom' ? 'active' : ''}`}
          >
            <Eye size={16} />
            <span>3D Spatial Classroom</span>
          </button>

          <button
            onClick={() => setViewMode('geomap')}
            className={`c3d-btn ${viewMode === 'geomap' ? 'active' : ''}`}
          >
            <MapPin size={16} />
            <span>Geographical Campus Map</span>
          </button>

          <button
            onClick={() => setViewMode('dag3d')}
            className={`c3d-btn ${viewMode === 'dag3d' ? 'active' : ''}`}
          >
            <Layers size={16} />
            <span>3D Knowledge DAG Sphere</span>
          </button>
        </div>
      </div>

      {/* Routine Banner & Factors Banner */}
      <div className="routine-banner">
        <div className="routine-item">
          <Clock size={16} className="icon-cyan" />
          <span>Daily Time: <strong>{world.timeOfDay || '08:30 AM'}</strong></span>
        </div>

        <div className="routine-item">
          <Coffee size={16} className="icon-amber" />
          <span>Routine Period: <strong>{world.currentRoutinePeriod ? world.currentRoutinePeriod.replace('_', ' ').toUpperCase() : 'INSTRUCTION 1'}</strong></span>
        </div>

        <div className="routine-item">
          <Bus size={16} className="icon-emerald" />
          <span>Avg Commute: <strong>{Math.round(world.students.reduce((sum, s) => sum + s.commuteTimeMins, 0) / (world.students.length || 1))} mins</strong></span>
        </div>
      </div>

      <div className="canvas-wrapper-3d" ref={mountRef}>
        <div className="overlay-legend-3d">
          {viewMode === 'geomap' ? (
            <>
              <div className="legend-item">
                <span className="dot purple" />
                <span>Central Campus</span>
              </div>
              <div className="legend-item">
                <span className="dot green" />
                <span>Walk/Bike Zone (&lt; 3 km)</span>
              </div>
              <div className="legend-item">
                <span className="dot amber" />
                <span>Bus/Transit Zone (&gt; 10 km)</span>
              </div>
            </>
          ) : (
            <>
              <div className="legend-item">
                <span className="dot cyan" />
                <span>High Mastery (Cyan)</span>
              </div>
              <div className="legend-item">
                <span className="dot amber" />
                <span>Commute Fatigue (Amber)</span>
              </div>
              <div className="legend-item">
                <span className="dot red" />
                <span>High Stress (Red)</span>
              </div>
              {world.architecture.aiIntegrationLevel > 50 && (
                <div className="legend-item">
                  <Sparkles size={14} className="icon-cyan" />
                  <span>AI Tutor Hologram</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
