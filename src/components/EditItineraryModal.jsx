import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiType, FiFileText, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Reutilizamos o componente InputField (pode ser movido para um ficheiro próprio no futuro)
const InputField = ({ icon, label, isTextArea = false, ...props }) => (
  <div>
    <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-text-secondary">{icon}{label}</label>
    {isTextArea ? (
      <textarea {...props} rows="3" className="w-full bg-gray-50 p-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-gold transition-all" />
    ) : (
      <input {...props} className="w-full bg-gray-50 p-3 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-gold transition-all" />
    )}
  </div>
);

const EditItineraryModal = ({ itineraryId, isOpen, onClose, onItineraryUpdated }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) return;
      setLoadingData(true);
      try {
        const { data, error } = await supabase.from('itineraries').select('*').eq('id', itineraryId).single();
        if (error) throw error;
        // Garante que os valores nulos não quebrem os inputs
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
      onItineraryUpdated(data);
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar o roteiro.");
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-background w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-xl overflow-hidden flex flex-col"
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex items-center justify-between border-b border-border-light">
              <h2 className="font-poppins text-2xl font-bold text-text-primary">Editar Roteiro</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <FiX size={24} />
              </button>
            </div>
            
            {loadingData ? (
              <div className="p-8 text-center text-text-secondary">Carregando...</div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                <InputField icon={<FiType/>} label="Nome do Roteiro" name="name" value={itinerary?.name || ''} onChange={handleChange} required />
                <InputField icon={<FiFileText/>} label="Descrição" name="description" value={itinerary?.description || ''} onChange={handleChange} isTextArea />
                <InputField icon={<FiImage/>} label="URL da Imagem de Capa" name="image_url" value={itinerary?.image_url || ''} onChange={handleChange} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField icon={<FiCalendar/>} label="Data de Início" name="start_date" value={itinerary?.start_date || ''} onChange={handleChange} type="date" />
                  <InputField icon={<FiCalendar/>} label="Data de Fim" name="end_date" value={itinerary?.end_date || ''} onChange={handleChange} type="date" />
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border border-border-light">
                  <div className="flex items-center gap-3">
                    <FiGlobe className="text-gold" />
                    <div>
                      <label htmlFor="is_public" className="font-semibold text-text-primary">Roteiro Público</label>
                      <p className="text-xs text-text-secondary">Outros usuários poderão ver este roteiro.</p>
                    </div>
                  </div>
                  <input type="checkbox" id="is_public" name="is_public" checked={itinerary?.is_public || false} onChange={handleChange} />
                </div>
                <div className="pt-4 flex justify-end">
                  <button type="submit" disabled={isSaving} className="bg-gold text-white font-inter font-bold py-3 px-6 rounded-lg hover:bg-coral transition-colors disabled:opacity-50">
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditItineraryModal;