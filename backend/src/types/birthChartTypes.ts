/**
 * Tipos compartilhados entre Frontend e Backend para Mapa Astral
 * ================================================================
 * Estes tipos garantem consistência na comunicação entre cliente e servidor
 */

/**
 * Dados de entrada para calcular o mapa astral
 */
export interface BirthChartData {
  /** Nome da pessoa */
  name?: string;
  /** Ano de nascimento (ex: 1990) */
  year: number;
  /** Mês de nascimento (1-12) */
  month: number;
  /** Dia de nascimento (1-31) */
  day: number;
  /** Hora de nascimento (0-23) */
  hour: number;
  /** Minuto de nascimento (0-59) */
  minute: number;
  /** Latitude do local de nascimento (graus decimais) */
  latitude: number;
  /** Longitude do local de nascimento (graus decimais) */
  longitude: number;
  /** Timezone IANA (ex: "America/Sao_Paulo", "Europe/London") */
  timezone: string;
  /** Cidade de nascimento (opcional, apenas para exibição) */
  city?: string;
}

/**
 * Posição de um planeta no mapa astral
 */
export interface PlanetPosition {
  /** Nome do planeta (ex: "Sol", "Lua", "Mercúrio") */
  name: string;
  /** Signo zodiacal (ex: "Áries", "Touro") */
  sign: string;
  /** Graus dentro do signo (0-30) */
  degree: number;
  /** Casa astrológica (1-12) */
  house: number;
  /** Indica se o planeta está retrógrado */
  retrograde: boolean;
  /** Longitude eclíptica absoluta (0-360) */
  longitude: number;
}

/**
 * Posição de uma casa astrológica
 */
export interface HousePosition {
  /** Número da casa (1-12) */
  number: number;
  /** Signo na cúspide da casa */
  sign: string;
  /** Graus dentro do signo */
  degree: number;
  /** Longitude eclíptica absoluta da cúspide */
  longitude: number;
}

/**
 * Aspecto astrológico entre dois planetas
 */
export interface Aspect {
  /** Nome do primeiro planeta */
  planet1: string;
  /** Nome do segundo planeta */
  planet2: string;
  /** Tipo de aspecto (ex: "Conjunção", "Trígono", "Quadratura") */
  type: string;
  /** Orbe (diferença em graus do aspecto exato) */
  orb: number;
  /** Ângulo do aspecto (ex: 0, 60, 90, 120, 180) */
  angle: number;
  /** Natureza do aspecto */
  nature: 'harmonic' | 'challenging' | 'neutral';
}

/**
 * Distribuição de elementos no mapa
 */
export interface Elements {
  /** Quantidade de planetas em signos de Fogo */
  fire: number;
  /** Quantidade de planetas em signos de Terra */
  earth: number;
  /** Quantidade de planetas em signos de Ar */
  air: number;
  /** Quantidade de planetas em signos de Água */
  water: number;
}

/**
 * Distribuição de modalidades no mapa
 */
export interface Modalities {
  /** Quantidade de planetas em signos Cardinais */
  cardinal: number;
  /** Quantidade de planetas em signos Fixos */
  fixed: number;
  /** Quantidade de planetas em signos Mutáveis */
  mutable: number;
}

/**
 * Resultado completo do cálculo do mapa astral
 */
export interface BirthChartResult {
  /** Posições dos planetas */
  planets: PlanetPosition[];
  /** Posições das casas */
  houses: HousePosition[];
  /** Ascendente */
  ascendant: {
    sign: string;
    degree: number;
    longitude: number;
  };
  /** Meio do Céu (MC) */
  midheaven: {
    sign: string;
    degree: number;
    longitude: number;
  };
  /** Aspectos entre planetas */
  aspects: Aspect[];
  /** Distribuição por elementos */
  elements: Elements;
  /** Distribuição por modalidades */
  modalities: Modalities;
  /** Data/hora calculada (UTC) */
  calculatedAt?: string;
}

/**
 * Constantes astrológicas
 */
export const ZODIAC_SIGNS = [
  'Áries',
  'Touro',
  'Gêmeos',
  'Câncer',
  'Leão',
  'Virgem',
  'Libra',
  'Escorpião',
  'Sagitário',
  'Capricórnio',
  'Aquário',
  'Peixes'
] as const;

export const PLANET_NAMES = [
  'Sol',
  'Lua',
  'Mercúrio',
  'Vênus',
  'Marte',
  'Júpiter',
  'Saturno',
  'Urano',
  'Netuno',
  'Plutão'
] as const;

export type ZodiacSign = typeof ZODIAC_SIGNS[number];
export type PlanetName = typeof PLANET_NAMES[number];
