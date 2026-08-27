import * as THREE from 'three';
import { Preset } from '../types';

export const PRESETS: Preset[] = [
  {
    id: 'trappist-1',
    name: 'TRAPPIST-1 Resonance Chain',
    subtitle: '7 Exoplanets in 8:5:3:2 Harmonic Lock',
    description: 'A miniature ultra-cool red dwarf orbited by 7 terrestrial planets locked in resonant laplace chains playing Just-Intonation chords.',
    scale: 'just_major',
    rootKey: 'D3',
    gravity: 12.0,
    timeDilation: 1.0,
    bodies: [
      {
        id: 'star-trappist',
        name: 'TRAPPIST-1 Star',
        type: 'star',
        mass: 100.0,
        radius: 1.4,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: '#ff4d00',
        baseFreq: 55,
        volume: 0.8,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.02
      },
      {
        id: 'trappist-b',
        name: 'Planet b (8)',
        type: 'planet',
        mass: 1.0,
        radius: 0.35,
        position: new THREE.Vector3(3.2, 0, 0),
        velocity: new THREE.Vector3(0, 5.5, 0),
        color: '#00f0ff',
        baseFreq: 220,
        volume: 0.7,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.05
      },
      {
        id: 'trappist-c',
        name: 'Planet c (5)',
        type: 'planet',
        mass: 1.2,
        radius: 0.38,
        position: new THREE.Vector3(4.5, 0, 0),
        velocity: new THREE.Vector3(0, 4.6, 0),
        color: '#7000ff',
        baseFreq: 275,
        volume: 0.7,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.04
      },
      {
        id: 'trappist-d',
        name: 'Planet d (3)',
        type: 'planet',
        mass: 0.8,
        radius: 0.32,
        position: new THREE.Vector3(6.1, 0, 0),
        velocity: new THREE.Vector3(0, 3.9, 0),
        color: '#ff0055',
        baseFreq: 330,
        volume: 0.7,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.03
      },
      {
        id: 'trappist-e',
        name: 'Planet e (2)',
        type: 'planet',
        mass: 1.1,
        radius: 0.36,
        position: new THREE.Vector3(8.0, 0, 0),
        velocity: new THREE.Vector3(0, 3.4, 0),
        color: '#ffb703',
        baseFreq: 440,
        volume: 0.7,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.02
      }
    ]
  },
  {
    id: 'kerr-black-hole',
    name: 'Kerr Singularity & Binary Pulsar',
    subtitle: 'Relativistic Doppler & Gravitational Lensing',
    description: 'A supermassive rotating black hole generating sub-bass drones and photon ring warping, orbited by an ultra-dense pulsar sweeping high-frequency radio pulses.',
    scale: 'minor_pentatonic',
    rootKey: 'C2',
    gravity: 25.0,
    timeDilation: 0.8,
    bodies: [
      {
        id: 'kerr-singularity',
        name: 'Gargantua (Kerr BH)',
        type: 'black_hole',
        mass: 250.0,
        radius: 1.8,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: '#111827',
        baseFreq: 32.7,
        volume: 0.9,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.15
      },
      {
        id: 'binary-pulsar',
        name: 'PSR J0737 Pulsar',
        type: 'pulsar',
        mass: 4.0,
        radius: 0.45,
        position: new THREE.Vector3(5.5, 0, 0),
        velocity: new THREE.Vector3(0, 6.8, 0),
        color: '#00ffff',
        baseFreq: 523.25,
        volume: 0.85,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.25
      }
    ]
  },
  {
    id: 'figure-8',
    name: 'Figure-8 Three-Body Canon',
    subtitle: 'Stable 3-Body Choreography & Rhythmic Loop',
    description: 'Three equal-mass bodies perpetually chasing each other on a stable lemniscate figure-8 curve, performing a three-voice musical canon.',
    scale: 'lydian',
    rootKey: 'F3',
    gravity: 10.0,
    timeDilation: 1.2,
    bodies: [
      {
        id: 'body-1',
        name: 'Voice Alpha',
        type: 'gas_giant',
        mass: 15.0,
        radius: 0.6,
        position: new THREE.Vector3(4.0, 0, 0),
        velocity: new THREE.Vector3(0, 2.0, 0),
        color: '#00f0ff',
        baseFreq: 174.61,
        volume: 0.75,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.05
      },
      {
        id: 'body-2',
        name: 'Voice Beta',
        type: 'gas_giant',
        mass: 15.0,
        radius: 0.6,
        position: new THREE.Vector3(-4.0, 0, 0),
        velocity: new THREE.Vector3(0, -2.0, 0),
        color: '#ff0055',
        baseFreq: 220.0,
        volume: 0.75,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.05
      },
      {
        id: 'body-3',
        name: 'Voice Gamma',
        type: 'gas_giant',
        mass: 15.0,
        radius: 0.6,
        position: new THREE.Vector3(0, 0, 0),
        velocity: new THREE.Vector3(0, 0, 0),
        color: '#ffb703',
        baseFreq: 261.63,
        volume: 0.75,
        isMuted: false,
        isSoloed: false,
        spinRate: 0.05
      }
    ]
  }
];
