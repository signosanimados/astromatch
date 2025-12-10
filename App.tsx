
import React, { useState, useEffect } from 'react';
import { SIGNS, APP_LOGO } from './constants';
import { SignData, CompatibilityResult } from './types';
import SignCard from './components/SignCard';
import ResultView from './components/ResultView';
import Login from './components/Login';
import HomeScreen from './components/HomeScreen';
import SignFinder from './components/SignFinder';
import BirthChart from './components/BirthChart';
import { getCompatibility } from './services/geminiService';
import { supabase } from './lib/supabaseClient';

// LINK DE PAGAMENTO DO STRIPE
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/00w4gA3pR0j0cbRgqj9AA01";

type ScreenType = 'home' | 'combinations' | 'signfinder' | 'birthchart';

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [refreshingCredits, setRefreshingCredits] = useState(false);

  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');

  const [signA, setSignA] = useState<SignData | null>(null);
  const [signB, setSignB] = useState<SignData | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [relationshipMode, setRelationshipMode] = useState<'love' | 'friendship'>('love');

  // 1. Inicialização
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
      setCheckingAuth(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchCredits(session.user.id);
      } else {
        setCredits(null);
      }
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Auto-refresh de créditos quando a aba volta ao foco (após pagamento)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.id) {
        console.log('🔄 Aba ativa - atualizando créditos...');
        fetchCredits(session.user.id);
      }
    };

    const handleFocus = () => {
      if (session?.user?.id) {
        console.log('🔄 Janela em foco - atualizando créditos...');
        fetchCredits(session.user.id);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [session]);

  // 3. Busca Créditos (e cria perfil se não existir - ex: login Google OAuth)
  const fetchCredits = async (userId: string) => {
    setRefreshingCredits(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (data) {
        setCredits(data.credits);
      } else if (error) {
        // Perfil não existe - criar com créditos iniciais (usuário novo via OAuth)
        console.log('Perfil não encontrado, criando...');
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({ id: userId, credits: 3 })
          .select('credits')
          .single();

        if (newProfile) {
          setCredits(newProfile.credits);
          console.log('✅ Perfil criado com 3 créditos iniciais');
        } else if (createError) {
          // Pode ser que outro processo já criou, tenta buscar novamente
          const { data: retryData } = await supabase
            .from('profiles')
            .select('credits')
            .eq('id', userId)
            .single();

          if (retryData) {
            setCredits(retryData.credits);
          } else {
            console.error('Erro ao criar/buscar perfil:', createError);
            setCredits(0);
          }
        }
      }
    } catch (e) {
      console.error("Erro de conexão:", e);
    } finally {
      setTimeout(() => setRefreshingCredits(false), 500);
    }
  };

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
    if (session) fetchCredits(session.user.id);
  };

  // Função para abrir o checkout com ID
  const handleBuyCredits = () => {
      if (!session?.user?.id) return;
      const checkoutUrl = `${STRIPE_CHECKOUT_URL}?client_reference_id=${session.user.id}`;
      window.open(checkoutUrl, '_blank');

      // Feedback para o usuário
      alert('💫 Após concluir o pagamento, volte aqui que seus créditos serão atualizados automaticamente!');
  };

  const handleCalculate = async () => {
    if (!signA || !signB || !session) return;

    // 3. Verificação de Créditos
    if (credits !== null && credits <= 0) {
       const confirmar = window.confirm(
         "Seus créditos acabaram! 🌑\n\nPara revelar essa combinação, você precisa de mais energia astral.\n\nClique em OK para adquirir novos créditos."
       );

       if (confirmar) {
          handleBuyCredits();
       }
       return;
    }

    setLoading(true);
    setError(null);

    try {
      const previousCredits = credits;
      const newCredits = (credits || 0) - 1;
      setCredits(newCredits);

      await new Promise(resolve => setTimeout(resolve, 800));

      const data = await getCompatibility(signA, signB, relationshipMode);
      setResult(data);

      // 4. Salvar no Banco
      const { error: dbError } = await supabase.from('combinations').insert({
            user_id: session.user.id,
            sign_a: signA.name,
            sign_b: signB.name,
            compatibility: data.compatibilidade,
            mode: relationshipMode
      });

      if (dbError) console.error("Erro ao salvar histórico:", dbError);

      const { error: creditError } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', session.user.id);

      if (creditError) {
        console.error("Erro ao deduzir crédito:", creditError);
        setCredits(previousCredits);
        alert("Erro de conexão ao debitar crédito. Tente novamente.");
        setResult(null);
      }

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao consultar os astros.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeselectA = () => { setSignA(null); setSignB(null); };
  const handleDeselectB = () => { setSignB(null); };

  // Navigation handlers
  const handleGoHome = () => {
    setCurrentScreen('home');
    handleReset();
  };

  const handleGoToCombinations = () => {
    setCurrentScreen('combinations');
  };

  const handleGoToSignFinder = () => {
    setCurrentScreen('signfinder');
  };

  const handleGoToBirthChart = () => {
    setCurrentScreen('birthchart');
  };

  // Deduct credits for paid features (like birth chart)
  const handleDeductCredits = async (amount: number): Promise<boolean> => {
    if (!session?.user?.id) return false;
    if (credits === null || credits < amount) return false;

    try {
      const newCredits = credits - amount;

      const { error } = await supabase
        .from('profiles')
        .update({ credits: newCredits })
        .eq('id', session.user.id);

      if (error) {
        console.error('Erro ao deduzir créditos:', error);
        return false;
      }

      setCredits(newCredits);
      return true;
    } catch (err) {
      console.error('Erro ao deduzir créditos:', err);
      return false;
    }
  };

  const handleSignFinderComplete = (sign: SignData) => {
    // Pre-select the discovered sign and go to combinations
    setSignA(sign);
    setSignB(null);
    setResult(null);
    setCurrentScreen('combinations');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentScreen('home');
  };

  if (checkingAuth) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <span className="text-sm tracking-widest uppercase text-slate-500">Carregando Astros...</span>
        </div>
    </div>
  );

  if (!session) {
    return <Login />;
  }

  // Home Screen
  if (currentScreen === 'home') {
    return (
      <HomeScreen
        onSelectCombinations={handleGoToCombinations}
        onSelectSignFinder={handleGoToSignFinder}
        onSelectBirthChart={handleGoToBirthChart}
        onLogout={handleLogout}
        userEmail={session?.user?.email}
        credits={credits}
      />
    );
  }

  // Birth Chart Screen
  if (currentScreen === 'birthchart') {
    return (
      <BirthChart
        onBack={handleGoHome}
        credits={credits}
        onDeductCredits={handleDeductCredits}
      />
    );
  }

  // Sign Finder Screen
  if (currentScreen === 'signfinder') {
    return (
      <SignFinder
        onBack={handleGoHome}
        onGoToCombinations={handleSignFinderComplete}
      />
    );
  }

  // Combinations Screen (original app)
  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 pb-32 md:pb-20 font-sans relative overflow-x-hidden">

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="container mx-auto px-4 md:px-8 relative z-10 pt-8">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-white/5 pb-4">

          <div className="flex items-center gap-3">
             <button
               onClick={handleGoHome}
               className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
             >
               <img
                  src={APP_LOGO}
                  alt="AM"
                  className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                  crossOrigin="anonymous"
               />
               <h1 className="text-xl font-bold tracking-[0.2em] uppercase text-slate-300 hidden md:block">
                 Signos Combinados
               </h1>
             </button>
          </div>

          {/* Contador de Créditos */}
          <div className="flex items-center gap-4">

             <div
                className={`
                  relative px-4 py-1.5 rounded-full flex items-center gap-3 shadow-lg transition-all border
                  ${credits !== null && credits > 0
                    ? 'bg-slate-900 border-indigo-500/50 shadow-indigo-900/20'
                    : 'bg-red-900/20 border-red-500/50 shadow-red-900/20 animate-pulse'}
                `}
             >
                <div className="flex flex-col items-end leading-none py-1">
                    <span className="text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-0.5">Seus Créditos</span>
                    <span className={`text-lg font-mono font-bold ${credits === 0 ? 'text-red-400' : 'text-white'}`}>
                        {credits ?? '-'}
                    </span>
                </div>

                <div className="flex items-center gap-1">
                    {/* Botão Atualizar Saldo */}
                    <button
                      onClick={() => session && fetchCredits(session.user.id)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all ${refreshingCredits ? 'animate-spin text-indigo-400' : ''}`}
                      title="Atualizar saldo"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>

                    {/* Botão Comprar */}
                    <button
                      onClick={handleBuyCredits}
                      className="w-6 h-6 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-indigo-100 transition-colors font-bold text-sm pb-0.5 ml-1"
                      title="Comprar mais créditos"
                    >
                      +
                    </button>
                </div>
             </div>

             <div className="h-8 w-[1px] bg-slate-800 hidden md:block"></div>

             <button
                onClick={handleGoHome}
                className="text-xs text-slate-500 hover:text-white transition-colors border border-slate-800 px-4 py-2 rounded-lg hover:bg-slate-800 flex items-center gap-2"
             >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Início
             </button>
          </div>
        </header>

        {!result && (
          <div className="animate-fade-in max-w-6xl mx-auto flex flex-col items-center">

            <div className="flex flex-col items-center gap-3 mb-8 w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">
                Tipo de Combinação
              </span>
              <div className="flex p-1 bg-slate-900/80 border border-slate-700/50 rounded-full shadow-lg relative">
                 <button
                    onClick={() => setRelationshipMode('love')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 flex items-center gap-2 ${relationshipMode === 'love' ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    AMOR
                 </button>
                 <button
                    onClick={() => setRelationshipMode('friendship')}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 flex items-center gap-2 ${relationshipMode === 'friendship' ? 'bg-gradient-to-r from-cyan-600 to-blue-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'text-slate-400 hover:text-slate-200'}`}
                 >
                    AMIZADE
                 </button>
              </div>
            </div>

            <div className="w-full mb-12 glass rounded-2xl p-6 md:p-10 border border-white/5 relative overflow-hidden hidden md:block">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                 <div className="flex items-center gap-4 md:gap-8 flex-1 justify-center md:justify-start">
                    <div onClick={handleDeselectA} className={`relative w-24 h-32 md:w-28 md:h-40 rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center overflow-hidden group ${signA ? 'border-transparent' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}>
                      {signA ? (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${signA.gradient} opacity-20`}></div>
                          <img src={signA.icon} alt={signA.name} className="w-20 h-20 object-contain drop-shadow-lg relative z-10" />
                          <div className="absolute bottom-2 text-[10px] uppercase font-bold text-white tracking-widest">{signA.name}</div>
                        </>
                      ) : (
                         <span className="text-2xl text-slate-700 group-hover:text-slate-500 transition-colors">+</span>
                      )}
                    </div>
                    <div className="h-[1px] w-10 bg-slate-800 hidden md:block"></div>
                    <div onClick={handleDeselectB} className={`relative w-24 h-32 md:w-28 md:h-40 rounded-lg border-2 border-dashed transition-all cursor-pointer flex items-center justify-center overflow-hidden group ${signB ? 'border-transparent' : 'border-slate-800 hover:border-slate-700 bg-slate-900/50'}`}>
                      {signB ? (
                        <>
                          <div className={`absolute inset-0 bg-gradient-to-br ${signB.gradient} opacity-20`}></div>
                          <img src={signB.icon} alt={signB.name} className="w-20 h-20 object-contain drop-shadow-lg relative z-10" />
                          <div className="absolute bottom-2 text-[10px] uppercase font-bold text-white tracking-widest">{signB.name}</div>
                        </>
                      ) : (
                         <span className="text-2xl text-slate-700 group-hover:text-slate-500 transition-colors">+</span>
                      )}
                    </div>
                 </div>

                 <div className="flex-1 flex justify-center md:justify-end w-full md:w-auto">
                    <div className="flex flex-col items-end gap-3">
                        <button
                          onClick={handleCalculate}
                          disabled={!signA || !signB || loading}
                          className={`w-full md:w-auto px-10 py-4 font-bold tracking-widest text-xs uppercase rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]
                              ${credits === 0
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500 ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#050510]'
                                : 'bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed'
                              }
                          `}
                        >
                          {loading
                            ? 'Calculando...'
                            : (credits !== null && credits <= 0 ? 'COMPRAR CRÉDITOS' : 'REVELAR')
                          }
                        </button>

                        {credits !== null && credits <= 0 && (
                            <span className="text-[10px] text-red-400 font-bold tracking-wide flex items-center gap-1 bg-red-900/20 px-2 py-1 rounded cursor-pointer hover:bg-red-900/30 transition-colors" onClick={handleBuyCredits}>
                              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                              Saldo insuficiente. Clique para recarregar.
                            </span>
                        )}
                        {credits !== null && credits > 0 && (
                           <span className="text-[10px] text-emerald-400/70 font-mono">
                             Custo: -1 crédito
                           </span>
                        )}
                    </div>
                 </div>
              </div>
            </div>

            {error && <div className="mb-8 p-4 bg-red-900/20 border border-red-500/20 rounded-sm text-red-200 text-center text-sm">{error}</div>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-6 w-full">
              {SIGNS.map((sign) => {
                const isSelected = signA?.id === sign.id || signB?.id === sign.id;
                const isDisabled = !!(signA && signB && !isSelected);
                return <SignCard key={sign.id} sign={sign} isSelected={isSelected} disabled={isDisabled} onClick={() => handleSelectSign(sign)} />;
              })}
            </div>
          </div>
        )}

        {result && signA && signB && (
          <ResultView
            result={result}
            signA={signA}
            signB={signB}
            mode={relationshipMode}
            onReset={handleReset}
            userEmail={session?.user?.email}
          />
        )}
      </main>

      {/* MOBILE FLOATING BAR */}
      {!result && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#050510]/95 backdrop-blur-xl border-t border-white/10 z-50 md:hidden flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.8)]">
           <div className="flex items-center gap-3 pl-2">
              <div onClick={handleDeselectA} className={`w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer transition-all overflow-hidden ${signA ? 'bg-gradient-to-t ' + signA.gradient + ' border-white/50' : 'bg-slate-900 border-dashed'}`}>
                 {signA ? <img src={signA.icon} alt={signA.name} className="w-8 h-8 object-contain" /> : <span className="text-slate-600">+</span>}
              </div>
              <span className="text-slate-600 text-xs">+</span>
              <div onClick={handleDeselectB} className={`w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center cursor-pointer transition-all overflow-hidden ${signB ? 'bg-gradient-to-t ' + signB.gradient + ' border-white/50' : 'bg-slate-900 border-dashed'}`}>
                 {signB ? <img src={signB.icon} alt={signB.name} className="w-8 h-8 object-contain" /> : <span className="text-slate-600">+</span>}
              </div>
           </div>

           <button
              onClick={credits === 0 ? handleBuyCredits : handleCalculate}
              disabled={!signA || !signB || loading}
              className={`flex-1 py-3 font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors active:scale-95
                  ${credits === 0
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-white text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
           >
              {loading
                 ? '...'
                 : (credits !== null && credits <= 0 ? 'Comprar (+)' : 'Revelar')
              }
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
