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

        // --- CONSULTA ATUALIZADA ---
        // Agora pedimos os dados do perfil E também os badges relacionados
        const { data, error, status } = await supabase
          .from('profiles')
          .select(`
            username,
            xp,
            level,
            user_badges (
              badges (
                name,
                description,
                image_url
              )
            )
          `)
          .eq('id', session.user.id)
          .single();
        // -------------------------

        if (error && status !== 406) {
          throw error;
        }

        if (data) {
          setProfile(data);
        }
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (!profile) {
    return <div>Perfil não encontrado.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Voltar para o Mapa</Link>
      <h1>Perfil do Usuário</h1>
      
      <div>
        <p><strong>Email:</strong> {session.user.email}</p>
        <p><strong>Username:</strong> {profile.username || 'Não definido'}</p>
        <p><strong>XP:</strong> {profile.xp}</p>
        <p><strong>Nível:</strong> {profile.level}</p>
      </div>

      <hr style={{ margin: '20px 0' }} />

      <h2>Minhas Conquistas (Badges)</h2>
      
      {/* --- LÓGICA PARA EXIBIR OS BADGES --- */}
      {profile.user_badges.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {profile.user_badges.map(userBadge => (
            <li key={userBadge.badges.name} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
              {/* Futuramente, aqui podemos usar a profile.user_badges.badges.image_url */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
  <img 
    src={userBadge.badges.image_url} 
    alt={userBadge.badges.name} 
    style={{ width: '50px', height: '50px', marginRight: '15px', borderRadius: '50%' }} 
  />
  <div>
    <strong>{userBadge.badges.name}</strong>
    <p style={{ margin: 0 }}>{userBadge.badges.description}</p>
  </div>
</div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Você ainda não ganhou nenhum badge.</p>
      )}
      {/* ------------------------------------ */}
    </div>
  );
};

export default Profile;