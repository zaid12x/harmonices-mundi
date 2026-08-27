# Harmonices Mundi: Relativistic N-Body Celestial Synthesizer and Spacetime Sonification Engine

**Author:** Zaid  
**Affiliation:** ShW Labs  
**AI Engineering Collaborator:** Gemini 3.7 Flash (DeepMind Advanced Agentic Architecture)  
**Date:** August 2026  
**Keywords:** Celestial Mechanics, Sonification, Relativistic N-Body, Keplerian Resonance, Runge-Kutta 4, WebGL, Web Audio API, Just Intonation

---

## Abstract
In 1619, Johannes Kepler published *Harmonices Mundi*, positing that celestial bodies produce an imperceptible polyphonic harmony determined by their extreme angular velocities at perihelion and aphelion. In this work, we present a unified computational framework and real-time WebGL/Web Audio engine that translates relativistic N-body gravitational mechanics directly into musical structures and GLSL spacetime deformation shaders.
We employ an 8-substep 4th-Order Runge-Kutta (RK4) integrator with 1st Post-Newtonian (1PN) Schwarzschild precession terms, coupled with a dynamic voice matrix that quantizes instantaneous orbital kinematics into harmonic ratios (Just Intonation, Keplerian Pythagorean, and modal scales). Furthermore, close-periapsis approaches trigger rhythmic transients, and orbital coordinates modulate 3D binaural spatial panners with Doppler frequency shifts.

---

## 1. Introduction & Historical Context
Kepler's Third Law (T^2 proportional to a^3) established the mathematical foundation of orbital mechanics. Kepler discovered that the ratio of planetary velocities at extreme points of eccentric orbits corresponds closely to musical intervals: Saturn's ratio was a Major Third (4:5), Jupiter a Minor Third (5:6), Mars a Fifth (2:3), and Earth a Semitone (15:16).

Modern astrophysics has revealed multi-planet systems locked in genuine resonant chains, most notably the TRAPPIST-1 system (Luger et al., 2017). *Harmonices Mundi* transforms this theoretical bridge into an interactive, deterministic synthesizer where astrophysics is the score and gravity is the conductor.

---

## 2. Mathematical & Astrophysical Foundations

### 2.1 Gravitational Equations of Motion with Post-Newtonian Corrections
For an N-body system with softening parameter epsilon > 0, the Newtonian acceleration on body i augmented by the 1st Post-Newtonian (1PN) general relativistic correction is given by:

a_i = sum_{j != i} [ G * M_j * (r_j - r_i) / (|r_j - r_i|^2 + epsilon^2)^(3/2) ] * [ 1 + (3 * G * (M_i + M_j)) / (c^2 * r_{ij}) ]

Where:
- G is the universal gravitational constant.
- M_j, r_j are the mass and position vector of body j.
- c is the effective speed of light in simulation units.
- epsilon is the gravitational softening length preventing infinite velocity singularities during close encounters.

### 2.2 Numerical Integration: 4th-Order Runge-Kutta (RK4)
The phase-space state y = (r, v) evolves according to dy/dt = f(t, y). For time step dt, RK4 evaluates 4 sub-slopes:

k_1 = f(t_n, y_n)
k_2 = f(t_n + dt/2, y_n + (dt/2)*k_1)
k_3 = f(t_n + dt/2, y_n + (dt/2)*k_2)
k_4 = f(t_n + dt, y_n + dt*k_3)
y_{n+1} = y_n + (dt/6) * (k_1 + 2*k_2 + 2*k_3 + k_4)

To guarantee energy conservation and symplectic fidelity, the engine subdivides each frame step into 8 micro-substeps (dt_sub = dt / 8).

---

## 3. Spacetime Shader & Visual Synthesis
The 3D canvas renders a spacetime mesh deformed by the gravitational potential field Phi(x). The vertex displacement along the vertical z-axis follows:

z(x) = - sum_{i=1}^N [ (G * M_i) / sqrt(||x - r_i||^2 + epsilon^2) ]

The GLSL fragment shader evaluates local gradient magnitude ||nabla Phi|| to color the mesh from deep cyan in asymptotic flat space to incandescent crimson within black hole event horizons.

---

## 4. Web Audio Synthesis Architecture & Microtonal Quantization

### 4.1 Voice Allocation Matrix
1. **Terrestrial Exoplanets:** Crystalline FM synthesizer with dynamic carrier-to-modulator modulation index driven by orbital velocity v = ||v||.
2. **Gas Giants:** Polyphonic analog subtractive saw/square pads with dynamic resonant lowpass filters.
3. **Black Holes / Singularities:** Deep 30-60 Hz dual-saw Reese sub-bass drone with slow gravitational LFO pulsation.
4. **Binary Pulsars:** Rapid rhythmic FM membrane clicks modulated by rotational frequency.

### 4.2 Scale Quantization & Frequency Mapping
The instantaneous angular speed omega = ||r x v|| / ||r||^2 is mapped logarithmically to musical octaves and quantized to Just Intonation ratios (1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2/1) or Kepler's Pythagorean ratios based on powers of (3/2)^k mod 2.

---

## 5. Curated Astrophysical Case Studies
1. **TRAPPIST-1 System:** Seven earth-sized planets locked in a continuous three-body Laplace resonance chain (8:5:3:2), generating shimmering, consonant chordal cadences.
2. **Kerr Singularity & Binary Pulsar:** High gravitational redshift and relativistic precession yielding deep sub-bass glissandos and rhythmic pulsar transients.
3. **Figure-8 Lemniscate Canon:** Stable 3-body equal-mass choreographic solution (Chenciner & Montgomery, 2000), producing an unending three-voice musical canon.

---

## 6. AI-Assisted Engineering Methodology
This system was engineered by **Zaid at ShW Labs** leveraging **Gemini 3.7 Flash** (DeepMind) through an advanced agentic pair-programming architecture. Gemini 3.7 Flash facilitated the mathematical derivation of the RK4 sub-stepped integrator, GLSL vertex displacement shaders, Web Audio tone matrix routing, and mobile-optimized glassmorphic UI engineering.

---

## References & Citations
1. Kepler, J. (1619). *Harmonices Mundi*. Lincii Austriae: Gottfried Tampach.
2. Luger, R. et al. (2017). *A seven-planet resonant chain in TRAPPIST-1*. Nature Astronomy. [arXiv:1703.04166](https://arxiv.org/abs/1703.04166).
3. Teyssandier, J. et al. (2021). *TRAPPIST-1: Dynamical analysis of transit-timing variations and resonant chain*. [arXiv:2110.03340](https://arxiv.org/abs/2110.03340).
4. Chenciner, A., & Montgomery, R. (2000). *A remarkable periodic solution of the three-body problem in the case of equal masses*. Annals of Mathematics. [arXiv:math/0011268](https://arxiv.org/abs/math/0011268).
5. Misner, C. W., Thorne, K. S., & Wheeler, J. A. (1973). *Gravitation*. W. H. Freeman.