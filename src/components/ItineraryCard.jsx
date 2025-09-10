// src/components/ItineraryCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const ItineraryCard = ({ itinerary, onViewMore, onEdit }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full"
    >
      <img 
        src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
        alt={`Imagem de ${itinerary.name}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-poppins text-2xl font-bold text-sherloc-text-bright mb-2">{itinerary.name}</h3>
        <p className="text-gray-400 text-sm mb-4 flex-grow">{itinerary.description || 'Uma aventura inesquecível espera por você.'}</p>
        <div className="flex items-center gap-4 mt-auto">
          <button 
            onClick={() => onViewMore(itinerary.id)}
            className="flex-1 bg-sherloc-purple text-white font-bold text-sm py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Ver Mais
          </button>
          <button 
            onClick={() => onEdit(itinerary.id)}
            className="flex-1 bg-sherloc-dark-2 text-sherloc-text font-bold text-sm py-3 px-4 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
          >
            Editar Roteiro
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryCard;