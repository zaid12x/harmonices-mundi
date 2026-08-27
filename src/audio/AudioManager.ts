import * as Tone from 'tone';
import * as THREE from 'three';
import { CelestialBody, SimulationParams } from '../types';
import { SCALES } from './scales';

export class AudioManager {
  private isInitialized = false;
  private masterLimiter!: Tone.Limiter;
  private shimmerReverb!: Tone.Reverb;
  private spaceDelay!: Tone.FeedbackDelay;
  private masterGain!: Tone.Gain;
  private voiceSynths = new Map<string, any>();
  private panners = new Map<string, Tone.Panner3D>();
  private lastTriggerTimes = new Map<string, number>();
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  public async init() {
    if (this.isInitialized) return;
    try {
      await Tone.start();
      if (Tone.context.state !== 'running') {
        await Tone.context.resume();
      }
    } catch (e) {
      console.warn('Tone start gesture deferred:', e);
    }

    this.masterLimiter = new Tone.Limiter(-0.5).toDestination();
    this.masterGain = new Tone.Gain(0.8).connect(this.masterLimiter);

    this.shimmerReverb = new Tone.Reverb({ decay: 4.0, wet: 0.3 }).connect(this.masterGain);
    try {
      await this.shimmerReverb.generate();
    } catch (e) {
      console.warn('Reverb generation fallback:', e);
    }

    this.spaceDelay = new Tone.FeedbackDelay({ delayTime: '8n.', feedback: 0.35, wet: 0.2 }).connect(this.shimmerReverb);

    this.isInitialized = true;
  }

  public registerBody(body: CelestialBody) {
    if (!this.isInitialized) return;
    if (this.voiceSynths.has(body.id)) return;

    const panner = new Tone.Panner3D({
      panningModel: 'HRTF',
      positionX: body.position.x,
      positionY: body.position.y,
      positionZ: body.position.z,
    }).connect(this.spaceDelay);

    let synth: any;

    switch (body.type) {
      case 'star':
        synth = new Tone.FatOscillator({
          frequency: body.baseFreq,
          type: 'sawtooth',
          spread: 20,
          count: 3,
          volume: Tone.gainToDb(body.volume * 0.5)
        }).connect(panner).start();
        break;

      case 'black_hole':
        synth = new Tone.MonoSynth({
          oscillator: { type: 'sawtooth' },
          filter: { Q: 3, type: 'lowpass', frequency: 90 },
          envelope: { attack: 0.8, decay: 0.5, sustain: 1.0, release: 2.0 },
          volume: Tone.gainToDb(body.volume * 0.7)
        }).connect(panner).triggerAttack(body.baseFreq);
        break;

      case 'pulsar':
        synth = new Tone.MembraneSynth({
          pitchDecay: 0.05,
          octaves: 4,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.001, decay: 0.1, sustain: 0.0, release: 0.1 },
          volume: Tone.gainToDb(body.volume * 0.7)
        }).connect(panner);
        break;

      case 'gas_giant':
        synth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.2, decay: 0.4, sustain: 0.5, release: 0.8 },
          volume: Tone.gainToDb(body.volume * 0.5)
        }).connect(panner);
        synth.maxPolyphony = 4;
        break;

      case 'planet':
      default:
        synth = new Tone.FMSynth({
          harmonicity: 2.5,
          modulationIndex: 4,
          oscillator: { type: 'sine' },
          envelope: { attack: 0.01, decay: 0.8, sustain: 0.2, release: 1.0 },
          modulation: { type: 'sine' },
          volume: Tone.gainToDb(body.volume * 0.6)
        }).connect(panner);
        break;
    }

    this.voiceSynths.set(body.id, synth);
    this.panners.set(body.id, panner);
  }

  public updateBodyVoice(body: CelestialBody, cameraPos: THREE.Vector3, params: SimulationParams) {
    if (!this.isInitialized) return;
    const synth = this.voiceSynths.get(body.id);
    const panner = this.panners.get(body.id);

    if (!synth || !panner) return;

    panner.positionX.value = body.position.x;
    panner.positionY.value = body.position.y;
    panner.positionZ.value = body.position.z;

    const quantizedFreq = this.quantizeToScale(body.currentFreq || body.baseFreq, params.scaleMode, params.rootNote);

    if (body.type === 'planet' || body.type === 'gas_giant') {
      if (synth.frequency && typeof synth.frequency.rampTo === 'function') {
        try {
          synth.frequency.rampTo(quantizedFreq, 0.1);
        } catch (_) {}
      }
    }
  }

  public triggerPeriapsisHit(body: CelestialBody, velocity: number) {
    if (!this.isInitialized || body.isMuted) return;
    const synth = this.voiceSynths.get(body.id);
    if (!synth) return;

    const now = performance.now();
    const lastTime = this.lastTriggerTimes.get(body.id) || 0;
    if (now - lastTime < 180) return; // 180ms cooldown to avoid note flooding
    this.lastTriggerTimes.set(body.id, now);

    const velScaled = Math.min(Math.max(velocity / 8.0, 0.2), 1.0);
    const triggerTime = Tone.now() + 0.03;

    try {
      if (body.type === 'planet' || body.type === 'gas_giant') {
        synth.triggerAttackRelease(body.currentFreq || body.baseFreq, '8n', triggerTime, velScaled);
      } else if (body.type === 'pulsar') {
        synth.triggerAttackRelease(body.baseFreq, '16n', triggerTime, velScaled);
      }
    } catch (_) {}
  }

  public quantizeToScale(freq: number, scaleMode: string, rootNote: string): number {
    const scale = SCALES[scaleMode] || SCALES.just_major;
    const rootFreq = Tone.Frequency(rootNote).toFrequency();
    if (freq <= 0) return rootFreq;

    const octaves = Math.floor(Math.log2(freq / rootFreq));
    const baseRatio = (freq / rootFreq) / Math.pow(2, octaves);

    let closestRatio = scale.ratios[0];
    let minDiff = Infinity;

    for (const ratio of scale.ratios) {
      const diff = Math.abs(ratio - baseRatio);
      if (diff < minDiff) {
        minDiff = diff;
        closestRatio = ratio;
      }
    }

    return rootFreq * closestRatio * Math.pow(2, octaves);
  }

  public setMasterVolume(val: number) {
    if (!this.isInitialized) return;
    this.masterGain.gain.rampTo(val, 0.05);
  }

  public setReverbWet(val: number) {
    if (!this.isInitialized) return;
    this.shimmerReverb.wet.rampTo(val, 0.05);
  }

  public setDelayWet(val: number) {
    if (!this.isInitialized) return;
    this.spaceDelay.wet.rampTo(val, 0.05);
  }

  public startRecording(): boolean {
    try {
      const dest = Tone.context.createMediaStreamDestination();
      this.masterGain.connect(dest);
      this.mediaRecorder = new MediaRecorder(dest.stream);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.recordedChunks.push(e.data);
      };

      this.mediaRecorder.start();
      return true;
    } catch (e) {
      console.error('Recording error', e);
      return false;
    }
  }

  public stopRecording(): Blob | null {
    if (!this.mediaRecorder) return null;
    this.mediaRecorder.stop();
    return new Blob(this.recordedChunks, { type: 'audio/wav' });
  }
}
