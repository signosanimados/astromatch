import React, { useEffect, useState } from 'react';
import { CompatibilityResult, SignData } from '../types';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResultViewProps {
  result: CompatibilityResult;
  signA: SignData;
  signB: SignData;
  mode: 'love' | 'friendship';
  onReset: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ result, signA, signB, mode, onReset }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Animate percentage
    let start = 0;
    const end = result.compatibilidade;
    const duration = 1500;
    const increment = end / (duration / 16); // 60fps

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedPercent(end);
        clearInterval(timer);
      } else {
        setAnimatedPercent(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [result.compatibilidade]);

  const chartData = [
    { name: 'Match', value: animatedPercent },
    { name: 'Gap', value: 100 - animatedPercent }
  ];

  // Determine color based on percentage
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const scoreColorHex = (score: number) => {
    if (score >= 80) return '#34d399'; // Emerald 400
    if (score >= 50) return '#facc15'; // Yellow 400
    return '#f87171'; // Red 400
  };

  const handleDownloadCard = async () => {
    setIsGenerating(true);
    const element = document.getElementById('share-card');
    
    // Safety check for library availability
    const html2canvas = (window as any).html2canvas;

    if (element && html2canvas) {
      try {
        // Wait for fonts and layout to settle
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
          backgroundColor: '#050510',
          scale: 1, // 1080x1920 is already high res, no need to scale up
          logging: false,
          useCORS: true, // Crucial for loading local images
          allowTaint: true,
          width: 1080,
          height: 1920,
          windowWidth: 1080, // FORCE WIDTH to 1080px so layout logic works perfectly
          windowHeight: 1920,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });
        
        const link = document.createElement('a');
        link.download = `AstroMatch-${signA.name}-${signB.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (error) {
        console.error("Erro ao gerar card:", error);
        alert("Não foi possível gerar a imagem. Verifique se o bloqueador de pop-ups está ativo.");
      } finally {
        setIsGenerating(false);
      }
    } else {
      setIsGenerating(false);
      console.error("Biblioteca html2canvas não encontrada.");
      alert("Erro interno: Biblioteca gráfica não carregada.");
    }
  };

  const tipsTitle = mode === 'love' ? 'Dicas para o Casal' : 'Dicas para a Amizade';

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      {/* Header Result Section */}
      <div className="glass rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 z-0" />
        
        {/* Chart */}
        <div className="relative z-10 flex-shrink-0 w-48 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                stroke="none"
              >
                <Cell fill={scoreColorHex(result.compatibilidade)} />
                <Cell fill="#334155" /> 
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold font-mono ${getScoreColor(result.compatibilidade)}`}>
              {animatedPercent}%
            </span>
            <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Match</span>
          </div>
        </div>

        {/* Summary Text */}
        <div className="z-10 flex-1 text-center md:text-left flex flex-col items-center md:items-start">
          
          {/* Mode Indicator Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-4 border ${
            mode === 'love' 
              ? 'bg-pink-500/10 border-pink-500/30 text-pink-300' 
              : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
          }`}>
            {mode === 'love' ? (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                <span>Compatibilidade Amorosa</span>
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
                <span>Compatibilidade de Amizade</span>
              </>
            )}
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
             <div className={`text-sm font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 ${signA.color}`}>
               {signA.name}
             </div>
             <span className="text-slate-500">+</span>
             <div className={`text-sm font-bold px-3 py-1 rounded-full bg-slate-800 border border-slate-700 ${signB.color}`}>
               {signB.name}
             </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Resumo Astral</h2>
          <p className="text-slate-300 leading-relaxed text-lg">
            {result.resumo}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pros */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-emerald-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </span>
            O que Combina
          </h3>
          <ul className="space-y-3">
            {result.combina.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-red-500">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-red-500/20 text-red-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </span>
            Desafios
          </h3>
          <ul className="space-y-3">
            {result.nao_combina.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tips */}
        <div className="glass rounded-2xl p-6 border-l-4 border-l-indigo-500 md:col-span-2">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="bg-indigo-500/20 text-indigo-400 p-1.5 rounded-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </span>
            {tipsTitle}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {result.dicas.map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4 text-slate-300 text-sm border border-slate-700/50">
                "{item}"
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 pb-4">
        <button 
          onClick={onReset}
          className="px-8 py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          Nova Combinação
        </button>

        <button 
          onClick={handleDownloadCard}
          disabled={isGenerating}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {isGenerating ? 'Gerando...' : 'Baixar Stories'}
        </button>
      </div>

      {/* HIDDEN SHARE CARD (1080x1920) */}
      {/* 
         SOLUTION FOR VISIBILITY & ALIGNMENT:
         Wrap the actual card in a container with width:0, height:0 and overflow:hidden.
         This effectively hides it from the UI flow without removing it from DOM (which would break html2canvas).
         The internal card keeps fixed dimensions.
      */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <div 
          id="share-card" 
          className="flex flex-col items-center justify-between p-20 text-center bg-[#050510]"
          style={{
              width: '1080px',
              height: '1920px',
              minWidth: '1080px',
              minHeight: '1920px',
              background: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #050510 60%)',
              boxSizing: 'border-box'
          }}
        >
            {/* Header */}
            <div className="flex flex-col items-center gap-4 mt-20">
                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_50px_rgba(99,102,241,0.5)] border-2 border-white/20">
                    <img src="/logo.png" className="w-full h-full object-cover rounded-full" onError={(e) => {e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerText='AM'}}/>
                </div>
                <h1 className="text-5xl font-bold tracking-[0.3em] uppercase text-white font-mono">
                    AstroMatch
                </h1>
                <div className="h-1 w-40 bg-white/20 mt-4"></div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col justify-center items-center gap-16 w-full">
                
                {/* Signs Row */}
                <div className="flex flex-row items-center justify-center gap-12 w-full">
                    {/* Sign A */}
                    <div className="flex flex-col items-center gap-6">
                        <div className={`w-64 h-80 rounded-3xl border-4 border-white/20 bg-gradient-to-t ${signA.gradient} flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.1)]`}>
                          <span className="text-[10rem] leading-none text-white drop-shadow-2xl">
                            {signA.icon}
                          </span>
                        </div>
                        <span className="text-5xl font-bold text-white uppercase tracking-widest">{signA.name}</span>
                    </div>

                    <span className="text-8xl text-white/50 font-light">+</span>

                    {/* Sign B */}
                    <div className="flex flex-col items-center gap-6">
                        <div className={`w-64 h-80 rounded-3xl border-4 border-white/20 bg-gradient-to-t ${signB.gradient} flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.1)]`}>
                          <span className="text-[10rem] leading-none text-white drop-shadow-2xl">
                            {signB.icon}
                          </span>
                        </div>
                        <span className="text-5xl font-bold text-white uppercase tracking-widest">{signB.name}</span>
                    </div>
                </div>

                {/* Compatibility Score */}
                <div className="flex flex-col items-center gap-4 mt-12 bg-white/5 p-12 rounded-[3rem] border border-white/10 backdrop-blur-xl w-full max-w-2xl">
                    {/* Mode Label in Card */}
                    <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-2xl font-bold uppercase tracking-widest mb-2 border ${
                      mode === 'love' 
                        ? 'bg-pink-500/20 border-pink-500/40 text-pink-300' 
                        : 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                    }`}>
                       {mode === 'love' ? 'AMOR' : 'AMIZADE'}
                    </div>

                    <span className={`text-[12rem] leading-none font-bold font-mono ${getScoreColor(result.compatibilidade)} drop-shadow-[0_0_30px_rgba(255,255,255,0.3)]`}>
                        {result.compatibilidade}%
                    </span>
                    
                    {/* Progress Bar Visual */}
                    <div className="w-full h-4 bg-slate-800 rounded-full mt-4 overflow-hidden relative">
                        <div 
                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 absolute left-0 top-0"
                            style={{ width: `${result.compatibilidade}%` }}
                        ></div>
                    </div>
                </div>

                {/* Summary Snippet */}
                <p className="text-3xl text-slate-300 leading-normal max-w-3xl px-8 font-light italic">
                    "{result.resumo}"
                </p>

            </div>

            {/* Footer */}
            <div className="mb-20 flex flex-col items-center gap-6 opacity-80">
                <p className="text-2xl text-slate-300 uppercase tracking-widest">
                    Descubra a sua combinação em
                </p>
                <div className="flex items-center gap-3">
                   <span className="text-3xl font-bold text-white">TikTok: @signosanimadosoficial</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;