import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '../supabaseClient';
import { Toaster } from 'react-hot-toast';

const MainLayout = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // CORREÇÃO: A linha abaixo estava com 'onst' em vez de 'const'
    const activeSession = supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login');
      } else {
        setSession(session);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);
  
  // Define um título para o Header com base na rota atual
  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/mapa': return 'Mapa Interativo';
      case '/roteiros': return 'Meus Roteiros';
      case '/perfil': return 'Meu Perfil';
      default: return 'Sherloc';
    }
  };

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando...</div>;
  }

  return (
    <div className="flex bg-sherloc-dark min-h-screen">
      <Toaster position="top-center" toastOptions={{ style: { background: '#2A2D3A', color: '#F0F0F0' } }} />
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        {session && <Header title={getTitle()} userEmail={session.user.email} />}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;