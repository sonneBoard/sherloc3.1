import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '../supabaseClient';
import { Toaster } from 'react-hot-toast';
import useSidebarStore from '../store/sidebarStore'; // 1. Importamos o store
import { motion } from 'framer-motion';             // 2. Importamos o motion

const MainLayout = () => {
  const { isOpen } = useSidebarStore(); // 3. Lemos o estado 'isOpen' da sidebar
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activeSession = supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/mapa': return 'Mapa Interativo';
      case '/roteiros': return 'Meus Roteiros';
      case '/perfil': return 'Meu Perfil';
      default: return 'Sherloc';
    }
  };

  if (loading || !session) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando...</div>;
  }

  return (
    <div className="bg-sherloc-dark text-sherloc-text min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#2A2D3A', color: '#F0F0F0' } }} />
      <Sidebar />
      {/* 4. A tag <main> agora é uma <motion.main> animada */}
      <motion.main 
        className="p-8"
        animate={{ marginLeft: isOpen ? '16rem' : '5rem' }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Header title={getTitle()} userEmail={session.user.email} />
        <Outlet />
      </motion.main>
    </div>
  );
};

export default MainLayout;