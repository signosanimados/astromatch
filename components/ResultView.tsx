
import React, { useEffect, useState } from 'react';
import { CompatibilityResult, SignData } from '../types';
import { APP_LOGO, PORTUGUESE_NAMES, DEFAULT_BACKGROUND, BACKGROUND_URLS } from '../constants';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface ResultViewProps {
  result: CompatibilityResult;
  signA: SignData;
  signB: SignData;
  mode: 'love' | 'friendship';
  onReset: () => void;
  userEmail?: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, signA, signB, mode, onReset, userEmail }) => {
  const [animatedPercent, setAnimatedPercent] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [bgImage, setBgImage] = useState<string>(DEFAULT_BACKGROUND);

  useEffect(() => {
    // Determine dynamic background image
    const determineBackgroundImage = () => {
      // 1. Sort signs alphabetically by the MAPPED NAME to ensure consistency 
      const sortedSigns = [signA, signB].sort((a, b) => {
        const nameA = PORTUGUESE_NAMES[a.id];
        const nameB = PORTUGUESE_NAMES[b.id];
        return nameA.localeCompare(nameB);
      });

      const name1 = PORTUGUESE_NAMES[sortedSigns[0].id];
      const name2 = PORTUGUESE_NAMES[sortedSigns[1].id];

      // Key format: ARIESxTOURO
      const key = `${name1}x${name2}`;
      
      // Look up URL in map, fallback to default if not found
      return BACKGROUND_URLS[key] || DEFAULT_BACKGROUND;
    };

    setBgImage(determineBackgroundImage());

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
  }, [result.compatibilidade, signA, signB]);

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
          backgroundColor: null, // Transparent to let background image show
          scale: 1, // 1080x1920 is already high res
          logging: false,
          useCORS: true, // Crucial for loading local images and Drive/Imgur images
          allowTaint: true,
          width: 1080,
          height: 1920,
          windowWidth: 1080, // FORCE WIDTH to 1080px
          windowHeight: 1920,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0
        });
        
        const link = document.createElement('a');
        link.download = `SignosCombinados-${signA.name}-${signB.name}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        if (userEmail) {
             // Placeholder for analytics
        }
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

  // Determine if we need to flip the background image
  // Name Lookup
  const nameA = PORTUGUESE_NAMES[signA.id]; // First Selected Sign
  const nameB = PORTUGUESE_NAMES[signB.id]; // Second Selected Sign
  
  // Check if the selection order is Alphabetical (A before B)
  const isAlphabeticalSelection = nameA.localeCompare(nameB) < 0;

  // Identify Exceptions (Pairs where behavior must be INVERTED)
  const isAquariusPisces = (signA.id === 'aquarius' && signB.id === 'pisces') || (signA.id === 'pisces' && signB.id === 'aquarius');
  const isAriesLeo = (signA.id === 'aries' && signB.id === 'leo') || (signA.id === 'leo' && signB.id === 'aries');
  const isExceptionPair = isAquariusPisces || isAriesLeo;

  // Apply Logic
  // STANDARD RULE: Flip if selection is NOT alphabetical (Reverse order)
  // EXCEPTION RULE: Flip if selection IS alphabetical (Invert logic)
  
  let shouldFlipBackground;

  if (isExceptionPair) {
     shouldFlipBackground = isAlphabeticalSelection;
  } else {
     shouldFlipBackground = !isAlphabeticalSelection;
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in-up">
      
      {/* Top Branding (Web View) & Download Button */}
      <div className="flex flex-col items-center gap-4">
        <a 
          href="https://www.tiktok.com/@signosanimadosoficial?is_from_webapp=1&sender_device=pc"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
        >
           <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
           TikTok: @signosanimadosoficial
        </a>

        <button 
          onClick={handleDownloadCard}
          disabled={isGenerating}
          className="px-6 py-2 bg-indigo-600 text-white text-xs font-bold rounded-full hover:bg-indigo-500 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
          ) : (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          )}
          {isGenerating ? 'Gerando...' : 'Baixar Imagem'}
        </button>
      </div>

      {/* Header Result Section (Web View) */}
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

        {/* Summary Text (Web View) */}
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
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
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

      {/* Details Grid (Web View) */}
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
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v-1h9l-7-8h7z" /></svg>
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
      </div>

      {/* HIDDEN SHARE CARD (1080x1920) */}
      <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <div 
          id="share-card" 
          className="flex flex-col items-center p-0 relative"
          style={{
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: -50,
              width: '1080px',
              height: '1920px',
              minWidth: '1080px',
              minHeight: '1920px',
              boxSizing: 'border-box',
              fontFamily: 'sans-serif',
              backgroundColor: '#000'
          }}
        >
            {/* LAYER 1: Background Image & Overlay */}
            <div className="absolute inset-0 z-0">
               <img 
                 src={bgImage} 
                 crossOrigin="anonymous" 
                 style={{ 
                   width: '100%', 
                   height: '100%', 
                   objectFit: 'cover',
                   // Apply Flip Logic:
                   // Default: Flip if selection is reverse alphabetical
                   // Exceptions: Invert that logic (Flip if selection is alphabetical)
                   transform: shouldFlipBackground ? 'scaleX(-1)' : 'none'
                 }}
                 onError={(e) => {
                   // Fallback if specific combo image is missing
                   e.currentTarget.src = DEFAULT_BACKGROUND;
                 }}
               />
               <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* LAYER 2: Content (Sits on top of Layer 1) */}
            <div className="relative z-10 w-full h-full flex flex-col items-center">

                {/* Header / Logo Section */}
                <div className="flex flex-col items-center gap-4 mt-20 z-10 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                    {/* Increased Logo Size */}
                    <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-[0_0_50px_rgba(99,102,241,0.5)] border-4 border-white/20">
                        <img src={APP_LOGO} crossOrigin="anonymous" className="w-full h-full object-cover rounded-full" onError={(e) => {e.currentTarget.style.display='none'; e.currentTarget.parentElement!.innerText='AM'}}/>
                    </div>
                    {/* Cleaned up TikTok Text (No Box) */}
                    <h1 className="text-3xl font-bold tracking-[0.1em] text-white font-mono uppercase mt-6 drop-shadow-md">
                        TikTok: @signosanimadosoficial
                    </h1>
                </div>

                {/* Main Content Container (Pushed down) */}
                <div 
                  className="flex-1 flex flex-col justify-center items-center w-full z-10 mt-10"
                  style={{
                    filter: 'drop-shadow(0px 0px 10px rgba(0,0,0,0.5))'
                  }}
                >
                    {/* Horizontal Layout: Sign A - Score - Sign B */}
                    <div className="flex flex-row items-center justify-center gap-2 w-full px-8">
                        
                        {/* Sign A */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-64 h-64 flex items-center justify-center">
                              <img src={signA.icon} alt={signA.name} className="w-64 h-64 object-cover rounded-full drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white/10" crossOrigin="anonymous" />
                            </div>
                            <span className="text-3xl font-bold text-white uppercase tracking-wide text-center text-shadow-lg whitespace-nowrap">{signA.name}</span>
                        </div>

                        {/* Center Score Block (Just Percentage now) */}
                        <div className="flex flex-col items-center justify-center mx-2 gap-4">
                            {/* Percentage Number - HUGE */}
                            <div className="flex items-baseline">
                                 <span className={`text-[9rem] leading-none font-bold font-mono ${getScoreColor(result.compatibilidade)} drop-shadow-[0_0_30px_rgba(0,0,0,0.8)]`}>
                                    {result.compatibilidade}
                                 </span>
                                 <span className={`text-6xl font-bold ${getScoreColor(result.compatibilidade)}`}>%</span>
                            </div>
                        </div>

                        {/* Sign B */}
                        <div className="flex flex-col items-center gap-6">
                            <div className="w-64 h-64 flex items-center justify-center">
                              <img src={signB.icon} alt={signB.name} className="w-64 h-64 object-cover rounded-full drop-shadow-[0_0_40px_rgba(255,255,255,0.4)] border-4 border-white/10" crossOrigin="anonymous" />
                            </div>
                            <span className="text-3xl font-bold text-white uppercase tracking-wide text-center text-shadow-lg whitespace-nowrap">{signB.name}</span>
                        </div>
                    </div>

                    {/* Summary Snippet with Mode Title Above */}
                    <div className="mt-16 px-20 w-full flex flex-col items-center gap-6">
                       
                       {/* Mode Label - Text Only, No Box */}
                       <span className={`text-4xl font-bold uppercase tracking-[0.2em] drop-shadow-md ${
                              mode === 'love' 
                                ? 'text-pink-300' 
                                : 'text-cyan-300'
                            }`}>
                               {mode === 'love' ? 'AMOR' : 'AMIZADE'}
                       </span>

                       <p className="text-5xl text-white leading-tight font-light italic text-center drop-shadow-[0_4px_8px_rgba(0,0,0,1)]" style={{ textShadow: '0px 2px 10px rgba(0,0,0,0.8)' }}>
                          "{result.resumo}"
                       </p>
                    </div>

                </div>
                
                {/* Bottom Spacer */}
                <div className="h-20"></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
