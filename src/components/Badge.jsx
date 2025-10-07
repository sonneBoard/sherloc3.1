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
      {/* Imagem circular sem bordas */}
      <div
        className={`w-16 h-16 rounded-full overflow-hidden transition-all duration-300 ${isUnlocked ? '' : 'grayscale'}`}
      >
        <img
          src={badge.image_url}
          alt={badge.name}
          className={`w-full h-full object-cover transition-all duration-300 ${isUnlocked ? '' : 'opacity-40'}`}
        />
      </div>
      {isUnlocked && (
        <p className="text-xs font-semibold text-text-secondary">
          {badge.name}
        </p>
      )}
    </motion.div>
  );
};

export default Badge;