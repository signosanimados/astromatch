import React, { useState, useEffect } from 'react';
import { SIGN_FINDER_QUESTIONS, SIGN_NAMES, SIGN_DESCRIPTIONS, QuestionOption } from '../data/signFinderQuestions';
import { SIGNS } from '../constants';
import { SignData, ElementType } from '../types';

// Backgrounds por signo
const SIGN_BACKGROUNDS: Record<string, string> = {
  aries: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/ARIES_ciimnd.jpg',
  taurus: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/TOURO_es4byb.jpg',
  gemini: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880918/GEMEOS_qe5zpn.jpg',
  cancer: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/CANCER_iz01fk.jpg',
  leo: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880918/LEAO_gv3pyd.jpg',
  virgo: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880918/VIRGEM_ipb9cf.jpg',
  libra: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880918/LIBRA_k4bo7q.jpg',
  scorpio: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/ESCORPIAO_txexaw.jpg',
  sagittarius: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880918/SAGIT%C3%81RIO_aybsvn.jpg',
  capricorn: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/CAPRICORNIO_xlzrzw.jpg',
  aquarius: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880916/AQUARIO_weceya.jpg',
  pisces: 'https://res.cloudinary.com/dwhau3ipe/image/upload/v1764880917/PEIXES_f8m3f9.jpg',
};

interface SignFinderProps {
  onBack: () => void;
  onGoToCombinations: (sign: SignData) => void;
}

