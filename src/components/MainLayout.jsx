import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster } from 'react-hot-toast';
import useSidebarStore from '../store/appStore';
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

  return (
    // Aplicamos o novo fundo 'bg-primary' e o texto padrão 'text-text-primary'
    <div className="min-h-screen bg-primary text-text-primary">
      {/* O Toaster agora usará o nosso estilo .glass-card para as notificações */}
      <Toaster position="top-center" toastOptions={{
        className: 'glass-card',
        style: {
          background: 'rgba(26, 27, 38, 0.7)', // Cor secondary com opacidade
          color: '#E0E0E0', // Cor text-primary
        },
      }}/>
      <Sidebar />
      <motion.main 
        className="p-8"
        animate={{ marginLeft: isOpen ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header title={getTitle()} /> {/* O Header será redesenhado a seguir */}
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;