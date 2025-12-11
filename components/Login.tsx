
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { APP_LOGO } from '../constants';

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [showEmailOption, setShowEmailOption] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Login com Google (1 clique!)
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
      setMessage({ text: 'Erro ao conectar com Google: ' + error.message, type: 'error' });
      setLoading(false);
    }
  };

  // Criar perfil do usuário com créditos iniciais
  const createUserProfile = async (userId: string) => {
    try {
      // Verifica se o perfil já existe
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        // Cria perfil com 3 créditos iniciais
        const { error } = await supabase
          .from('profiles')
          .insert({ id: userId, credits: 3 });

        if (error) {
          console.error('Erro ao criar perfil:', error);
        }
      }
    } catch (e) {
      console.error('Erro ao verificar/criar perfil:', e);
    }
  };

  // Login/Cadastro com Email e Senha
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // CADASTRO
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Desabilita confirmação de email para login imediato
            emailRedirectTo: window.location.origin,
          }
        });

        if (error) throw error;

        // Verifica se o usuário foi criado
        if (data.user) {
          // Cria o perfil do usuário
          await createUserProfile(data.user.id);

          // Tenta fazer login automaticamente
          const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (signInError) {
            // Se não conseguiu logar, pode ser que precisa confirmar email
            if (signInError.message.includes('Email not confirmed')) {
              setMessage({
                text: 'Conta criada! Verifique seu email para confirmar, ou tente fazer login.',
                type: 'success'
              });
            } else {
              // Conta criada mas falhou o auto-login - mostra mensagem de sucesso
              setMessage({
                text: 'Conta criada com sucesso! Agora faça login com seu email e senha.',
                type: 'success'
              });
              setIsSignUp(false); // Muda para tela de login
            }
          }
          // Se o login automático funcionar, o App.tsx vai detectar a sessão
        } else {
          setMessage({
            text: 'Conta criada! Verifique seu email para confirmar.',
            type: 'success'
          });
        }
      } else {
        // LOGIN
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Se logou com sucesso, garante que o perfil existe
        if (data.user) {
          await createUserProfile(data.user.id);
        }
      }
    } catch (error: any) {
      let errorMessage = error.message || 'Ocorreu um erro.';

      // Traduz mensagens de erro comuns
      if (errorMessage.includes('Invalid login credentials')) {
        errorMessage = 'Email ou senha incorretos. Verifique seus dados ou crie uma conta.';
      } else if (errorMessage.includes('Email not confirmed')) {
        errorMessage = 'Email não confirmado. Verifique sua caixa de entrada.';
      } else if (errorMessage.includes('User already registered')) {
        errorMessage = 'Este email já está cadastrado. Tente fazer login.';
        setIsSignUp(false);
      } else if (errorMessage.includes('Password should be')) {
        errorMessage = 'A senha deve ter no mínimo 6 caracteres.';
      } else if (errorMessage.includes('Unable to validate email')) {
        errorMessage = 'Email inválido. Verifique o formato.';
      } else if (errorMessage.includes('Error sending confirmation email') || errorMessage.includes('error sending')) {
        errorMessage = 'Erro ao enviar email de confirmação. Use o login com Google ou tente novamente mais tarde.';
      }

      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setLoading(false);
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

        <h1 className="text-2xl font-bold text-white mb-2 tracking-wide font-mono">Signos Animados</h1>
        <p className="text-slate-400 mb-8 text-sm">Entre para descobrir suas combinações astrais</p>

        {/* MENSAGENS DE ERRO/SUCESSO */}
        {message && (
          <div className={`mb-6 p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/30' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
            {message.text}
          </div>
        )}

        {/* VIEW PRINCIPAL - GOOGLE LOGIN */}
        {!showEmailOption && (
          <div className="flex flex-col gap-4 animate-fade-in">
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-4 bg-white text-slate-800 font-bold rounded-xl hover:bg-slate-100 transition-all shadow-lg disabled:opacity-50 flex justify-center items-center gap-3 text-sm"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-slate-800 border-t-transparent rounded-full"></span>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Entrar com Google
                </>
              )}
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-[#0a0a1a] text-slate-500 uppercase tracking-wider">ou</span>
              </div>
            </div>

            <button
              onClick={() => setShowEmailOption(true)}
              className="w-full py-3 bg-slate-800/50 text-slate-300 font-medium rounded-xl hover:bg-slate-800 transition-all border border-slate-700 text-sm"
            >
              Usar email e senha
            </button>

            <p className="text-[10px] text-slate-500 mt-4">
              Recomendamos entrar com Google para uma experiência mais rápida e segura.
            </p>
          </div>
        )}

        {/* VIEW: EMAIL E SENHA */}
        {showEmailOption && (
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4 animate-fade-in">
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
                <label className="text-[10px] text-slate-400 ml-1 mb-1 block uppercase tracking-wider font-bold">Senha</label>
                <input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
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
              className="w-full py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 flex justify-center items-center gap-2 mt-2 text-sm uppercase tracking-widest"
            >
              {loading ? <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span> : (isSignUp ? 'Criar Conta' : 'Entrar')}
            </button>

            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setMessage(null); }}
              className="text-xs text-slate-400 hover:text-white underline transition-colors"
            >
              {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Criar agora'}
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setShowEmailOption(false); setMessage(null); }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Voltar para login com Google
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
