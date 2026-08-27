import React, { useState } from 'react';
import { Play, Pause, Radio, Disc3, Sliders, ChevronUp, ChevronDown } from 'lucide-react';
import { SimulationParams, CelestialBody, Preset } from '../types';
import { PRESETS } from '../physics/presets';
import { SCALES } from '../audio/scales';

interface HUDProps {
  params: SimulationParams;
  onUpdateParams: (newParams: Partial<SimulationParams>) => void;
  bodies: CelestialBody[];
  currentPreset: Preset;
  onSelectPreset: (preset: Preset) => void;
  onRecordToggle: () => void;
  isRecording: boolean;
  selectedBody: CelestialBody | null;
  onSelectBody: (body: CelestialBody | null) => void;
}

export const HUD: React.FC<HUDProps> = ({
  params,
  onUpdateParams,
  bodies,
  currentPreset,
  onSelectPreset,
  onRecordToggle,
  isRecording,
  selectedBody,
  onSelectBody
}) => {
  const [showPresets, setShowPresets] = useState(false);
  const [showMobileControls, setShowMobileControls] = useState(false);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-6 pb-6">
      
      <header className="flex justify-between items-start pointer-events-auto gap-2">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-white to-pink-500 font-mono">
            HARMONICES MUNDI
          </h1>
          <p className="text-[10px] sm:text-xs text-slate-400 font-mono tracking-wider mt-0.5 sm:mt-1">
            RELATIVISTIC N-BODY SYNTHESIZER • KEPLER 1619
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-lg text-[11px] sm:text-xs font-mono text-cyan-400 hover:border-cyan-400 active:scale-95 transition-all flex items-center gap-1.5 shadow-lg"
          >
            <Radio size={13} />
            <span className="max-w-[100px] sm:max-w-none truncate">{currentPreset.name}</span>
          </button>

          <button
            onClick={onRecordToggle}
            className={`px-2.5 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md border rounded-lg text-[11px] sm:text-xs font-mono active:scale-95 transition-all flex items-center gap-1.5 shadow-lg ${
              isRecording 
                ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse' 
                : 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:border-slate-500'
            }`}
          >
            <Disc3 size={13} className={isRecording ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">{isRecording ? 'RECORDING WAV' : 'EXPORT AUDIO'}</span>
            <span className="sm:hidden">{isRecording ? 'REC' : 'WAV'}</span>
          </button>
        </div>
      </header>

      {showPresets && (
        <div className="absolute top-16 sm:top-20 right-3 sm:right-6 left-3 sm:left-auto sm:w-96 bg-slate-950/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 pointer-events-auto shadow-2xl z-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs sm:text-sm font-bold text-slate-200 font-mono">CELESTIAL SCENARIOS</h3>
            <button onClick={() => setShowPresets(false)} className="text-slate-400 hover:text-white text-sm p-1">&#10005;</button>
          </div>
          <div className="flex flex-col gap-2 max-h-[60vh] sm:max-h-80 overflow-y-auto">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelectPreset(p); setShowPresets(false); }}
                className={`text-left p-3 rounded-lg border transition-all ${
                  p.id === currentPreset.id
                    ? 'bg-cyan-950/40 border-cyan-400 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200 active:scale-[0.98]'
                }`}
              >
                <div className="text-xs font-bold font-mono text-cyan-400">{p.name}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">{p.subtitle}</div>
                <div className="text-[10px] text-slate-500 mt-1 line-clamp-2">{p.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      <footer className="flex flex-col md:flex-row justify-between items-stretch md:items-end pointer-events-auto gap-3">
        
        <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl p-2.5 sm:p-4 flex gap-3 items-center justify-between md:justify-start shadow-2xl">
          <button
            onClick={() => onUpdateParams({ isPaused: !params.isPaused })}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 text-black flex items-center justify-center font-bold active:scale-95 transition-all shadow-lg shadow-cyan-500/20 shrink-0"
          >
            {params.isPaused ? <Play size={18} fill="black" /> : <Pause size={18} fill="black" />}
          </button>

          <div className="flex gap-2 sm:gap-4 flex-1 md:flex-initial">
            <div className="flex flex-col gap-0.5 sm:gap-1 flex-1">
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">SCALE</span>
              <select
                value={params.scaleMode}
                onChange={(e) => onUpdateParams({ scaleMode: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-[11px] sm:text-xs font-mono text-slate-200 rounded px-1.5 sm:px-2 py-1 focus:border-cyan-400 outline-none"
              >
                {Object.values(SCALES).map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-0.5 sm:gap-1 w-16 sm:w-20">
              <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">ROOT</span>
              <select
                value={params.rootNote}
                onChange={(e) => onUpdateParams({ rootNote: e.target.value })}
                className="bg-slate-900 border border-slate-700 text-[11px] sm:text-xs font-mono text-slate-200 rounded px-1.5 sm:px-2 py-1 focus:border-cyan-400 outline-none"
              >
                {['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'C3', 'D3', 'F3', 'A3'].map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={() => setShowMobileControls(!showMobileControls)}
            className="md:hidden px-2.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 flex items-center gap-1 text-[11px] font-mono shrink-0"
          >
            <Sliders size={13} />
            {showMobileControls ? <ChevronDown size={13} /> : <ChevronUp size={13} />}
          </button>
        </div>

        <div className={`${showMobileControls ? 'flex' : 'hidden md:flex'} bg-slate-950/90 backdrop-blur-md border border-slate-800/90 rounded-xl p-3 sm:p-4 grid grid-cols-2 sm:flex sm:flex-row gap-4 sm:gap-6 shadow-2xl justify-items-center`}>
          
          <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
            <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 font-bold">GRAVITY (G)</span>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={params.gravity}
              onChange={(e) => onUpdateParams({ gravity: parseFloat(e.target.value) })}
              className="w-full sm:w-24 accent-cyan-400 cursor-pointer h-5 sm:h-2"
            />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">{params.gravity.toFixed(1)}</span>
          </div>

          <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
            <span className="text-[9px] sm:text-[10px] font-mono text-pink-400 font-bold">WARP / TEMPO</span>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.05"
              value={params.timeDilation}
              onChange={(e) => onUpdateParams({ timeDilation: parseFloat(e.target.value) })}
              className="w-full sm:w-24 accent-pink-400 cursor-pointer h-5 sm:h-2"
            />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">{params.timeDilation.toFixed(2)}x</span>
          </div>

          <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
            <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold">SHIMMER FX</span>
            <input
              type="range"
              min="0.0"
              max="0.8"
              step="0.02"
              value={params.reverbMix}
              onChange={(e) => onUpdateParams({ reverbMix: parseFloat(e.target.value) })}
              className="w-full sm:w-24 accent-amber-400 cursor-pointer h-5 sm:h-2"
            />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">{Math.round(params.reverbMix * 100)}%</span>
          </div>

          <div className="flex flex-col items-center gap-1 w-full sm:w-auto">
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-300 font-bold">MASTER GAIN</span>
            <input
              type="range"
              min="0.0"
              max="1.0"
              step="0.01"
              value={params.masterVolume}
              onChange={(e) => onUpdateParams({ masterVolume: parseFloat(e.target.value) })}
              className="w-full sm:w-24 accent-white cursor-pointer h-5 sm:h-2"
            />
            <span className="text-[9px] sm:text-[10px] font-mono text-slate-400">{Math.round(params.masterVolume * 100)}%</span>
          </div>
        </div>

      </footer>
    </div>
  );
};
