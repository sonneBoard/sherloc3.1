<<<<<<< HEAD
=======
// src/components/EditItineraryModal.jsx
>>>>>>> master
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiType, FiFileText, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
<<<<<<< HEAD

// InputField atualizado para o tema cinematográfico
const InputField = ({ icon, label, isTextArea = false, ...props }) => (
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
import InputField from './ui/InputField'; // Usando o mesmo InputField
import ErrorNotification from './ErrorNotification';
>>>>>>> master

const EditItineraryModal = ({ itineraryId, isOpen, onClose, onItineraryUpdated }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
<<<<<<< HEAD

=======
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  
  const showErrorNotification = (message) => {
    setErrorMessage(message);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  // Efeito para bloquear o scroll do body (consistência)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Lógica para buscar os dados do roteiro a ser editado (mantida)
>>>>>>> master
  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) return;
      setLoadingData(true);
      try {
        const { data, error } = await supabase.from('itineraries').select('*').eq('id', itineraryId).single();
        if (error) throw error;
<<<<<<< HEAD
        // Garante que os valores nulos não quebrem os inputs
=======
>>>>>>> master
        setItinerary({
          ...data,
          start_date: data.start_date || '',
          end_date: data.end_date || '',
          description: data.description || '',
          image_url: data.image_url || '',
        });
      } catch (error) {
        toast.error("Erro ao carregar dados do roteiro.");
      } finally {
        setLoadingData(false);
      }
    };
<<<<<<< HEAD
    fetchItinerary();
  }, [itineraryId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setItinerary(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const { id, created_at, created_by, ...updateData } = itinerary;
      const { data, error } = await supabase.from('itineraries').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      toast.success("Roteiro atualizado com sucesso!");

      // --- NOVA LÓGICA: Badge "Fotógrafo" (ID 4) ---
      if (itinerary.image_url && itinerary.image_url.trim() !== '') {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 4 }]);
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Fotógrafo!', { icon: '📸' });
        }
      }
      // ------------------------------------
=======
    if (isOpen) {
      fetchItinerary();
    }
  }, [itineraryId, isOpen]);

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
      setIsSaving(true);
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

      setItinerary(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Imagem carregada com sucesso!");
    } catch (error) {
      showErrorNotification("Erro ao fazer upload da imagem. Verifique se o bucket 'itineraries' existe no Supabase Storage.");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Manipulador genérico para atualizar o estado do formulário (mantido)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItinerary(prev => ({ ...prev, [name]: value }));
  };

  // Manipulador para o toggle switch
  const handleTogglePublic = () => {
    setItinerary(prev => ({ ...prev, is_public: !prev.is_public }));
  };

  // Lógica para salvar as alterações (corrigida com validação e imagem padrão)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação detalhada com notificações personalizadas
    if (!itinerary.name || itinerary.name.trim() === '') {
      showErrorNotification("Você não adicionou um nome ao seu roteiro");
      return;
    }
    
    if (!itinerary.description || itinerary.description.trim() === '') {
      showErrorNotification("Você não adicionou uma descrição ao seu roteiro");
      return;
    }
    
    // Validar data de início
    const today = new Date().toISOString().split('T')[0];
    if (itinerary.start_date && itinerary.start_date < today) {
      showErrorNotification("Você não pode adicionar uma data antes do dia de hoje");
      return;
    }
    
    // Validar se data de fim é posterior à data de início
    if (itinerary.start_date && itinerary.end_date && itinerary.end_date < itinerary.start_date) {
      showErrorNotification("A data de fim não pode ser anterior à data de início");
      return;
    }
    
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado.");

      const { id, created_at, created_by, ...updateData } = itinerary;
      
      // Se não houver imagem, definir a imagem padrão
      if (!updateData.image_url || updateData.image_url.trim() === '') {
        updateData.image_url = 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318';
      }
      
      const { data, error } = await supabase.from('itineraries').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      
      toast.success("Roteiro atualizado com sucesso!");

      // Lógica de Badge "Fotógrafo" (mantida)
      if (itinerary.image_url && itinerary.image_url.trim() !== '') {
        const { error: badgeError } = await supabase.from('user_badges').insert([{ user_id: user.id, badge_id: 4 }]);
        if (badgeError && badgeError.code !== '23505') { throw badgeError; }
        if (!badgeError) {
          toast.success('✨ Conquista Desbloqueada: Fotógrafo!', { icon: '📸', duration: 4000 });
        }
      }
