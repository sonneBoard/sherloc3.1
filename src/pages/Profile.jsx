import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiUser } from 'react-icons/fi';
import Badge from '../components/Badge';

// --- NOVO COMPONENTE SKELETON PARA O PERFIL ---
const ProfileSkeleton = () => (
  <div>
    <div className="h-10 w-1/3 bg-secondary/50 rounded-lg animate-pulse mb-8"></div>
    
    {/* Skeleton do Card Principal */}
    <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center">
      <div className="w-32 h-32 rounded-full bg-secondary/50 animate-pulse mb-4"></div>
      <div className="h-8 w-1/2 bg-secondary/50 rounded-md animate-pulse mb-2"></div>
      <div className="h-4 w-2/3 bg-secondary/50 rounded-md animate-pulse"></div>
      <div className="w-full max-w-sm mt-6">
        <div className="flex justify-between items-end mb-1">
          <div className="h-5 w-1/4 bg-secondary/50 rounded-md animate-pulse"></div>
          <div className="h-4 w-1/3 bg-secondary/50 rounded-md animate-pulse"></div>
        </div>
        <div className="w-full bg-secondary/50 rounded-full h-3 animate-pulse"></div>
      </div>
    </div>

    {/* Skeleton da Seção de Conquistas */}
    <div className="mt-8">
      <div className="h-8 w-1/4 bg-secondary/50 rounded-lg animate-pulse mb-4"></div>
      <div className="glass-card p-6 rounded-2xl">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-16 h-16 bg-secondary/50 rounded-full animate-pulse"></div>
              <div className="h-3 w-10 mt-2 bg-secondary/50 rounded-md animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);


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

  // Se o carregamento estiver a decorrer, mostramos o Skeleton
  if (loading) {
    return <ProfileSkeleton />;
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
      
      {/* Card Principal do Usuário com estilo .glass-card */}
      <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center">
        <div className="w-32 h-32 rounded-full border-4 border-accent-gold bg-secondary flex items-center justify-center mb-4">
          <FiUser size={64} className="text-text-secondary" />
        </div>
        <h2 className="font-poppins text-3xl font-bold text-accent-glow">{profile.username}</h2>
        <p className="text-text-secondary">{profile.email}</p>
        <div className="w-full max-w-sm mt-6">
          <div className="flex justify-between items-end mb-1">
            <span className="font-inter font-bold text-accent-gold">Nível {profile.level || 1}</span>
            <span className="text-sm font-semibold text-text-secondary">{profile.xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-3">
            <motion.div 
              className="h-3 rounded-full bg-gradient-to-r from-accent-gold to-yellow-500"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Seção de Conquistas com estilo .glass-card */}
      <div className="mt-8">
        <h3 className="font-poppins text-2xl font-bold mb-4 text-text-primary">Minhas Conquistas</h3>
        <div className="glass-card p-6 rounded-2xl">
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