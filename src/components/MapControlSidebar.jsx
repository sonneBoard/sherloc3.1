import React from 'react';
// --- CORREÇÃO AQUI ---
// Apenas UMA linha importando TODOS os ícones necessários
import { FiSearch, FiSliders, FiPlus } from 'react-icons/fi';




// --- CORREÇÃO AQUI ---
// Adicionamos { onNewItinerary } como um parâmetro para que o componente
// receba a função que é passada a partir do MapPage.jsx
const MapControlSidebar = ({ onNewItinerary }) => { 
  return (
    <div className="w-[380px] flex-shrink-0 bg-sherloc-dark-2 rounded-lg p-6 flex flex-col">
      {/* ... sua barra de pesquisa e filtros ... */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-sherloc-text-bright">Meus Roteiros</h2>
        <button 
          onClick={onNewItinerary} // O botão chama a função recebida
          className="flex items-center gap-2 text-sm bg-sherloc-purple text-white font-bold py-2 px-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FiPlus />
          Criar Novo
        </button>
      </div>

      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Pesquisar roteiros ou locais..."
          className="w-full bg-sherloc-dark p-3 pl-10 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-sherloc-purple transition-all text-sherloc-text"
        />
      </div>

      <div className="flex items-center justify-between mb-6">
        {/* Adicionada cor de texto brilhante ao título */}
        <h2 className="text-xl font-bold text-sherloc-text-bright">Meus Roteiros</h2>
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <FiSliders />
          Filtros
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        <div className="bg-sherloc-dark p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
          {/* Adicionada cor de texto ao título do card */}
          <h3 className="font-bold text-sherloc-text">Roteiro Histórico de Orlândia</h3>
          <p className="text-sm text-gray-400">5 pontos turísticos</p>
        </div>
        <div className="bg-sherloc-dark p-4 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
          {/* Adicionada cor de texto ao título do card */}
          <h3 className="font-bold text-sherloc-text">Cafeterias da Cidade</h3>
          <p className="text-sm text-gray-400">3 pontos turísticos</p>
        </div>
      </div>
    </div>
  );
};

export default MapControlSidebar;