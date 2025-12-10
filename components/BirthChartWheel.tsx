import React from 'react';
import { BirthChartResult, PlanetPosition } from '../services/birthChartService';

interface BirthChartWheelProps {
  chart: BirthChartResult;
}

// Signos e seus símbolos
const SIGN_SYMBOLS: Record<string, string> = {
  'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
  'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
  'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
};

// Signos em ordem
const SIGNS_ORDER = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];

// Cores por elemento
const ELEMENT_COLORS: Record<string, string> = {
  'Áries': '#ef4444', 'Leão': '#ef4444', 'Sagitário': '#ef4444', // Fogo - vermelho
  'Touro': '#22c55e', 'Virgem': '#22c55e', 'Capricórnio': '#22c55e', // Terra - verde
  'Gêmeos': '#eab308', 'Libra': '#eab308', 'Aquário': '#eab308', // Ar - amarelo
  'Câncer': '#3b82f6', 'Escorpião': '#3b82f6', 'Peixes': '#3b82f6', // Água - azul
};

// Símbolos dos planetas
const PLANET_SYMBOLS: Record<string, string> = {
  'Sol': '☉', 'Lua': '☽', 'Mercúrio': '☿', 'Vênus': '♀',
  'Marte': '♂', 'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅',
  'Netuno': '♆', 'Plutão': '♇',
};

// Cores dos planetas
const PLANET_COLORS: Record<string, string> = {
  'Sol': '#fbbf24', // Amarelo dourado
  'Lua': '#e2e8f0', // Prata
  'Mercúrio': '#a3a3a3', // Cinza
  'Vênus': '#ec4899', // Rosa
  'Marte': '#ef4444', // Vermelho
  'Júpiter': '#f97316', // Laranja
  'Saturno': '#78716c', // Marrom
  'Urano': '#22d3ee', // Ciano
  'Netuno': '#8b5cf6', // Roxo
  'Plutão': '#6366f1', // Índigo
};

