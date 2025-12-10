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
    <div className="min-h-screen bg-[#050510] text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/15 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-900/15 blur-[150px] rounded-full"></div>
        <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-pink-900/10 blur-[100px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 flex justify-end items-center">
        <div className="flex items-center gap-3">
          {credits !== null && (
            <div className="px-3 py-1.5 bg-slate-900/80 rounded-full border border-slate-700 flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Créditos</span>
              <span className="text-white font-mono font-bold">{credits}</span>
            </div>
          )}
          <button
            onClick={onLogout}
            className="text-xs text-slate-500 hover:text-white transition-colors border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-8">
        {/* Logo */}
        <div className="mb-8">
          <a
            href="https://www.tiktok.com/@signosanimadosoficial"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 p-1 shadow-[0_0_60px_rgba(99,102,241,0.3)]">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900/50 flex items-center justify-center">
                <img
                  src={APP_LOGO}
                  alt="Signos Animados"
                  className="w-20 h-20 md:w-28 md:h-28 object-contain"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-[0.15em] uppercase text-white">
              Signos Animados
            </h1>
            <p className="text-slate-500 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
              @signosanimadosoficial
            </p>
          </a>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-10">
          <p className="text-slate-400 text-lg">
            O que você quer descobrir hoje?
          </p>
        </div>

        {/* Options */}
        <div className="w-full max-w-md space-y-4">
          {/* Option 1: Combinations */}
          <button
            onClick={onSelectCombinations}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-pink-600/20 to-rose-600/20 border border-pink-500/30 p-6 text-left transition-all hover:scale-[1.02] hover:border-pink-500/50 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/0 to-rose-600/0 group-hover:from-pink-600/10 group-hover:to-rose-600/10 transition-all"></div>

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Signos Combinados</h3>
                <p className="text-slate-400 text-sm">Descubra a compatibilidade entre dois signos</p>
              </div>

              <svg className="w-6 h-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="relative mt-4 flex items-center gap-2">
              <span className="text-[10px] text-pink-400/70 uppercase tracking-wider">Amor & Amizade</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-500">1 crédito por combinação</span>
            </div>
          </button>

          {/* Option 2: Sign Finder */}
          <button
            onClick={onSelectSignFinder}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/30 p-6 text-left transition-all hover:scale-[1.02] hover:border-indigo-500/50 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 group-hover:from-indigo-600/10 group-hover:to-purple-600/10 transition-all"></div>

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Signos Match</h3>
                <p className="text-slate-400 text-sm">Quiz para descobrir qual signo combina mais com a sua personalidade</p>
              </div>

              <svg className="w-6 h-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="relative mt-4 flex items-center gap-2">
              <span className="text-[10px] text-indigo-400/70 uppercase tracking-wider">15 Perguntas</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-emerald-400/70">Gratuito</span>
            </div>
          </button>

          {/* Option 3: Birth Chart */}
          <button
            onClick={onSelectBirthChart}
            className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600/20 to-orange-600/20 border border-amber-500/30 p-6 text-left transition-all hover:scale-[1.02] hover:border-amber-500/50 active:scale-[0.98]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600/0 to-orange-600/0 group-hover:from-amber-600/10 group-hover:to-orange-600/10 transition-all"></div>

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>

              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">Mapa Astral</h3>
                <p className="text-slate-400 text-sm">Gere seu mapa astral completo com interpretação profissional</p>
              </div>

              <svg className="w-6 h-6 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            <div className="relative mt-4 flex items-center gap-2">
              <span className="text-[10px] text-emerald-400/70 uppercase tracking-wider">Simples: Gratuito</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-amber-400/70">Completo: 5 créditos</span>
            </div>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-4 text-center">
        <p className="text-slate-600 text-xs">
          {userEmail && `Conectado como ${userEmail}`}
        </p>
      </footer>
    </div>
  );
};

export default HomeScreen;
