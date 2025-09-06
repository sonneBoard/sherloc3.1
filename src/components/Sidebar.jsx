import React from 'react';
import { NavLink } from 'react-router-dom';
import { FiGrid, FiMap, FiBookOpen, FiUser } from "react-icons/fi";

const Sidebar = () => {
  const activeLinkStyle = { backgroundColor: '#1A1B26', color: '#FFD15B' };

  return (
    <aside className="w-64 h-screen bg-sherloc-dark-2 text-sherloc-text p-5 flex flex-col font-lexend fixed">
      <div className="font-poppins text-3xl font-bold mb-12 text-center text-sherloc-yellow">Sherloc</div>
      <nav className="flex flex-col space-y-3">
        <NavLink 
          to="/dashboard" 
          style={({ isActive }) => isActive ? activeLinkStyle : {}} 
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FiGrid size={20} /><span>Dashboard</span>
        </NavLink>
       
        <NavLink 
          to="/mapa" 
          style={({ isActive }) => isActive ? activeLinkStyle : {}} 
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FiMap size={20} /><span>Mapa</span>
        </NavLink>
        
        <NavLink 
          to="/roteiros" 
          style={({ isActive }) => isActive ? activeLinkStyle : {}} 
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FiBookOpen size={20} /><span>Meus Roteiros</span>
        </NavLink>
        <NavLink 
          to="/perfil" 
          style={({ isActive }) => isActive ? activeLinkStyle : {}} 
          className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <FiUser size={20} /><span>Perfil</span>
        </NavLink>
      </nav>
      <div className="mt-auto text-center text-xs text-gray-500">
        <p>Sherloc © 2025</p>
      </div>
    </aside>
  );
};

export default Sidebar;