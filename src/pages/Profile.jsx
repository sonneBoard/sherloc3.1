import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) throw new Error("Usuário não autenticado");
        setSession(session);

        const { data, error, status } = await supabase
          .from('profiles')
          .select(`username, xp, level, user_badges(badges(name, description, image_url))`)
          .eq('id', session.user.id)
          .single();

        if (error && status !== 406) throw error;
        if (data) setProfile(data);
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };
    getProfileData();
  }, []);

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando perfil...</div>;
  }

  if (!profile) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Perfil não encontrado.</div>;
  }

  return (
    // Container principal da página
    <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sherloc-yellow hover:underline mb-6 inline-block">&larr; Voltar para o Mapa</Link>
        <h1 className="font-poppins text-4xl font-bold mb-6">Perfil do Usuário</h1>
        
        {/* Card com as informações do usuário */}
        <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-lg">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Username</p>
              <p className="text-lg">{profile.username || 'Não definido'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">XP</p>
              <p className="text-lg font-poppins font-bold text-sherloc-yellow">{profile.xp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Nível</p>
              <p className="text-lg font-poppins font-bold text-sherloc-yellow">{profile.level}</p>
            </div>
          </div>
        </div>

        <h2 className="font-poppins text-3xl font-bold mb-4">Minhas Conquistas</h2>
        
        {/* Seção dos Badges */}
        {profile.user_badges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.user_badges.map(userBadge => (
              // Card para cada badge
              <div key={userBadge.badges.name} className="bg-sherloc-dark-2 p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <img 
                  src={userBadge.badges.image_url || 'https://via.placeholder.com/50'} // Imagem placeholder
                  alt={userBadge.badges.name} 
                  className="w-16 h-16 rounded-full bg-sherloc-dark" 
                />
                <div>
                  <h3 className="font-poppins font-bold text-sherloc-yellow">{userBadge.badges.name}</h3>
                  <p className="text-sm text-gray-400">{userBadge.badges.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="bg-sherloc-dark-2 p-4 rounded-lg">Você ainda não ganhou nenhum badge.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;