
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_LOGO } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Login com Google
  const handleGoogleLogin = async () => {
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ text: 'Erro ao entrar com Google: ' + error.message, type: 'error' });
      setLoading(false);
    }
    // Não precisa setLoading(false) aqui porque vai redirecionar
  };

  // Login com Email (Magic Link)
  const handleEmailLogin = async (e: React.FormEvent) => {
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
      setMessage({ text: 'Erro ao enviar email: ' + error.message, type: 'error' });
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050510] px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass w-full max-w-md p-8 rounded-2xl border border-white/10 text-center relative z-10 animate-fade-in-up">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center p-1 shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            <img src={APP_LOGO} alt="Logo" className="w-full h-full object-cover rounded-full" crossOrigin="anonymous" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2 tracking-wide font-mono">Signos Combinados</h1>
        <p className="text-slate-400 mb-8 text-sm">Entre para descobrir sua compatibilidade astrológica</p>

        {/* Mensagens de Erro/Sucesso */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}

        {/* Email Enviado */}
        {sent ? (
          <div className="bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-lg text-emerald-200 animate-fade-in">
            <div className="flex justify-center mb-3">
              <svg className="w-12 h-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="font-bold mb-2 text-lg">Verifique seu e-mail! 📧</p>
            <p className="text-sm mb-1">Enviamos um link mágico para:</p>
            <p className="font-mono bg-emerald-900/30 px-3 py-2 rounded mt-2 mb-4">{email}</p>
            <p className="text-xs text-emerald-300/70 mb-4">Clique no link para entrar automaticamente. O link expira em 1 hora.</p>
            <button
              onClick={() => { setSent(false); setEmail(''); }}
              className="text-xs text-emerald-400 underline hover:text-emerald-300 transition-colors"
            >
              ← Voltar
            </button>
          </div>
        ) : (
          <>
            {/* Botão Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all shadow-lg disabled:opacity-50 flex items-center justify-center gap-3 mb-6 group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="group-hover:translate-x-0.5 transition-transform">
                {loading ? 'Conectando...' : 'Continuar com Google'}
              </span>
            </button>

            {/* Divisor */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0a0a14] text-slate-500 uppercase tracking-wider">ou</span>
              </div>
            </div>

            {/* Login com Email */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="text-left">
                <label className="text-xs text-slate-400 ml-1 mb-2 block uppercase tracking-wider font-bold">
                  Digite seu e-mail
                </label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/30 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 uppercase tracking-wider text-sm"
              >
                {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Enviar Link Mágico
                  </>
                )}
              </button>

              <p className="text-xs text-slate-500 text-center leading-relaxed mt-4">
                Você receberá um link de acesso único no seu e-mail.<br/>
                Sem senha, sem cadastro, 100% seguro! ✨
              </p>
            </form>

            {/* Informações */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-600">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Login 100% seguro pelo Supabase</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
