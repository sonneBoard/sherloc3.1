// src/components/Badge.jsx
import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ badge }) => {
  return (
    <motion.div
      className="relative group flex flex-col items-center text-center"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {/* Moldura da Medalha */}
      {/* A classe 'p-2' foi REMOVIDA daqui */}
      <div className="w-16 h-16 bg-gray-100 rounded-full border-2 border-border-light flex items-center justify-center overflow-hidden">
        <img 
          src={badge.image_url} 
          alt={badge.name} 
          // As classes 'object-cover' e 'rounded-full' foram ADICIONADAS aqui
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      {/* Nome do Badge */}
      <p className="mt-2 text-xs font-semibold text-text-primary">{badge.name}</p>

      {/* Tooltip com a Descrição */}
      <div className="absolute bottom-full mb-2 w-48 p-2 bg-text-primary text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {badge.description}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-text-primary"></div>
      </div>
    </motion.div>
  );
};

export default Badge;