export enum ElementType {
  FIRE = 'Fogo',
  EARTH = 'Terra',
  AIR = 'Ar',
  WATER = 'Água'
}

export interface SignData {
  id: string;
  name: string;
  date: string;
  element: ElementType;
  icon: string; // Changed from iconPath to icon (emoji)
  color: string;
  gradient: string;
}

export interface CompatibilityResult {
  resumo: string;
  combina: string[];
  nao_combina: string[];
  dicas: string[];
  compatibilidade: number;
}