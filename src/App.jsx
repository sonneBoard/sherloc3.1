// src/App.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verifica a sessão atual quando o componente carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Ouve em tempo real as mudanças de autenticação (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    // Limpa a subscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, []);

  // Mostra uma mensagem de carregamento enquanto a sessão está a ser verificada
  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando...</div>;
  }

  // Se houver uma sessão, redireciona para a dashboard.
  // Se não houver sessão, mostra a LandingPage.
  return session ? <Navigate to="/dashboard" /> : <LandingPage />;
};

export default App;