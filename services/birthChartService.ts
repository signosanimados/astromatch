// Serviço de cálculos astrológicos simplificado
// Para produção, considere usar Swiss Ephemeris via API backend

export interface BirthChartData {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PlanetPosition {
  name: string;
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
}

export interface HousePosition {
  number: number;
  sign: string;
  degree: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: string;
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

// Signos do zodíaco em português
const SIGNS = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];

// Elementos por signo
const SIGN_ELEMENTS: Record<string, 'fire' | 'earth' | 'air' | 'water'> = {
  'Áries': 'fire', 'Leão': 'fire', 'Sagitário': 'fire',
  'Touro': 'earth', 'Virgem': 'earth', 'Capricórnio': 'earth',
  'Gêmeos': 'air', 'Libra': 'air', 'Aquário': 'air',
  'Câncer': 'water', 'Escorpião': 'water', 'Peixes': 'water',
};

// Modalidades por signo
const SIGN_MODALITIES: Record<string, 'cardinal' | 'fixed' | 'mutable'> = {
  'Áries': 'cardinal', 'Câncer': 'cardinal', 'Libra': 'cardinal', 'Capricórnio': 'cardinal',
  'Touro': 'fixed', 'Leão': 'fixed', 'Escorpião': 'fixed', 'Aquário': 'fixed',
  'Gêmeos': 'mutable', 'Virgem': 'mutable', 'Sagitário': 'mutable', 'Peixes': 'mutable',
};

// Converte data para Julian Day
function toJulianDay(year: number, month: number, day: number, hour: number, minute: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;

  let jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  // Adiciona fração do dia
  const dayFraction = (hour + minute / 60) / 24;
  return jdn + dayFraction - 0.5;
}

// Calcula a posição do Sol (simplificado)
function calculateSunPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T * T;

  const Mrad = M * Math.PI / 180;
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);

  let sunLong = L0 + C;
  sunLong = sunLong % 360;
  if (sunLong < 0) sunLong += 360;

  return sunLong;
}

// Calcula a posição da Lua (simplificado)
function calculateMoonPosition(jd: number): number {
  const T = (jd - 2451545.0) / 36525;

  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;
  const F = 93.2720950 + 483202.0175233 * T - 0.0036539 * T * T;

  const toRad = Math.PI / 180;

  let moonLong = Lp
    + 6.289 * Math.sin(Mp * toRad)
    + 1.274 * Math.sin((2 * D - Mp) * toRad)
    + 0.658 * Math.sin(2 * D * toRad)
    + 0.214 * Math.sin(2 * Mp * toRad)
    - 0.186 * Math.sin(M * toRad)
    - 0.114 * Math.sin(2 * F * toRad);

  moonLong = moonLong % 360;
  if (moonLong < 0) moonLong += 360;

  return moonLong;
}

// Calcula posições simplificadas dos planetas
function calculatePlanetPositions(jd: number): { name: string; longitude: number; retrograde: boolean }[] {
  const T = (jd - 2451545.0) / 36525;

  // Longitudes médias aproximadas (simplificado para demo)
  const planets = [
    { name: 'Mercúrio', period: 87.969, base: 252.25, retroChance: 0.19 },
    { name: 'Vênus', period: 224.7, base: 181.98, retroChance: 0.07 },
    { name: 'Marte', period: 686.98, base: 355.45, retroChance: 0.09 },
    { name: 'Júpiter', period: 4332.59, base: 34.40, retroChance: 0.30 },
    { name: 'Saturno', period: 10759.22, base: 50.08, retroChance: 0.36 },
    { name: 'Urano', period: 30688.5, base: 314.06, retroChance: 0.41 },
    { name: 'Netuno', period: 60182.0, base: 304.88, retroChance: 0.43 },
    { name: 'Plutão', period: 90560.0, base: 238.96, retroChance: 0.44 },
  ];

  const daysSinceJ2000 = jd - 2451545.0;

  return planets.map(planet => {
    let longitude = planet.base + (360 / planet.period) * daysSinceJ2000;
    longitude = longitude % 360;
    if (longitude < 0) longitude += 360;

    // Simula retrogradação baseado em probabilidade e posição
    const retrograde = Math.random() < planet.retroChance && Math.sin(longitude * Math.PI / 180) > 0.5;

    return { name: planet.name, longitude, retrograde };
  });
}

// Calcula o Ascendente (simplificado)
function calculateAscendant(jd: number, latitude: number, longitude: number): number {
  // Tempo Sideral Local
  const T = (jd - 2451545.0) / 36525;
  let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T;
  GMST = GMST % 360;
  if (GMST < 0) GMST += 360;

  const LST = (GMST + longitude) % 360;

  // Obliquidade da eclíptica
  const obliquity = 23.4393 - 0.013 * T;
  const oblRad = obliquity * Math.PI / 180;
  const latRad = latitude * Math.PI / 180;
  const lstRad = LST * Math.PI / 180;

  // Cálculo do Ascendente
  const y = -Math.cos(lstRad);
  const x = Math.sin(lstRad) * Math.cos(oblRad) + Math.tan(latRad) * Math.sin(oblRad);
  let asc = Math.atan2(y, x) * 180 / Math.PI;

  asc = asc % 360;
  if (asc < 0) asc += 360;

  return asc;
}

