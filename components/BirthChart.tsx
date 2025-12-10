import React, { useState } from 'react';
import { calculateBirthChart, BirthChartData, BirthChartResult } from '../services/birthChartService';
import { generateBirthChartInterpretation } from '../services/geminiService';
import BirthChartWheel from './BirthChartWheel';

interface BirthChartProps {
  onBack: () => void;
  credits: number | null;
  onDeductCredits: (amount: number) => Promise<boolean>;
}

interface FormData {
  name: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  latitude: number | null;
  longitude: number | null;
  timezone: string;
  knowsExactTime: boolean;
}

const BRAZILIAN_CITIES = [
  { name: 'São Paulo, SP', lat: -23.5505, lng: -46.6333, tz: 'America/Sao_Paulo' },
  { name: 'Rio de Janeiro, RJ', lat: -22.9068, lng: -43.1729, tz: 'America/Sao_Paulo' },
  { name: 'Brasília, DF', lat: -15.7942, lng: -47.8822, tz: 'America/Sao_Paulo' },
  { name: 'Salvador, BA', lat: -12.9714, lng: -38.5014, tz: 'America/Bahia' },
  { name: 'Fortaleza, CE', lat: -3.7172, lng: -38.5433, tz: 'America/Fortaleza' },
  { name: 'Belo Horizonte, MG', lat: -19.9167, lng: -43.9345, tz: 'America/Sao_Paulo' },
  { name: 'Manaus, AM', lat: -3.1190, lng: -60.0217, tz: 'America/Manaus' },
  { name: 'Curitiba, PR', lat: -25.4290, lng: -49.2671, tz: 'America/Sao_Paulo' },
  { name: 'Recife, PE', lat: -8.0476, lng: -34.8770, tz: 'America/Recife' },
  { name: 'Porto Alegre, RS', lat: -30.0346, lng: -51.2177, tz: 'America/Sao_Paulo' },
  { name: 'Belém, PA', lat: -1.4558, lng: -48.4902, tz: 'America/Belem' },
  { name: 'Goiânia, GO', lat: -16.6869, lng: -49.2648, tz: 'America/Sao_Paulo' },
  { name: 'Guarulhos, SP', lat: -23.4543, lng: -46.5337, tz: 'America/Sao_Paulo' },
  { name: 'Campinas, SP', lat: -22.9099, lng: -47.0626, tz: 'America/Sao_Paulo' },
  { name: 'São Luís, MA', lat: -2.5297, lng: -44.3028, tz: 'America/Fortaleza' },
  { name: 'Maceió, AL', lat: -9.6658, lng: -35.7353, tz: 'America/Maceio' },
  { name: 'Natal, RN', lat: -5.7945, lng: -35.2110, tz: 'America/Fortaleza' },
  { name: 'Campo Grande, MS', lat: -20.4697, lng: -54.6201, tz: 'America/Campo_Grande' },
  { name: 'Teresina, PI', lat: -5.0892, lng: -42.8019, tz: 'America/Fortaleza' },
  { name: 'João Pessoa, PB', lat: -7.1195, lng: -34.8450, tz: 'America/Fortaleza' },
  { name: 'Florianópolis, SC', lat: -27.5954, lng: -48.5480, tz: 'America/Sao_Paulo' },
  { name: 'Vitória, ES', lat: -20.3155, lng: -40.3128, tz: 'America/Sao_Paulo' },
  { name: 'Cuiabá, MT', lat: -15.6014, lng: -56.0979, tz: 'America/Cuiaba' },
  { name: 'Aracaju, SE', lat: -10.9472, lng: -37.0731, tz: 'America/Maceio' },
];

