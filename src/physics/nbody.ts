import * as THREE from 'three';
import { CelestialBody, SimulationParams } from '../types';

export class NBodySimulation {
  public bodies: CelestialBody[] = [];
  public params: SimulationParams;
  public onPeriapsisCrossing?: (body: CelestialBody, velocityMagnitude: number) => void;
  public onResonanceDetected?: (bodyA: CelestialBody, bodyB: CelestialBody, ratio: string) => void;

  constructor(params: SimulationParams) {
    this.params = params;
  }

  public setBodies(bodies: CelestialBody[]) {
    this.bodies = bodies.map(b => ({
      ...b,
      position: b.position.clone(),
      velocity: b.velocity.clone(),
      trail: [b.position.clone()]
    }));
  }

  private computeAccelerations(positions: THREE.Vector3[]): THREE.Vector3[] {
    const n = positions.length;
    const accelerations: THREE.Vector3[] = Array.from({ length: n }, () => new THREE.Vector3(0, 0, 0));
    const G = this.params.gravity;
    const eps2 = this.params.softening * this.params.softening;
    const c2 = 900.0; // Scaled speed of light squared for simulation

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const diff = new THREE.Vector3().subVectors(positions[j], positions[i]);
        const r2 = diff.lengthSq();
        const dist = Math.sqrt(r2 + eps2);
        const invDist3 = 1.0 / (dist * dist * dist);

        // General Relativistic Schwarzschild Precession term
        const mTotal = this.bodies[i].mass + this.bodies[j].mass;
        const grFactor = 1.0 + (3.0 * G * mTotal) / (Math.max(dist, 1.0) * c2);

        const forceI = diff.clone().multiplyScalar(G * this.bodies[j].mass * invDist3 * grFactor);
        const forceJ = diff.clone().multiplyScalar(-G * this.bodies[i].mass * invDist3 * grFactor);

        accelerations[i].add(forceI);
        accelerations[j].add(forceJ);
      }
    }

    return accelerations;
  }

  public update(dt: number) {
    if (this.params.isPaused || this.bodies.length === 0) return;

    const scaledDt = dt * this.params.timeDilation;
    const subSteps = 8;
    const h = scaledDt / subSteps;

    for (let step = 0; step < subSteps; step++) {
      const n = this.bodies.length;
      const r0 = this.bodies.map(b => b.position.clone());
      const v0 = this.bodies.map(b => b.velocity.clone());

      // k1
      const a0 = this.computeAccelerations(r0);
      const k1_r = v0.map(v => v.clone());
      const k1_v = a0.map(a => a.clone());

      // k2
      const r1 = r0.map((r, i) => r.clone().addScaledVector(k1_r[i], 0.5 * h));
      const v1 = v0.map((v, i) => v.clone().addScaledVector(k1_v[i], 0.5 * h));
      const a1 = this.computeAccelerations(r1);
      const k2_r = v1.map(v => v.clone());
      const k2_v = a1.map(a => a.clone());

      // k3
      const r2 = r0.map((r, i) => r.clone().addScaledVector(k2_r[i], 0.5 * h));
      const v2 = v0.map((v, i) => v.clone().addScaledVector(k2_v[i], 0.5 * h));
      const a2 = this.computeAccelerations(r2);
      const k3_r = v2.map(v => v.clone());
      const k3_v = a2.map(a => a.clone());

      // k4
      const r3 = r0.map((r, i) => r.clone().addScaledVector(k3_r[i], h));
      const v3 = v0.map((v, i) => v.clone().addScaledVector(k3_v[i], h));
      const a3 = this.computeAccelerations(r3);
      const k4_r = v3.map(v => v.clone());
      const k4_v = a3.map(a => a.clone());

      // Combine RK4 increments
      for (let i = 0; i < n; i++) {
        const dr = new THREE.Vector3()
          .addScaledVector(k1_r[i], 1 / 6)
          .addScaledVector(k2_r[i], 2 / 6)
          .addScaledVector(k3_r[i], 2 / 6)
          .addScaledVector(k4_r[i], 1 / 6)
          .multiplyScalar(h);

        const dv = new THREE.Vector3()
          .addScaledVector(k1_v[i], 1 / 6)
          .addScaledVector(k2_v[i], 2 / 6)
          .addScaledVector(k3_v[i], 2 / 6)
          .addScaledVector(k4_v[i], 1 / 6)
          .multiplyScalar(h);

        this.bodies[i].position.add(dr);
        this.bodies[i].velocity.add(dv);
      }
    }

    this.updateAudioMetrics();
  }

  private updateAudioMetrics() {
    const centralBody = this.bodies.find(b => b.type === 'star' || b.type === 'black_hole') || this.bodies[0];

    for (const body of this.bodies) {
      if (body === centralBody) continue;

      const rVec = new THREE.Vector3().subVectors(body.position, centralBody.position);
      const r = rVec.length();
      const v = body.velocity.length();

      const omega = v / Math.max(r, 0.5);
      body.currentFreq = body.baseFreq * (1.0 + omega * 2.5);

      if (body.lastPeriapsisDist !== undefined) {
        if (body.lastPeriapsisDist > r) {
          // Approaching
        } else if (body.lastPeriapsisDist < r && r < 15.0) {
          if (this.onPeriapsisCrossing) {
            this.onPeriapsisCrossing(body, v);
          }
        }
      }
      body.lastPeriapsisDist = r;

      body.trail.push(body.position.clone());
      if (body.trail.length > 150) {
        body.trail.shift();
      }
    }
  }
}
