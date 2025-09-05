import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import MapComponent from './components/Map';

// O componente Filter continua o mesmo
const Filter = ({ setFilter }) => {
  return (
    <div className="bg-sherloc-dark-2 p-2 rounded-lg shadow-lg flex items-center space-x-2">
      <span className="font-semibold text-sherloc-text mr-2 font-lexend text-sm">Filtrar:</span>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('all')}>Todos</button>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('restaurante')}>Restaurantes</button>
      <button className="px-3 py-1 text-sm font-medium text-sherloc-text rounded-md hover:bg-gray-700 transition-colors" onClick={() => setFilter('ponto_turistico')}>Pontos Turísticos</button>
    </div>
  );
};

// A função App agora é muito mais simples
function App() {
  const [filter, setFilter] = useState('all');

  // Removemos toda a lógica de autenticação (useState, useEffect, handleLogin, handleSignUp)
  // e o "if (!session)" porque o roteamento agora cuida de quem pode ou não ver esta página.

  return (
    <div className="font-lexend">
      {/* O cabeçalho foi movido para o componente MainLayout para ser compartilhado em todas as telas */}
      {/* O Painel de Filtros também foi movido para o MainLayout */}
      
      <MapComponent currentFilter={filter} />
    </div>
  );
}

export default App;