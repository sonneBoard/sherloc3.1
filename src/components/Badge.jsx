import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ badge }) => {
  return (
    <motion.div
      className="relative group flex flex-col items-center text-center"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Moldura da Medalha atualizada para o tema escuro */}
      <div className="w-16 h-16 bg-secondary rounded-full p-1 border-2 border-white/10 flex items-center justify-center overflow-hidden">
        <img 
          src={badge.image_url} 
          alt={badge.name} 
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <p className="mt-2 text-xs font-semibold text-text-primary">{badge.name}</p>

      {/* Tooltip com a Descrição */}
      <div className="absolute bottom-full mb-2 w-48 p-2 bg-primary text-text-primary border border-white/10 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {badge.description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-primary"></div>
      </div>
    </motion.div>
  );
};

export default Badge;