// Converte longitude eclíptica para signo e grau
function longitudeToSign(longitude: number): { sign: string; degree: number } {
  const signIndex = Math.floor(longitude / 30) % 12;
  const degree = longitude % 30;
  return { sign: SIGNS[signIndex], degree };
}

// Determina a casa de um planeta
function getPlanetHouse(planetLong: number, ascendant: number): number {
  let diff = planetLong - ascendant;
  if (diff < 0) diff += 360;
  return Math.floor(diff / 30) + 1;
}

// Calcula aspectos entre planetas
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];
  const aspectTypes = [
    { name: 'conjunção', angle: 0, orb: 8, nature: 'neutral' as const },
    { name: 'sextil', angle: 60, orb: 6, nature: 'harmonic' as const },
    { name: 'quadratura', angle: 90, orb: 7, nature: 'challenging' as const },
    { name: 'trígono', angle: 120, orb: 8, nature: 'harmonic' as const },
    { name: 'oposição', angle: 180, orb: 8, nature: 'challenging' as const },
  ];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      // Calcula a diferença angular
      let diff = Math.abs(p1.degree + SIGNS.indexOf(p1.sign) * 30 - (p2.degree + SIGNS.indexOf(p2.sign) * 30));
      if (diff > 180) diff = 360 - diff;

      // Verifica cada tipo de aspecto
      for (const aspect of aspectTypes) {
        const orb = Math.abs(diff - aspect.angle);
        if (orb <= aspect.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type: aspect.name,
            orb: Math.round(orb * 10) / 10,
            nature: aspect.nature,
          });
          break;
        }
      }
    }
  }

  return aspects;
}

// Função principal de cálculo
export function calculateBirthChart(data: BirthChartData): BirthChartResult {
  // Converte para Julian Day
  const jd = toJulianDay(data.year, data.month, data.day, data.hour, data.minute);

  // Calcula posição do Sol
  const sunLong = calculateSunPosition(jd);
  const sunPos = longitudeToSign(sunLong);

  // Calcula posição da Lua
  const moonLong = calculateMoonPosition(jd);
  const moonPos = longitudeToSign(moonLong);

  // Calcula Ascendente
  const ascLong = calculateAscendant(jd, data.latitude, data.longitude);
  const ascPos = longitudeToSign(ascLong);

  // Meio do Céu (MC) - simplificado como 90° do Ascendente
  const mcLong = (ascLong + 270) % 360;
  const mcPos = longitudeToSign(mcLong);

  // Calcula outros planetas
  const otherPlanets = calculatePlanetPositions(jd);

  // Monta lista de planetas
  const planets: PlanetPosition[] = [
    { name: 'Sol', ...sunPos, house: getPlanetHouse(sunLong, ascLong), retrograde: false },
    { name: 'Lua', ...moonPos, house: getPlanetHouse(moonLong, ascLong), retrograde: false },
    ...otherPlanets.map(p => {
      const pos = longitudeToSign(p.longitude);
      return {
        name: p.name,
        ...pos,
        house: getPlanetHouse(p.longitude, ascLong),
        retrograde: p.retrograde,
      };
    }),
  ];

  // Calcula casas (sistema de casas iguais - simplificado)
  const houses: HousePosition[] = [];
  for (let i = 0; i < 12; i++) {
    const houseLong = (ascLong + i * 30) % 360;
    const pos = longitudeToSign(houseLong);
    houses.push({ number: i + 1, ...pos });
  }

  // Calcula aspectos
  const aspects = calculateAspects(planets);

  // Conta elementos e modalidades
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };

  // Considera Sol, Lua, Mercúrio, Vênus, Marte e Ascendente
  const importantPlanets = planets.slice(0, 5);
  importantPlanets.forEach(p => {
    const element = SIGN_ELEMENTS[p.sign];
    const modality = SIGN_MODALITIES[p.sign];
    if (element) elements[element]++;
    if (modality) modalities[modality]++;
  });

  // Adiciona Ascendente
  const ascElement = SIGN_ELEMENTS[ascPos.sign];
  const ascModality = SIGN_MODALITIES[ascPos.sign];
  if (ascElement) elements[ascElement]++;
  if (ascModality) modalities[ascModality]++;

  return {
    planets,
    houses,
    ascendant: ascPos,
    midheaven: mcPos,
    aspects,
    elements,
    modalities,
  };
}
