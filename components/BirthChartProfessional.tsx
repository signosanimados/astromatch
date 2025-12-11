import React, { useState, useEffect } from 'react';
import { calculateBirthChartApi, geocodeCity, checkApiHealth } from '../services/birthChartApiService';
import { generateBirthChartAnalysis, generatePDF } from '../services/birthChartAnalysisService';
import type { BirthChartResult } from '../shared/birthChartTypes';
import { PLANET_MEANINGS, ASCENDANT_MEANING, MIDHEAVEN_MEANING } from '../data/planetMeanings';

interface BirthChartProfessionalProps {
  onBack: () => void;
  userId: string;
  credits: number;
  onCreditsUpdate: (newCredits: number) => void;
}

const CREDIT_COST = 5;

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

  // Estados da aplicação
  const [loading, setLoading] = useState(false);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(true); // Assume available
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [tooltipType, setTooltipType] = useState<'planet' | 'ascendant' | 'midheaven' | null>(null);

  // Verificar API ao montar (não bloqueia o uso)
  useEffect(() => {
    checkApiHealth().then(available => {
      if (!available) {
        console.warn('Backend API may be offline');
      }
      setApiAvailable(available);
    });
  }, []);

  // Buscar coordenadas da cidade via Nominatim (OpenStreetMap)
  const searchCityCoordinates = async (cityName: string) => {
    if (!cityName || cityName.length < 3 || useManualCoords) return;

    try {
      setSearchingCity(true);
      setError(null);

      // Usar Nominatim API (OpenStreetMap) - gratuita e sem necessidade de API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(cityName)}&` +
        `format=json&` +
        `addressdetails=1&` +
        `limit=1`,
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
        const location = data[0];
        setLatitude(parseFloat(location.lat));
        setLongitude(parseFloat(location.lon));

        // Determinar timezone baseado na latitude/longitude (simplificado para Brasil)
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        // Timezones principais do Brasil
        if (lat >= -33 && lat <= 5 && lon >= -75 && lon <= -30) {
          if (lon >= -52) setTimezone('America/Sao_Paulo');
          else if (lon >= -60) setTimezone('America/Manaus');
          else if (lon >= -70) setTimezone('America/Rio_Branco');
          else setTimezone('America/Sao_Paulo');
        } else {
          setTimezone('America/Sao_Paulo'); // Default
        }
      } else {
        console.warn('Cidade não encontrada, usando coordenadas padrão');
      }
    } catch (err) {
      console.error('Erro ao buscar coordenadas:', err);
    } finally {
      setSearchingCity(false);
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
      onCreditsUpdate(newCredits);

    } catch (err: any) {
      setError(err.message || 'Erro ao calcular mapa astral');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    if (!result) return;

    setGeneratingAnalysis(true);
    setError(null);

    try {
      const analysisText = await generateBirthChartAnalysis(result, name);
      setAnalysis(analysisText);
    } catch (err: any) {
      setError(err.message || 'Erro ao gerar análise');
    } finally {
      setGeneratingAnalysis(false);
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
                  <p className="text-xs text-slate-500">Elemento {sunData.element}</p>
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
            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>🌟</span> Elementos
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-red-400">🔥 Fogo</span>
                  <span className="font-mono font-bold">{result.elements.fire}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-green-400">🌍 Terra</span>
                  <span className="font-mono font-bold">{result.elements.earth}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-blue-400">💨 Ar</span>
                  <span className="font-mono font-bold">{result.elements.air}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-cyan-400">💧 Água</span>
                  <span className="font-mono font-bold">{result.elements.water}</span>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-2xl border border-white/5">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <span>⚡</span> Modalidades
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-pink-400">Cardinal</span>
                  <span className="font-mono font-bold">{result.modalities.cardinal}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-amber-400">Fixo</span>
                  <span className="font-mono font-bold">{result.modalities.fixed}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-900/30 rounded-lg">
                  <span className="text-indigo-400">Mutável</span>
                  <span className="font-mono font-bold">{result.modalities.mutable}</span>
                </div>
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

          {/* Análise com IA */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-purple-500/20 mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <span className="text-3xl">🤖</span>
              Análise Profissional com IA
            </h2>

            {!analysis ? (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-6">
                  Gere uma análise completa e detalhada do seu mapa astral usando Inteligência Artificial.
                </p>
                <button
                  onClick={handleGenerateAnalysis}
                  disabled={generatingAnalysis}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 mx-auto"
                >
                  {generatingAnalysis ? (
                    <>
                      <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      Gerando análise...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">✨</span>
                      Gerar Análise Completa
                    </>
                  )}
                </button>
              </div>
            ) : (
              <>
                <div className="prose prose-invert max-w-none mb-6">
                  <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {analysis}
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
          {(selectedPlanet || tooltipType === 'ascendant' || tooltipType === 'midheaven') && (
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => {
                setSelectedPlanet(null);
                setTooltipType(null);
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
                <button
                  onClick={() => {
                    setSelectedPlanet(null);
                    setTooltipType(null);
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

          <div>
            <label className="text-xs text-slate-400 mb-2 block uppercase tracking-wider font-medium">
              Cidade *
            </label>
            <div className="relative">
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={useManualCoords}
                className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
                placeholder="Ex: São Paulo, Brazil ou Rio de Janeiro, RJ"
                required
              />
              {searchingCity && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="w-5 h-5 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
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
