// src/components/EditItineraryModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiType, FiFileText, FiImage, FiCalendar, FiGlobe } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

// Reutilizamos o InputField do CreateItineraryModal (pode ser movido para um ficheiro separado)
const InputField = ({ icon, label, ...props }) => (
    <div>
      <label className="text-sm font-semibold mb-2 flex items-center gap-2 text-gray-300">{icon}{label}</label>
      <input {...props} className="w-full bg-sherloc-dark p-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sherloc-purple transition-all" />
    </div>
);


const EditItineraryModal = ({ itineraryId, isOpen, onClose, onItineraryUpdated }) => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItinerary = async () => {
      if (!itineraryId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase.from('itineraries').select('*').eq('id', itineraryId).single();
        if (error) throw error;
        setItinerary(data);
      } catch (error) {
        toast.error("Erro ao carregar dados do roteiro.");
      } finally {
        setLoading(false);
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
    setLoading(true);
    try {
      const { id, created_by, ...updateData } = itinerary;
      const { data, error } = await supabase.from('itineraries').update(updateData).eq('id', id).select().single();
      if (error) throw error;
      toast.success("Roteiro atualizado com sucesso!");
      onItineraryUpdated(data);
      onClose();
    } catch (error) {
      toast.error("Erro ao atualizar o roteiro.");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    // O JSX do modal é muito similar ao de criação, mas com os valores ligados ao estado 'itinerary'
    // (Omitido para ser breve, mas é um formulário preenchido com os dados do 'itinerary')
    <AnimatePresence>
      {/* ... JSX do modal de edição aqui ... */}
    </AnimatePresence>
  );
};

export default EditItineraryModal;