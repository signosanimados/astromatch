import React from 'react';
import { APP_LOGO } from '../constants';

interface HomeScreenProps {
  onSelectCombinations: () => void;
  onSelectSignFinder: () => void;
  onSelectBirthChart: () => void;
  onLogout: () => void;
  userEmail?: string;
  credits: number | null;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ 
  onSelectCombinations, 
  onSelectSignFinder, 
  onSelectBirthChart, 
  onLogout,
  userEmail,
  credits
}) => {
  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans relative overflow-x-hidden flex flex-col">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none"></div>

      <header className="container mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <img src={APP_LOGO} alt="Logo" className="w-10 h-10 object-contain" crossOrigin="anonymous"/>
          <span className="text-xl font-bold tracking-widest uppercase text-white hidden md:block">Signos Combinados</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Logado como</div>
            <div className="text-xs text-slate-300">{userEmail}</div>
          </div>
          <button 
            onClick={onLogout}
            className="p-2 bg-slate-800 rounded-full hover:bg-slate-700 transition-colors"
          >
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-6 flex flex-col items-center justify-center relative z-10 py-10">
        
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 font-mono">
            Portal Astral
          </h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Explore as conexões do universo. Descubra compatibilidades, seu signo solar ou mergulhe em seu mapa astral com nossa IA.
          </p>
          
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-slate-900/50 rounded-full border border-slate-700">
             <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Créditos Disponíveis:</span>
             <span className={`text-lg font-mono font-bold ${credits === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
               {credits ?? '-'}
             </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          
          {/* Card 1: Combinations */}
          <button 
            onClick={onSelectCombinations}
            className="group glass p-8 rounded-2xl border border-white/5 hover:border-indigo-500/50 hover:bg-indigo-900/20 transition-all duration-500 text-left relative overflow-hidden h-64 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
               </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">Combinação de Signos</h3>
              <p className="text-sm text-slate-400">Descubra a compatibilidade no amor e na amizade entre todos os signos do zodíaco.</p>
            </div>
          </button>

          {/* Card 2: Sign Finder */}
          <button 
            onClick={onSelectSignFinder}
            className="group glass p-8 rounded-2xl border border-white/5 hover:border-purple-500/50 hover:bg-purple-900/20 transition-all duration-500 text-left relative overflow-hidden h-64 flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
               </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">Qual meu Signo?</h3>
              <p className="text-sm text-slate-400">Não sabe seu signo? Insira sua data de nascimento e descubra instantaneamente.</p>
            </div>
          </button>

          {/* Card 3: Birth Chart */}
          <button 
            onClick={onSelectBirthChart}
            className="group glass p-8 rounded-2xl border border-white/5 hover:border-emerald-500/50 hover:bg-emerald-900/20 transition-all duration-500 text-left relative overflow-hidden h-64 flex flex-col justify-between"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
               <svg className="w-24 h-24 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
               <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
               </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">Mapa Astral (IA)</h3>
              <p className="text-sm text-slate-400">Uma leitura profunda de Sol, Lua e Ascendente gerada pela nossa Inteligência Artificial.</p>
            </div>
          </button>

        </div>

      </main>

      <footer className="text-center py-6 text-xs text-slate-600">
        © 2024 Signos Combinados. Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default HomeScreen;