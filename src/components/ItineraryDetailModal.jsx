// src/components/ItineraryDetailModal.jsx
import React from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMapPin } from 'react-icons/fi';

const ItineraryDetailModal = ({ itineraryId, onClose }) => {
  const [itinerary, setItinerary] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchItineraryDetails = async () => {
      if (!itineraryId) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('itineraries')
          .select(`
            id, name, description, image_url,
            itinerary_locations(locations(id, name, category))
          `)
          .eq('id', itineraryId)
          .single();

        if (error) throw error;
        setItinerary(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do roteiro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryDetails();
  }, [itineraryId]);

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { y: "100vh", opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    exit: { y: "100vh", opacity: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
         className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose} // Fecha ao clicar no fundo
      >
        <motion.div
          key="modal"
          className="glass-card w-full max-w-2xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()} // Impede que o clique no modal feche-o
        >
          {loading ? (
            <div className="p-8 text-center">Carregando detalhes...</div>
          ) : itinerary ? (
            <>
              <div className="relative">
                <img src={itinerary.image_url} alt={itinerary.name} className="w-full h-64 object-cover" />
                <button onClick={onClose} className="absolute top-4 right-4 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors">
                  <FiX size={24} />
                </button>
              </div>
              <div className="p-8 flex-grow overflow-y-auto">
                <h2 className="font-poppins text-4xl font-bold text-sherloc-text-bright mb-2">{itinerary.name}</h2>
                <p className="text-gray-300 mb-6">{itinerary.description}</p>
                <h3 className="font-poppins text-2xl font-bold mb-4 text-sherloc-text-bright">Locais neste Roteiro</h3>
                <ul className="space-y-3">
                  {itinerary.itinerary_locations.length > 0 ? (
                    itinerary.itinerary_locations.map(item => (
                      <li key={item.locations.id} className="bg-sherloc-dark/50 p-4 rounded-lg flex items-center gap-4">
                        <FiMapPin className="text-sherloc-purple flex-shrink-0" size={20} />
                        <div>
                          <p className="font-semibold">{item.locations.name}</p>
                          <p className="text-xs text-gray-400">{item.locations.category}</p>
                        </div>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-400">Nenhum local adicionado a este roteiro ainda.</p>
                  )}
                </ul>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">Roteiro não encontrado.</div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ItineraryDetailModal;