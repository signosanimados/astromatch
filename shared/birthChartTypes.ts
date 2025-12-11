/**
 * Tipos compartilhados para Mapa Astral
 * Usado tanto no frontend quanto no backend
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
  timezone: string; // IANA timezone (ex: "America/Sao_Paulo")
  city?: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number; // 0-30 dentro do signo
  house: number; // 1-12
  retrograde: boolean;
  longitude: number; // longitude absoluta 0-360
}

export interface HousePosition {
  number: number; // 1-12
  sign: string;
  degree: number;
  longitude: number; // cúspide em graus absolutos
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: 'conjunção' | 'sextil' | 'quadratura' | 'trígono' | 'oposição';
  angle: number; // ângulo ideal (0, 60, 90, 120, 180)
  orb: number; // diferença real
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

// Constantes
export const ZODIAC_SIGNS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer',
  'Leão', 'Virgem', 'Libra', 'Escorpião',
  'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];

export const PLANET_NAMES = [
  'Sol', 'Lua', 'Mercúrio', 'Vênus', 'Marte',
  'Júpiter', 'Saturno', 'Urano', 'Netuno', 'Plutão'
];
