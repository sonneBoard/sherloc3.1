import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '../supabaseClient';

const MainLayout = () => {
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login'); // Se não tiver sessão, manda para o login
      } else {
        setSession(session);
      }
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

  if (!session) {
    return null; // ou uma tela de loading
  }

  return (
    <div className="flex bg-sherloc-dark min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8"> {/* ml-64 para dar espaço para a sidebar */}
        {/* Passamos um título e o email do usuário para o Header */}
        <Header title="Dashboard" userEmail={session.user.email} />
        {/* O Outlet renderiza o conteúdo da página atual (Dashboard, Perfil, etc) */}
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;