const BirthChart: React.FC<BirthChartProps> = ({ onBack, credits, onDeductCredits }) => {
  const [step, setStep] = useState<'form' | 'loading' | 'result'>('form');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    birthDate: '',
    birthTime: '12:00',
    birthCity: '',
    latitude: null,
    longitude: null,
    timezone: 'America/Sao_Paulo',
    knowsExactTime: true,
  });
  const [chartResult, setChartResult] = useState<BirthChartResult | null>(null);
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [chartType, setChartType] = useState<'simple' | 'complete'>('simple');
  const [error, setError] = useState<string | null>(null);
  const [filteredCities, setFilteredCities] = useState(BRAZILIAN_CITIES);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const handleCitySearch = (value: string) => {
    setFormData({ ...formData, birthCity: value, latitude: null, longitude: null });
    if (value.length > 1) {
      const filtered = BRAZILIAN_CITIES.filter(city =>
        city.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCityDropdown(true);
    } else {
      setShowCityDropdown(false);
    }
  };

  const selectCity = (city: typeof BRAZILIAN_CITIES[0]) => {
    setFormData({
      ...formData,
      birthCity: city.name,
      latitude: city.lat,
      longitude: city.lng,
      timezone: city.tz,
    });
    setShowCityDropdown(false);
  };

  const handleGenerate = async (type: 'simple' | 'complete') => {
    setError(null);

    // Validação
    if (!formData.birthDate) {
      setError('Por favor, informe a data de nascimento.');
      return;
    }
    if (!formData.latitude || !formData.longitude) {
      setError('Por favor, selecione uma cidade da lista.');
      return;
    }

    // Verificar créditos para versão completa
    if (type === 'complete') {
      if (credits === null || credits < 5) {
        setError('Você precisa de 5 créditos para o mapa completo.');
        return;
      }
    }

    setChartType(type);
    setStep('loading');

    try {
      // Preparar dados para cálculo
      const [year, month, day] = formData.birthDate.split('-').map(Number);
      const [hour, minute] = formData.birthTime.split(':').map(Number);

      const birthData: BirthChartData = {
        year,
        month,
        day,
        hour: formData.knowsExactTime ? hour : 12,
        minute: formData.knowsExactTime ? minute : 0,
        latitude: formData.latitude,
        longitude: formData.longitude,
        timezone: formData.timezone,
      };

      // Calcular mapa
      const result = calculateBirthChart(birthData);
      setChartResult(result);

      // Se for versão completa, deduzir créditos e gerar interpretação com IA
      if (type === 'complete') {
        const success = await onDeductCredits(5);
        if (!success) {
          setError('Erro ao deduzir créditos. Tente novamente.');
          setStep('form');
          return;
        }

        // Gerar interpretação com IA
        const aiInterpretation = await generateBirthChartInterpretation(result, formData.name);
        setInterpretation(aiInterpretation);
      }

      setStep('result');
    } catch (err: any) {
      console.error('Erro ao gerar mapa:', err);
      setError(err.message || 'Erro ao gerar mapa astral.');
      setStep('form');
    }
  };

  // Tela de Loading
  if (step === 'loading') {
    return (
      <div className="min-h-screen bg-[#050510] text-white flex flex-col items-center justify-center">
        <div className="relative">
          {/* Animated zodiac wheel */}
          <div className="w-32 h-32 rounded-full border-4 border-amber-500/30 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-3 h-3 bg-amber-500 rounded-full"></div>
          </div>
          <div className="absolute inset-4 rounded-full border-2 border-orange-500/30 animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 w-2 h-2 bg-orange-500 rounded-full"></div>
          </div>
          <div className="absolute inset-8 rounded-full border border-yellow-500/30 animate-spin" style={{ animationDuration: '4s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5 w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
          </div>
        </div>
        <p className="mt-8 text-amber-400 animate-pulse">Calculando posições planetárias...</p>
        <p className="mt-2 text-slate-500 text-sm">
          {chartType === 'complete' ? 'Gerando interpretação com IA...' : 'Isso pode levar alguns segundos'}
        </p>
      </div>
    );
  }

  // Tela de Resultado
  if (step === 'result' && chartResult) {
    return (
      <div className="min-h-screen bg-[#050510] text-white">
        {/* Header */}
        <header className="sticky top-0 z-20 p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <button
              onClick={() => { setStep('form'); setChartResult(null); setInterpretation(null); }}
              className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </button>
            <h1 className="text-lg font-bold text-amber-400">
              {chartType === 'complete' ? 'Mapa Astral Completo' : 'Mapa Astral Simples'}
            </h1>
            <div className="w-20"></div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto p-4 space-y-6">
          {/* Nome do usuário */}
          {formData.name && (
            <div className="text-center py-4">
              <h2 className="text-2xl font-bold text-white">{formData.name}</h2>
              <p className="text-slate-400 text-sm">
                {formData.birthDate.split('-').reverse().join('/')} às {formData.birthTime} • {formData.birthCity}
              </p>
            </div>
          )}

          {/* Mapa Visual */}
          <div className="bg-slate-900/50 rounded-2xl p-4 border border-slate-700/50">
            <BirthChartWheel chart={chartResult} />
          </div>

          {/* Resumo dos Signos */}
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Seus Signos Principais</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl mb-2">{getSignEmoji(chartResult.planets.find(p => p.name === 'Sol')?.sign || '')}</div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Sol</p>
                <p className="text-white font-bold">{chartResult.planets.find(p => p.name === 'Sol')?.sign}</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl mb-2">{getSignEmoji(chartResult.planets.find(p => p.name === 'Lua')?.sign || '')}</div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Lua</p>
                <p className="text-white font-bold">{chartResult.planets.find(p => p.name === 'Lua')?.sign}</p>
              </div>
              <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                <div className="text-3xl mb-2">{getSignEmoji(chartResult.ascendant.sign)}</div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Ascendente</p>
                <p className="text-white font-bold">{chartResult.ascendant.sign}</p>
              </div>
            </div>
          </div>

          {/* Lista de Planetas */}
          <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-amber-400 mb-4">Posições Planetárias</h3>
            <div className="space-y-3">
              {chartResult.planets.map((planet) => (
                <div key={planet.name} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getPlanetEmoji(planet.name)}</span>
                    <span className="text-white">{planet.name}</span>
                    {planet.retrograde && <span className="text-xs text-red-400">℞</span>}
                  </div>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold">{planet.sign}</span>
                    <span className="text-slate-500 text-sm ml-2">{planet.degree.toFixed(1)}°</span>
                    <span className="text-slate-600 text-xs ml-2">Casa {planet.house}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interpretação IA (apenas versão completa) */}
          {chartType === 'complete' && interpretation && (
            <div className="bg-gradient-to-br from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-500/30">
              <h3 className="text-lg font-bold text-amber-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Interpretação Personalizada
              </h3>
              <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                {interpretation}
              </div>
            </div>
          )}

          {/* CTA para versão completa (se for simples) */}
          {chartType === 'simple' && (
            <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-6 border border-amber-500/30 text-center">
              <h3 className="text-lg font-bold text-white mb-2">Quer uma análise mais profunda?</h3>
              <p className="text-slate-400 text-sm mb-4">
                O Mapa Astral Completo inclui interpretação personalizada por IA, análise de aspectos e PDF para download.
              </p>
              <button
                onClick={() => handleGenerate('complete')}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full hover:opacity-90 transition-opacity"
              >
                Gerar Mapa Completo (5 créditos)
              </button>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Tela de Formulário
  return (
    <div className="min-h-screen bg-[#050510] text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 p-4 border-b border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
          <h1 className="text-lg font-bold">Mapa Astral</h1>
          <div className="w-16"></div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6 space-y-6">
        {/* Intro */}
        <div className="text-center py-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Descubra seu Mapa Astral</h2>
          <p className="text-slate-400">Informe seus dados de nascimento para revelar as posições dos astros no momento em que você nasceu.</p>
        </div>

        {/* Erro */}
        {error && (
          <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* Formulário */}
        <div className="space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Seu nome (opcional)</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Como quer ser chamado?"
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Data de Nascimento */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Data de nascimento *</label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Hora de Nascimento */}
          <div>
            <label className="block text-sm text-slate-400 mb-2">Hora de nascimento</label>
            <div className="flex items-center gap-4">
              <input
                type="time"
                value={formData.birthTime}
                onChange={(e) => setFormData({ ...formData, birthTime: e.target.value })}
                disabled={!formData.knowsExactTime}
                className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-500 disabled:opacity-50"
              />
              <label className="flex items-center gap-2 text-sm text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!formData.knowsExactTime}
                  onChange={(e) => setFormData({ ...formData, knowsExactTime: !e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 text-amber-500 focus:ring-amber-500"
                />
                Não sei a hora
              </label>
            </div>
            {!formData.knowsExactTime && (
              <p className="text-xs text-slate-500 mt-2">
                Sem a hora exata, o Ascendente e as casas podem não ser precisos.
              </p>
            )}
          </div>

          {/* Cidade */}
          <div className="relative">
            <label className="block text-sm text-slate-400 mb-2">Cidade de nascimento *</label>
            <input
              type="text"
              value={formData.birthCity}
              onChange={(e) => handleCitySearch(e.target.value)}
              onFocus={() => formData.birthCity.length > 1 && setShowCityDropdown(true)}
              placeholder="Digite o nome da cidade..."
              className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
            {showCityDropdown && filteredCities.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl max-h-48 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city.name}
                    onClick={() => selectCity(city)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-800 text-white transition-colors first:rounded-t-xl last:rounded-b-xl"
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Opções de Geração */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {/* Mapa Simples */}
          <button
            onClick={() => handleGenerate('simple')}
            className="p-6 bg-slate-900/50 border border-slate-700 rounded-2xl text-left hover:border-emerald-500/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">Gratuito</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mapa Simples</h3>
            <p className="text-slate-400 text-sm">
              Posições planetárias e signos principais. Sem interpretação IA.
            </p>
          </button>

          {/* Mapa Completo */}
          <button
            onClick={() => handleGenerate('complete')}
            className="p-6 bg-gradient-to-br from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl text-left hover:border-amber-500/50 transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">5 créditos</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Mapa Completo</h3>
            <p className="text-slate-400 text-sm">
              Interpretação personalizada por IA + aspectos + PDF para download.
            </p>
          </button>
        </div>
      </main>
    </div>
  );
};

// Helper functions
function getSignEmoji(sign: string): string {
  const emojis: Record<string, string> = {
    'Áries': '♈', 'Touro': '♉', 'Gêmeos': '♊', 'Câncer': '♋',
    'Leão': '♌', 'Virgem': '♍', 'Libra': '♎', 'Escorpião': '♏',
    'Sagitário': '♐', 'Capricórnio': '♑', 'Aquário': '♒', 'Peixes': '♓',
  };
  return emojis[sign] || '⭐';
}

function getPlanetEmoji(planet: string): string {
  const emojis: Record<string, string> = {
    'Sol': '☉', 'Lua': '☽', 'Mercúrio': '☿', 'Vênus': '♀',
    'Marte': '♂', 'Júpiter': '♃', 'Saturno': '♄', 'Urano': '♅',
    'Netuno': '♆', 'Plutão': '♇',
  };
  return emojis[planet] || '•';
}

export default BirthChart;
