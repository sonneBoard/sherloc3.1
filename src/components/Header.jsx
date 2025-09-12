// src/components/Header.jsx
import React from 'react';
import { FiBell, FiUser } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';
import useAppStore from '../store/appStore'; // 1. Importamos o appStore

const Header = ({ title }) => { // Simplificado para receber apenas title por enquanto
  const navigate = useNavigate();
  const clearUserSession = useAppStore(state => state.clearUserSession); // 2. Pegamos a nova ação

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      clearUserSession(); // 3. LIMPAMOS O ESTADO ANTES DE REDIRECIONAR

      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="font-poppins text-3xl font-bold text-text-primary">{title}</h1>
      <div className="flex items-center space-x-4">
        {/* Lógica para mostrar email do usuário pode ser adicionada aqui depois */}
        <p className="text-sm text-text-secondary hidden sm:block">Olá, Viajante</p>
        <button className="p-2 rounded-full hover:bg-white/10 transition-colors"><FiBell size={20} /></button>
        <Link to="/perfil" className="p-2 rounded-full hover:bg-white/10 transition-colors"><FiUser size={20} /></Link>
        <button onClick={handleLogout} className="bg-accent-gold text-primary font-inter font-bold text-sm px-4 py-2 rounded-lg hover:brightness-110 transition-colors">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;