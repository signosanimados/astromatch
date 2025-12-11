/**
 * Serviço de cálculo profissional de Mapa Astral usando Swiss Ephemeris
 */

import * as swisseph from 'swisseph';
import { DateTime } from 'luxon';
import * as path from 'path';
import {
  BirthChartData,
  BirthChartResult,
  PlanetPosition,
  HousePosition,
  Aspect,
  PLANET_NAMES
} from './types/birthChartTypes';
import {
  longitudeToSignAndDegree,
  getSignElement,
  getSignModality,
  determineHouse,
  getAngularDistance
} from './utils/helpers';

// Configurar caminho das efemérides
const EPHE_PATH = path.join(__dirname, '..', 'ephe');
swisseph.swe_set_ephe_path(EPHE_PATH);

// IDs dos planetas no Swiss Ephemeris
const SE_SUN = 0;
const SE_MOON = 1;
const SE_MERCURY = 2;
const SE_VENUS = 3;
const SE_MARS = 4;
const SE_JUPITER = 5;
const SE_SATURN = 6;
const SE_URANUS = 7;
const SE_NEPTUNE = 8;
const SE_PLUTO = 9;

const PLANET_IDS = [
  SE_SUN, SE_MOON, SE_MERCURY, SE_VENUS, SE_MARS,
  SE_JUPITER, SE_SATURN, SE_URANUS, SE_NEPTUNE, SE_PLUTO
];

// Definições de aspectos
const ASPECT_DEFINITIONS = [
  { type: 'conjunção' as const, angle: 0, orb: 8, nature: 'neutral' as const },
  { type: 'sextil' as const, angle: 60, orb: 6, nature: 'harmonic' as const },
  { type: 'quadratura' as const, angle: 90, orb: 7, nature: 'challenging' as const },
  { type: 'trígono' as const, angle: 120, orb: 8, nature: 'harmonic' as const },
  { type: 'oposição' as const, angle: 180, orb: 8, nature: 'challenging' as const }
];

/**
 * Converte data/hora local para UTC e retorna Julian Day
 */
function getJulianDay(data: BirthChartData): number {
  // Criar DateTime no timezone especificado
  const localTime = DateTime.fromObject(
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

  // Converter para UTC
  const utcTime = localTime.toUTC();

  // Calcular hora decimal
  const hourDecimal = utcTime.hour + utcTime.minute / 60 + utcTime.second / 3600;

  // Retornar Julian Day
  return swisseph.swe_julday(
    utcTime.year,
    utcTime.month,
    utcTime.day,
    hourDecimal,
    swisseph.SE_GREG_CAL
  );
}

/**
 * Calcula posição de um planeta
 */
function calculatePlanetPosition(
  planetId: number,
  planetName: string,
  julday: number,
  houseCusps: number[]
): PlanetPosition {
  const flag = swisseph.SEFLG_SWIEPH | swisseph.SEFLG_SPEED;
  const result = swisseph.swe_calc_ut(julday, planetId, flag) as any;

  const longitude = result.longitude;
  const speedLon = result.longitudeSpeed;
  const { sign, degree } = longitudeToSignAndDegree(longitude);
  const house = determineHouse(longitude, houseCusps);
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
 * Calcula casas usando sistema Placidus
 */
function calculateHouses(julday: number, latitude: number, longitude: number): {
  cusps: number[];
  ascendant: number;
  mc: number;
} {
  const houseSystem = 'P'; // Placidus
  const houses = swisseph.swe_houses(julday, latitude, longitude, houseSystem) as any;

  const cusps = houses.house.slice(1, 13); // Índices 1-12
  const ascendant = houses.ascendant;
  const mc = houses.mc;

  return { cusps, ascendant, mc };
}

/**
 * Calcula aspectos entre planetas
 */
function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const planet1 = planets[i];
      const planet2 = planets[j];
      const distance = getAngularDistance(planet1.longitude, planet2.longitude);

      for (const aspectDef of ASPECT_DEFINITIONS) {
        const diff = Math.abs(distance - aspectDef.angle);
        if (diff <= aspectDef.orb) {
          aspects.push({
            planet1: planet1.name,
            planet2: planet2.name,
            type: aspectDef.type,
            angle: aspectDef.angle,
            orb: Math.round(diff * 100) / 100,
            nature: aspectDef.nature
          });
        }
      }
    }
  }

  return aspects;
}

/**
 * Calcula distribuição de elementos e modalidades
 */
function calculateElementsAndModalities(
  planets: PlanetPosition[],
  ascendantSign: string
): {
  elements: { fire: number; earth: number; air: number; water: number };
  modalities: { cardinal: number; fixed: number; mutable: number };
} {
  const elements = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities = { cardinal: 0, fixed: 0, mutable: 0 };

  // Contar planetas pessoais + Ascendente
  const personalPlanets = planets.slice(0, 5); // Sol, Lua, Mercúrio, Vênus, Marte
  const signsToCount = [...personalPlanets.map(p => p.sign), ascendantSign];

  signsToCount.forEach(sign => {
    const element = getSignElement(sign);
    const modality = getSignModality(sign);
    elements[element]++;
    modalities[modality]++;
  });

  return { elements, modalities };
}

/**
 * FUNÇÃO PRINCIPAL: Calcula mapa astral completo com precisão profissional
 */
export function calculateBirthChartPrecise(data: BirthChartData): BirthChartResult {
  try {
    // 1. Calcular Julian Day
    const julday = getJulianDay(data);

    // 2. Calcular casas (Placidus)
    const { cusps, ascendant, mc } = calculateHouses(julday, data.latitude, data.longitude);

    // 3. Calcular todos os planetas
    const planets: PlanetPosition[] = PLANET_IDS.map((id, index) =>
      calculatePlanetPosition(id, PLANET_NAMES[index], julday, cusps)
    );

    // 4. Montar casas
    const houses: HousePosition[] = cusps.map((cusp, index) => {
      const { sign, degree } = longitudeToSignAndDegree(cusp);
      return {
        number: index + 1,
        sign,
        degree,
        longitude: cusp
      };
    });

    // 5. Ascendente e MC
    const ascendantInfo = longitudeToSignAndDegree(ascendant);
    const mcInfo = longitudeToSignAndDegree(mc);

    // 6. Calcular aspectos
    const aspects = calculateAspects(planets);

    // 7. Elementos e modalidades
    const { elements, modalities } = calculateElementsAndModalities(planets, ascendantInfo.sign);

    return {
      planets,
      houses,
      ascendant: {
        sign: ascendantInfo.sign,
        degree: ascendantInfo.degree
      },
      midheaven: {
        sign: mcInfo.sign,
        degree: mcInfo.degree
      },
      aspects,
      elements,
      modalities
    };
  } catch (error: any) {
    console.error('Erro ao calcular mapa astral:', error);
    throw new Error('Falha ao calcular mapa astral: ' + error.message);
  }
}
