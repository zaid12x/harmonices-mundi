import * as THREE from 'three';

export type BodyType = 'star' | 'planet' | 'gas_giant' | 'black_hole' | 'pulsar';

export interface CelestialBody {
  id: string;
  name: string;
  type: BodyType;
  mass: number;
  radius: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  color: string;
  trail: THREE.Vector3[];
  synthVoice?: any;
  baseFreq: number;
  currentFreq: number;
  volume: number;
  isMuted: boolean;
  isSoloed: boolean;
  spinRate: number;
  lastPeriapsisDist?: number;
}

export interface Preset {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  bodies: Omit<CelestialBody, 'trail' | 'currentFreq'>[];
  scale: string;
  rootKey: string;
  gravity: number;
  timeDilation: number;
}

export interface SimulationParams {
  gravity: number;
  timeDilation: number;
  softening: number;
  scaleMode: string;
  rootNote: string;
  masterVolume: number;
  reverbMix: number;
  delayMix: number;
  lensingStrength: number;
  isPaused: boolean;
  dopplerEnabled: boolean;
}
