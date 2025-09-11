import React from 'react';
import { FiSearch, FiSliders, FiPlus } from 'react-icons/fi';

const MapControlSidebar = ({ onNewItinerary }) => { 
  return (
    // Container principal agora com fundo branco, borda e sombra
    <div className="w-[380px] flex-shrink-0 bg-background rounded-2xl shadow-lg p-6 flex flex-col border border-border-light">
      
      {/* Barra de Pesquisa com novo estilo */}
      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Pesquisar roteiros ou locais..."
          className="w-full bg-gray-50 p-3 pl-10 rounded-lg border border-border-light focus:outline-none focus:ring-2 focus:ring-gold text-text-primary transition-all"
        />
      </div>

      {/* Cabeçalho da lista com o novo botão dourado */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-poppins font-bold text-text-primary">Meus Roteiros</h2>
        <button 
          onClick={onNewItinerary}
          className="flex items-center gap-2 text-sm bg-gold text-white font-inter font-semibold py-2 px-3 rounded-lg hover:bg-coral transition-colors"
        >
          <FiPlus />
          Criar Novo
        </button>
      </div>

      {/* Lista de Roteiros com novo estilo */}
      <div className="flex-1 overflow-y-auto space-y-3 -mr-2 pr-2">
        {/* Placeholders */}
        <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-colors">
          <h3 className="font-poppins font-semibold text-text-primary">Roteiro Histórico de Orlândia</h3>
          <p className="text-sm text-text-secondary">5 pontos turísticos</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg cursor-pointer hover:bg-gold/10 border border-transparent hover:border-gold/30 transition-colors">
          <h3 className="font-poppins font-semibold text-text-primary">Cafeterias da Cidade</h3>
          <p className="text-sm text-text-secondary">3 pontos turísticos</p>
        </div>
      </div>
    </div>
  );
};

export default MapControlSidebar;