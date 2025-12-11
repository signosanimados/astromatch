
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_LOGO } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [sent, setSent] = useState(false);
  
  // Novos estados para gerenciar o modo de login
  const [mode, setMode] = useState<'magic' | 'password'>('password'); // 'magic' ou 'password'
  const [isSignUp, setIsSignUp] = useState(false); // Alternar entre Entrar/Cadastrar
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // 1. Login com Link Mágico (Sem senha)
  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ text: 'Erro ao enviar link: ' + error.message, type: 'error' });
    } else {
      setSent(true);
    }
    setLoading(false);
  };

  // 2. Login/Cadastro com Senha
  const handlePasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // CADASTRAR
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage({ text: 'Conta criada! Verifique seu e-mail para confirmar o cadastro.', type: 'success' });
      } else {
        // ENTRAR
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        // O App.tsx detectará a sessão automaticamente
      }
    } catch (error: any) {
      setMessage({ text: error.message || 'Ocorreu um erro.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // 3. Recuperar Senha
  const handleResetPassword = async () => {
    if (!email) {
      setMessage({ text: 'Digite seu e-mail acima primeiro.', type: 'error' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    setLoading(false);
    
    if (error) {
      setMessage({ text: error.message, type: 'error' });
    } else {
      setMessage({ text: 'Link de redefinição enviado para o e-mail.', type: 'success' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510] px-4 relative overflow-hidden">
       {/* Background Effects */}
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 text-center relative z-10 animate-fade-in-up">
        
        <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                <img src={APP_LOGO} alt="Logo" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
            </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-wide font-mono">Signos Combinados</h1>
        <p className="text-slate-400 mb-6 text-sm">Acesse sua conta para ver as combinações.</p>

        {/* TABS DE NAVEGAÇÃO */}
        <div className="flex p-1 bg-slate-900/50 rounded-lg mb-6 border border-white/5">
          <button 
            onClick={() => { setMode('magic'); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'magic' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Sem Senha
          </button>
          <button 
            onClick={() => { setMode('password'); setMessage(null); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${mode === 'password' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Com Senha
          </button>
        </div>

        {/* MENSAGENS DE ERRO/SUCESSO */}
        {message && (
          <div className={`mb-4 p-3 rounded text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}

        {/* VIEW: LINK MÁGICO */}
        {mode === 'magic' && (
          sent ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg text-emerald-200 text-sm animate-fade-in">
              <div className="flex justify-center mb-3">
                  <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <p className="font-bold mb-1 text-lg">Verifique seu e-mail!</p>
              <p>Enviamos um link mágico para <strong>{email}</strong>. Clique nele para entrar automaticamente.</p>
              <button onClick={() => setSent(false)} className="mt-4 text-xs text-emerald-400 underline hover:text-emerald-300">Voltar</button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="flex flex-col gap-4 animate-fade-in">
              <div className="text-left">
                  <label className="text-[10px] text-slate-400 ml-1 mb-1 block uppercase tracking-wider font-bold">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all placeholder:text-slate-600 text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex justify-center items-center gap-2 mt-2 text-sm uppercase tracking-widest"
              >
                {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : 'Receber Link de Acesso'}
              </button>
              <p className="text-[10px] text-slate-500">
                Ideal se você esqueceu sua senha ou está acessando pela primeira vez.
              </p>
            </form>
          )
        )}

        {/* VIEW: SENHA (LOGIN E CADASTRO) */}
        {mode === 'password' && (
          <form onSubmit={handlePasswordAuth} className="flex flex-col gap-4 animate-fade-in">
            <div className="text-left">
                <label className="text-[10px] text-slate-400 ml-1 mb-1 block uppercase tracking-wider font-bold">E-mail</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all placeholder:text-slate-600 text-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
            </div>
            <div className="text-left">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-[10px] text-slate-400 ml-1 block uppercase tracking-wider font-bold">Senha</label>
                   {!isSignUp && (
                     <button type="button" onClick={handleResetPassword} className="text-[10px] text-indigo-400 hover:text-indigo-300 underline">
                       Esqueci a senha
                     </button>
                   )}
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all placeholder:text-slate-600 text-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 mt-2 text-sm uppercase tracking-widest"
            >
              {loading ? <span className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></span> : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>

            <div className="mt-2 text-center">
              <button 
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
                className="text-xs text-slate-400 hover:text-white underline transition-colors"
              >
                {isSignUp ? 'Já tem uma conta? Fazer login' : 'Não tem senha? Cadastrar-se'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
