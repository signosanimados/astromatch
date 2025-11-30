import React from 'react';
import { SignData, ElementType } from './types';

export const SIGNS: SignData[] = [
  {
    id: 'aries',
    name: 'Áries',
    date: '21 Mar - 19 Abr',
    element: ElementType.FIRE,
    color: 'text-red-400',
    gradient: 'from-red-900/50 to-red-600/50',
    icon: '♈'
  },
  {
    id: 'taurus',
    name: 'Touro',
    date: '20 Abr - 20 Mai',
    element: ElementType.EARTH,
    color: 'text-emerald-400',
    gradient: 'from-emerald-900/50 to-emerald-600/50',
    icon: '♉'
  },
  {
    id: 'gemini',
    name: 'Gêmeos',
    date: '21 Mai - 20 Jun',
    element: ElementType.AIR,
    color: 'text-amber-400',
    gradient: 'from-amber-900/50 to-amber-600/50',
    icon: '♊' 
  },
  {
    id: 'cancer',
    name: 'Câncer',
    date: '21 Jun - 22 Jul',
    element: ElementType.WATER,
    color: 'text-violet-400',
    gradient: 'from-violet-900/50 to-violet-600/50',
    icon: '♋'
  },
  {
    id: 'leo',
    name: 'Leão',
    date: '23 Jul - 22 Ago',
    element: ElementType.FIRE,
    color: 'text-orange-400',
    gradient: 'from-orange-900/50 to-orange-600/50',
    icon: '♌'
  },
  {
    id: 'virgo',
    name: 'Virgem',
    date: '23 Ago - 22 Set',
    element: ElementType.EARTH,
    color: 'text-lime-400',
    gradient: 'from-lime-900/50 to-lime-600/50',
    icon: '♍'
  },
  {
    id: 'libra',
    name: 'Libra',
    date: '23 Set - 22 Out',
    element: ElementType.AIR,
    color: 'text-pink-400',
    gradient: 'from-pink-900/50 to-pink-600/50',
    icon: '♎'
  },
  {
    id: 'scorpio',
    name: 'Escorpião',
    date: '23 Out - 21 Nov',
    element: ElementType.WATER,
    color: 'text-indigo-400',
    gradient: 'from-indigo-900/50 to-indigo-600/50',
    icon: '♏'
  },
  {
    id: 'sagittarius',
    name: 'Sagitário',
    date: '22 Nov - 21 Dez',
    element: ElementType.FIRE,
    color: 'text-fuchsia-400',
    gradient: 'from-fuchsia-900/50 to-fuchsia-600/50',
    icon: '♐'
  },
  {
    id: 'capricorn',
    name: 'Capricórnio',
    date: '22 Dez - 19 Jan',
    element: ElementType.EARTH,
    color: 'text-stone-400',
    gradient: 'from-stone-800/80 to-stone-500/50',
    icon: '♑'
  },
  {
    id: 'aquarius',
    name: 'Aquário',
    date: '20 Jan - 18 Fev',
    element: ElementType.AIR,
    color: 'text-sky-400',
    gradient: 'from-sky-900/50 to-sky-600/50',
    icon: '♒'
  },
  {
    id: 'pisces',
    name: 'Peixes',
    date: '19 Fev - 20 Mar',
    element: ElementType.WATER,
    color: 'text-cyan-400',
    gradient: 'from-cyan-900/50 to-cyan-600/50',
    icon: '♓'
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