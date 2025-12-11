import React, { useState, useEffect } from 'react';
import { calculateBirthChartApi, geocodeCity, checkApiHealth } from '../services/birthChartApiService';
import { generateBirthChartAnalysis, generatePDF } from '../services/birthChartAnalysisService';
import type { BirthChartResult } from '../shared/birthChartTypes';
import { PLANET_MEANINGS, ASCENDANT_MEANING, MIDHEAVEN_MEANING } from '../data/planetMeanings';
import { ELEMENTS_MEANINGS, MODALITIES_MEANINGS, DISTRIBUTION_MEANING } from '../data/elementsMeanings';

interface BirthChartProfessionalProps {
  onBack: () => void;
  userId: string;
  credits: number;
  onCreditsUpdate: (newCredits: number) => void | Promise<void>;
}

const CREDIT_COST = 5;
const ANALYSIS_CREDIT_COST = 5;

const BirthChartProfessional: React.FC<BirthChartProfessionalProps> = ({
  onBack,
  userId,
  credits,
  onCreditsUpdate
}) => {
  // Estados do formulário
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [city, setCity] = useState('São Paulo, Brazil');
  const [useManualCoords, setUseManualCoords] = useState(false);
  const [latitude, setLatitude] = useState(-23.5505);
  const [longitude, setLongitude] = useState(-46.6333);
  const [timezone, setTimezone] = useState('America/Sao_Paulo');
  const [searchingCity, setSearchingCity] = useState(false);
  const [citySuggestions, setCitySuggestions] = useState<Array<{
    name: string;
    displayName: string;
    lat: number;
    lon: number;
  }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Estados da aplicação
  const [loading, setLoading] = useState(false);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(true); // Assume available
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [tooltipType, setTooltipType] = useState<'planet' | 'ascendant' | 'midheaven' | 'element' | 'modality' | null>(null);
  const [selectedElement, setSelectedElement] = useState<'fire' | 'earth' | 'air' | 'water' | null>(null);
  const [selectedModality, setSelectedModality] = useState<'cardinal' | 'fixed' | 'mutable' | null>(null);

  // Verificar API ao montar (não bloqueia o uso)
  useEffect(() => {
    checkApiHealth().then(available => {
      if (!available) {
        console.warn('Backend API may be offline');
      }
      setApiAvailable(available);
    });
  }, []);

  // Buscar sugestões de cidades via Nominatim (OpenStreetMap)
  const searchCityCoordinates = async (cityName: string) => {
    if (!cityName || cityName.length < 3 || useManualCoords) {
      setCitySuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      setSearchingCity(true);
      setError(null);

      // Usar Nominatim API (OpenStreetMap) - gratuita e sem necessidade de API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(cityName)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=5`, // Buscar 5 sugestões
        {
          headers: {
            'User-Agent': 'AstroMatch Birth Chart App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar cidade');
      }

      const data = await response.json();

      if (data && data.length > 0) {
        const suggestions = data.map((location: any) => ({
          name: location.name,
          displayName: location.display_name,
          lat: parseFloat(location.lat),
          lon: parseFloat(location.lon)
        }));
        setCitySuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setCitySuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('Erro ao buscar coordenadas:', err);
      setCitySuggestions([]);
      setShowSuggestions(false);
    } finally {
      setSearchingCity(false);
    }
  };

  // Selecionar cidade da sugestão
  const selectCity = (suggestion: { name: string; displayName: string; lat: number; lon: number }) => {
    setCity(suggestion.displayName);
    setLatitude(suggestion.lat);
    setLongitude(suggestion.lon);
    setShowSuggestions(false);
    setCitySuggestions([]);

    // Determinar timezone baseado na latitude/longitude (simplificado para Brasil)
    const lat = suggestion.lat;
    const lon = suggestion.lon;

    // Timezones principais do Brasil
    if (lat >= -33 && lat <= 5 && lon >= -75 && lon <= -30) {
      if (lon >= -52) setTimezone('America/Sao_Paulo');
      else if (lon >= -60) setTimezone('America/Manaus');
      else if (lon >= -70) setTimezone('America/Rio_Branco');
      else setTimezone('America/Sao_Paulo');
    } else {
      setTimezone('America/Sao_Paulo'); // Default
    }
  };

  // Debounce para buscar cidade após usuário parar de digitar
  useEffect(() => {
    const timer = setTimeout(() => {
      if (city && !useManualCoords) {
        searchCityCoordinates(city);
      }
    }, 1000); // Aguarda 1 segundo após última digitação

    return () => clearTimeout(timer);
  }, [city, useManualCoords]);

  // Fechar sugestões ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.city-autocomplete-container')) {
        setShowSuggestions(false);
      }
    };

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificar créditos
    if (credits < CREDIT_COST) {
      setError(`Você precisa de ${CREDIT_COST} créditos para gerar um mapa astral. Você tem apenas ${credits} crédito(s).`);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setAnalysis(null);

    try {
      // Parse da data
      const [year, month, day] = date.split('-').map(Number);
      const [hour, minute] = time.split(':').map(Number);

      // Calcular mapa astral
      const chartResult = await calculateBirthChartApi({
        name,
        year,
        month,
        day,
        hour,
        minute,
        latitude,
        longitude,
        timezone,
        city,
      });

      setResult(chartResult);

      // Deduzir créditos
      const newCredits = credits - CREDIT_COST;
      console.log(`[Credits] Deducting ${CREDIT_COST} credits. Before: ${credits}, After: ${newCredits}`);
      await onCreditsUpdate(newCredits);
      console.log(`[Credits] Credits updated successfully`);

    } catch (err: any) {
      setError(err.message || 'Erro ao calcular mapa astral');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!result) return;

    // Verificar créditos
    if (credits < ANALYSIS_CREDIT_COST) {
      setError(`Você precisa de ${ANALYSIS_CREDIT_COST} créditos para gerar a interpretação completa. Você tem apenas ${credits} crédito(s).`);
      return;
    }

    setGeneratingAnalysis(true);
    setAnalysisProgress(0);
    setError(null);

    try {
      // Simular progresso gradual
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const analysisText = await generateBirthChartAnalysis(result, name);

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      // Deduzir créditos
      const newCredits = credits - ANALYSIS_CREDIT_COST;
      console.log(`[Credits] Deducting ${ANALYSIS_CREDIT_COST} credits for analysis. Before: ${credits}, After: ${newCredits}`);
      await onCreditsUpdate(newCredits);
      console.log(`[Credits] Analysis credits updated successfully`);

      setAnalysis(analysisText);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar análise');
    } finally {
      setGeneratingAnalysis(false);
      setAnalysisProgress(0);
    }
  };

  const handleDownloadPDF = () => {
    if (!result || !analysis) return;

    generatePDF(result, analysis, name, {
      date,
      time,
      city: city || 'Coordenadas personalizadas'
    });
  };

  const planetSymbols: Record<string, string> = {
    'Sol': '☉',
    'Lua': '☽',
    'Mercúrio': '☿',
    'Vênus': '♀',
    'Marte': '♂',
    'Júpiter': '♃',
    'Saturno': '♄',
    'Urano': '♅',
    'Netuno': '♆',
    'Plutão': '♇',
  };

  // Mapeamento de signos para ícones e cores
  const signData: Record<string, { icon: string; gradient: string; element: string }> = {
    'Áries': { icon: 'https://i.imgur.com/1jfkg85.png', gradient: 'from-red-500/20 to-orange-500/80', element: '🔥' },
    'Touro': { icon: 'https://i.imgur.com/Je2j4uC.png', gradient: 'from-green-600/20 to-emerald-600/80', element: '🌍' },
    'Gêmeos': { icon: 'https://i.imgur.com/6F9Gu1T.png', gradient: 'from-yellow-400/10 to-amber-400/60', element: '💨' },
    'Câncer': { icon: 'https://i.imgur.com/Jev0I5P.png', gradient: 'from-blue-400/20 to-cyan-500/80', element: '💧' },
    'Leão': { icon: 'https://i.imgur.com/iXWGgB5.png', gradient: 'from-red-500/20 to-orange-500/80', element: '🔥' },
    'Virgem': { icon: 'https://i.imgur.com/p2w1syF.png', gradient: 'from-green-600/20 to-emerald-600/80', element: '🌍' },
    'Libra': { icon: 'https://i.imgur.com/8yyWG6m.png', gradient: 'from-yellow-400/10 to-amber-400/60', element: '💨' },
    'Escorpião': { icon: 'https://i.imgur.com/XMz6rP6.png', gradient: 'from-blue-400/20 to-cyan-500/80', element: '💧' },
    'Sagitário': { icon: 'https://i.imgur.com/ar07j7y.png', gradient: 'from-red-500/20 to-orange-500/80', element: '🔥' },
    'Capricórnio': { icon: 'https://i.imgur.com/iD9niIf.png', gradient: 'from-green-600/20 to-emerald-600/80', element: '🌍' },
    'Aquário': { icon: 'https://i.imgur.com/b7dHYgk.png', gradient: 'from-yellow-400/10 to-amber-400/60', element: '💨' },
    'Peixes': { icon: 'https://i.imgur.com/IDVKxlq.png', gradient: 'from-blue-400/20 to-cyan-500/80', element: '💧' },
  };

  // Tela de resultados
  if (result) {
    const sunSign = result.planets[0]?.sign; // Sol é o primeiro planeta
    const sunData = sunSign ? signData[sunSign] : null;

    return (
      <div className="min-h-screen bg-[#050510] text-white p-4 md:p-6 relative overflow-hidden">
        {/* Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setResult(null)}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Novo Mapa
            </button>

            <button
              onClick={onBack}
              className="text-sm text-slate-500 hover:text-white transition-colors"
            >
              ← Voltar ao Menu
            </button>
          </div>

          {/* Título */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {name || 'Mapa Astral'}
            </h1>
            <p className="text-slate-400 text-sm">
              {date} às {time} • {city || 'Coordenadas personalizadas'}
            </p>
          </div>

          {/* Signo Solar (Destaque Principal) */}
          {sunSign && sunData && (
            <div className="mb-8 flex justify-center">
              <div className={`glass p-8 rounded-3xl border border-white/10 bg-gradient-to-br ${sunData.gradient} max-w-sm w-full`}>
                <div className="text-center">
                  <p className="text-xs uppercase text-slate-400 mb-3 tracking-widest">Seu Signo Solar</p>
                  <img
                    src={sunData.icon}
                    alt={sunSign}
                    className="w-32 h-32 mx-auto mb-4 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
                  />
                  <h2 className="text-4xl font-bold mb-2">{sunSign}</h2>
                  <p className="text-sm text-slate-300 mb-1">{result.planets[0].degree.toFixed(1)}° • Casa {result.planets[0].house}</p>
                  <p className="text-xs text-white">Elemento {sunData.element}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ascendente e MC */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => {
                setTooltipType('ascendant');
                setSelectedPlanet(null);
              }}
              className="glass p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-transparent hover:border-purple-500/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xs uppercase text-slate-500 tracking-wider">Ascendente</h3>
                <span className="text-xs text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">ℹ️ Clique para saber mais</span>
              </div>
              <p className="text-3xl font-bold text-purple-400">{result.ascendant.sign}</p>
              <p className="text-sm text-slate-400 font-mono">{result.ascendant.degree.toFixed(2)}°</p>
            </button>
            <button
              onClick={() => {
                setTooltipType('midheaven');
                setSelectedPlanet(null);
              }}
              className="glass p-6 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-900/20 to-transparent hover:border-pink-500/40 transition-all cursor-pointer text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xs uppercase text-slate-500 tracking-wider">Meio do Céu (MC)</h3>
                <span className="text-xs text-pink-400 opacity-0 group-hover:opacity-100 transition-opacity">ℹ️ Clique para saber mais</span>
              </div>
              <p className="text-3xl font-bold text-pink-400">{result.midheaven.sign}</p>
              <p className="text-sm text-slate-400 font-mono">{result.midheaven.degree.toFixed(2)}°</p>
            </button>
          </div>

          {/* Planetas */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">🪐</span>
              Planetas
              <span className="text-xs text-slate-500 font-normal ml-auto">Clique para saber mais</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {result.planets.map((planet, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedPlanet(planet.name);
                    setTooltipType('planet');
                  }}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/70 hover:border-purple-500/30 transition-all border border-white/5 cursor-pointer group"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl group-hover:scale-110 transition-transform">{planetSymbols[planet.name] || '•'}</span>
                    <div className="text-left">
                      <p className="font-bold">{planet.name}</p>
                      <p className="text-xs text-slate-500">Casa {planet.house}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm font-medium">
                      {planet.sign} {planet.degree.toFixed(1)}°
                      {planet.retrograde && <span className="text-red-400 ml-2">℞</span>}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Elementos e Modalidades */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {/* Elementos */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🌟</span> Elementos
                <span className="text-xs text-slate-500 font-normal ml-auto">Clique para saber mais</span>
              </h3>
              <div className="space-y-4">
                {/* Fogo */}
                {(() => {
                  const total = result.elements.fire + result.elements.earth + result.elements.air + result.elements.water;
                  const percentage = total > 0 ? Math.round((result.elements.fire / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedElement('fire');
                        setTooltipType('element');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-red-400">🔥 Fogo</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-red-500 to-orange-500 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}

                {/* Terra */}
                {(() => {
                  const total = result.elements.fire + result.elements.earth + result.elements.air + result.elements.water;
                  const percentage = total > 0 ? Math.round((result.elements.earth / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedElement('earth');
                        setTooltipType('element');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-green-400">🌍 Terra</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-green-600 to-emerald-500 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}

                {/* Ar */}
                {(() => {
                  const total = result.elements.fire + result.elements.earth + result.elements.air + result.elements.water;
                  const percentage = total > 0 ? Math.round((result.elements.air / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedElement('air');
                        setTooltipType('element');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-blue-400">💨 Ar</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-sky-400 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}

                {/* Água */}
                {(() => {
                  const total = result.elements.fire + result.elements.earth + result.elements.air + result.elements.water;
                  const percentage = total > 0 ? Math.round((result.elements.water / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedElement('water');
                        setTooltipType('element');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-cyan-400">💧 Água</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-blue-400 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Modalidades */}
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> Modalidades
                <span className="text-xs text-slate-500 font-normal ml-auto">Clique para saber mais</span>
              </h3>
              <div className="space-y-4">
                {/* Cardinal */}
                {(() => {
                  const total = result.modalities.cardinal + result.modalities.fixed + result.modalities.mutable;
                  const percentage = total > 0 ? Math.round((result.modalities.cardinal / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedModality('cardinal');
                        setTooltipType('modality');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-pink-400">▲ Cardinal</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-pink-500 to-rose-400 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}

                {/* Fixo */}
                {(() => {
                  const total = result.modalities.cardinal + result.modalities.fixed + result.modalities.mutable;
                  const percentage = total > 0 ? Math.round((result.modalities.fixed / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedModality('fixed');
                        setTooltipType('modality');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-amber-400">■ Fixo</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}

                {/* Mutável */}
                {(() => {
                  const total = result.modalities.cardinal + result.modalities.fixed + result.modalities.mutable;
                  const percentage = total > 0 ? Math.round((result.modalities.mutable / total) * 100) : 0;
                  return (
                    <button
                      onClick={() => {
                        setSelectedModality('mutable');
                        setTooltipType('modality');
                        setSelectedPlanet(null);
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-indigo-400">◆ Mutável</span>
                        <span className="text-sm font-bold">{percentage}%</span>
                      </div>
                      <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-400 h-full rounded-full transition-all duration-500 group-hover:opacity-80"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Aspectos */}
          {result.aspects.length > 0 && (
            <div className="glass p-6 rounded-2xl border border-white/5 mb-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>✨</span> Aspectos Principais
              </h2>
              <div className="grid gap-2 max-h-96 overflow-y-auto">
                {result.aspects.slice(0, 20).map((aspect, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30 text-sm hover:bg-slate-900/50 transition-all"
                  >
                    <span className="font-medium">
                      {aspect.planet1} <strong className="text-purple-400">{aspect.type}</strong> {aspect.planet2}
                    </span>
                    <span className="text-slate-500 font-mono text-xs">orb {aspect.orb.toFixed(1)}°</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interpretação Completa */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-purple-500/20 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">📜</span>
              Interpretação Completa
            </h2>

            {!analysis ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-2">
                  Obtenha uma interpretação detalhada e personalizada do seu mapa astral.
                </p>
                <p className="text-purple-400 text-sm mb-6 font-bold">
                  💫 {ANALYSIS_CREDIT_COST} créditos • Você tem {credits} crédito(s)
                </p>

                {generatingAnalysis && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-300 mb-3">✨ Gerando sua interpretação...</p>
                    <p className="text-xs text-slate-500 mb-2">Por favor, aguarde alguns instantes</p>
                    <div className="w-full max-w-md mx-auto bg-slate-800/50 rounded-full h-4 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-full rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${analysisProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-purple-400 mt-2">{analysisProgress}%</p>
                  </div>
                )}

                <button
                  onClick={handleGenerateAnalysis}
                  disabled={generatingAnalysis || credits < ANALYSIS_CREDIT_COST}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                  {generatingAnalysis ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Gerando interpretação...
                    </>
                  ) : credits < ANALYSIS_CREDIT_COST ? (
                    <>
                      <span>🔒</span>
                      Créditos Insuficientes
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      Gerar Interpretação ({ANALYSIS_CREDIT_COST} créditos)
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none mb-6">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {analysis.split('\n').map((line, idx) => {
                      // Converter **texto** em negrito
                      const parts = line.split(/(\*\*.*?\*\*)/g);
                      return (
                        <div key={idx} style={{ marginBottom: '8px' }}>
                          {parts.map((part, partIdx) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                              return <strong key={partIdx}>{part.slice(2, -2)}</strong>;
                            }
                            return <span key={partIdx}>{part}</span>;
                          })}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg flex items-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Baixar PDF Completo
                  </button>
                </div>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-sm text-red-200 mb-6">
              {error}
            </div>
          )}

          {/* Tooltip Modal */}
          {(selectedPlanet || tooltipType === 'ascendant' || tooltipType === 'midheaven' || tooltipType === 'element' || tooltipType === 'modality') && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedPlanet(null);
                setTooltipType(null);
                setSelectedElement(null);
                setSelectedModality(null);
              }}
            >
              <div
                className="glass max-w-md w-full p-8 rounded-2xl border border-purple-500/30 bg-slate-900/95"
                onClick={(e) => e.stopPropagation()}
              >
                {tooltipType === 'planet' && selectedPlanet && PLANET_MEANINGS[selectedPlanet] && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">{planetSymbols[selectedPlanet]}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{selectedPlanet}</h3>
                        <p className="text-sm text-purple-400">{PLANET_MEANINGS[selectedPlanet].short}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {PLANET_MEANINGS[selectedPlanet].description}
                    </p>
                  </>
                )}
                {tooltipType === 'ascendant' && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">🌅</span>
                      <div>
                        <h3 className="text-2xl font-bold">Ascendente</h3>
                        <p className="text-sm text-purple-400">{ASCENDANT_MEANING.short}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {ASCENDANT_MEANING.description}
                    </p>
                    <div className="p-4 bg-purple-900/20 rounded-xl border border-purple-500/20">
                      <p className="text-sm font-bold mb-1">Seu Ascendente:</p>
                      <p className="text-xl text-purple-400">{result.ascendant.sign} {result.ascendant.degree.toFixed(2)}°</p>
                    </div>
                  </>
                )}
                {tooltipType === 'midheaven' && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">⭐</span>
                      <div>
                        <h3 className="text-2xl font-bold">Meio do Céu (MC)</h3>
                        <p className="text-sm text-pink-400">{MIDHEAVEN_MEANING.short}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {MIDHEAVEN_MEANING.description}
                    </p>
                    <div className="p-4 bg-pink-900/20 rounded-xl border border-pink-500/20">
                      <p className="text-sm font-bold mb-1">Seu Meio do Céu:</p>
                      <p className="text-xl text-pink-400">{result.midheaven.sign} {result.midheaven.degree.toFixed(2)}°</p>
                    </div>
                  </>
                )}
                {tooltipType === 'element' && selectedElement && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">{ELEMENTS_MEANINGS[selectedElement].icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{ELEMENTS_MEANINGS[selectedElement].name}</h3>
                        <p className="text-sm text-purple-400">{ELEMENTS_MEANINGS[selectedElement].short}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {ELEMENTS_MEANINGS[selectedElement].description}
                    </p>
                  </>
                )}
                {tooltipType === 'modality' && selectedModality && (
                  <>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-5xl">{MODALITIES_MEANINGS[selectedModality].icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold">{MODALITIES_MEANINGS[selectedModality].name}</h3>
                        <p className="text-sm text-purple-400">{MODALITIES_MEANINGS[selectedModality].short}</p>
                      </div>
                    </div>
                    <p className="text-slate-300 leading-relaxed mb-6">
                      {MODALITIES_MEANINGS[selectedModality].description}
                    </p>
                  </>
                )}
                <button
                  onClick={() => {
                    setSelectedPlanet(null);
                    setTooltipType(null);
                    setSelectedElement(null);
                    setSelectedModality(null);
                  }}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tela do formulário
  return (
    <div className="min-h-screen bg-[#050510] text-white p-4 md:p-6 relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar
        </button>

        {/* Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-500 bg-clip-text text-transparent">
            Mapa Astral
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Descubra seu Sol, Lua, Ascendente e muito mais
          </p>
          <p className="text-purple-400 text-sm mt-2 font-bold">
            💫 {CREDIT_COST} créditos • Você tem {credits} crédito(s)
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="glass p-8 rounded-2xl border border-white/5 space-y-6">
          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-medium">
              Nome (opcional)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all"
              placeholder="Seu nome"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-medium">
                Data de Nascimento *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                required
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-medium">
                Horário *
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all"
                required
              />
            </div>
          </div>

          <div className="relative city-autocomplete-container">
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-medium">
              Cidade *
            </label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onFocus={() => {
                  if (citySuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                disabled={useManualCoords}
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
                placeholder="Ex: São Paulo, Brazil ou Rio de Janeiro, RJ"
                required
                autoComplete="off"
              />
              {searchingCity && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                </div>
              )}

              {/* Dropdown de Sugestões */}
              {showSuggestions && citySuggestions.length > 0 && !useManualCoords && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-purple-500/30 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                  {citySuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectCity(suggestion)}
                      className="w-full px-4 py-3 text-left hover:bg-purple-900/30 transition-colors border-b border-slate-800/50 last:border-0"
                    >
                      <p className="text-sm font-medium text-white">{suggestion.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{suggestion.displayName}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Digite qualquer cidade do mundo (Ex: São Paulo, Brazil • New York, USA • Paris, France)
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="manual-coords"
              checked={useManualCoords}
              onChange={(e) => setUseManualCoords(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="manual-coords" className="text-sm text-slate-400">
              Usar coordenadas manuais
            </label>
          </div>

          {useManualCoords && (
            <div className="grid grid-cols-3 gap-3 p-4 bg-slate-900/30 rounded-xl border border-slate-800">
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="w-full p-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="w-full p-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-slate-500 mb-1 block">Timezone</label>
                <input
                  type="text"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-900/50 border border-slate-700/50 text-white text-sm focus:outline-none focus:border-purple-500/50"
                  placeholder="America/Sao_Paulo"
                  required
                />
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || credits < CREDIT_COST}
            className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3 text-base uppercase tracking-wide"
          >
            {loading ? (
              <>
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                Calculando...
              </>
            ) : credits < CREDIT_COST ? (
              <>
                <span>🔒</span>
                Créditos Insuficientes
              </>
            ) : (
              <>
                <span className="text-xl">✨</span>
                Calcular Mapa ({CREDIT_COST} créditos)
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BirthChartProfessional;
