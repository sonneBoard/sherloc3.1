// src/components/ItineraryCardSkeleton.jsx
import React from 'react';

const ItineraryCardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      {/* Placeholder da Imagem */}
      <div className="w-full h-48 bg-secondary/50 animate-pulse"></div>
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Placeholder do Título */}
        <div className="h-6 w-3/4 bg-secondary/50 rounded-md animate-pulse mb-3"></div>
        
        {/* Placeholder da Descrição */}
        <div className="space-y-2 flex-grow">
          <div className="h-4 w-full bg-secondary/50 rounded-md animate-pulse"></div>
          <div className="h-4 w-5/6 bg-secondary/50 rounded-md animate-pulse"></div>
        </div>
        
        {/* Placeholder dos Botões */}
        <div className="flex items-center gap-4 mt-6 pt-4 border-t border-white/10">
          <div className="h-9 flex-1 bg-secondary/50 rounded-lg animate-pulse"></div>
          <div className="h-9 flex-1 bg-secondary/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCardSkeleton;