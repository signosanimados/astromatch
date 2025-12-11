/**
 * Tipos compartilhados - cópia local para o backend
 */

export interface BirthChartData {
  name?: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: string;
  city?: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
  longitude: number;
}

export interface HousePosition {
  number: number;
  sign: string;
  degree: number;
  longitude: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunção' | 'sextil' | 'quadratura' | 'trígono' | 'oposição';
  angle: number;
  orb: number;
  nature: 'harmonic' | 'challenging' | 'neutral';
}

export interface BirthChartResult {
  planets: PlanetPosition[];
  houses: HousePosition[];
  ascendant: { sign: string; degree: number };
  midheaven: { sign: string; degree: number };
  aspects: Aspect[];
  elements: { fire: number; earth: number; air: number; water: number };
  modalities: { cardinal: number; fixed: number; mutable: number };
}

export const ZODIAC_SIGNS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer',
  'Leão', 'Virgem', 'Libra', 'Escorpião',
  'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];

export const PLANET_NAMES = [
  'Sol', 'Lua', 'Mercúrio', 'Vênus', 'Marte',
  'Júpiter', 'Saturno', 'Urano', 'Netuno', 'Plutão'
];
