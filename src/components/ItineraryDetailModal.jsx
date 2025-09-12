// src/components/ItineraryDetailModal.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Adicionamos o ícone de lixo (FiTrash2)
import { FiX, FiMapPin, FiTrash2 } from 'react-icons/fi';

// 2. O componente agora aceita a propriedade 'onDelete'
const ItineraryDetailModal = ({ itineraryId, onClose, onDelete }) => {
  const [itinerary, setItinerary] = useState(null); //
  const [loading, setLoading] = useState(true); //

  // A sua lógica para buscar os detalhes do roteiro foi mantida
  useEffect(() => {
    const fetchItineraryDetails = async () => {
      if (!itineraryId) return; //
      setLoading(true); //
      try {
        const { data, error } = await supabase
          .from('itineraries') //
          .select(`id, name, description, image_url, itinerary_locations(locations(id, name, category))`) //
          .eq('id', itineraryId) //
          .single(); //
        if (error) throw error; //
        setItinerary(data); //
      } catch (error) {
        console.error("Erro ao buscar detalhes do roteiro:", error); //
      } finally {
        setLoading(false); //
      }
    };
    fetchItineraryDetails();
  }, [itineraryId]); //

  // As suas variantes de animação foram mantidas
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }; //

  const modalVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { y: 50, opacity: 0, transition: { duration: 0.2 } },
  }; //

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
        variants={backdropVariants} initial="hidden" animate="visible" exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          variants={modalVariants} initial="hidden" animate="visible" exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          {loading ? (
            <div className="p-8 text-center text-text-secondary">Carregando detalhes...</div> //
          ) : itinerary ? (
            <>
              {/* A sua seção de imagem e conteúdo principal foi mantida */}
              <div className="relative">
                <img src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} alt={itinerary.name} className="w-full h-64 object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 bg-primary/70 text-text-primary p-2 rounded-full hover:bg-primary/90 backdrop-blur-sm transition-colors">
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-8 flex-grow overflow-y-auto">
                <h2 className="font-poppins text-4xl font-bold text-accent-glow mb-2">{itinerary.name}</h2>
                <p className="text-text-primary mb-6">{itinerary.description}</p>
                <h3 className="font-poppins text-2xl font-bold mb-4 text-text-primary">Locais neste Roteiro</h3>
                <ul className="space-y-3">
                  {itinerary.itinerary_locations.length > 0 ? (
                    itinerary.itinerary_locations.map(item => (
                      <li key={item.locations.id} className="bg-secondary/50 p-4 rounded-lg flex items-center gap-4 border border-white/10">
                        <FiMapPin className="text-accent-gold flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold text-text-primary">{item.locations.name}</p>
                          <p className="text-xs text-text-secondary">{item.locations.category}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-text-secondary">Nenhum local adicionado a este roteiro ainda.</p>
                  )}
                </ul>
              </div>

              {/* --- 3. BOTÃO DE APAGAR ADICIONADO AQUI --- */}
              <div className="p-6 border-t border-white/10 mt-auto">
                <button 
                  onClick={onDelete}
                  className="w-full flex items-center justify-center gap-2 bg-red-500/10 text-red-400 font-inter font-semibold py-3 rounded-lg hover:bg-red-500/20 hover:text-red-300 transition-colors"
                >
                  <FiTrash2 />
                  Apagar Roteiro
                </button>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-text-secondary">Roteiro não encontrado.</div> //
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItineraryDetailModal;