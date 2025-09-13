// src/components/ForgotPasswordModal.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMail } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`, // URL para onde o usuário volta após redefinir
      });
      if (error) throw error;
      setIsSent(true);
    } catch (error) {
      toast.error(error.message || "Erro ao enviar o e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full max-w-md rounded-2xl overflow-hidden"
          initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-poppins text-2xl font-bold text-text-primary">Recuperar Senha</h2>
                <p className="text-sm text-text-secondary mt-1">Insira o seu e-mail para receber o link de redefinição.</p>
              </div>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            {isSent ? (
              <div className="mt-6 text-center bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-semibold text-accent-glow">Verifique o seu E-mail</h3>
                <p className="text-sm text-text-primary">Se existir uma conta com este e-mail, você receberá um link para redefinir a sua senha em breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="relative">
                  <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                  <input 
                    type="email" 
                    required 
                    className="w-full rounded-lg border border-white/10 bg-secondary p-4 pl-12 text-sm focus:ring-accent-gold focus:border-accent-gold" 
                    placeholder="Seu e-mail de cadastro" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full rounded-lg bg-accent-gold px-5 py-3 text-sm font-semibold text-primary hover:brightness-110 transition-all disabled:opacity-50"
                >
                  {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;