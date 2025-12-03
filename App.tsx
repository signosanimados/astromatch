
import React, { useState, useEffect } from 'react';
import { SIGNS, APP_LOGO } from './constants';
import { SignData, CompatibilityResult } from './types';
import SignCard from './components/SignCard';
import ResultView from './components/ResultView';
import Login from './components/Login';
import { getCompatibility } from './services/geminiService';
import { supabase } from './lib/supabaseClient';

// ⚠️ IMPORTANTE: Substitua pelo seu link de pagamento real do Stripe
// Você pega esse link no Dashboard do Stripe -> Catálogo de Produtos -> Criar Link de Pagamento
const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/SEU_LINK_DE_PAGAMENTO_AQUI"; 

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [signA, setSignA] = useState<SignData | null>(null);
  const [signB, setSignB] = useState<SignData | null>(null);
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [relationshipMode, setRelationshipMode] = useState<'love' | 'friendship'>('love');

  // 1. Verificar Sessão e Buscar Créditos
  useEffect(() => {
    // Verifica sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
      setCheckingAuth(false);
    });

    // Escuta mudanças na autenticação (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchCredits(session.user.id);
      else setCredits(null);
      setCheckingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Função para buscar créditos do banco
  const fetchCredits = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single();
    
    if (data) {
      setCredits(data.credits);
    } else if (error) {
      console.error('Erro ao buscar créditos:', error);
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
    if (session) fetchCredits(session.user.id); // Atualiza créditos visualmente
  };

  const handleCalculate = async () => {
    if (!signA || !signB || !session) return;

    // 3. VERIFICAÇÃO DE CRÉDITOS
    // Se créditos forem 0 ou menos, bloqueia e manda pro Stripe
    if (credits !== null && credits <= 0) {
       if(confirm("Seus créditos gratuitos acabaram! 😱\n\nDeseja adquirir mais créditos para continuar descobrindo as combinações astrais?")) {
          window.location.href = STRIPE_CHECKOUT_URL;
       }
       return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Delay artificial para dar emoção
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Gera compatibilidade (Local)
      const data = await getCompatibility(signA, signB, relationshipMode);
      setResult(data);

      // 4. LÓGICA DE CONSUMO E REGISTRO NO BANCO
      const newCredits = (credits || 0) - 1;
      setCredits(newCredits); // Atualiza na tela instantaneamente
      
      // Executa operações no Supabase em paralelo
      const { error: dbError } = await supabase.from('combinations').insert({
            user_id: session.user.id,
            sign_a: signA.name,
            sign_b: signB.name,
            compatibility: data.compatibilidade,
            mode: relationshipMode
      });

      if (dbError) console.error("Erro ao salvar histórico:", dbError);

      const { error: creditError } = await supabase.from('profiles').update({ credits: newCredits }).eq('id', session.user.id);

      if (creditError) console.error("Erro ao deduzir crédito:", creditError);

    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao consultar os astros.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeselectA = () => { setSignA(null); setSignB(null); };
  const handleDeselectB = () => { setSignB(null); };

  // Tela de Carregamento Inicial
  if (checkingAuth) return (
    <div className="min-h-screen bg-[#050510] flex items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-800"></div>
            <span className="text-sm tracking-widest uppercase text-slate-500">Carregando Astros...</span>
        </div>
    </div>
  );

  // Se não estiver logado, mostra Login
  if (!session) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-[#050510] text-slate-200 pb-32 md:pb-20 font-sans relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full"></div>
      </div>

      <main className="container mx-auto px-4 md:px-8 relative z-10 pt-8">
        
        {/* Header / Brand & Credits */}
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
             <a 
               href="https://www.tiktok.com/@signosanimadosoficial?is_from_webapp=1&sender_device=pc" 
               target="_blank" 
               rel="noopener noreferrer" 
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
             </a>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-slate-900 border border-indigo-500/30 rounded-full px-4 py-1 flex items-center gap-2 shadow-lg">
                <span className="text-[10px] uppercase tracking-widest text-slate-400">Créditos</span>
                <span className={`font-bold ${credits === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {credits ?? '...'}
                </span>
             </div>
             <button 
                onClick={() => supabase.auth.signOut()} 
                className="text-xs text-slate-500 hover:text-white transition-colors border border-slate-800 px-3 py-1 rounded hover:bg-slate-800"
             >
                Sair
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

            {/* Active Selection Area */}
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
                    <div className="flex flex-col items-end gap-2">
                        <button 
                          onClick={handleCalculate}
                          disabled={!signA || !signB || loading}
                          className={`w-full md:w-auto px-10 py-4 font-bold tracking-widest text-xs uppercase rounded-sm transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]
                              ${credits === 0 
                                ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                                : 'bg-slate-100 text-slate-900 hover:bg-white disabled:opacity-20 disabled:cursor-not-allowed'
                              }
                          `}
                        >
                          {loading 
                            ? 'Calculando...' 
                            : (credits && credits > 0 ? 'Revelar (-1 Crédito)' : 'Comprar Créditos')
                          }
                        </button>
                        {credits !== null && credits <= 0 && (
                            <span className="text-[10px] text-red-400 font-bold tracking-wide">Saldo insuficiente</span>
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

      {!result && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#050510]/90 backdrop-blur-xl border-t border-white/10 z-50 md:hidden flex items-center justify-between gap-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
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
              onClick={handleCalculate}
              disabled={!signA || !signB || loading}
              className={`flex-1 py-3 font-bold uppercase tracking-widest text-xs rounded-full shadow-lg transition-colors active:scale-95 
                  ${credits === 0 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-white text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed'
                  }`}
           >
              {loading 
                 ? '...' 
                 : (credits && credits > 0 ? 'Revelar' : 'Comprar')
              }
           </button>
        </div>
      )}
    </div>
  );
};

export default App;
