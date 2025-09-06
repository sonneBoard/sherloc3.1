import React, { useState, useEffect, useCallback } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { supabase } from '../supabaseClient';
import LevelUpModal from './LevelUpModal';
import { Toaster } from 'react-hot-toast'; // A importação já estava correta

const MainLayout = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // BUG FIX: Adicionamos o estado 'profile' que estava faltando no seu código
  const [profile, setProfile] = useState(null);

  const [newLevel, setNewLevel] = useState(0);
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const handleProfileUpdate = useCallback((payload) => {
    console.log("MUDANÇA NO PERFIL RECEBIDA!", payload);
    const newProfileData = payload.new;

    setProfile(currentProfile => {
      if (currentProfile && newProfileData.level > currentProfile.level) {
        console.log(`LEVEL UP DETECTADO! De ${currentProfile.level} para ${newProfileData.level}`);
        setNewLevel(newProfileData.level);
        setIsLevelUpModalOpen(true);
      }
      return newProfileData;
    });
  }, []);


  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data: { session } }) => {
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

  useEffect(() => {
    if (session) {
      const profileChannel = supabase
        .channel('public:profiles')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${session.user.id}` },
          handleProfileUpdate
        )
        .subscribe((status) => {
          console.log("Status da Assinatura do Perfil:", status);
        });

      return () => {
        supabase.removeChannel(profileChannel);
      };
    }
  }, [session, handleProfileUpdate]);


  if (loading || !session) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando...</div>;
  }

  return (
    <div className="flex bg-sherloc-dark min-h-screen">
      {/* --- CONTAINER DE NOTIFICAÇÕES ADICIONADO --- */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#2A2D3A',
            color: '#F0F0F0',
            border: '1px solid #4A4A4A',
          },
        }}
      />
      {/* ------------------------------------------- */}
      
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <Header title="Dashboard" userEmail={session.user.email} />
        <Outlet />
      </main>

      {/* Corrigindo as props do LevelUpModal que estavam comentadas */}
      <LevelUpModal 
        isOpen={isLevelUpModalOpen}
        onClose={() => setIsLevelUpModalOpen(false)}
        newLevel={newLevel}
      />
    </div>
  );
};

export default MainLayout;