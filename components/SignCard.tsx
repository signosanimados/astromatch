import React from 'react';
import { SignData, ElementType } from '../types';
import { ElementIcons } from '../constants';

interface SignCardProps {
  sign: SignData;
  isSelected: boolean;
  onClick: () => void;
  disabled?: boolean;
}

const SignCard: React.FC<SignCardProps> = ({ sign, isSelected, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
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
           No. {sign.id.substring(0,3).toUpperCase()}
         </span>
         <div className={`p-1 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800/50 text-slate-500'}`}>
            {ElementIcons[sign.element]}
          </div>
      </div>

      {/* Main Icon (Emoji) */}
      <div className={`transition-all duration-500 text-6xl leading-none ${isSelected ? 'scale-125 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.6)]' : `${sign.color} group-hover:scale-125 group-hover:text-white`}`}>
        {sign.icon}
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
};

export default SignCard;