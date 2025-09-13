import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiCheck, FiX } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { motion, AnimatePresence } from 'framer-motion';
import ForgotPasswordModal from '../components/ForgotPasswordModal';

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
    let color = 'bg-red-500';
    if (score >= 3) color = 'bg-accent-gold';
    if (score === 4) color = 'bg-green-500';
    return { width, color };
  }, [password, checks]);

  if (!password) return null;

  return (
    <div className="mt-4 space-y-2">
      <div className="w-full bg-secondary rounded-full h-1.5">
        <div className={`h-1.5 rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }}></div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check, index) => {
          const isValid = check.re.test(password);
          return (
            <div key={index} className={`flex items-center text-xs transition-colors ${isValid ? 'text-green-400' : 'text-text-secondary'}`}>
              {isValid ? <FiCheck className="mr-2 flex-shrink-0" /> : <FiX className="mr-2 flex-shrink-0" />}
              <span>{check.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const inputWrapperVariants = {
  normal: {
    translateX: 0,
  },
  error: {
    translateX: [-5, 5, -5, 5, 0],
    transition: { duration: 0.3, ease: "easeInOut" },
  }
};

const errorMessageVariants = {
  hidden: { opacity: 0, y: -5, transition: { duration: 0.2 } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const LoginPage = () => {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleLogin = async (e) => { e.preventDefault(); setLoading(true); setErrors({}); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { toast.error("E-mail ou senha inválidos."); setErrors({ email: "E-mail ou senha inválidos.", password: " " }); } else { navigate('/dashboard'); } setLoading(false); };
  const handleSignUp = async (e) => { e.preventDefault(); setErrors({}); let hasError = false; if (password !== confirmPassword) { setErrors(prev => ({...prev, confirmPassword: 'As senhas não coincidem.'})); hasError = true; } const isPasswordStrong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password); if (!isPasswordStrong) { setErrors(prev => ({...prev, password: 'A senha não cumpre todos os requisitos.'})); hasError = true; } if (hasError) { return; } setLoading(true); const { data: { user }, error } = await supabase.auth.signUp({ email, password }); if (error) { toast.error(error.error_description || error.message); } else if (user) { const { error: updateError } = await supabase.from('profiles').update({ username: username }).eq('id', user.id); if (updateError) { toast.error('Usuário criado, mas houve um erro ao salvar o nome de usuário.'); } else { toast.success(`Bem-vindo, ${username}! Redirecionando para o mapa...`, { duration: 3000, }); setTimeout(() => { navigate('/mapa'); }, 2000); } } setLoading(false); };
  const handleSubmit = (e) => { if (isSignUp) { handleSignUp(e); } else { handleLogin(e); } };
  const handleOAuthLogin = async () => { setLoading(true); const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/dashboard`, }, }); if (error) { toast.error(error.error_description || error.message); } setLoading(false); };

   return (
    <div className="min-h-screen w-full lg:grid lg:grid-cols-2 font-inter bg-primary text-text-primary">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="w-full max-w-md space-y-8"
          key={isSignUp ? 'signup-form' : 'login-form'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div>
            <h1 className="font-montserrat text-3xl font-bold text-accent-glow">Sherloc</h1>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
              {isSignUp ? 'Crie sua Conta' : 'Bem-vindo de Volta'}
            </h2>
          </div>

          <div className="flex border-b border-white/10">
            <button onClick={() => { setIsSignUp(false); setErrors({}); }} className={`flex-1 py-3 font-semibold text-sm transition-colors ${!isSignUp ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-text-secondary hover:text-text-primary'}`}>
              Login
            </button>
            <button onClick={() => { setIsSignUp(true); setErrors({}); }} className={`flex-1 py-3 font-semibold text-sm transition-colors ${isSignUp ? 'text-accent-gold border-b-2 border-accent-gold' : 'text-text-secondary hover:text-text-primary'}`}>
              Cadastro
            </button>
          </div>

          {/* ===== CORREÇÃO 2: A TRANSIÇÃO SUAVE ===== */}
          <motion.form
            layout
            transition={{ type: 'spring', duration: 0.8, bounce: 0.15 }}
            className="space-y-4 pt-2"
            onSubmit={handleSubmit}
          >
            <AnimatePresence>
              {isSignUp && (
                 <motion.div
                   layout
                   key="username-container"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   transition={{ duration: 0.3 }}
                 >
                    <motion.div variants={inputWrapperVariants} animate={errors.username ? 'error' : 'normal'} className="relative">
                      <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                      <input type="text" required onChange={(e) => setUsername(e.target.value)} 
                        className={`w-full rounded-lg border bg-secondary p-4 pl-12 text-sm text-text-primary focus:ring-1 focus:ring-accent-gold focus:border-accent-gold ${errors.username ? 'border-red-500/50' : 'border-white/10'}`} 
                        placeholder="Nome de Usuário" 
                      />
                    </motion.div>
                    <AnimatePresence>{errors.username && <motion.p variants={errorMessageVariants} initial="hidden" animate="visible" exit="hidden" className="mt-1 text-xs text-red-400">{errors.username}</motion.p>}</AnimatePresence>
                 </motion.div>
              )}
            </AnimatePresence>
            
            <div>
              <motion.div variants={inputWrapperVariants} animate={errors.email ? 'error' : 'normal'} className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input type="email" required onChange={(e) => setEmail(e.target.value)} 
                  className={`w-full rounded-lg border bg-secondary p-4 pl-12 text-sm text-text-primary focus:ring-1 focus:ring-accent-gold focus:border-accent-gold ${errors.email ? 'border-red-500/50' : 'border-white/10'}`} 
                  placeholder="Email" 
                />
              </motion.div>
              <AnimatePresence>{errors.email && <motion.p variants={errorMessageVariants} initial="hidden" animate="visible" exit="hidden" className="mt-1 text-xs text-red-400">{errors.email}</motion.p>}</AnimatePresence>
            </div>
            
            <div>
              <motion.div variants={inputWrapperVariants} animate={errors.password ? 'error' : 'normal'} className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input type={showPassword ? "text" : "password"} required onChange={(e) => setPassword(e.target.value)} 
                  className={`w-full rounded-lg border bg-secondary p-4 pl-12 text-sm text-text-primary focus:ring-1 focus:ring-accent-gold focus:border-accent-gold ${errors.password ? 'border-red-500/50' : 'border-white/10'}`} 
                  placeholder="Senha" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
              </motion.div>
              <AnimatePresence>{errors.password && !errors.email && <motion.p variants={errorMessageVariants} initial="hidden" animate="visible" exit="hidden" className="mt-1 text-xs text-red-400">{errors.password}</motion.p>}</AnimatePresence>
            </div>

            <AnimatePresence>
              {isSignUp && (
                <motion.div
                  layout
                  key="confirm-password-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div variants={inputWrapperVariants} animate={errors.confirmPassword ? 'error' : 'normal'}>
                    <div className="relative">
                      <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                      <input type="password" required onChange={(e) => setConfirmPassword(e.target.value)} 
                        className={`w-full rounded-lg border bg-secondary p-4 pl-12 text-sm text-text-primary focus:ring-1 focus:ring-accent-gold focus:border-accent-gold ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'}`} 
                        placeholder="Confirmar Senha" 
                      />
                    </div>
                  </motion.div>
                  <AnimatePresence>{errors.confirmPassword && <motion.p variants={errorMessageVariants} initial="hidden" animate="visible" exit="hidden" className="mt-1 text-xs text-red-400">{errors.confirmPassword}</motion.p>}</AnimatePresence>
                  <PasswordStrengthIndicator password={password} />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between text-sm pt-2">
               <div className="flex items-center"></div>
              <button type="button" onClick={() => setIsForgotModalOpen(true)} className="font-semibold text-accent-gold hover:underline">Esqueceu a senha?</button>
            </div>

            <div>
              <button type="submit" disabled={loading} className="w-full rounded-lg bg-accent-gold px-5 py-3 text-sm font-semibold text-primary hover:brightness-110 transition-all disabled:opacity-50">
                {loading ? 'Carregando...' : (isSignUp ? 'Criar Conta' : 'Continuar')}
              </button>
            </div>
          </motion.form>
          
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-4 text-sm text-text-secondary">OU</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>
          
           <div>
             <button
                onClick={handleOAuthLogin} disabled={loading}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-white/10 px-5 py-3 text-sm font-semibold text-text-primary hover:bg-secondary transition-colors"
              >
                <FcGoogle size={20} />
                <span>Continuar com Google</span>
              </button>
          </div>

          <p className="pt-8 text-center text-xs text-text-secondary">
            Ao continuar, você concorda com nossos{' '}
            <Link to="/termos" className="underline hover:text-text-primary">Termos de Serviço</Link> e{' '}
            <Link to="/privacidade" className="underline hover:text-text-primary">Política de Privacidade</Link>.
          </p>

        </motion.div>
      </div>
      
      {/* ===== CORREÇÃO 1: A IMAGEM ===== */}
      <div className="relative hidden lg:block">
        <img alt="Mapa de Viagem" src="https://images.unsplash.com/photo-1528543606781-2f6e6857f318?q=80&w=1965&auto-format&fit=crop" className="absolute inset-0 h-full w-full object-cover lg:rounded-r-2xl"/>
      </div>

      <ForgotPasswordModal 
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};

export default LoginPage;