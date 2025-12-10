import React, { useState } from 'react';
import { SIGNS } from '../constants';
import { SignData } from '../types';

interface SignFinderProps {
  onBack: () => void;
  onGoToCombinations: (sign: SignData) => void;
}

const SignFinder: React.FC<SignFinderProps> = ({ onBack, onGoToCombinations }) => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [foundSign, setFoundSign] = useState<SignData | null>(null);

  const months = [
    { value: '1', label: 'Janeiro' },
    { value: '2', label: 'Fevereiro' },
    { value: '3', label: 'Março' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Maio' },
    { value: '6', label: 'Junho' },
    { value: '7', label: 'Julho' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Setembro' },
    { value: '10', label: 'Outubro' },
    { value: '11', label: 'Novembro' },
    { value: '12', label: 'Dezembro' }
  ];

  const handleFindSign = () => {
    if (!day || !month) return;
    const d = parseInt(day);
    const m = parseInt(month);

    let signId = '';

    if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) signId = 'aries';
    else if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) signId = 'taurus';
    else if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) signId = 'gemini';
    else if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) signId = 'cancer';
    else if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) signId = 'leo';
    else if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) signId = 'virgo';
    else if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) signId = 'libra';
    else if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) signId = 'scorpio';
    else if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) signId = 'sagittarius';
    else if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) signId = 'capricorn';
    else if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) signId = 'aquarius';
    else if ((m === 2 && d >= 19) || (m === 3 && d <= 20)) signId = 'pisces';

    const sign = SIGNS.find(s => s.id === signId);
    if (sign) {
      setFoundSign(sign);
    }
  };

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 font-sans flex flex-col items-center pt-12 px-4 relative">
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

       <div className="max-w-md w-full animate-fade-in-up">
         <h2 className="text-3xl font-bold text-white text-center mb-2">Qual é meu Signo?</h2>
         <p className="text-slate-400 text-center mb-8 text-sm">Insira sua data de nascimento para descobrir.</p>

         <div className="glass p-8 rounded-2xl border border-white/10">
            <div className="flex gap-4 mb-6">
               <div className="flex-1">
                 <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Dia</label>
                 <input 
                   type="number" 
                   min="1" 
                   max="31" 
                   placeholder="DD"
                   value={day}
                   onChange={(e) => setDay(e.target.value)}
                   className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white text-center focus:border-indigo-500 focus:outline-none"
                 />
               </div>
               <div className="flex-[2]">
                 <label className="block text-xs uppercase font-bold text-slate-500 mb-2">Mês</label>
                 <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none appearance-none"
                 >
                    <option value="" disabled>Selecione</option>
                    {months.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                 </select>
               </div>
            </div>

            <button 
              onClick={handleFindSign}
              disabled={!day || !month}
              className="w-full py-3 bg-indigo-600 text-white font-bold uppercase tracking-widest rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Descobrir
            </button>
         </div>

         {foundSign && (
           <div className="mt-8 glass p-8 rounded-2xl border border-white/20 flex flex-col items-center animate-fade-in text-center relative overflow-hidden">
              <div className={`absolute inset-0 bg-gradient-to-t ${foundSign.gradient} opacity-20`}></div>
              
              <img src={foundSign.icon} alt={foundSign.name} className="w-32 h-32 object-contain drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-4 relative z-10" />
              
              <h3 className="text-3xl font-bold text-white mb-1 relative z-10">{foundSign.name}</h3>
              <p className="text-indigo-300 font-mono text-sm mb-6 relative z-10">{foundSign.date}</p>
              
              <button 
                onClick={() => onGoToCombinations(foundSign)}
                className="px-6 py-2 bg-white text-indigo-900 font-bold rounded-full hover:bg-slate-200 transition-colors shadow-lg relative z-10"
              >
                Ver Combinações
              </button>
           </div>
         )}
       </div>
    </div>
  );
};

export default SignFinder;