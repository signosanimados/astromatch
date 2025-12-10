/**
 * Serviço de cálculo preciso de Mapa Astral usando Swiss Ephemeris
 * =================================================================
 *
 * Este serviço utiliza a biblioteca swisseph para cálculos astronômicos
 * de alta precisão, compatíveis com plataformas profissionais como Astro.com
 */

import swisseph from 'swisseph';
import { DateTime } from 'luxon';
import path from 'path';
import {
  BirthChartData,
  BirthChartResult,
  PlanetPosition,
  HousePosition,
  Aspect,
  Elements,
  Modalities,
  PLANET_NAMES
} from '../../shared/birthChartTypes';
import {
  longitudeToSignAndDegree,
  getSignElement,
  getSignModality,
  getAngularDistance,
  determineHouse
} from './utils/helpers';

// Configuração do caminho das efemérides
const EPHE_PATH = path.join(__dirname, '..', 'ephe');
swisseph.swe_set_ephe_path(EPHE_PATH);

// IDs dos planetas no Swiss Ephemeris
const PLANET_IDS = {
  Sol: swisseph.SE_SUN,
  Lua: swisseph.SE_MOON,
  Mercúrio: swisseph.SE_MERCURY,
  Vênus: swisseph.SE_VENUS,
  Marte: swisseph.SE_MARS,
  Júpiter: swisseph.SE_JUPITER,
  Saturno: swisseph.SE_SATURN,
  Urano: swisseph.SE_URANUS,
  Netuno: swisseph.SE_NEPTUNE,
  Plutão: swisseph.SE_PLUTO
} as const;

// Definição de aspectos astrológicos
interface AspectDefinition {
  name: string;
  angle: number;
  orb: number;
  nature: 'harmonic' | 'challenging' | 'neutral';
}

const ASPECT_DEFINITIONS: AspectDefinition[] = [
  { name: 'Conjunção', angle: 0, orb: 8, nature: 'neutral' },
  { name: 'Sextil', angle: 60, orb: 6, nature: 'harmonic' },
  { name: 'Quadratura', angle: 90, orb: 7, nature: 'challenging' },
  { name: 'Trígono', angle: 120, orb: 8, nature: 'harmonic' },
  { name: 'Oposição', angle: 180, orb: 8, nature: 'challenging' }
];

/**
 * Converte data/hora local para Julian Day (UTC)
 */
function getJulianDay(data: BirthChartData): number {
  try {
    // Cria DateTime na timezone local especificada
    const localDateTime = DateTime.fromObject(
      {
        year: data.year,
        month: data.month,
        day: data.day,
        hour: data.hour,
        minute: data.minute,
        second: 0
      },
      { zone: data.timezone }
    );

    if (!localDateTime.isValid) {
      throw new Error(`Data/hora inválida: ${localDateTime.invalidReason}`);
    }

    // Converte para UTC
    const utcDateTime = localDateTime.toUTC();

    // Calcula hora decimal UTC
    const hourDecimal =
      utcDateTime.hour +
      utcDateTime.minute / 60 +
      utcDateTime.second / 3600;

    // Calcula Julian Day usando calendario gregoriano
    const jd = swisseph.swe_julday(
      utcDateTime.year,
      utcDateTime.month,
      utcDateTime.day,
      hourDecimal,
      swisseph.SE_GREG_CAL
    );

    return jd;
  } catch (error) {
    throw new Error(`Erro ao converter data para Julian Day: ${error}`);
  }
}

/**
 * Calcula a posição de um planeta
 */
function calculatePlanetPosition(
  jd: number,
  planetName: keyof typeof PLANET_IDS,
  cusps: number[]
): PlanetPosition {
  const planetId = PLANET_IDS[planetName];
  const flags = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;

  const result = swisseph.swe_calc(jd, planetId, flags) as any;

  // Na API 0.5.x, o resultado é um objeto com propriedades diretas
  const longitude = result.longitude as number; // Posição eclíptica
  const speedLon = result.longitudeSpeed as number; // Velocidade em longitude

  const { sign, degree } = longitudeToSignAndDegree(longitude);
  const house = determineHouse(longitude, cusps);
  const retrograde = speedLon < 0;

  return {
    name: planetName,
    sign,
    degree,
    house,
    retrograde,
    longitude
  };
}

/**
 * Calcula as casas astrológicas e pontos (ASC, MC)
 */
function calculateHouses(jd: number, latitude: number, longitude: number) {
  // Sistema de casas Placidus ('P')
  const houseSystem = 'P';

  const result = swisseph.swe_houses(jd, latitude, longitude, houseSystem) as any;

  // Cúspides das casas (índices 1-12)
  const cusps: number[] = [];
  for (let i = 1; i <= 12; i++) {
    cusps.push(result.house[i] as number);
  }

  // Ascendente e MC
  const ascendantLon = result.ascendant as number;
  const mcLon = result.mc as number;

  return {
    cusps,
    ascendant: {
      ...longitudeToSignAndDegree(ascendantLon),
      longitude: ascendantLon
    },
    midheaven: {
      ...longitudeToSignAndDegree(mcLon),
      longitude: mcLon
    }
  };
}

/**
 * Cria as posições das casas
 */
function createHousePositions(cusps: number[]): HousePosition[] {
  return cusps.map((cuspLon, index) => {
    const { sign, degree } = longitudeToSignAndDegree(cuspLon);
    return {
      number: index + 1,
      sign,
      degree,
      longitude: cuspLon
    };
  });
}

/**
 * Calcula aspectos entre planetas
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  // Compara cada par de planetas
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];

      const angularDistance = getAngularDistance(
        planet1.longitude,
        planet2.longitude
      );

      // Verifica cada tipo de aspecto
      for (const aspectDef of ASPECT_DEFINITIONS) {
        const diff = Math.abs(angularDistance - aspectDef.angle);

        if (diff <= aspectDef.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectDef.name,
            angle: aspectDef.angle,
            orb: parseFloat(diff.toFixed(2)),
            nature: aspectDef.nature
          });
          break; // Só considera um aspecto por par
        }
      }
    }
  }

  return aspects;
}

/**
 * Calcula distribuição de elementos
 */
function calculateElements(
  planets: PlanetPosition[],
  ascendantSign: string
): Elements {
  const elements: Elements = { fire: 0, earth: 0, air: 0, water: 0 };

  // Conta planetas principais (Sol, Lua, Mercúrio, Vênus, Marte)
  const mainPlanets = planets.filter(p =>
    ['Sol', 'Lua', 'Mercúrio', 'Vênus', 'Marte'].includes(p.name)
  );

  mainPlanets.forEach(planet => {
    const element = getSignElement(planet.sign as any);
    elements[element]++;
  });

  // Adiciona Ascendente
  const ascElement = getSignElement(ascendantSign as any);
  elements[ascElement]++;

  return elements;
}

/**
 * Calcula distribuição de modalidades
 */
function calculateModalities(
  planets: PlanetPosition[],
  ascendantSign: string
): Modalities {
  const modalities: Modalities = { cardinal: 0, fixed: 0, mutable: 0 };

  // Conta planetas principais
  const mainPlanets = planets.filter(p =>
    ['Sol', 'Lua', 'Mercúrio', 'Vênus', 'Marte'].includes(p.name)
  );

  mainPlanets.forEach(planet => {
    const modality = getSignModality(planet.sign as any);
    modalities[modality]++;
  });

  // Adiciona Ascendente
  const ascModality = getSignModality(ascendantSign as any);
  modalities[ascModality]++;

  return modalities;
}

/**
 * FUNÇÃO PRINCIPAL: Calcula mapa astral completo com precisão profissional
 */
export function calculateBirthChartPrecise(data: BirthChartData): BirthChartResult {
  try {
    // 1. Converte data/hora para Julian Day (UTC)
    const jd = getJulianDay(data);

    // 2. Calcula casas, ascendente e MC
    const housesData = calculateHouses(jd, data.latitude, data.longitude);
    const { cusps, ascendant, midheaven } = housesData;

    // 3. Calcula posição de cada planeta
    const planets: PlanetPosition[] = [];
    for (const planetName of PLANET_NAMES) {
      const planet = calculatePlanetPosition(
        jd,
        planetName as keyof typeof PLANET_IDS,
        cusps
      );
      planets.push(planet);
    }

    // 4. Cria posições das casas
    const houses = createHousePositions(cusps);

    // 5. Calcula aspectos
    const aspects = calculateAspects(planets);

    // 6. Calcula elementos e modalidades
    const elements = calculateElements(planets, ascendant.sign);
    const modalities = calculateModalities(planets, ascendant.sign);

    // 7. Retorna resultado completo
    return {
      planets,
      houses,
      ascendant,
      midheaven,
      aspects,
      elements,
      modalities,
      calculatedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Erro no cálculo do mapa astral: ${error}`);
  }
}

/**
 * Fecha a biblioteca Swiss Ephemeris (chamar ao encerrar o servidor)
 */
export function closeSwissEph(): void {
  swisseph.swe_close();
}
