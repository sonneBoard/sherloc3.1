// src/components/ActivityFeed.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen, FiAward, FiMapPin } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Mapeia o tipo de atividade para um ícone e cor
const activityConfig = {
  itinerary_created: {
    icon: FiBookOpen,
    color: 'text-accent-gold',
  },
  badge_earned: {
    icon: FiAward,
    color: 'text-green-400',
  },
  location_added: {
    icon: FiMapPin,
    color: 'text-blue-400',
  },
};

const ActivityFeed = ({ activities, loading }) => {
  if (loading) {
    return (
      <div className="glass-card p-6 rounded-2xl">
        <h2 className="font-poppins text-xl font-bold mb-4 text-text-primary">Atividade Recente</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-10 h-10 bg-secondary/50 rounded-full"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-secondary/50 rounded w-3/4"></div>
                <div className="h-3 bg-secondary/50 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const renderContent = (activity) => {
    switch (activity.activity_type) {
      case 'itinerary_created':
        return `Você criou o roteiro: "${activity.content.name}"`;
      case 'badge_earned':
        return `Você conquistou o badge: "${activity.content.name}"`;
      case 'location_added':
        return `Você adicionou "${activity.content.location_name}" ao roteiro "${activity.content.itinerary_name}"`;
      default:
        return 'Nova atividade registrada.';
    }
  };

  return (
    <motion.div 
      className="glass-card p-6 rounded-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="font-poppins text-xl font-bold mb-4 text-text-primary">Atividade Recente</h2>
      {activities.length > 0 ? (
        <ul className="space-y-4">
          {activities.map((activity) => {
            const config = activityConfig[activity.activity_type] || {};
            const Icon = config.icon || FiTarget;
            return (
              <motion.li 
                key={activity.id} 
                className="flex items-start gap-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary/50 ${config.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm text-text-primary">{renderContent(activity)}</p>
                  <p className="text-xs text-text-secondary mt-1">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-text-secondary">Nenhuma atividade recente para mostrar. Comece a planejar para ver seu progresso aqui!</p>
      )}
    </motion.div>
  );
};

export default ActivityFeed;