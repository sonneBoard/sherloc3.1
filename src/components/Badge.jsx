import React from 'react';
import { motion } from 'framer-motion';

const Badge = ({ badge, isUnlocked = false }) => {
  if (!badge) return null;

  const tooltipText = isUnlocked 
    ? badge.description 
    : `Bloqueado: ${badge.description}`;

  return (
    <motion.div
      className="flex flex-col items-center gap-2 text-center"
      title={tooltipText}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
<<<<<<< HEAD
      {/* 1. Esta 'div' é a nova moldura circular */}
      <div
        className={`w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center p-2 border-2 border-transparent transition-all duration-300 ${isUnlocked ? 'border-accent-gold/30' : 'grayscale'}`}
=======
      {/* Imagem circular sem bordas */}
      <div
        className={`w-16 h-16 rounded-full overflow-hidden transition-all duration-300 ${isUnlocked ? '' : 'grayscale'}`}
>>>>>>> master
      >
        <img
          src={badge.image_url}
          alt={badge.name}
<<<<<<< HEAD
          // 2. A imagem agora se ajusta dentro da moldura
          className={`w-full h-full object-contain transition-all duration-300 ${isUnlocked ? '' : 'opacity-40'}`}
        />
      </div>
      <p 
        className={`text-xs font-semibold transition-colors ${isUnlocked ? 'text-text-secondary' : 'text-text-secondary/40'}`}
      >
        {isUnlocked ? badge.name : '???'}
      </p>
=======
          className={`w-full h-full object-cover transition-all duration-300 ${isUnlocked ? '' : 'opacity-40'}`}
        />
      </div>
      {isUnlocked && (
        <p className="text-xs font-semibold text-text-secondary">
          {badge.name}
        </p>
      )}
>>>>>>> master
    </motion.div>
  );
};

export default Badge;