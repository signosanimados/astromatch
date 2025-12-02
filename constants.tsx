import React from 'react';
import { SignData, ElementType } from './types';

// Link direto do Imgur (Convertido de álbum para imagem direta .png)
// Para funcionar no download, TEM que ser o link direto (i.imgur.com/...)
export const APP_LOGO = "https://i.imgur.com/azbf6qp.png";

// Paleta de Cores por Elemento
const COLORS = {
  FIRE: '#FC4629',   // Vermelho
  EARTH: '#A3CB00',  // Verde
  WATER: '#1D5EFF',  // Azul
  AIR: '#FFFFFF'     // Branco
};

export const SIGNS: SignData[] = [
  {
    id: 'aries',
    name: 'Áries',
    date: '21 Mar - 19 Abr',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/1jfkg85.png'
  },
  {
    id: 'taurus',
    name: 'Touro',
    date: '20 Abr - 20 Mai',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/Je2j4uC.png'
  },
  {
    id: 'gemini',
    name: 'Gêmeos',
    date: '21 Mai - 20 Jun',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`, // Opacidade menor para o branco não estourar
    icon: 'https://i.imgur.com/6F9Gu1T.png' 
  },
  {
    id: 'cancer',
    name: 'Câncer',
    date: '21 Jun - 22 Jul',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/Jev0I5P.png'
  },
  {
    id: 'leo',
    name: 'Leão',
    date: '23 Jul - 22 Ago',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/iXWGgB5.png'
  },
  {
    id: 'virgo',
    name: 'Virgem',
    date: '23 Ago - 22 Set',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/p2w1syF.png'
  },
  {
    id: 'libra',
    name: 'Libra',
    date: '23 Set - 22 Out',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`,
    icon: 'https://i.imgur.com/8yyWG6m.png'
  },
  {
    id: 'scorpio',
    name: 'Escorpião',
    date: '23 Out - 21 Nov',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/XMz6rP6.png'
  },
  {
    id: 'sagittarius',
    name: 'Sagitário',
    date: '22 Nov - 21 Dez',
    element: ElementType.FIRE,
    color: `text-[${COLORS.FIRE}]`,
    gradient: `from-[${COLORS.FIRE}]/20 to-[${COLORS.FIRE}]/80`,
    icon: 'https://i.imgur.com/ar07j7y.png'
  },
  {
    id: 'capricorn',
    name: 'Capricórnio',
    date: '22 Dez - 19 Jan',
    element: ElementType.EARTH,
    color: `text-[${COLORS.EARTH}]`,
    gradient: `from-[${COLORS.EARTH}]/20 to-[${COLORS.EARTH}]/80`,
    icon: 'https://i.imgur.com/iD9niIf.png'
  },
  {
    id: 'aquarius',
    name: 'Aquário',
    date: '20 Jan - 18 Fev',
    element: ElementType.AIR,
    color: `text-[${COLORS.AIR}]`,
    gradient: `from-[${COLORS.AIR}]/10 to-[${COLORS.AIR}]/60`,
    icon: 'https://i.imgur.com/b7dHYgk.png'
  },
  {
    id: 'pisces',
    name: 'Peixes',
    date: '19 Fev - 20 Mar',
    element: ElementType.WATER,
    color: `text-[${COLORS.WATER}]`,
    gradient: `from-[${COLORS.WATER}]/20 to-[${COLORS.WATER}]/80`,
    icon: 'https://i.imgur.com/IDVKxlq.png'
  }
];

export const ElementIcons = {
  [ElementType.FIRE]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 2l-6 10h12z" />
    </svg>
  ),
  [ElementType.EARTH]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 22l-8-8h16z M2 14h20" />
    </svg>
  ),
  [ElementType.AIR]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
       <path d="M2 12h20" />
    </svg>
  ),
  [ElementType.WATER]: (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M12 22l-6-10h12z" />
    </svg>
  )
};