const BirthChartWheel: React.FC<BirthChartWheelProps> = ({ chart }) => {
  const size = 350;
  const center = size / 2;
  const outerRadius = size / 2 - 10;
  const signRadius = outerRadius - 25;
  const houseRadius = signRadius - 30;
  const planetRadius = houseRadius - 35;
  const innerRadius = 45;

  // Calcula a posição do Ascendente para rotação
  const ascSignIndex = SIGNS_ORDER.indexOf(chart.ascendant.sign);
  const ascDegree = chart.ascendant.degree;
  // O Ascendente deve estar no lado esquerdo (180°), então rotacionamos
  const rotationOffset = -(ascSignIndex * 30 + ascDegree) + 180;

  // Converte graus para coordenadas
  const polarToCartesian = (radius: number, degrees: number) => {
    const radians = ((degrees + rotationOffset - 90) * Math.PI) / 180;
    return {
      x: center + radius * Math.cos(radians),
      y: center + radius * Math.sin(radians),
    };
  };

  // Desenha um arco
  const describeArc = (radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(radius, endAngle);
    const end = polarToCartesian(radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
  };

  // Calcula a longitude total de um planeta
  const getPlanetLongitude = (planet: PlanetPosition): number => {
    const signIndex = SIGNS_ORDER.indexOf(planet.sign);
    return signIndex * 30 + planet.degree;
  };

  // Agrupa planetas próximos para evitar sobreposição
  const getSpacedPlanets = () => {
    const planets = chart.planets.map(p => ({
      ...p,
      longitude: getPlanetLongitude(p),
    }));

    // Ordena por longitude
    planets.sort((a, b) => a.longitude - b.longitude);

    // Espaça planetas muito próximos (menos de 8 graus)
    const minSpacing = 12;
    for (let i = 1; i < planets.length; i++) {
      const diff = planets[i].longitude - planets[i - 1].longitude;
      if (diff < minSpacing && diff >= 0) {
        planets[i].longitude = planets[i - 1].longitude + minSpacing;
      }
    }

    return planets;
  };

  const spacedPlanets = getSpacedPlanets();

  return (
    <div className="flex justify-center items-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-full h-auto"
      >
        {/* Definições de gradientes */}
        <defs>
          <radialGradient id="bgGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1e1b4b" />
            <stop offset="100%" stopColor="#030712" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Fundo */}
        <circle cx={center} cy={center} r={outerRadius} fill="url(#bgGradient)" />

        {/* Anel externo - Signos */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="#4c1d95"
          strokeWidth="1"
        />
        <circle
          cx={center}
          cy={center}
          r={signRadius}
          fill="none"
          stroke="#4c1d95"
          strokeWidth="1"
        />

        {/* Divisões dos signos (30° cada) */}
        {SIGNS_ORDER.map((sign, i) => {
          const startAngle = i * 30;
          const endAngle = (i + 1) * 30;
          const midAngle = startAngle + 15;

          // Linha de divisão
          const lineStart = polarToCartesian(signRadius, startAngle);
          const lineEnd = polarToCartesian(outerRadius, startAngle);

          // Posição do símbolo
          const symbolPos = polarToCartesian((outerRadius + signRadius) / 2, midAngle);

          // Cor do segmento baseada no elemento
          const color = ELEMENT_COLORS[sign];

          return (
            <g key={sign}>
              {/* Arco colorido do signo */}
              <path
                d={describeArc((outerRadius + signRadius) / 2, startAngle, endAngle)}
                fill="none"
                stroke={color}
                strokeWidth={(outerRadius - signRadius) - 4}
                opacity="0.3"
              />
              {/* Linha divisória */}
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke="#4c1d95"
                strokeWidth="1"
              />
              {/* Símbolo do signo */}
              <text
                x={symbolPos.x}
                y={symbolPos.y}
                fill={color}
                fontSize="14"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ filter: 'url(#glow)' }}
              >
                {SIGN_SYMBOLS[sign]}
              </text>
            </g>
          );
        })}

        {/* Anel das casas */}
        <circle
          cx={center}
          cy={center}
          r={houseRadius}
          fill="none"
          stroke="#374151"
          strokeWidth="1"
        />

        {/* Linhas das casas */}
        {chart.houses.map((house, i) => {
          const angle = i * 30;
          const lineStart = polarToCartesian(innerRadius, angle);
          const lineEnd = polarToCartesian(houseRadius, angle);

          // Número da casa
          const houseNumPos = polarToCartesian(houseRadius - 12, angle + 15);

          return (
            <g key={`house-${house.number}`}>
              <line
                x1={lineStart.x}
                y1={lineStart.y}
                x2={lineEnd.x}
                y2={lineEnd.y}
                stroke="#374151"
                strokeWidth="1"
              />
              <text
                x={houseNumPos.x}
                y={houseNumPos.y}
                fill="#6b7280"
                fontSize="9"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {house.number}
              </text>
            </g>
          );
        })}

        {/* Círculo interno */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="#030712"
          stroke="#4c1d95"
          strokeWidth="1"
        />

        {/* Ascendente (AC) */}
        <text
          x={center - innerRadius - 15}
          y={center}
          fill="#fbbf24"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          AC
        </text>

        {/* Descendente (DC) */}
        <text
          x={center + innerRadius + 15}
          y={center}
          fill="#fbbf24"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          DC
        </text>

        {/* Meio do Céu (MC) */}
        <text
          x={center}
          y={center - innerRadius - 15}
          fill="#fbbf24"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          MC
        </text>

        {/* Fundo do Céu (IC) */}
        <text
          x={center}
          y={center + innerRadius + 15}
          fill="#fbbf24"
          fontSize="10"
          fontWeight="bold"
          textAnchor="middle"
        >
          IC
        </text>

        {/* Planetas */}
        {spacedPlanets.map((planet) => {
          const pos = polarToCartesian(planetRadius, planet.longitude);
          const color = PLANET_COLORS[planet.name] || '#ffffff';

          return (
            <g key={planet.name}>
              {/* Círculo de fundo */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r="11"
                fill="#0f172a"
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Símbolo do planeta */}
              <text
                x={pos.x}
                y={pos.y}
                fill={color}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ filter: 'url(#glow)' }}
              >
                {PLANET_SYMBOLS[planet.name] || '•'}
              </text>
              {/* Indicador de retrogradação */}
              {planet.retrograde && (
                <text
                  x={pos.x + 8}
                  y={pos.y - 8}
                  fill="#ef4444"
                  fontSize="8"
                  fontWeight="bold"
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}

        {/* Linhas de aspecto (apenas principais) */}
        {chart.aspects.slice(0, 8).map((aspect, i) => {
          const p1 = spacedPlanets.find(p => p.name === aspect.planet1);
          const p2 = spacedPlanets.find(p => p.name === aspect.planet2);
          if (!p1 || !p2) return null;

          const pos1 = polarToCartesian(planetRadius - 15, p1.longitude);
          const pos2 = polarToCartesian(planetRadius - 15, p2.longitude);

          let strokeColor = '#6b7280';
          let strokeDash = '';

          if (aspect.nature === 'harmonic') {
            strokeColor = '#22c55e';
          } else if (aspect.nature === 'challenging') {
            strokeColor = '#ef4444';
            strokeDash = '4,2';
          }

          return (
            <line
              key={`aspect-${i}`}
              x1={pos1.x}
              y1={pos1.y}
              x2={pos2.x}
              y2={pos2.y}
              stroke={strokeColor}
              strokeWidth="0.5"
              strokeDasharray={strokeDash}
              opacity="0.5"
            />
          );
        })}

        {/* Centro - Sol/Lua/Ascendente */}
        <text
          x={center}
          y={center - 10}
          fill="#fbbf24"
          fontSize="16"
          textAnchor="middle"
        >
          {SIGN_SYMBOLS[chart.planets.find(p => p.name === 'Sol')?.sign || '']}
        </text>
        <text
          x={center}
          y={center + 10}
          fill="#e2e8f0"
          fontSize="14"
          textAnchor="middle"
        >
          {SIGN_SYMBOLS[chart.planets.find(p => p.name === 'Lua')?.sign || '']}
        </text>
      </svg>
    </div>
  );
};

export default BirthChartWheel;
