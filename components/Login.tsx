
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_LOGO } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Enviar Magic Link e salvar dados temporariamente
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !phone) {
      setMessage({ text: 'Por favor, preencha todos os campos', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    // Salvar dados no localStorage para usar após autenticação
    localStorage.setItem('pendingUserData', JSON.stringify({ name, phone, email }));

    // Enviar Magic Link
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setMessage({ text: 'Erro ao enviar email: ' + error.message, type: 'error' });
      setLoading(false);
      localStorage.removeItem('pendingUserData');
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
              onClick={() => { setSent(false); setEmail(''); setName(''); setPhone(''); }}
              className="text-xs text-emerald-400 underline hover:text-emerald-300 transition-colors"
            >
              ← Voltar
            </button>
          </div>
        ) : (
          <>
            {/* Formulário de Cadastro/Login */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="text-left">
                <label className="text-xs text-slate-400 ml-1 mb-2 block uppercase tracking-wider font-bold">
                  E-mail
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

              <div className="text-left">
                <label className="text-xs text-slate-400 ml-1 mb-2 block uppercase tracking-wider font-bold">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Seu nome"
                  className="w-full p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="text-left">
                <label className="text-xs text-slate-400 ml-1 mb-2 block uppercase tracking-wider font-bold">
                  Telefone (com DDD)
                </label>
                <input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  className="w-full p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-600"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email || !name || !phone}
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
                Sem senha, 100% seguro! ✨
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
