// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Verificando autenticação...</div>;
  }

  // Se houver sessão, renderiza o conteúdo protegido (o MainLayout com as páginas dentro).
  // Se não, redireciona para a página de login.
  return session ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;