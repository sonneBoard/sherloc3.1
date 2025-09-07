import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';

// --- COMPONENTE INDICADOR DE FORÇA DA SENHA REINTEGRADO ---
const PasswordStrengthIndicator = ({ password }) => {
  const checks = useMemo(() => [
    { label: 'Pelo menos 8 caracteres', re: /.{8,}/ },
    { label: 'Pelo menos uma letra maiúscula (A-Z)', re: /[A-Z]/ },
    { label: 'Pelo menos uma letra minúscula (a-z)', re: /[a-z]/ },
    { label: 'Pelo menos um número (0-9)', re: /[0-9]/ },
  ], []);

  const strength = useMemo(() => {
    let score = 0;
    if (password) {
      checks.forEach(check => { if (check.re.test(password)) { score += 1; } });
    }
    const width = `${(score / checks.length) * 100}%`;
    let color = 'bg-red-500'; // Fraca
    if (score >= 3) color = 'bg-yellow-500'; // Média
    if (score === 4) color = 'bg-green-500'; // Forte
    return { width, color };
  }, [password, checks]);

  if (!password) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="w-full bg-sherloc-dark-2 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }}></div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check, index) => {
          const isValid = check.re.test(password);
          return (
            <div key={index} className={`flex items-center text-xs transition-colors ${isValid ? 'text-green-400' : 'text-gray-500'}`}>
              {isValid ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
              <span>{check.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.error_description || error.message);
    } else {
      navigate('/mapa');
    }
    setLoading(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem!');
      return;
    }
    const isPasswordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
    if (!isPasswordStrong) {
      toast.error('A senha não cumpre todos os requisitos.');
      return;
    }
    setLoading(true);
    const { data: { user }, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      toast.error(error.error_description || error.message);
    } else if (user) {
      const { error: updateError } = await supabase.from('profiles').update({ username: username }).eq('id', user.id);
      if (updateError) {
        toast.error('Usuário criado, mas houve um erro ao salvar o nome de usuário.');
      } else {
        toast.success('Cadastro realizado! Verifique seu e-mail para confirmar a conta.');
      }
    }
    setLoading(false);
  };
  
  const handleSubmit = (e) => {
    if (isSignUp) { handleSignUp(e); } else { handleLogin(e); }
  };

  // --- ANIMAÇÃO MAIS SUAVE E SUTIL ---
  const inputVariants = {
    hidden: { opacity: 0, height: 0, y: -10, transition: { duration: 0.2, ease: "easeOut" } },
    visible: { opacity: 1, height: 'auto', y: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 font-lexend bg-sherloc-dark text-sherloc-text">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-12">
        <motion.div
          className="w-full max-w-sm space-y-6"
          key={isSignUp ? 'signup' : 'login'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="font-poppins text-2xl font-bold text-sherloc-purple">Sherloc</h1>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-sherloc-text">
              {isSignUp ? 'Crie sua conta' : 'Bem-vindo de volta!'}
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              {isSignUp ? 'Comece sua jornada de exploração.' : 'Continue sua jornada.'}
            </p>
          </div>

          <div className="bg-sherloc-dark-2 p-1 rounded-full flex">
            <button onClick={() => setIsSignUp(false)} className={`flex-1 py-2 font-semibold text-sm rounded-full transition-colors ${!isSignUp ? 'bg-sherloc-purple text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}>
              Login
            </button>
            <button onClick={() => setIsSignUp(true)} className={`flex-1 py-2 font-semibold text-sm rounded-full transition-colors ${isSignUp ? 'bg-sherloc-purple text-white shadow' : 'text-gray-400 hover:bg-gray-700'}`}>
              Cadastro
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div key="username-field" variants={inputVariants} initial="hidden" animate="visible" exit="hidden" className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiUser className="h-5 w-5 text-gray-400" /></span>
                  <input id="username" type="text" required className="w-full rounded-xl border-gray-600 bg-sherloc-dark-2 p-4 pl-10 text-sm text-sherloc-text shadow-sm" placeholder="Nome de Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiMail className="h-5 w-5 text-gray-400" /></span>
              <input id="email" type="email" required className="w-full rounded-xl border-gray-600 bg-sherloc-dark-2 p-4 pl-10 text-sm text-sherloc-text shadow-sm" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            
            <div className="relative">
               <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiLock className="h-5 w-5 text-gray-400" /></span>
              <input id="password" type={showPassword ? "text" : "password"} required className="w-full rounded-xl border-gray-600 bg-sherloc-dark-2 p-4 pl-10 text-sm text-sherloc-text shadow-sm" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
               <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {isSignUp && (
                <motion.div key="password-confirm-field" variants={inputVariants} initial="hidden" animate="visible" exit="hidden" >
                   <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3"><FiLock className="h-5 w-5 text-gray-400" /></span>
                    <input id="confirmPassword" type="password" required className="w-full rounded-xl border-gray-600 bg-sherloc-dark-2 p-4 pl-10 text-sm text-sherloc-text shadow-sm" placeholder="Confirmar Senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                  <PasswordStrengthIndicator password={password} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <label htmlFor="remember-me" className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" id="remember-me" className="h-4 w-4 rounded border-gray-600 bg-sherloc-dark-2 text-sherloc-purple focus:ring-sherloc-purple" />
                Lembrar-me
              </label>
              <Link to="#" className="text-sm text-sherloc-purple hover:underline font-semibold">
                Esqueceu a senha?
              </Link>
            </div>

            <div>
              <button
                type="submit" disabled={loading}
                className="w-full rounded-xl bg-sherloc-purple px-5 py-3 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
              >
                {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Continuar')}
              </button>
            </div>
          </form>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink mx-4 text-sm text-gray-400">OU</span>
            <div className="flex-grow border-t border-gray-700"></div>
          </div>
          
          <div>
             <button
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-600 px-5 py-3 text-sm font-medium text-sherloc-text hover:bg-sherloc-dark-2 transition-colors"
              >
                <FcGoogle size={20} />
                <span>Continuar com Google</span>
              </button>
          </div>
        </motion.div>
      </div>
      
      <div className="relative hidden lg:block">
        <img
          alt="Mapa de Viagem"
          src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto=format&fit=crop"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default LoginPage;