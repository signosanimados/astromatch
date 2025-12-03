import React from 'react';
import { SignData } from '../types';
import { ElementIcons } from '../constants';

interface SignCardProps {
  sign: SignData;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SignCard: React.FC<SignCardProps> = React.memo(({ sign, isSelected, onClick, disabled }) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      onClick={onClick}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={`Selecionar signo ${sign.name}`}
      className={`
        relative group flex flex-col items-center justify-between p-4 rounded-xl transition-all duration-500 border aspect-[3/4.2] overflow-hidden
        ${isSelected 
          ? `bg-gradient-to-t ${sign.gradient} border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.15)] -translate-y-2 z-10` 
          : 'glass border-white/5 hover:border-white/20 hover:bg-white/5 hover:-translate-y-1'
        }
        ${disabled ? 'opacity-30 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
    >
      {/* Top Decor */}
      <div className="w-full flex justify-between items-start opacity-70">
         <span className={`text-[10px] uppercase tracking-widest ${isSelected ? 'text-white' : 'text-slate-500'}`}>
           {sign.element}
         </span>
         <div className={`p-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800/50 text-slate-500'}`}>
            {ElementIcons[sign.element]}
          </div>
      </div>

      {/* Main Icon (Image) */}
      <div className={`transition-all duration-500 flex items-center justify-center w-full h-full p-2`}>
        <img
          src={sign.icon}
          alt={sign.name}
          className={`w-24 h-24 object-cover rounded-full drop-shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-transform duration-500
            ${isSelected ? 'scale-110 drop-shadow-[0_0_20px_rgba(255,255,255,0.7)]' : 'group-hover:scale-110'}
          `}
          loading="lazy"
          width="96"
          height="96"
        />
      </div>
      
      {/* Bottom Info */}
      <div className="w-full text-center mt-2">
        <h3 className={`text-sm font-bold uppercase tracking-[0.2em] mb-1 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
          {sign.name}
        </h3>
        <div className={`h-[1px] w-8 mx-auto mb-2 ${isSelected ? 'bg-white/50' : 'bg-slate-700'}`}></div>
        <p className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-white/70' : 'text-slate-600'}`}>
          {sign.date}
        </p>
      </div>

      {/* Background Hover Effect */}
      <div className={`absolute inset-0 bg-gradient-to-t ${sign.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none`}></div>
    </button>
  );
});

SignCard.displayName = 'SignCard';

export default SignCard;