>>>>>>> master

      onItineraryUpdated(data);
      onClose();
    } catch (error) {
<<<<<<< HEAD
      toast.error("Erro ao atualizar o roteiro.");
=======
      showErrorNotification(error.message || "Ocorreu um erro inesperado, tente novamente mais tarde");
>>>>>>> master
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
<<<<<<< HEAD
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
=======
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
>>>>>>> master
          onClick={onClose}
        >
          <motion.div
            className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
<<<<<<< HEAD
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
=======
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
>>>>>>> master
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-white/10">
              <h2 className="font-poppins text-2xl font-bold text-text-primary">Editar Roteiro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            {loadingData ? (
              <div className="p-8 text-center text-text-secondary">Carregando...</div>
            ) : (
<<<<<<< HEAD
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <InputField icon={<FiType/>} label="Nome do Roteiro" name="name" value={itinerary?.name || ''} onChange={handleChange} required />
                <InputField icon={<FiFileText/>} label="Descrição" name="description" value={itinerary?.description || ''} onChange={handleChange} isTextArea />
                <InputField icon={<FiImage/>} label="URL da Imagem de Capa" name="image_url" value={itinerary?.image_url || ''} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField icon={<FiCalendar/>} label="Data de Início" name="start_date" value={itinerary?.start_date || ''} onChange={handleChange} type="date" />
                  <InputField icon={<FiCalendar/>} label="Data de Fim" name="end_date" value={itinerary?.end_date || ''} onChange={handleChange} type="date" />
                </div>
                <div className="flex items-center justify-between bg-secondary/50 p-4 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-accent-gold" />
                    <div>
                      <label htmlFor="is_public" className="font-semibold text-text-primary">Roteiro Público</label>
                      <p className="text-xs text-text-secondary">Outros usuários poderão ver este roteiro.</p>
                    </div>
                  </div>
                  <input type="checkbox" id="is_public" name="is_public" checked={itinerary?.is_public || false} onChange={handleChange} />
                </div>
=======
              <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto overscroll-y-contain">
                <InputField 
                  icon={<FiType/>} 
                  label="Nome do Roteiro" 
                  name="name" 
                  value={itinerary?.name || ''} 
                  onChange={handleChange} 
                  required 
                />
                <InputField 
                  icon={<FiFileText/>} 
                  label="Descrição" 
                  name="description" 
                  value={itinerary?.description || ''} 
                  onChange={handleChange} 
                  isTextArea 
                />
                
                {/* Seção de Imagem com Upload */}
                <div>
                  <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">
                    <FiImage/>Imagem de Capa (Opcional)
                  </label>
                  
                  {itinerary?.image_url && (
                    <div className="mb-3 flex justify-center">
                      <img 
                        src={itinerary.image_url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border-2 border-accent-gold"
                      />
                    </div>
                  )}
                  
                  <div className="mb-3">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="w-full bg-secondary/50 p-3 rounded-lg border border-white/10 hover:border-accent-gold/50 transition-colors cursor-pointer text-text-primary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-gold file:text-primary hover:file:brightness-110"
                      disabled={isSaving}
                    />
                  </div>
                  
                  <div>
                    <p className="text-xs text-text-secondary mb-2">Ou insira uma URL:</p>
                    <input 
                      type="url" 
                      name="image_url"
                      value={itinerary?.image_url || ''} 
                      onChange={handleChange} 
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="w-full bg-secondary p-3 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold transition-all text-text-primary placeholder:text-text-secondary"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField 
                    icon={<FiCalendar/>} 
                    label="Data de Início" 
                    name="start_date" 
                    value={itinerary?.start_date || ''} 
                    onChange={handleChange} 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <InputField 
                    icon={<FiCalendar/>} 
                    label="Data de Fim" 
                    name="end_date" 
                    value={itinerary?.end_date || ''} 
                    onChange={handleChange} 
                    type="date" 
                    min={itinerary?.start_date || new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {/* Seção "Roteiro Público" com o novo switch */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-accent-gold" />
                    <div>
                      <label className="font-semibold text-text-primary cursor-pointer">
                        Tornar este roteiro público
                      </label>
                      <p className="text-xs text-text-secondary">
                        Permita que outros viajantes na comunidade vejam e se inspirem.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleTogglePublic}
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 focus:ring-offset-secondary ${
                      itinerary?.is_public ? 'bg-accent-gold' : 'bg-secondary'
                    }`}
                  >
                    <motion.span
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className="inline-block h-6 w-6 transform rounded-full bg-white shadow-lg"
                      style={{
                        translateX: itinerary?.is_public ? '1.75rem' : '0.25rem',
                      }}
                    />
                  </button>
                </div>

>>>>>>> master
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-accent-gold text-primary font-inter font-bold py-3 px-6 rounded-lg hover:brightness-110 transition-colors disabled:opacity-50">
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
<<<<<<< HEAD
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditItineraryModal;
=======
        </div>
      )}
    </AnimatePresence>
    </>
  );
};

export default EditItineraryModal;
>>>>>>> master
