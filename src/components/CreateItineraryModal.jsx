// src/components/CreateItineraryModal.jsx
<<<<<<< HEAD
import React, { useState } from 'react';
=======
import React, { useState, useEffect } from 'react';
>>>>>>> master
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiType, FiFileText, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
<<<<<<< HEAD

const InputField = ({ icon, label, isTextArea = false, ...props }) => (
  // O seu componente InputField foi mantido
  <div>
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">{icon}{label}</label>
    {isTextArea ? (
      <textarea {...props} rows="3" className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-primary" />
    ) : (
      <input {...props} className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-primary" />
    )}
  </div>
);
=======
import InputField from './ui/InputField';
import ErrorNotification from './ErrorNotification';
>>>>>>> master

const CreateItineraryModal = ({ isOpen, onClose, onItineraryCreated, initialLocation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
<<<<<<< HEAD
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
=======
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  
  const showErrorNotification = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showErrorNotification("A imagem deve ter no máximo 2MB");
      return;
    }

    if (!file.type.startsWith('image/')) {
      showErrorNotification("Por favor, selecione uma imagem válida");
      return;
    }

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `itineraries/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('itineraries')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('itineraries')
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      showErrorNotification("Erro ao fazer upload da imagem. Verifique se o bucket 'itineraries' existe no Supabase Storage.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // A função handleSubmit com validação detalhada
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação detalhada com notificações personalizadas
    if (!name || name.trim() === '') {
      showErrorNotification("Você não adicionou um nome ao seu roteiro");
      return;
    }
    
    if (!description || description.trim() === '') {
      showErrorNotification("Você não adicionou uma descrição ao seu roteiro");
      return;
    }
    
    // Validar data de início
    const today = new Date().toISOString().split('T')[0];
    if (startDate && startDate < today) {
      showErrorNotification("Você não pode adicionar uma data antes do dia de hoje");
      return;
    }
    
    // Validar se data de fim é posterior à data de início
    if (startDate && endDate && endDate < startDate) {
      showErrorNotification("A data de fim não pode ser anterior à data de início");
      return;
    }
    
>>>>>>> master
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const newItineraryData = {
        name, description, image_url: imageUrl,
        start_date: startDate || null,
        end_date: endDate || null,
        is_public: isPublic, created_by: user.id,
      };

      const { data: newItinerary, error: itineraryError } = await supabase.from('itineraries').insert([newItineraryData]).select().single();
      if (itineraryError) throw itineraryError;
      
      toast.success("Roteiro criado com sucesso!");

<<<<<<< HEAD
      // --- LÓGICA PARA BADGES (VERSÃO CORRIGIDA E ATUALIZADA) ---
      
      // 1. Badge "Pioneiro" (ID 1)
      const { count, error: countError } = await supabase.from('itineraries').select('*', { count: 'exact', head: true }).eq('created_by', user.id);
      if (countError) throw countError;

      if (count === 1) {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 1 }]);
=======
      // Conceder XP ao criar roteiro usando o sistema corrigido
      try {
        const { updateUserXpAndLevel } = await import('../utils/levelSystem.js');
        const xpToAdd = 50; // XP concedido por criar um roteiro
        
        const levelData = await updateUserXpAndLevel(supabase, user.id, xpToAdd);
        
        if (levelData.leveledUp) {
          toast.success(`🎉 Parabéns! Você subiu para o nível ${levelData.level}!`, { duration: 5000 });
        }
      } catch (error) {
        console.error('Erro ao atualizar XP:', error);
      }

      // Lógica de Badges aprimorada
      const { count, error: countError } = await supabase.from('itineraries').select('*', { count: 'exact', head: true }).eq('created_by', user.id);
      if (countError) throw countError;

      // Badge 1: Primeiro roteiro - "Pioneiro"
      if (count === 1) {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 1, earned_at: new Date().toISOString() }]);
>>>>>>> master
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Pioneiro!', { icon: '🏆', duration: 4000 });
        }
      }

<<<<<<< HEAD
      // 2. Badge "Fotógrafo" (ID 4)
      if (imageUrl && imageUrl.trim() !== '') {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 4 }]);
=======
      // Badge 4: Adicionou imagem de capa - "Fotógrafo"
      if (imageUrl && imageUrl.trim() !== '') {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 4, earned_at: new Date().toISOString() }]);
>>>>>>> master
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Fotógrafo!', { icon: '📸', duration: 4000 });
        }
      }
<<<<<<< HEAD
      // ----------------------------------------------------
=======

      // Badge 5: Criou roteiro com data de início e fim - "Viajante do Tempo"
      if (startDate && endDate) {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 5, earned_at: new Date().toISOString() }]);
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Viajante do Tempo!', { icon: '⏰', duration: 4000 });
        }
      }
>>>>>>> master

      if (initialLocation && newItinerary) {
        const { error: locationError } = await supabase.from('itinerary_locations').insert([{ itinerary_id: newItinerary.id, location_id: initialLocation.id, visit_order: 0 }]);
        if (locationError) throw locationError;
      }
      
      onItineraryCreated(newItinerary);
      onClose();

    } catch (error) {
<<<<<<< HEAD
      toast.error(error.message || "Erro ao criar o roteiro.");
=======
      showErrorNotification(error.message || "Ocorreu um erro inesperado, tente novamente mais tarde");
>>>>>>> master
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  // O seu JSX foi mantido
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
=======
  return (
    <>
      <ErrorNotification 
        isVisible={showError}
        message={errorMessage}
        onClose={() => setShowError(false)}
      />
      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
            onClick={onClose}
          >
          <motion.div
            className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
>>>>>>> master
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold text-text-primary">Criar Novo Roteiro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
<<<<<<< HEAD
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
              <InputField icon={<FiType/>} label="Nome do Roteiro" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Fim de Semana em Campos do Jordão" required />
              <InputField icon={<FiFileText/>} label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Um resumo sobre a viagem..." isTextArea />
              <InputField icon={<FiImage/>} label="URL da Imagem de Capa" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://exemplo.com/imagem.jpg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField icon={<FiCalendar/>} label="Data de Início" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" />
                <InputField icon={<FiCalendar/>} label="Data de Fim" value={endDate} onChange={(e) => setEndDate(e.target.value)} type="date" />
              </div>
              <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-accent-gold" />
                  <div>
                    <label htmlFor="is_public" className="font-semibold text-text-primary">Roteiro Público</label>
                    <p className="text-xs text-text-secondary">Outros usuários poderão ver este roteiro.</p>
                  </div>
                </div>
                <input type="checkbox" id="is_public" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              </div>
=======
           <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto overscroll-y-contain">
              <InputField 
                icon={<FiType/>} 
                label="Nome do Roteiro" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Ex: Fim de Semana em Campos do Jordão" 
                required 
              />
              <InputField 
                icon={<FiFileText/>} 
                label="Descrição" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Um resumo sobre a viagem e o que a torna especial..." 
                isTextArea 
              />
              
              {/* Seção de Imagem com Upload */}
              <div>
                <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">
                  <FiImage/>Imagem de Capa (Opcional)
                </label>
                

                
                <div className="mb-3">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="w-full bg-secondary/50 p-3 rounded-lg border border-white/10 hover:border-accent-gold/50 transition-colors cursor-pointer text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-gold file:text-primary hover:file:brightness-110"
                    disabled={loading}
                  />
                </div>
                
                <div>
                  <p className="text-xs text-text-secondary mb-2">Ou insira uma URL:</p>
                  <input 
                    type="url" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="https://exemplo.com/imagem.jpg"
                    className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-primary placeholder:text-text-secondary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField 
                  icon={<FiCalendar/>} 
                  label="Data de Início" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                />
                <InputField 
                  icon={<FiCalendar/>} 
                  label="Data de Fim" 
                  value={endDate} 
                  onChange={(e) => setEndDate(e.target.value)} 
                  type="date" 
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
              
              {/* Seção "Roteiro Público" atualizada */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <FiGlobe className="text-accent-gold" />
                  <div>
                    <label htmlFor="is_public" className="font-semibold text-text-primary cursor-pointer">
                      Tornar este roteiro público
                    </label>
                    <p className="text-xs text-text-secondary">
                      Permita que outros viajantes na comunidade vejam e se inspirem.
                    </p>
                  </div>
                </div>
               {/* --- NOVO SWITCH TOGGLE APRIMORADO --- */}
<button
  type="button"
  onClick={() => setIsPublic(!isPublic)}
  className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-secondary ${
    isPublic ? 'bg-accent-gold' : 'bg-secondary'
  }`}
>
  <motion.span
    layout
    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
    style={{
      translateX: isPublic ? '1.75rem' : '0.25rem', // 28px ou 4px
    }}
  />
</button>
              </div>

>>>>>>> master
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-accent-gold text-primary font-inter font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-colors disabled:opacity-50">
                  {loading ? 'Salvando...' : 'Salvar Roteiro'}
                </button>
              </div>
            </form>
          </motion.div>
<<<<<<< HEAD
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateItineraryModal;
=======
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default CreateItineraryModal;
>>>>>>> master
