import React from 'react';
import { FiBell, FiUser } from "react-icons/fi";
import { Link } from 'react-router-dom';

const Header = ({ title, userEmail }) => {
  const handleLogout = async () => {
    // A lógica de logout pode ser adicionada aqui no futuro
    alert('Função de Logout a ser implementada');
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="font-poppins text-3xl font-bold text-sherloc-text">{title}</h1>
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-400 hidden sm:block">Olá, {userEmail ? userEmail.split('@')[0] : 'Viajante'}</p>
        <button className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiBell size={20} /></button>
        <Link to="/perfil" className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiUser size={20} /></Link>
        <button onClick={handleLogout} className="bg-sherloc-purple text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">Logout</button>
      </div>
    </header>
  );
};

export default Header;