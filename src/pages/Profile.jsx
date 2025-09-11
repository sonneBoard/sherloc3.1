import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import Badge from '../components/Badge';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A função foi definida como 'fetchProfile'
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const [profileResponse, badgesResponse] = await Promise.all([
            supabase.from('profiles').select('username, xp, level').eq('id', user.id).single(),
            supabase.from('user_badges').select('badges(name, description, image_url)').eq('user_id', user.id)
          ]);
          
          if (profileResponse.error) throw profileResponse.error;
          if (badgesResponse.error) throw badgesResponse.error;
          
          if (profileResponse.data) {
            setProfile({ ...profileResponse.data, email: user.email });
          }
          if (badgesResponse.data) {
            setBadges(badgesResponse.data.map(item => item.badges));
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do perfil:", error);
      } finally {
        setLoading(false);
      }
    };

    // --- CORREÇÃO AQUI ---
    // Chamamos a função pelo nome correto: 'fetchProfile'
    fetchProfile();

  }, []);

  if (loading) {
    return <div>Carregando perfil...</div>;
  }

  if (!profile) {
    return <div>Não foi possível carregar o perfil.</div>;
  }

  const xpForNextLevel = (profile.level || 1) * 100;
  const progressPercentage = (profile.xp / xpForNextLevel) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="font-poppins text-4xl font-bold mb-8 text-text-primary">Meu Perfil</h1>
      
      {/* O seu JSX continua o mesmo... */}
      <div className="bg-background p-8 rounded-2xl shadow-lg border border-border-light text-center flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border-4 border-gold bg-gray-200 flex items-center justify-center mb-4">
          <FiUser size={64} className="text-gray-400" />
        </div>
        <h2 className="font-poppins text-3xl font-bold text-text-primary">{profile.username}</h2>
        <p className="text-text-secondary">{profile.email}</p>
        <div className="w-full max-w-sm mt-6">
          <div className="flex justify-between items-end mb-1">
            <span className="font-inter font-bold text-gold">Nível {profile.level || 1}</span>
            <span className="text-sm font-semibold text-text-secondary">{profile.xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <motion.div 
              className="h-3 rounded-full bg-gradient-to-r from-gold to-coral"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-poppins text-2xl font-bold mb-4 text-text-primary">Minhas Conquistas</h3>
        <div className="bg-background p-6 rounded-2xl shadow-lg border border-border-light">
          {badges.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
              {badges.map((badge, index) => (
                <Badge key={index} badge={badge} />
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center">Você ainda não conquistou nenhuma medalha. Continue explorando!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;