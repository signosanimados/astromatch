import React, { useState } from 'react';
import { SIGNS } from './constants';
import { SignData, CompatibilityResult } from './types';
import SignCard from './components/SignCard';
import ResultView from './components/ResultView';
import { getCompatibility } from './services/geminiService';

const App: React.FC = () => {
  // Removed API Key state
  const [signA, setSignA] = useState<SignData | null>(null);
  const [signB, setSignB] = useState<SignData | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Relationship mode state
  const [relationshipMode, setRelationshipMode] = useState<'love' | 'friendship'>('love');

  const handleSelectSign = (sign: SignData) => {
    if (!signA) {
      setSignA(sign);
    } else if (!signB && sign.id !== signA.id) {
      setSignB(sign);
    } else if (!signB && sign.id === signA.id) {
       setSignB(sign);
    }
  };

  const handleReset = () => {
    setSignA(null);
    setSignB(null);
    setResult(null);
    setError(null);
  };

  const handleCalculate = async () => {
    if (!signA || !signB) return;

    setLoading(true);
    setError(null);
    try {
      // Small artificial delay to simulate calculation/suspense
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const data = await getCompatibility(signA, signB, relationshipMode);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao consultar os astros.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeselectA = () => {
    setSignA(null);
    setSignB(null);
  };

  const handleDeselectB = () => {
    setSignB(null);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 pb-32 md:pb-20 font-sans relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-[20%] right-[20%] w-[20%] h-[20%] bg-cyan-900/5 blur-[80px] rounded-full"></div>
      </div>

      <main className="container mx-auto px-4 md:px-8 relative z-10 pt-8">
        
        {/* Header / Brand */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
             {/* Logo image if it exists in public folder, otherwise fallback to text/icon */}
             <img 
                src="logo.png" 
                alt="AM" 
                className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }} 
             />
             <div className="hidden w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-[0_0_15px_rgba(99,102,241,0.6)] border border-white/20">
               AM
             </div>
             <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-300">
               AstroMatch
             </h1>
          </div>
        </header>

        {!result && (
          <div className="animate-fade-in max-w-6xl mx-auto flex flex-col items-center">
            
            {/* RELATIONSHIP MODE SELECTOR */}
            <div className="flex flex-col items-center gap-3 mb-8 w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Tipo de Combinação
              </span>
              <div className="flex p-1 bg-slate-900/80 border border-slate-700/50 rounded-full shadow-lg relative">
                 <button 
                    onClick={() => setRelationshipMode('love')}
                    className={`
                      relative z-10 px-8 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 flex items-center gap-2
                      ${relationshipMode === 'love' 
                        ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' 
                        : 'text-slate-400 hover:text-slate-200'}
                    `}
                 >
                    <svg className="w-4 h-4" fill={relationshipMode === 'love' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    AMOR
                 </button>
                 <button 
                    onClick={() => setRelationshipMode('friendship')}
                    className={`
                      relative z-10 px-8 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 flex items-center gap-2
                      ${relationshipMode === 'friendship' 
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                        : 'text-slate-400 hover:text-slate-200'}
                    `}
                 >
                    <svg className="w-4 h-4" fill={relationshipMode === 'friendship' ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    AMIZADE
                 </button>
              </div>
            </div>

            {/* Active Selection Area (Desktop only mostly) */}
            <div className="w-full mb-12 glass rounded-2xl p-6 md:p-10 border border-white/5 relative overflow-hidden hidden md:block">
              <div className="absolute inset-0 bg-white/2 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 
                 {/* Left Side: Slots */}
                 <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center md:justify-start">
                    
                    {/* Slot A */}
                    <div onClick={handleDeselectA} className={`relative w-24 h-32 md:w-28 md:h-40 rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center overflow-hidden group
                      ${signA ? 'border-transparent' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}>
                      {signA ? (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${signA.gradient} opacity-20`}></div>
                          <div className="text-6xl drop-shadow-lg relative z-10">
                            {signA.icon}
                          </div>
                          <div className="absolute bottom-2 text-[10px] uppercase font-bold text-white tracking-widest">{signA.name}</div>
                        </>
                      ) : (
                         <span className="text-2xl text-slate-700 group-hover:text-slate-500 transition-colors">+</span>
                      )}
                    </div>

                    <div className="h-[1px] w-10 bg-slate-800 hidden md:block"></div>

                    {/* Slot B */}
                    <div onClick={handleDeselectB} className={`relative w-24 h-32 md:w-28 md:h-40 rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center overflow-hidden group
                      ${signB ? 'border-transparent' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}>
                      {signB ? (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${signB.gradient} opacity-20`}></div>
                          <div className="text-6xl drop-shadow-lg relative z-10">
                            {signB.icon}
                          </div>
                          <div className="absolute bottom-2 text-[10px] uppercase font-bold text-white tracking-widest">{signB.name}</div>
                        </>
                      ) : (
                         <span className="text-2xl text-slate-700 group-hover:text-slate-500 transition-colors">+</span>
                      )}
                    </div>
                 </div>

                 {/* Right Side: Action */}
                 <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
                    <div className="flex flex-col items-center md:items-end gap-2">
                      <p className="text-sm text-slate-500 mb-2 uppercase tracking-widest">
                        {signA && signB 
                          ? `Sinergia de ${relationshipMode === 'love' ? 'Amor' : 'Amizade'}` 
                          : 'Selecione os signos abaixo'
                        }
                      </p>
                      <button 
                        onClick={handleCalculate}
                        disabled={!signA || !signB || loading}
                        className="w-full md:w-auto px-10 py-4 bg-slate-100 text-slate-900 font-bold tracking-widest text-xs uppercase rounded-sm hover:bg-white transition-all disabled:opacity-20 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      >
                        {loading ? 'Calculando...' : 'Revelar'}
                      </button>
                    </div>
                 </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-500/20 rounded-sm text-red-200 text-center text-sm tracking-wide">
                {error}
              </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full">
              {SIGNS.map((sign) => {
                const isSelected = signA?.id === sign.id || signB?.id === sign.id;
                const isDisabled = !!(signA && signB && !isSelected);
                
                return (
                  <SignCard
                    key={sign.id}
                    sign={sign}
                    isSelected={isSelected}
                    disabled={isDisabled}
                    onClick={() => handleSelectSign(sign)}
                  />
                );
              })}
            </div>

          </div>
        )}

        {/* Result View */}
        {result && signA && signB && (
          <ResultView 
            result={result} 
            signA={signA} 
            signB={signB} 
            mode={relationshipMode}
            onReset={handleReset} 
          />
        )}

      </main>

      {/* MOBILE FLOATING ACTION BAR */}
      {!result && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#050510]/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
           {/* Mini Sign Previews */}
           <div className="flex items-center gap-3 pl-2">
              {/* Sign A Mini */}
              <div onClick={handleDeselectA} className={`w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer transition-all ${signA ? 'bg-gradient-to-t ' + signA.gradient + ' border-white/50' : 'bg-slate-900 border-dashed'}`}>
                 {signA ? <span className="text-xl drop-shadow-md">{signA.icon}</span> : <span className="text-slate-600">+</span>}
              </div>
              
              <span className="text-slate-600 text-xs">+</span>

              {/* Sign B Mini */}
              <div onClick={handleDeselectB} className={`w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer transition-all ${signB ? 'bg-gradient-to-t ' + signB.gradient + ' border-white/50' : 'bg-slate-900 border-dashed'}`}>
                 {signB ? <span className="text-xl drop-shadow-md">{signB.icon}</span> : <span className="text-slate-600">+</span>}
              </div>
           </div>

           {/* Reveal Button */}
           <button 
              onClick={handleCalculate}
              disabled={!signA || !signB || loading}
              className="flex-1 py-3 bg-white text-slate-900 font-bold uppercase tracking-widest text-xs rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-200 transition-colors active:scale-95"
           >
              {loading ? '...' : 'Revelar'}
           </button>
        </div>
      )}

    </div>
  );
};

export default App;