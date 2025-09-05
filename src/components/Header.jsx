import React from 'react';
// A importação correta, usando 'fi' para Feather Icons
import { FiBell, FiUser } from "react-icons/fi";

const Header = ({ title, userEmail }) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="font-poppins text-3xl font-bold text-sherloc-text">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* Usamos o operador 'optional chaining' (?.) para evitar erros caso o email ainda não tenha carregado */}
        <p className="text-sm text-gray-400">Olá, {userEmail?.split('@')[0] || 'Viajante'}</p>
        
        {/* Usamos os ícones corretos que foram importados (FiBell e FiUser) */}
        <button className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiBell size={20} /></button>
        <button className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiUser size={20} /></button>
        <button className="bg-sherloc-yellow text-black font-bold text-sm px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors">Export</button>
      </div>
    </header>
  );
};

export default Header;