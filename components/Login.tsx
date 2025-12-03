
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_LOGO } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Login via Magic Link (Email sem senha)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin, // Redireciona de volta para o site após clicar no email
      },
    });

    if (error) {
      alert('Erro ao tentar entrar: ' + error.message);
    } else {
      setSent(true);
    }
    setLoading(false);
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
        <p className="text-slate-400 mb-8 text-sm">Descubra a sinergia dos astros. Entre para começar.</p>

        {sent ? (
          <div className="bg-emerald-500/20 border border-emerald-500/50 p-6 rounded-lg text-emerald-200 text-sm animate-fade-in">
            <div className="flex justify-center mb-3">
                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <p className="font-bold mb-1 text-lg">Verifique seu e-mail!</p>
            <p>Enviamos um link mágico para <strong>{email}</strong>. Clique nele para entrar automaticamente.</p>
            <button onClick={() => setSent(false)} className="mt-4 text-xs text-emerald-400 underline hover:text-emerald-300">Tentar outro e-mail</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="text-left">
                <label className="text-xs text-slate-500 ml-1 mb-1 block uppercase tracking-wider">E-mail</label>
                <input
                type="email"
                placeholder="exemplo@email.com"
                className="w-full p-4 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 focus:bg-slate-900/80 transition-all placeholder:text-slate-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-slate-900 font-bold rounded-full hover:bg-slate-200 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-2 mt-2"
            >
              {loading ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                    Enviando...
                  </>
              ) : 'Receber Link de Acesso'}
            </button>
            <p className="text-[10px] text-slate-500 mt-4">
              Ao entrar, você ganhará <span className="text-indigo-400 font-bold">2 créditos grátis</span> para testar.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