const SignFinder: React.FC<SignFinderProps> = ({ onBack, onGoToCombinations }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [resultSign, setResultSign] = useState<SignData | null>(null);
  const [showingResult, setShowingResult] = useState(false);

  const totalQuestions = SIGN_FINDER_QUESTIONS.length;
  const progress = ((currentQuestion) / totalQuestions) * 100;

  // Inicializa scores com todos os signos em 0
  useEffect(() => {
    const initialScores: Record<string, number> = {};
    Object.keys(SIGN_NAMES).forEach(sign => {
      initialScores[sign] = 0;
    });
    setScores(initialScores);
  }, []);

  const handleSelectOption = (option: QuestionOption) => {
    if (isTransitioning) return;

    setSelectedOption(option.id);

    // Atualiza scores
    const newScores = { ...scores };
    option.signos.forEach((signo, index) => {
      // Primeiro signo ganha 3 pontos, segundo 2, terceiro 1
      newScores[signo] = (newScores[signo] || 0) + (3 - index);
    });
    setScores(newScores);

    // Transição para próxima pergunta
    setIsTransitioning(true);
    setTimeout(() => {
      if (currentQuestion < totalQuestions - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedOption(null);
        setIsTransitioning(false);
      } else {
        // Fim do quiz
        calculateResult(newScores);
      }
    }, 400);
  };

  const calculateResult = (finalScores: Record<string, number>) => {
    // Encontra o signo com maior pontuação
    let maxScore = 0;
    let winningSign = 'aries';

    Object.entries(finalScores).forEach(([sign, score]) => {
      if (score > maxScore) {
        maxScore = score;
        winningSign = sign;
      }
    });

    // Mapeia para o ID correto no SIGNS array
    const signIdMap: Record<string, string> = {
      aries: 'aries',
      touro: 'taurus',
      gemeos: 'gemini',
      cancer: 'cancer',
      leao: 'leo',
      virgem: 'virgo',
      libra: 'libra',
      escorpiao: 'scorpio',
      sagitario: 'sagittarius',
      capricornio: 'capricorn',
      aquario: 'aquarius',
      peixes: 'pisces'
    };

    const signData = SIGNS.find(s => s.id === signIdMap[winningSign]);
    setResultSign(signData || SIGNS[0]);
    setGameFinished(true);

    // Animação de revelação
    setTimeout(() => {
      setShowingResult(true);
    }, 500);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsTransitioning(false);
    setGameFinished(false);
    setResultSign(null);
    setShowingResult(false);
    const initialScores: Record<string, number> = {};
    Object.keys(SIGN_NAMES).forEach(sign => {
      initialScores[sign] = 0;
    });
    setScores(initialScores);
  };

  // Mapeia ID do signo de volta para português
  const getPortugueseSignId = (signId: string): string => {
    const reverseMap: Record<string, string> = {
      aries: 'aries',
      taurus: 'touro',
      gemini: 'gemeos',
      cancer: 'cancer',
      leo: 'leao',
      virgo: 'virgem',
      libra: 'libra',
      scorpio: 'escorpiao',
      sagittarius: 'sagitario',
      capricorn: 'capricornio',
      aquarius: 'aquario',
      pisces: 'peixes'
    };
    return reverseMap[signId] || signId;
  };

  const question = SIGN_FINDER_QUESTIONS[currentQuestion];

  // Tela de Resultado
  if (gameFinished && resultSign) {
    const portugueseId = getPortugueseSignId(resultSign.id);
    const bgImage = SIGN_BACKGROUNDS[resultSign.id] || '';

    return (
      <div className="min-h-screen bg-[#050510] text-white flex flex-col">
        {/* Header */}
        <header className="relative z-20 p-4 border-b border-white/10 bg-black/30 backdrop-blur-sm">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>
        </header>

        {/* Result Content with Background */}
        <div className="flex-1 relative">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-4 md:inset-8 rounded-3xl overflow-hidden">
              <img
                src={bgImage}
                alt="Background"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 20%' }}
                crossOrigin="anonymous"
              />
              {/* Overlay para legibilidade */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
            </div>
          </div>

          {/* Content */}
          <div className={`relative z-10 flex flex-col items-center justify-center p-6 min-h-full transition-all duration-700 ${showingResult ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

            {/* Badge */}
            <div className="mb-6 px-4 py-2 bg-indigo-500/30 backdrop-blur-sm rounded-full border border-indigo-500/30">
              <span className="text-indigo-200 text-sm font-bold uppercase tracking-widest">Seu Signo</span>
            </div>

            {/* Sign Icon - círculo mascarado */}
            <div className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br ${resultSign.gradient} p-1 shadow-2xl mb-6`}>
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-900/50 backdrop-blur-sm">
                <img
                  src={resultSign.icon}
                  alt={resultSign.name}
                  className="w-full h-full object-cover rounded-full"
                  crossOrigin="anonymous"
                />
              </div>
            </div>

            {/* Sign Name */}
            <h1 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-wide drop-shadow-lg">
              {resultSign.name}
            </h1>
            <p className="text-slate-300 text-sm mb-6 drop-shadow-md">{resultSign.date}</p>

            {/* Element Badge */}
            <div className="flex items-center gap-2 mb-6">
              <span className="text-slate-400 text-sm">Elemento:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm ${
                resultSign.element === ElementType.FIRE ? 'bg-red-500/30 text-red-200' :
                resultSign.element === ElementType.EARTH ? 'bg-green-500/30 text-green-200' :
                resultSign.element === ElementType.AIR ? 'bg-sky-500/30 text-sky-200' :
                'bg-blue-500/30 text-blue-200'
              }`}>
                {resultSign.element}
              </span>
            </div>

            {/* Description */}
            <div className="max-w-lg text-center mb-8 px-4">
              <p className="text-white/90 text-base md:text-lg leading-relaxed drop-shadow-md">
                "{SIGN_DESCRIPTIONS[portugueseId]}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md px-4">
              <button
                onClick={() => onGoToCombinations(resultSign)}
                className="flex-1 py-4 px-6 bg-white text-slate-900 font-bold rounded-full shadow-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Ver Combinações
              </button>

              <button
                onClick={handleRestart}
                className="flex-1 py-4 px-6 bg-slate-800/80 backdrop-blur-sm text-white font-bold rounded-full border border-slate-600 hover:bg-slate-700/80 transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refazer Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela do Quiz
  return (
    <div className="min-h-screen bg-[#050510] text-white flex flex-col">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-4 border-b border-white/10">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </button>

          <span className="text-slate-500 text-sm font-mono">
            {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="relative z-10 px-4 py-2">
        <div className="max-w-2xl mx-auto">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
        <div className={`w-full max-w-2xl transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'}`}>

          {/* Question Number */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-1 bg-indigo-500/20 rounded-full text-indigo-300 text-xs font-bold uppercase tracking-widest">
              Pergunta {currentQuestion + 1}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-bold text-center text-white mb-8 leading-relaxed">
            {question.pergunta}
          </h2>

          {/* Options */}
          <div className="space-y-3">
            {question.opcoes.map((option) => (
              <button
                key={option.id}
                onClick={() => handleSelectOption(option)}
                disabled={isTransitioning}
                className={`w-full p-4 md:p-5 rounded-xl border text-left transition-all duration-200 ${
                  selectedOption === option.id
                    ? 'bg-indigo-500/30 border-indigo-500 scale-[1.02]'
                    : 'bg-slate-900/50 border-slate-700 hover:bg-slate-800/50 hover:border-slate-600'
                } ${isTransitioning ? 'pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    selectedOption === option.id
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {option.id}
                  </span>
                  <span className="text-slate-200 text-base md:text-lg pt-0.5">
                    {option.texto}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Hint */}
      <div className="relative z-10 p-4 text-center">
        <p className="text-slate-600 text-xs">
          Escolha a opção que mais combina com você
        </p>
      </div>
    </div>
  );
};

export default SignFinder;
