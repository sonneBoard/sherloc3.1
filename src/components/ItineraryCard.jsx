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
      className="bg-background rounded-2xl overflow-hidden shadow-lg border border-border-light flex flex-col h-full hover:shadow-xl transition-shadow duration-300"
    >
      <img 
        src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
        alt={`Imagem de ${itinerary.name}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-poppins text-xl font-bold text-text-primary mb-2">{itinerary.name}</h3>
        <p className="text-text-secondary text-sm mb-4 flex-grow">{itinerary.description || 'Uma aventura inesquecível espera por você.'}</p>
        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border-light">
          <button 
            onClick={() => onViewMore(itinerary.id)}
            className="flex-1 bg-gold text-white font-inter font-semibold text-sm py-2 px-4 rounded-lg hover:bg-coral transition-colors"
          >
            Ver Mais
          </button>
          <button 
            onClick={() => onEdit(itinerary.id)}
            className="flex-1 bg-gray-100 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-border-light hover:bg-gray-200 transition-colors"
          >
            Editar
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryCard;