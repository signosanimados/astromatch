import { CompatibilityResult, SignData, ElementType } from '../types';

/**
 * Calculates a fixed, deterministic score for any pair of signs.
 * This ensures that Aries + Aries is always the same score for the same pair.
 */
const calculateDeterministicScore = (signA: SignData, signB: SignData): number => {
  // 1. Sort signs alphabetically by ID to ensure order doesn't matter (Aries+Leo == Leo+Aries)
  const [s1, s2] = [signA, signB].sort((a, b) => a.id.localeCompare(b.id));

  // 2. Base Score based on Astrological Elements
  let baseScore = 50;
  const el1 = s1.element;
  const el2 = s2.element;

  const FIRE = ElementType.FIRE;
  const EARTH = ElementType.EARTH;
  const AIR = ElementType.AIR;
  const WATER = ElementType.WATER;

  if (s1.id === s2.id) {
    baseScore = 75; // Same sign
  } else if (el1 === el2) {
    baseScore = 90; // Trine (Same element)
  } else {
    // Check Compatible Elements (Fire+Air or Earth+Water)
    const fireAir = (el1 === FIRE && el2 === AIR) || (el1 === AIR && el2 === FIRE);
    const earthWater = (el1 === EARTH && el2 === WATER) || (el1 === WATER && el2 === EARTH);

    if (fireAir || earthWater) {
      baseScore = 85; // Sextile/Opposition usually positive
    } else {
      baseScore = 45; // Square/Quincunx usually challenging
    }
  }

  // 3. Add Deterministic Variance (-12 to +12) based on name hash
  const comboId = s1.id + s2.id;
  let hash = 0;
  for (let i = 0; i < comboId.length; i++) {
    hash = comboId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const variance = (Math.abs(hash) % 25) - 12;

  // Clamp between 15 and 99
  return Math.min(Math.max(baseScore + variance, 15), 99);
};

// Cache for loaded compatibility data
const compatibilityCache: {
  love?: Record<string, CompatibilityResult>;
  friendship?: Record<string, CompatibilityResult>;
} = {};

/**
 * Loads compatibility data for the specified mode.
 * Data is cached after first load to avoid repeated fetches.
 */
const loadCompatibilityData = async (
  mode: 'love' | 'friendship'
): Promise<Record<string, CompatibilityResult>> => {
  // Return cached data if available
  if (compatibilityCache[mode]) {
    return compatibilityCache[mode]!;
  }

  // Dynamically import the JSON data
  try {
    const dataPath = `/data/compatibility/${mode}.json`;
    const response = await fetch(dataPath);

    if (!response.ok) {
      throw new Error(`Failed to load ${mode} compatibility data: ${response.statusText}`);
    }

    const data = await response.json();
    compatibilityCache[mode] = data;
    return data;
  } catch (error) {
    console.error(`Error loading ${mode} compatibility data:`, error);
    // Return empty object as fallback
    return {};
  }
};

/**
 * Calculates compatibility between two signs based on mode (love or friendship).
 * Returns the static data if available, or calculates a deterministic fallback.
 */
export const getCompatibility = async (
  signA: SignData,
  signB: SignData,
  mode: 'love' | 'friendship'
): Promise<CompatibilityResult> => {
  // Sort by ID to ensure consistent key generation (e.g. 'aries-taurus' vs 'taurus-aries')
  // The keys in the data maps are generally 'sign1-sign2' where sign1 comes before sign2 alphabetically
  const [s1, s2] = [signA, signB].sort((a, b) => a.id.localeCompare(b.id));
  const key = `${s1.id}-${s2.id}`;

  // Load the appropriate data for the mode
  const dataMap = await loadCompatibilityData(mode);
  const result = dataMap[key];

  if (result) {
    return result;
  }

  // Fallback calculation
  const score = calculateDeterministicScore(signA, signB);

  return {
    resumo: `A combinação entre ${signA.name} e ${signB.name} é interessante, unindo as energias de ${signA.element} e ${signB.element}.`,
    combina: ["Aprendizado mútuo", "Troca de experiências"],
    nao_combina: ["Diferenças de perspectiva", "Ajustes de ritmo"],
    dicas: ["Sejam pacientes um com o outro.", "Valorizem o que cada um traz de único."],
    compatibilidade: score
  };
};
