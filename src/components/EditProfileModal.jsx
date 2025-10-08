// src/components/EditProfileModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiUser, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
<<<<<<< HEAD
=======
import ErrorNotification from './ErrorNotification';
>>>>>>> master

const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [user, setUser] = useState(null);
<<<<<<< HEAD
=======
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  
  const showErrorNotification = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };
>>>>>>> master

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

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updates = {
        username,
        avatar_url: avatarUrl,
=======
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validar tamanho (máx 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showErrorNotification("A imagem deve ter no máximo 2MB");
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      showErrorNotification("Por favor, selecione uma imagem válida");
      return;
    }

    try {
      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Primeiro, tentar remover arquivo existente se houver
      if (avatarUrl && avatarUrl.includes('supabase')) {
        const oldPath = avatarUrl.split('/').pop();
        await supabase.storage.from('avatars').remove([`avatars/${oldPath}`]);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      showErrorNotification("Erro ao fazer upload da imagem. Verifique se o bucket 'avatars' existe no Supabase Storage.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação
    if (!username || username.trim() === '') {
      showErrorNotification("Você não adicionou um nome de usuário");
      return;
    }

    if (username.length < 3) {
      showErrorNotification("O nome de usuário deve ter pelo menos 3 caracteres");
      return;
    }

    setLoading(true);
    try {
      // Verificar se o username já existe (exceto o próprio usuário)
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

      if (existingUser) {
        showErrorNotification("Esse nome de usuário já está em uso");
        setLoading(false);
        return;
      }

      const updates = {
        username: username.trim(),
        avatar_url: avatarUrl || null,
>>>>>>> master
        updated_at: new Date(),
      };
      
      const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
      if (error) throw error;
      
      toast.success("Perfil atualizado com sucesso!");
      onProfileUpdated();
      onClose();

    } catch (error) {
<<<<<<< HEAD
      toast.error("Erro ao atualizar o perfil.");
=======
      if (error.code === '23505') {
        showErrorNotification("Esse nome de usuário já está em uso");
      } else {
        showErrorNotification("Não foi possível editar o perfil");
      }
>>>>>>> master
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
<<<<<<< HEAD
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div className="glass-card w-full max-w-lg rounded-2xl overflow-hidden flex flex-col" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onClick={(e) => e.stopPropagation()}>
=======
    <>
      <ErrorNotification 
        isVisible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
      <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
          <motion.div 
            className="glass-card w-full max-w-lg rounded-2xl overflow-hidden flex flex-col" 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
>>>>>>> master
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold">Editar Perfil</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10"><FiX size={24} /></button>
            </div>
            
<<<<<<< HEAD
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
=======
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-primary">
                  <FiUser/>Nome de Usuário
                </label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  className="w-full bg-secondary p-3 rounded-lg border border-white/10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold" 
                  placeholder="Digite seu nome de usuário"
                  required
                />
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-primary">
                  <FiImage/>Foto de Perfil
                </label>
                
                {/* Preview do avatar */}
                {avatarUrl && (
                  <div className="mb-3 flex justify-center">
                    <img 
                      src={avatarUrl} 
                      alt="Preview" 
                      className="w-20 h-20 rounded-full object-cover border-2 border-accent-gold"
                    />
                  </div>
                )}
                
                {/* Opção 1: Upload de arquivo */}
                <div className="mb-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="w-full bg-secondary/50 p-3 rounded-lg border border-white/10 hover:border-accent-gold/50 transition-colors cursor-pointer text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-gold file:text-primary hover:file:brightness-110"
                    disabled={loading}
                  />
                </div>
                
                {/* Opção 2: URL */}
                <div>
                  <p className="text-xs text-text-secondary mb-2">Ou insira uma URL:</p>
                  <input 
                    type="url" 
                    value={avatarUrl} 
                    onChange={(e) => setAvatarUrl(e.target.value)} 
                    className="w-full bg-secondary p-3 rounded-lg border border-white/10 text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold" 
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading} 
                  className="bg-accent-gold text-primary font-inter font-bold py-3 px-6 rounded-lg hover:brightness-110 disabled:opacity-50 transition-all"
                >
>>>>>>> master
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </motion.div>
<<<<<<< HEAD
        </motion.div>
      )}
    </AnimatePresence>
=======
        </div>
      )}
    </AnimatePresence>
    </>
>>>>>>> master
  );
};

export default EditProfileModal;