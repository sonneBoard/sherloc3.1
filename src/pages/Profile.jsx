import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { FiUser, FiEdit } from 'react-icons/fi';
import Badge from '../components/Badge';
import EditProfileModal from '../components/EditProfileModal';

const ProfileSkeleton = () => (
  <div>
    <div className="flex justify-between items-center mb-8">
      <div className="h-10 w-1/3 bg-secondary/50 rounded-lg animate-pulse"></div>
      <div className="h-10 w-32 bg-secondary/50 rounded-lg animate-pulse"></div>
    </div>
    
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
  const [allBadges, setAllBadges] = useState([]); // 1. Novo estado para TODOS os badges
  const [earnedBadgeIds, setEarnedBadgeIds] = useState(new Set()); // Para verificação rápida
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfileData = useCallback(async () => {
    try {
      if (!loading) setLoading(true); // Garante o loading ao re-buscar
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 2. Agora buscamos o perfil, e todos os badges do sistema em paralelo
        const [profileRes, allBadgesRes] = await Promise.all([
          supabase.from('profiles').select('*, user_badges(badge_id)').eq('id', user.id).single(),
          supabase.from('badges').select('*').order('id')
        ]);

        if (profileRes.error) throw profileRes.error;
        if (allBadgesRes.error) throw allBadgesRes.error;

        setProfile({ ...profileRes.data, email: user.email });
        setAllBadges(allBadgesRes.data || []);
        
        // Criamos um Set com os IDs dos badges ganhos para uma verificação rápida e eficiente
        const earnedIds = new Set(profileRes.data.user_badges.map(ub => ub.badge_id));
        setEarnedBadgeIds(earnedIds);
      }
    } catch (error) {
      console.error("Erro ao buscar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  }, []); // Removida a dependência 'loading' para evitar loops

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return <div>Não foi possível carregar o perfil.</div>;
  }

  const xpForNextLevel = (profile.level || 1) * 100;
  const progressPercentage = profile.xp ? (profile.xp / xpForNextLevel) * 100 : 0;

   return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-poppins text-4xl font-bold text-text-primary">Meu Perfil</h1>
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="flex items-center gap-2 bg-secondary/70 text-text-secondary font-inter font-semibold text-sm py-2 px-4 rounded-lg border border-white/10 hover:bg-secondary transition-colors"
        >
          <FiEdit size={16} />
          <span>Editar Perfil</span>
        </button>
      </div>
      
      <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center">
        <img
          src={profile.avatar_url || `https://ui-avatars.com/api/?name=${profile.username}&background=2D2E37&color=E0E0E0`}
          alt={`Avatar de ${profile.username}`}
          className="w-32 h-32 rounded-full border-4 border-accent-gold object-cover bg-secondary mb-4"
        />
        <h2 className="font-poppins text-3xl font-bold text-accent-glow">{profile.username}</h2>
        <p className="text-text-secondary">{profile.email}</p>
        <div className="w-full max-w-sm mt-6">
          <div className="flex justify-between items-end mb-1">
            <span className="font-inter font-bold text-accent-gold">Nível {profile.level || 1}</span>
            <span className="text-sm font-semibold text-text-secondary">{profile.xp || 0} / {xpForNextLevel} XP</span>
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

      <div className="mt-8">
        <h3 className="font-poppins text-2xl font-bold mb-4 text-text-primary">Conquistas</h3>
        <div className="glass-card p-6 rounded-2xl">
          {allBadges.length > 0 ? (
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-6">
              {allBadges.map((badge) => {
                const hasEarned = earnedBadgeIds.has(badge.id);
                return (
                  <Badge 
                    key={badge.id} 
                    badge={badge} 
                    isUnlocked={hasEarned} // Passamos a informação se está desbloqueado ou não
                  />
                );
              })}
            </div>
          ) : (
            <p className="text-text-secondary text-center">Nenhuma conquista disponível no momento.</p>
          )}
        </div>
      </div>
      
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onProfileUpdated={fetchProfileData}
      />
    </motion.div>
  );
};

export default Profile;