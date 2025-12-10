/**
 * Funções auxiliares para cálculos astrológicos
 */

import { ZODIAC_SIGNS, type ZodiacSign } from '../types/birthChartTypes';

/**
 * Converte longitude eclíptica absoluta (0-360°) para signo e grau
 */
export function longitudeToSignAndDegree(longitude: number): { sign: ZodiacSign; degree: number } {
  // Normaliza para 0-360
  const normalizedLon = ((longitude % 360) + 360) % 360;

  // Cada signo tem 30 graus
  const signIndex = Math.floor(normalizedLon / 30);
  const degree = normalizedLon % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: parseFloat(degree.toFixed(4))
  };
}

/**
 * Retorna o elemento de um signo
 */
export function getSignElement(sign: ZodiacSign): 'fire' | 'earth' | 'air' | 'water' {
  const fireSignsConst = ['Áries', 'Leão', 'Sagitário'] as const;
  const earthSignsConst = ['Touro', 'Virgem', 'Capricórnio'] as const;
  const airSignsConst = ['Gêmeos', 'Libra', 'Aquário'] as const;
  const waterSignsConst = ['Câncer', 'Escorpião', 'Peixes'] as const;

  const fireSigns: readonly string[] = fireSignsConst;
  const earthSigns: readonly string[] = earthSignsConst;
  const airSigns: readonly string[] = airSignsConst;
  const waterSigns: readonly string[] = waterSignsConst;

  if (fireSigns.includes(sign)) return 'fire';
  if (earthSigns.includes(sign)) return 'earth';
  if (airSigns.includes(sign)) return 'air';
  if (waterSigns.includes(sign)) return 'water';

  // Fallback (não deveria acontecer)
  return 'fire';
}

/**
 * Retorna a modalidade de um signo
 */
export function getSignModality(sign: ZodiacSign): 'cardinal' | 'fixed' | 'mutable' {
  const cardinalSignsConst = ['Áries', 'Câncer', 'Libra', 'Capricórnio'] as const;
  const fixedSignsConst = ['Touro', 'Leão', 'Escorpião', 'Aquário'] as const;
  const mutableSignsConst = ['Gêmeos', 'Virgem', 'Sagitário', 'Peixes'] as const;

  const cardinalSigns: readonly string[] = cardinalSignsConst;
  const fixedSigns: readonly string[] = fixedSignsConst;
  const mutableSigns: readonly string[] = mutableSignsConst;

  if (cardinalSigns.includes(sign)) return 'cardinal';
  if (fixedSigns.includes(sign)) return 'fixed';
  if (mutableSigns.includes(sign)) return 'mutable';

  // Fallback (não deveria acontecer)
  return 'cardinal';
}

/**
 * Calcula a diferença angular entre duas longitudes (considerando o ciclo 360°)
 */
export function getAngularDistance(lon1: number, lon2: number): number {
  let diff = Math.abs(lon1 - lon2);
  if (diff > 180) {
    diff = 360 - diff;
  }
  return diff;
}

/**
 * Determina em qual casa (1-12) um planeta está baseado nas cúspides
 */
export function determineHouse(planetLon: number, cusps: number[]): number {
  // Normaliza longitude do planeta
  const normPlanetLon = ((planetLon % 360) + 360) % 360;

  // Percorre as 12 casas
  for (let i = 0; i < 12; i++) {
    const currentCusp = ((cusps[i] % 360) + 360) % 360;
    const nextCusp = ((cusps[(i + 1) % 12] % 360) + 360) % 360;

    // Caso especial: quando a casa cruza 0° (ex: cúspide em 350°, próxima em 20°)
    if (currentCusp > nextCusp) {
      if (normPlanetLon >= currentCusp || normPlanetLon < nextCusp) {
        return i + 1;
      }
    } else {
      // Caso normal
      if (normPlanetLon >= currentCusp && normPlanetLon < nextCusp) {
        return i + 1;
      }
    }
  }

  // Fallback: se não encontrou, retorna casa 1
  return 1;
}

/**
 * Normaliza ângulo para intervalo 0-360
 */
export function normalizeAngle(angle: number): number {
  return ((angle % 360) + 360) % 360;
}
