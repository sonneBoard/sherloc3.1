// src/components/ItineraryListItem.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiMoreVertical, FiEdit, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';

const ItineraryListItem = ({ itinerary, onView, onEdit }) => {
  const hasDates = itinerary.start_date && itinerary.end_date;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full flex items-center gap-4 p-4 glass-card rounded-xl hover:border-white/20 transition-colors duration-300"
    >
      <img 
        src={itinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
        alt={itinerary.name}
        className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
      />
      <div className="flex-grow">
        <p className="font-semibold text-text-primary">{itinerary.name}</p>
        <p className="text-xs text-text-secondary truncate max-w-md">{itinerary.description || 'Sem descrição'}</p>
      </div>
      
      {hasDates && (
        <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary flex-shrink-0">
          <FiCalendar />
          <span>
            {format(new Date(itinerary.start_date), 'dd/MM/yy')} - {format(new Date(itinerary.end_date), 'dd/MM/yy')}
          </span>
        </div>
      )}

      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onView(itinerary.id)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Ver Detalhes">
          <FiEye />
        </button>
        <button onClick={() => onEdit(itinerary.id)} className="p-2 rounded-full hover:bg-white/10 transition-colors" title="Editar">
          <FiEdit />
        </button>
      </div>
    </motion.div>
  );
};

export default ItineraryListItem;