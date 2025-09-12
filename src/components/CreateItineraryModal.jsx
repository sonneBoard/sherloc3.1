// src/components/CreateItineraryModal.jsx
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiType, FiFileText, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

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

const CreateItineraryModal = ({ isOpen, onClose, onItineraryCreated, initialLocation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // --- LÓGICA PARA BADGES (VERSÃO CORRIGIDA E ATUALIZADA) ---
      
      // 1. Badge "Pioneiro" (ID 1)
      const { count, error: countError } = await supabase.from('itineraries').select('*', { count: 'exact', head: true }).eq('created_by', user.id);
      if (countError) throw countError;

      if (count === 1) {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 1 }]);
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Pioneiro!', { icon: '🏆', duration: 4000 });
        }
      }

      // 2. Badge "Fotógrafo" (ID 4)
      if (imageUrl && imageUrl.trim() !== '') {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 4 }]);
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Fotógrafo!', { icon: '📸', duration: 4000 });
        }
      }
      // ----------------------------------------------------

      if (initialLocation && newItinerary) {
        const { error: locationError } = await supabase.from('itinerary_locations').insert([{ itinerary_id: newItinerary.id, location_id: initialLocation.id, visit_order: 0 }]);
        if (locationError) throw locationError;
      }
      
      onItineraryCreated(newItinerary);
      onClose();

    } catch (error) {
      toast.error(error.message || "Erro ao criar o roteiro.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold text-text-primary">Criar Novo Roteiro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
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
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={loading} className="bg-accent-gold text-primary font-inter font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-colors disabled:opacity-50">
                  {loading ? 'Salvando...' : 'Salvar Roteiro'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateItineraryModal;