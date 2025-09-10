import React from 'react';
import { FiBell, FiUser } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom'; // 1. Importe o useNavigate
import { supabase } from '../supabaseClient';     // 2. Importe o supabase
import { toast } from 'react-hot-toast';          // 3. Importe o toast para notificações

const Header = ({ title, userEmail }) => {
  const navigate = useNavigate(); // 4. Inicialize o hook de navegação

  // 5. ATUALIZE A FUNÇÃO DE LOGOUT
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redireciona para a página de login após o logout bem-sucedido
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      toast.error('Erro ao fazer logout:', error.message);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="font-poppins text-3xl font-bold text-sherloc-text">{title}</h1>
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-400 hidden sm:block">Olá, {userEmail ? userEmail.split('@')[0] : 'Viajante'}</p>
        <button className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiBell size={20} /></button>
        <Link to="/perfil" className="p-2 rounded-full hover:bg-sherloc-dark-2 transition-colors"><FiUser size={20} /></Link>
        {/* O botão agora chama a nossa nova função */}
        <button onClick={handleLogout} className="bg-sherloc-purple text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;