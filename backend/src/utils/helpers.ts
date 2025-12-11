/**
 * Funções auxiliares para cálculos astrológicos
 */

import { ZODIAC_SIGNS } from '../types/birthChartTypes';

/**
 * Converte longitude (0-360°) para signo e grau dentro do signo
 */
export function longitudeToSignAndDegree(longitude: number): { sign: string; degree: number } {
  const normalizedLong = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalizedLong / 30);
  const degree = normalizedLong % 30;

  return {
    sign: ZODIAC_SIGNS[signIndex],
    degree: Math.round(degree * 100) / 100
  };
}

/**
 * Retorna elemento do signo
 */
export function getSignElement(sign: string): 'fire' | 'earth' | 'air' | 'water' {
  const fireSigns = ['Áries', 'Leão', 'Sagitário'];
  const earthSigns = ['Touro', 'Virgem', 'Capricórnio'];
  const airSigns = ['Gêmeos', 'Libra', 'Aquário'];
  const waterSigns = ['Câncer', 'Escorpião', 'Peixes'];

  if (fireSigns.includes(sign)) return 'fire';
  if (earthSigns.includes(sign)) return 'earth';
  if (airSigns.includes(sign)) return 'air';
  if (waterSigns.includes(sign)) return 'water';
  return 'fire';
}

/**
 * Retorna modalidade do signo
 */
export function getSignModality(sign: string): 'cardinal' | 'fixed' | 'mutable' {
  const cardinalSigns = ['Áries', 'Câncer', 'Libra', 'Capricórnio'];
  const fixedSigns = ['Touro', 'Leão', 'Escorpião', 'Aquário'];
  const mutableSigns = ['Gêmeos', 'Virgem', 'Sagitário', 'Peixes'];

  if (cardinalSigns.includes(sign)) return 'cardinal';
  if (fixedSigns.includes(sign)) return 'fixed';
  if (mutableSigns.includes(sign)) return 'mutable';
  return 'cardinal';
}

/**
 * Determina em qual casa está um planeta (considerando wrap 360°)
 */
export function determineHouse(planetLongitude: number, houseCusps: number[]): number {
  const normalizedPlanet = ((planetLongitude % 360) + 360) % 360;

  for (let i = 0; i < 12; i++) {
    const currentCusp = ((houseCusps[i] % 360) + 360) % 360;
    const nextCusp = ((houseCusps[(i + 1) % 12] % 360) + 360) % 360;

    if (currentCusp < nextCusp) {
      if (normalizedPlanet >= currentCusp && normalizedPlanet < nextCusp) {
        return i + 1;
      }
    } else {
      // Wrap case (ex: 350° -> 10°)
      if (normalizedPlanet >= currentCusp || normalizedPlanet < nextCusp) {
        return i + 1;
      }
    }
  }

  return 1; // fallback
}

/**
 * Calcula distância angular entre duas longitudes (considera ciclo 360°)
 */
export function getAngularDistance(long1: number, long2: number): number {
  const diff = Math.abs(long1 - long2);
  return Math.min(diff, 360 - diff);
}
