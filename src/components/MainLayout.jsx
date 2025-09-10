// src/components/MainLayout.jsx
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import useSidebarStore from '../store/sidebarStore';
import { motion } from 'framer-motion';

const MainLayout = () => {
  const { isOpen } = useSidebarStore();
  const location = useLocation();

  // TODA A LÓGICA DE VERIFICAÇÃO DE SESSÃO COM 'useState' E 'useEffect' FOI REMOVIDA.
  // O componente agora confia que o ProtectedRoute só o renderizará se o usuário estiver logado.

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/mapa': return 'Mapa Interativo';
      case '/roteiros': return 'Meus Roteiros';
      case '/perfil': return 'Meu Perfil';
      default: return 'Sherloc';
    }
  };

  // A verificação de 'loading' e 'session' não é mais necessária aqui.
  return (
    <div className="bg-sherloc-dark text-sherloc-text min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#2A2D3A', color: '#F0F0F0' } }} />
      <Sidebar />
      <motion.main 
        className="p-8"
        animate={{ marginLeft: isOpen ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* O Header foi simplificado para receber apenas o título por enquanto */}
        <Header title={getTitle()} />
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;