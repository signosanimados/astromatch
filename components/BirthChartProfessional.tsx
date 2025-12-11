import React, { useState, useEffect } from 'react';
import { calculateBirthChartApi, geocodeCity, checkApiHealth } from '../services/birthChartApiService';
import { generateBirthChartAnalysis, generatePDF } from '../services/birthChartAnalysisService';
import type { BirthChartResult } from '../shared/birthChartTypes';

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
  const [city, setCity] = useState('São Paulo');
  const [useManualCoords, setUseManualCoords] = useState(false);
  const [latitude, setLatitude] = useState(-23.5505);
  const [longitude, setLongitude] = useState(-46.6333);
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  // Estados da aplicação
  const [loading, setLoading] = useState(false);
  const [generatingAnalysis, setGeneratingAnalysis] = useState(false);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Verificar API ao montar
  useEffect(() => {
    checkApiHealth().then(setApiAvailable);
  }, []);

  // Cidades disponíveis
  const cityCoords: Record<string, { lat: number; lon: number; tz: string }> = {
    'São Paulo': { lat: -23.5505, lon: -46.6333, tz: 'America/Sao_Paulo' },
    'Rio de Janeiro': { lat: -22.9068, lon: -43.1729, tz: 'America/Sao_Paulo' },
    'Brasília': { lat: -15.7939, lon: -47.8828, tz: 'America/Sao_Paulo' },
    'Salvador': { lat: -12.9714, lon: -38.5014, tz: 'America/Bahia' },
    'Fortaleza': { lat: -3.7172, lon: -38.5434, tz: 'America/Fortaleza' },
    'Belo Horizonte': { lat: -19.9167, lon: -43.9345, tz: 'America/Sao_Paulo' },
    'Manaus': { lat: -3.1190, lon: -60.0217, tz: 'America/Manaus' },
    'Curitiba': { lat: -25.4284, lon: -49.2733, tz: 'America/Sao_Paulo' },
    'Recife': { lat: -8.0476, lon: -34.8770, tz: 'America/Recife' },
    'Porto Alegre': { lat: -30.0346, lon: -51.2177, tz: 'America/Sao_Paulo' }
  };

  const handleCityChange = (cityName: string) => {
    setCity(cityName);
    if (!useManualCoords && cityCoords[cityName]) {
      setLatitude(cityCoords[cityName].lat);
      setLongitude(cityCoords[cityName].lon);
      setTimezone(cityCoords[cityName].tz);
    }
  };

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

  // Tela de resultados
  if (result) {
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
              {name || 'Mapa Astral Profissional'}
            </h1>
            <p className="text-slate-400 text-sm">
              {date} às {time} • {city || 'Coordenadas personalizadas'}
            </p>
          </div>

          {/* Ascendente e MC */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="glass p-6 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/20 to-transparent">
              <h3 className="text-xs uppercase text-slate-500 mb-2 tracking-wider">Ascendente</h3>
              <p className="text-3xl font-bold text-purple-400">{result.ascendant.sign}</p>
              <p className="text-sm text-slate-400 font-mono">{result.ascendant.degree.toFixed(2)}°</p>
            </div>
            <div className="glass p-6 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-900/20 to-transparent">
              <h3 className="text-xs uppercase text-slate-500 mb-2 tracking-wider">Meio do Céu (MC)</h3>
              <p className="text-3xl font-bold text-pink-400">{result.midheaven.sign}</p>
              <p className="text-sm text-slate-400 font-mono">{result.midheaven.degree.toFixed(2)}°</p>
            </div>
          </div>

          {/* Planetas */}
          <div className="glass p-6 md:p-8 rounded-2xl border border-white/5 mb-6">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <span className="text-3xl">🪐</span>
              Planetas
            </h2>
            <div className="grid gap-3">
              {result.planets.map((planet, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-900/40 hover:bg-slate-900/60 transition-all border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{planetSymbols[planet.name] || '•'}</span>
                    <div>
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
                </div>
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
            Mapa Astral Profissional
          </h1>
          <p className="text-slate-400 text-base md:text-lg">
            Cálculos precisos com Swiss Ephemeris
          </p>
          <p className="text-purple-400 text-sm mt-2 font-bold">
            💫 {CREDIT_COST} créditos • Você tem {credits} crédito(s)
          </p>
        </div>

        {/* Aviso de API offline */}
        {apiAvailable === false && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-center">
            <p className="text-red-300">⚠️ Serviço temporariamente indisponível</p>
            <p className="text-red-400/70 text-xs mt-1">Aguarde alguns instantes</p>
          </div>
        )}

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
              Cidade
            </label>
            <select
              value={city}
              onChange={(e) => handleCityChange(e.target.value)}
              disabled={useManualCoords}
              className="w-full p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-purple-500/50 transition-all disabled:opacity-50"
            >
              {Object.keys(cityCoords).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
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
            disabled={loading || apiAvailable === false || credits < CREDIT_COST}
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

          <p className="text-center text-xs text-slate-600 pt-2">
            Cálculos profissionais Swiss Ephemeris • Análise com GPT-4 mini • Geração de PDF
          </p>
        </form>
      </div>
    </div>
  );
};

export default BirthChartProfessional;
