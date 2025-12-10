import React, { useState } from 'react';
import { generateBirthChart } from '../services/geminiService';

interface BirthChartProps {
  onBack: () => void;
  credits: number | null;
  onDeductCredits: (amount: number) => Promise<boolean>;
}

const BirthChart: React.FC<BirthChartProps> = ({ onBack, credits, onDeductCredits }) => {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [city, setCity] = useState('');
  
  const [reading, setReading] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COST = 2; // Cost in credits

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !birthDate || !birthTime || !city) return;

    if (credits !== null && credits < COST) {
      alert(`Você precisa de ${COST} créditos para gerar o mapa. Saldo atual: ${credits}`);
      return;
    }

    const confirmed = window.confirm(`Gerar o Mapa Astral custará ${COST} créditos. Deseja continuar?`);
    if (!confirmed) return;

    setLoading(true);
    setError(null);

    // 1. Deduct Credits
    const deducted = await onDeductCredits(COST);
    if (!deducted) {
      setError("Erro ao processar créditos. Tente novamente.");
      setLoading(false);
      return;
    }

    // 2. Call Gemini API
    try {
      const result = await generateBirthChart({
        name,
        date: birthDate,
        time: birthTime,
        city
      });
      setReading(result);
    } catch (err) {
      setError("Não foi possível conectar aos astros agora. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans flex flex-col items-center pt-8 px-4 pb-20 relative">
       {/* Back Button */}
       <div className="absolute top-6 left-6 z-20">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Voltar
          </button>
       </div>

       <div className="w-full max-w-2xl animate-fade-in-up mt-8">
         <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
              Mapa Astral IA
            </h2>
            <p className="text-slate-400 text-sm">
              Nossa inteligência artificial analisa seus dados para revelar suas energias de Sol, Lua e Ascendente (estimado).
            </p>
         </div>

         {!reading ? (
            <div className="glass p-8 rounded-2xl border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Seu Nome</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="Ex: Maria Silva"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Data de Nascimento</label>
                      <input 
                        type="date" 
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Hora (Exata)</label>
                      <input 
                        type="time" 
                        value={birthTime}
                        onChange={e => setBirthTime(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Cidade de Nascimento</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-emerald-500 focus:outline-none"
                      placeholder="Ex: São Paulo, SP"
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-emerald-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                          Interpretando Estrelas...
                        </>
                      ) : (
                        <>Gerar Mapa ({COST} créditos)</>
                      )}
                    </button>
                    {error && <p className="text-red-400 text-xs text-center mt-3">{error}</p>}
                  </div>
              </form>
            </div>
         ) : (
           <div className="animate-fade-in space-y-6">
              <div className="glass p-8 rounded-2xl border border-emerald-500/30 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                 <h3 className="text-2xl font-bold text-emerald-400 mb-6 border-b border-white/10 pb-4">Leitura Astral de {name}</h3>
                 <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed whitespace-pre-line">
                   {reading}
                 </div>
              </div>
              
              <div className="text-center">
                 <button 
                   onClick={() => setReading(null)}
                   className="px-6 py-2 border border-slate-700 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
                 >
                   Fazer outro mapa
                 </button>
              </div>
           </div>
         )}
       </div>
    </div>
  );
};

export default BirthChart;