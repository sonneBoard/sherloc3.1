// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const fetchProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUser(user);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('username, avatar_url')
            .eq('id', user.id)
            .single();
          
          if (error) {
            toast.error("Erro ao carregar o perfil.");
            console.error(error);
          } else if (profile) {
            setUsername(profile.username);
            setAvatarUrl(profile.avatar_url || '');
          }
        }
      };
      fetchProfile();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates = {
        username,
        avatar_url: avatarUrl,
        updated_at: new Date(),
      };
      
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      onProfileUpdated();
      onClose();

    } catch (error) {
      toast.error("Erro ao atualizar o perfil.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="glass-card w-full max-w-lg rounded-2xl overflow-hidden flex flex-col" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold">Editar Perfil</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><FiX size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary"><FiUser/>Nome de Usuário</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold" />
              </div>
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary"><FiImage/>URL do Avatar</label>
                <input type="url" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold" />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-accent-gold text-primary font-inter font-bold py-3 px-6 rounded-lg hover:brightness-110 disabled:opacity-50">
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;