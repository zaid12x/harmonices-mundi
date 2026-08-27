import * as THREE from 'three';
import { CelestialBody } from '../types';

export class SpacetimeGrid {
  public mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;

  constructor(size = 60, segments = 100) {
    const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    const vertexShader = [
      'uniform int uNumBodies;',
      'uniform vec3 uBodyPositions[16];',
      'uniform float uBodyMasses[16];',
      'uniform float uTime;',
      'varying float vDeformation;',
      'void main() {',
      '  vec3 pos = position;',
      '  float totalDisplacement = 0.0;',
      '  for (int i = 0; i < 16; i++) {',
      '    if (i >= uNumBodies) break;',
      '    vec3 bodyPos = uBodyPositions[i];',
      '    float mass = uBodyMasses[i];',
      '    float dist = distance(pos.xz, bodyPos.xz);',
      '    float eps = 1.2;',
      '    float well = (mass * 0.15) / sqrt(dist * dist + eps * eps);',
      '    totalDisplacement += well;',
      '  }',
      '  pos.y -= totalDisplacement;',
      '  vDeformation = totalDisplacement;',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);',
      '}'
    ].join('\n');

    const fragmentShader = [
      'uniform vec3 uGridColor;',
      'uniform vec3 uWellColor;',
      'varying float vDeformation;',
      'void main() {',
      '  float t = clamp(vDeformation * 0.35, 0.0, 1.0);',
      '  vec3 col = mix(uGridColor * 0.4, uWellColor, t);',
      '  float alpha = mix(0.25, 0.85, t);',
      '  gl_FragColor = vec4(col, alpha);',
      '}'
    ].join('\n');

    this.material = new THREE.ShaderMaterial({
      wireframe: true,
      transparent: true,
      uniforms: {
        uTime: { value: 0 },
        uNumBodies: { value: 0 },
        uBodyPositions: { value: Array.from({ length: 16 }, () => new THREE.Vector3()) },
        uBodyMasses: { value: new Float32Array(16) },
        uGridColor: { value: new THREE.Color('#00f0ff') },
        uWellColor: { value: new THREE.Color('#ff0055') },
      },
      vertexShader,
      fragmentShader
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.position.y = -0.5;
  }

  public update(bodies: CelestialBody[], time: number) {
    this.material.uniforms.uTime.value = time;
    const num = Math.min(bodies.length, 16);
    this.material.uniforms.uNumBodies.value = num;

    const posArray: THREE.Vector3[] = this.material.uniforms.uBodyPositions.value;
    const massArray: Float32Array = this.material.uniforms.uBodyMasses.value;

    for (let i = 0; i < num; i++) {
      posArray[i].copy(bodies[i].position);
      massArray[i] = bodies[i].mass;
    }
  }
}
