import React, { useState } from 'react';

interface ApiKeyInputProps {
  onSave: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSave }) => {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length > 10) {
      onSave(inputKey.trim());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-fade-in-up px-4">
      <div className="glass max-w-lg w-full p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl"></div>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Configuração Inicial</h2>
          <p className="text-slate-400">
            Para gerar as análises astrológicas, este app precisa se conectar à Inteligência Artificial do Google.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-slate-300 mb-2">
              Cole sua API Key do Google Gemini
            </label>
            <input
              id="apiKey"
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Ex: AIzaSy..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={inputKey.length < 10}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            Acessar Sistema
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500 relative z-10">
          <p>Sua chave é salva apenas no seu navegador.</p>
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline mt-2 inline-block"
          >
            Obter uma chave gratuita aqui
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyInput;