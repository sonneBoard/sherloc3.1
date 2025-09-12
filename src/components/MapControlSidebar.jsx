// src/components/MapControlSidebar.jsx
import React from 'react';
import { FiSearch, FiSliders, FiPlus } from 'react-icons/fi';

const MapControlSidebar = ({ onNewItinerary, itineraries, isLoading }) => { 
  return (
    <div className="glass-card w-[380px] flex-shrink-0 rounded-2xl p-6 flex flex-col">
      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Pesquisar roteiros ou locais..."
          className="w-full bg-secondary p-3 pl-10 rounded-lg border border-white/10 focus:outline-none focus:ring-2 focus:ring-accent-gold text-text-primary transition-all"
        />
      </div>

      {/* --- SEÇÃO RESTAURADA --- */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-poppins font-bold text-text-primary">Meus Roteiros</h2>
        <button 
          onClick={onNewItinerary}
          className="flex items-center gap-2 text-sm bg-accent-gold text-primary font-inter font-semibold py-2 px-3 rounded-lg hover:brightness-110 transition-colors"
        >
          <FiPlus />
          Criar Novo
        </button>
      </div>
      {/* ----------------------- */}
      
      <div className="flex-1 overflow-y-auto space-y-3 -mr-2 pr-2">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-14 bg-secondary/50 rounded-lg animate-pulse"></div>
            <div className="h-14 bg-secondary/50 rounded-lg animate-pulse"></div>
            <div className="h-14 bg-secondary/50 rounded-lg animate-pulse"></div>
          </div>
        ) : itineraries.length > 0 ? (
          itineraries.map(itinerary => (
            <div key={itinerary.id} className="bg-secondary/50 p-4 rounded-lg cursor-pointer hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
              <h3 className="font-poppins font-semibold text-text-primary truncate">{itinerary.name}</h3>
            </div>
          ))
        ) : (
          <p className="text-sm text-text-secondary text-center mt-4">Nenhum roteiro criado ainda. Clique em "Criar Novo" para começar!</p>
        )}
      </div>
    </div>
  );
};

export default MapControlSidebar;