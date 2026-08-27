# 🦐 Harmonices Mundi (Relativistic N-Body Synthesizer)

[![Netlify Status](https://img.shields.io/badge/Netlify-Live_Deploy-00C7B7?logo=netlify&logoColor=white)](https://harmonices-mundi.netlify.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-black?logo=three.js)](https://threejs.org/)
[![Tone.js](https://img.shields.io/badge/Tone.js-Web_Audio-orange)](https://tonejs.github.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> *"The heavenly motions are nothing but a continuous song for several voices, to be perceived by the intellect, not by the ear; a music which, through the discordant tensions, progresses towards certain pre-designed, six-voiced clausulas..."*  
> — **Johannes Kepler**, *Harmonices Mundi* (1619)

**Harmonices Mundi** is a real-time 3D gravitational sandbox where *orbital mechanics directly compose polyphonic music* and *relativistic spacetime geometry drives real-time GLSL visual synthesis*.

---

### 🌢 Live Application & Links
* **Live Production Web App:** [phttps://harmonices-mundi.netlify.app](https://harmonices-mundi.netlify.app)
* **GitHub Repository:** [https://github.com/zaid12x/harmonices-mundi](https://github.com/zaid12x/harmonices-mundi)
* **Preprint Whitepaper:** [WHITEPAPER.md](WHITEPAPER.md)
* **LaTeX Preprint Source:** [paper.tex](paper.tex)

---

## 🏛️ System Architecture

```
        [ SPACE ]                            [ MATH ]
  Keplerian Orbits &                    N-Body Runge-Kutta 4 &
  Gravitational Lensing                  Pythagorean Ratios
            ⨂                                   ⨂
            └─────────────┬──────────────┙
                                 Ⓖ
           [ THE SYSTEM: Gravitational Synthesizer ]
                                 Ⓕ
            └┌┌┌┌┌┌┌┌┌┌┌┌┬┌┌┌┌┌┌┌┌┌┌┌┌┙
            ⨂                                   ⨂
   [ MUSIC (Web Audio) ]                   [ CODE (Three.js/GLSL) ]
  Orbital Frequency to Pitch             Deformable Spacetime Grid &
  & Periapsis Beat Transients             Binaural Spatial Panners
```

---

## ⚙️ The Four Pillars

### 1. 🌌 Space (Astrophysical Physics Engine)
* **4th-Order Runge-Kutta (RK4) Integrator:** Deterministic multi-body gravitational physics running with micro-substepping ($x8$ per frame) and gravitational softening ($\\epsilon = 0.8$).
* **General Relativistic Precession:** 1st Post-Newtonian (1PN) Schwarzschild correction terms.


### 2. 📐 Math & Harmonic Ratios
* **Orbital Harmonicity:** Planetary resonance chains ($8:5:3:2$ in TRAPPIST-1) map to consonant musical intervals via Kepler's Third Law ($T^2 \\propto a^3$).
* **Scale Quantization:** Pure Just Intonation integer harmonic ratios and Kepler 1619 Pythagorean tuning.

### 3. 🎴 Music (Tone.js & Web Audio Synthesis Matrix)
* **Procedural Voices:** FM bells for rocky exoplanets, analog saw/triangle pads for gas giants, deep 30--60 Hz Reese drones for black holes, and FM pression pulses for binary pulsars.
* **3D Binaural Audio:** Web Audio aPannerNode` with HRTF spatialization mapped to the free-flying 3D camera.
* **Lossless WAV Export:** Integrated live stem recording directly in the browser.

### 4. 💻 Code & Visual Shader Synthesis
* **Deformable Spacetime Mesh:** Real-time 3D relativistic vertex displacement ($z+\\sum GM_j/\\sqrt{r&2+\\epsilon^2}$) and potential well heatmap shaders.
* **Mobile-First HUD:** Touch OrbitControls (1-finger rotate, 2-finger zoom/pan), collapsible DJ macro drawer, and in-app **Science & Theory Whitepaper Reader**.

---

## 🌶 Curated Celestial Scenarios

| Scenario | Physics & Resonance | Musical Character |
|---|---|---|
| **TRAPPIST-1 Resonance Chain** | 7 terrestrial exoplanets locked in $8:5:3:2$ Laplace chain | Pure Just-Intonation major chords and harmonic bell clausulas |
| **Kerr Singularity & Binary Pulsar** | Extreme gravity well, time dilation, and relativistic precession | Deep sub-bass drones, Doppler pitch sweeps, and rhythmic pulsar clicks |
| **Figure-8 Three-Body Canon** | Stable 3-body choreographic lemniscate solution | Continuous evolving 3-voice musical canon with interlocking pads |

---

## 🐑 Authors & Acknowledgments

* **Author & Lead Engineer:** **Zaid** ([ShW Labs](https://github.com/zaid12x))
* **AI Architecture & Mathematical Co-Engineering:** **Gemini 3.7 Flash** (Google DeepMind)

---

## 📜 License

This project is open source and licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
