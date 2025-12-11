/**
 * Componente de Mapa Astral Preciso
 * ==================================
 *
 * Este componente usa o backend com Swiss Ephemeris para cálculos precisos
 */

import React, { useState, useEffect } from 'react';
import type { BirthChartResult } from '../shared/birthChartTypes';
import {
  calculateBirthChartApi,
  geocodeCity,
  checkApiHealth
} from '../services/birthChartApiService';

interface BirthChartPreciseProps {
  onBack: () => void;
}

const BirthChartPrecise: React.FC<BirthChartPreciseProps> = ({ onBack }) => {
  // Estado do formulário
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState('');
  const [timezone, setTimezone] = useState('America/Sao_Paulo');

  // Estado de coordenadas (podem ser preenchidas automaticamente ou manualmente)
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [manualCoords, setManualCoords] = useState(false);

  // Estado de resultado
  const [result, setResult] = useState<BirthChartResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Status da API
  const [apiOnline, setApiOnline] = useState(false);

  // Verifica se a API está online
  useEffect(() => {
    checkApiHealth().then(setApiOnline);
  }, []);

  // Busca coordenadas quando cidade muda (se não estiver no modo manual)
  const handleCityChange = async (newCity: string) => {
    setCity(newCity);

    if (newCity.length > 3 && !manualCoords) {
      try {
        const coords = await geocodeCity(newCity);
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setTimezone(coords.timezone);
        setError(null);
      } catch (err) {
        // Não mostra erro aqui, só limpa coordenadas
        console.log('Geocoding falhou, usuário pode inserir manualmente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!birthDate || !birthTime) {
      setError('Por favor, preencha data e hora de nascimento');
      return;
    }

    if (latitude === null || longitude === null) {
      setError('Por favor, forneça a localização (cidade ou coordenadas)');
      return;
    }

    if (!apiOnline) {
      setError('API offline. Verifique se o backend está rodando em http://localhost:3001');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Parse date (YYYY-MM-DD format)
      const [yearStr, monthStr, dayStr] = birthDate.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);

      // Parse time (HH:MM format)
      const [hourStr, minuteStr] = birthTime.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      const birthData = {
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
      };

      const chartResult = await calculateBirthChartApi(birthData);
      setResult(chartResult);
    } catch (err: any) {
      setError(err.message || 'Erro ao calcular mapa astral');
    } finally {
      setLoading(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;

    return (
      <div className="space-y-6 animate-fade-in">
        {/* Informações Principais */}
        <div className="glass p-6 rounded-2xl border border-emerald-500/30">
          <h3 className="text-2xl font-bold text-emerald-400 mb-4">
            {name || 'Mapa Astral'}
          </h3>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-500 uppercase text-xs">Ascendente</span>
              <p className="text-white font-semibold">
                {result.ascendant.sign} {result.ascendant.degree.toFixed(2)}°
              </p>
            </div>
            <div>
              <span className="text-slate-500 uppercase text-xs">Meio do Céu</span>
              <p className="text-white font-semibold">
                {result.midheaven.sign} {result.midheaven.degree.toFixed(2)}°
              </p>
            </div>
          </div>
        </div>

        {/* Planetas */}
        <div className="glass p-6 rounded-2xl border border-white/10">
          <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span>🪐</span> Planetas
          </h4>
          <div className="space-y-2">
            {result.planets.map((planet) => (
              <div
                key={planet.name}
                className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-emerald-400 w-20">
                    {planet.name}
                  </span>
                  <span className="text-slate-300">
                    {planet.sign} {planet.degree.toFixed(2)}°
                  </span>
                  {planet.retrograde && (
                    <span className="text-red-400 text-xs">(R)</span>
                  )}
                </div>
                <span className="text-slate-500 text-sm">Casa {planet.house}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Aspectos */}
        {result.aspects.length > 0 && (
          <div className="glass p-6 rounded-2xl border border-white/10">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>⭐</span> Aspectos Principais
            </h4>
            <div className="space-y-2">
              {result.aspects.slice(0, 10).map((aspect, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0"
                >
                  <div>
                    <span className="text-slate-300">
                      {aspect.planet1} {aspect.type} {aspect.planet2}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        aspect.nature === 'harmonic'
                          ? 'bg-green-900/50 text-green-400'
                          : aspect.nature === 'challenging'
                          ? 'bg-red-900/50 text-red-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {aspect.nature === 'harmonic'
                        ? '+'
                        : aspect.nature === 'challenging'
                        ? '−'
                        : '○'}
                    </span>
                    <span className="text-slate-500 text-sm">
                      Orb {aspect.orb}°
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Elementos e Modalidades */}
        <div className="grid grid-cols-2 gap-4">
          {/* Elementos */}
          <div className="glass p-4 rounded-xl border border-white/10">
            <h5 className="text-sm font-bold text-slate-400 uppercase mb-3">
              Elementos
            </h5>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-red-400">🔥 Fogo</span>
                <span className="text-white">{result.elements.fire}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-400">🌍 Terra</span>
                <span className="text-white">{result.elements.earth}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-400">💨 Ar</span>
                <span className="text-white">{result.elements.air}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-cyan-400">💧 Água</span>
                <span className="text-white">{result.elements.water}</span>
              </div>
            </div>
          </div>

          {/* Modalidades */}
          <div className="glass p-4 rounded-xl border border-white/10">
            <h5 className="text-sm font-bold text-slate-400 uppercase mb-3">
              Modalidades
            </h5>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Cardinal</span>
                <span className="text-white">{result.modalities.cardinal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Fixo</span>
                <span className="text-white">{result.modalities.fixed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-300">Mutável</span>
                <span className="text-white">{result.modalities.mutable}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Botão para novo mapa */}
        <div className="text-center pt-4">
          <button
            onClick={() => setResult(null)}
            className="px-6 py-2 border border-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
          >
            Calcular outro mapa
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans flex flex-col items-center pt-8 px-4 pb-20 relative">
      {/* Back Button */}
      <div className="absolute top-6 left-6 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Voltar
        </button>
      </div>

      <div className="w-full max-w-4xl animate-fade-in-up mt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
            <svg
              className="w-8 h-8 text-emerald-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
              />
            </svg>
            Mapa Astral Profissional
          </h2>
          <p className="text-slate-400 text-sm">
            Cálculos precisos com Swiss Ephemeris
          </p>

          {/* API Status */}
          <div className="mt-2">
            {apiOnline ? (
              <span className="text-xs text-green-400">● API Online</span>
            ) : (
              <span className="text-xs text-red-400">
                ● API Offline - Inicie o backend
              </span>
            )}
          </div>
        </div>

        {/* Formulário ou Resultado */}
        {!result ? (
          <div className="glass p-8 rounded-2xl border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                  Nome (opcional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex: Maria Silva"
                />
              </div>

              {/* Data e Hora */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                    Hora Exata *
                  </label>
                  <input
                    type="time"
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Cidade */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                  Cidade de Nascimento
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Ex: São Paulo, SP"
                />
              </div>

              {/* Coordenadas manuais (toggle) */}
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={manualCoords}
                    onChange={(e) => setManualCoords(e.target.checked)}
                    className="rounded"
                  />
                  Inserir coordenadas manualmente
                </label>
              </div>

              {/* Latitude/Longitude (se modo manual) */}
              {manualCoords && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                      Latitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={latitude ?? ''}
                      onChange={(e) => setLatitude(parseFloat(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="-23.5505"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                      Longitude
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={longitude ?? ''}
                      onChange={(e) => setLongitude(parseFloat(e.target.value))}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="-46.6333"
                    />
                  </div>
                </div>
              )}

              {/* Timezone */}
              <div>
                <label className="block text-xs uppercase font-bold text-slate-500 mb-2">
                  Timezone (IANA)
                </label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="America/Sao_Paulo">America/Sao_Paulo (BR)</option>
                  <option value="America/Manaus">America/Manaus</option>
                  <option value="America/Fortaleza">America/Fortaleza</option>
                  <option value="America/Bahia">America/Bahia</option>
                  <option value="America/Recife">America/Recife</option>
                  <option value="Europe/Lisbon">Europe/Lisbon (PT)</option>
                  <option value="Europe/London">Europe/London (UK)</option>
                  <option value="America/New_York">America/New_York (US-East)</option>
                  <option value="America/Los_Angeles">America/Los_Angeles (US-West)</option>
                </select>
              </div>

              {/* Botão Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !apiOnline}
                  className="w-full py-4 bg-emerald-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Calculando...
                    </>
                  ) : (
                    <>Calcular Mapa Preciso</>
                  )}
                </button>
                {error && (
                  <p className="text-red-400 text-xs text-center mt-3">{error}</p>
                )}
              </div>
            </form>
          </div>
        ) : (
          renderResult()
        )}
      </div>
    </div>
  );
};

export default BirthChartPrecise;
