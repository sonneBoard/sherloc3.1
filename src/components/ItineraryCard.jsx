import React from 'react';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';

// O card agora aceita uma nova prop: 'variant' ('my-itineraries' ou 'explore')
const ItineraryCard = ({ itinerary, onViewMore, onEdit, onClone, variant = 'my-itineraries' }) => {
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={cardVariants}
      className="glass-card rounded-2xl overflow-hidden flex flex-col h-full hover:border-white/20 transition-colors duration-300"
    >
      <img 
        src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
        alt={`Imagem de ${itinerary.name}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-poppins text-xl font-bold text-text-primary mb-2">{itinerary.name}</h3>
        <p className="text-text-secondary text-sm mb-4 flex-grow">{itinerary.description || 'Uma aventura inesquecível espera por você.'}</p>
        
        {/* Mostra o nome do criador se estiver na página Explorar */}
        {variant === 'explore' && itinerary.profiles && (
          <div className="flex items-center gap-2 text-xs text-text-secondary mb-4">
            <FiUser />
            <span>Criado por {itinerary.profiles.username}</span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-auto pt-4 border-t border-white/10">
          {/* Renderização condicional dos botões */}
          {variant === 'my-itineraries' ? (
            <>
              <button onClick={() => onViewMore(itinerary.id)} className="flex-1 bg-accent-gold text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg hover:brightness-110">Ver Mais</button>
              <button onClick={() => onEdit(itinerary.id)} className="flex-1 bg-secondary/70 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-secondary">Editar</button>
            </>
          ) : (
            <>
              <button onClick={() => onViewMore(itinerary.id)} className="flex-1 bg-secondary/70 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-secondary">Ver Detalhes</button>
              <button onClick={() => onClone(itinerary.id)} className="flex-1 bg-accent-gold text-primary font-inter font-semibold text-sm py-2 px-4 rounded-lg hover:brightness-110">Salvar Roteiro</button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ItineraryCard;