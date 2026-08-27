export interface MusicalScale {
  id: string;
  name: string;
  tuning: 'just' | 'pythagorean' | 'equal';
  description: string;
  ratios: number[];
}

export const SCALES: Record<string, MusicalScale> = {
  just_major: {
    id: 'just_major',
    name: 'Just Intonation (Major)',
    tuning: 'just',
    description: 'Pure integer harmonic ratios (1/1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2/1).',
    ratios: [1.0, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8, 2.0]
  },
  pythagorean: {
    id: 'pythagorean',
    name: 'Kepler Harmonices Mundi (1619)',
    tuning: 'pythagorean',
    description: 'Harmonies generated strictly by powers of pure fifths (3/2) and octaves (2/1).',
    ratios: [1.0, 9/8, 81/64, 4/3, 3/2, 27/16, 243/128, 2.0]
  },
  minor_pentatonic: {
    id: 'minor_pentatonic',
    name: 'Cosmic Minor Pentatonic',
    tuning: 'equal',
    description: 'Ethereal celestial intervals (Root, Minor 3rd, 4th, 5th, Minor 7th).',
    ratios: [1.0, 1.1892, 1.3348, 1.4983, 1.7818, 2.0]
  },
  lydian: {
    id: 'lydian',
    name: 'Lydian Celestial Scale',
    tuning: 'equal',
    description: 'Bright sci-fi sound with raised fourth (C, D, E, F#, G, A, B).',
    ratios: [1.0, 1.1225, 1.2599, 1.4142, 1.4983, 1.6818, 1.8877, 2.0]
  }
};
