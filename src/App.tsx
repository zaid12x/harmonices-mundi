import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { NBodySimulation } from './physics/nbody';
import { AudioManager } from './audio/AudioManager';
import { SpacetimeGrid } from './visual/SpacetimeGrid';
import { PRESETS } from './physics/presets';
import { HUD } from './components/HUD';
import { CelestialBody, Preset, SimulationParams } from './types';

export const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentPreset, setCurrentPreset] = useState<Preset>(PRESETS[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(null);
  const [audioStarted, setAudioStarted] = useState(false);

  const [params, setParams] = useState<SimulationParams>({
    gravity: PRESETS[0].gravity,
    timeDilation: PRESETS[0].timeDilation,
    softening: 0.8,
    scaleMode: PRESETS[0].scale,
    rootNote: PRESETS[0].rootKey,
    masterVolume: 0.85,
    reverbMix: 0.35,
    delayMix: 0.25,
    lensingStrength: 1.0,
    isPaused: false,
    dopplerEnabled: true
  });

  const simRef = useRef<NBodySimulation | null>(null);
  const audioRef = useRef<AudioManager | null>(null);
  const gridRef = useRef<SpacetimeGrid | null>(null);
  const bodyMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const trailLinesRef = useRef<Map<string, THREE.Line>>(new Map());
  const sceneRef = useRef<THREE.Scene | null>(null);

  const handleUpdateParams = (newParams: Partial<SimulationParams>) => {
    setParams(prev => {
      const updated = { ...prev, ...newParams };
      if (simRef.current) simRef.current.params = updated;
      if (audioRef.current) {
        if (newParams.masterVolume !== undefined) audioRef.current.setMasterVolume(newParams.masterVolume);
        if (newParams.reverbMix !== undefined) audioRef.current.setReverbWet(newParams.reverbMix);
        if (newParams.delayMix !== undefined) audioRef.current.setDelayWet(newParams.delayMix);
      }
      return updated;
    });
  };

  const handleSelectPreset = (preset: Preset) => {
    setCurrentPreset(preset);
    handleUpdateParams({
      gravity: preset.gravity,
      timeDilation: preset.timeDilation,
      scaleMode: preset.scale,
      rootNote: preset.rootKey
    });

    if (sceneRef.current) {
      bodyMeshesRef.current.forEach(mesh => sceneRef.current?.remove(mesh));
      bodyMeshesRef.current.clear();
      trailLinesRef.current.forEach(line => sceneRef.current?.remove(line));
      trailLinesRef.current.clear();
    }

    if (simRef.current && preset.bodies) {
      simRef.current.setBodies(preset.bodies as CelestialBody[]);
      if (audioRef.current) {
        preset.bodies.forEach(b => audioRef.current?.registerBody(b as CelestialBody));
      }
    }
  };

  const handleRecordToggle = () => {
    if (!audioRef.current) return;
    if (isRecording) {
      const blob = audioRef.current.stopRecording();
      setIsRecording(false);
      if (blob && typeof window !== 'undefined') {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'harmonices-mundi-' + currentPreset.id + '.wav';
        a.click();
      }
    } else {
      const started = audioRef.current.startRecording();
      if (started) setIsRecording(true);
    }
  };

  const triggerStartAudio = async () => {
    if (audioRef.current) {
      await audioRef.current.init();
      currentPreset.bodies.forEach(b => audioRef.current?.registerBody(b as CelestialBody));
      setAudioStarted(true);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030712');
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 22, 26);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, -1, 0);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Spacetime Grid
    const grid = new SpacetimeGrid(65, 120);
    scene.add(grid.mesh);
    gridRef.current = grid;

    // Physics & Audio
    const sim = new NBodySimulation(params as SimulationParams);
    const audio = new AudioManager();
    simRef.current = sim;
    audioRef.current = audio;

    sim.onPeriapsisCrossing = (body, vel) => {
      audio.triggerPeriapsisHit(body, vel);
    };

    sim.setBodies(currentPreset.bodies as CelestialBody[]);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      sim.update(dt);
      grid.update(sim.bodies, elapsedTime);

      for (const body of sim.bodies) {
        let mesh = bodyMeshesRef.current.get(body.id);
        if (!mesh) {
          const rad = body.type === 'star' || body.type === 'black_hole' ? body.radius * 1.2 : body.radius * 1.8;
          const geom = new THREE.SphereGeometry(rad, 32, 32);
          const mat = new THREE.MeshStandardMaterial({
            color: body.color,
            emissive: body.color,
            emissiveIntensity: body.type === 'star' || body.type === 'pulsar' ? 1.2 : 0.6,
            roughness: 0.2,
            metalness: 0.6
          });
          mesh = new THREE.Mesh(geom, mat);
          scene.add(mesh);
          bodyMeshesRef.current.set(body.id, mesh);
        }

        mesh.position.copy(body.position);
        mesh.rotation.y += body.spinRate;

        // Update orbit trail line
        let trailLine = trailLinesRef.current.get(body.id);
        if (!trailLine && body.trail.length > 1) {
          const lineGeom = new THREE.BufferGeometry().setFromPoints(body.trail);
          const lineMat = new THREE.LineBasicMaterial({
            color: body.color,
            transparent: true,
            opacity: 0.6
          });
          trailLine = new THREE.Line(lineGeom, lineMat);
          scene.add(trailLine);
          trailLinesRef.current.set(body.id, trailLine);
        } else if (trailLine && body.trail.length > 1) {
          trailLine.geometry.setFromPoints(body.trail);
        }

        audio.updateBodyVoice(body, camera.position, sim.params);
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden select-none">
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {!audioStarted && (
        <div 
          onClick={triggerStartAudio}
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-30 cursor-pointer"
        >
          <div className="px-8 py-4 bg-slate-950/90 border border-cyan-400 rounded-2xl shadow-2xl shadow-cyan-500/30 text-center animate-pulse">
            <div className="text-lg font-bold font-mono text-cyan-400">CLICK TO ENGAGE GRAVITATIONAL SYNTHESIZER</div>
            <div className="text-xs text-slate-400 mt-1 font-mono">Initialize Web Audio & Celestial Harmonics</div>
          </div>
        </div>
      )}

      <HUD
        params={params}
        onUpdateParams={handleUpdateParams}
        bodies={simRef.current?.bodies || []}
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        onRecordToggle={handleRecordToggle}
        isRecording={isRecording}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
      />
    </div>
  );
};
