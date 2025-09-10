import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiBookOpen, FiMapPin, FiAward } from "react-icons/fi";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

// --- Componente para o Skeleton Loader (pronto para usar) ---
const CardSkeleton = () => (
  <div className="glass-card p-6 rounded-xl flex items-center space-x-4">
    <div className="bg-gray-700/50 p-3 rounded-lg w-12 h-12 animate-pulse"></div>
    <div className="w-full">
      <div className="h-4 bg-gray-700/50 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-8 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
);

// --- Componente para o Contador Animado (pronto para usar) ---
const AnimatedStat = ({ value }) => (
  <CountUp
    end={value}
    duration={2.5}
    separator="."
    className="font-poppins text-2xl font-bold text-sherloc-text-bright"
  />
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ itineraries: 0, locations: 0, badges: 0 });
  const [recentItineraries, setRecentItineraries] = useState([]);

  // A sua lógica para buscar os dados reais foi mantida
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscando todos os dados em paralelo para mais performance
        const [statsResponse, recentItinerariesResponse] = await Promise.all([
          Promise.all([
            supabase.rpc('get_total_itineraries'),
            supabase.rpc('get_total_locations_in_itineraries'),
            supabase.rpc('get_total_badges'),
          ]),
          supabase.from('itineraries').select('id, name').eq('created_by', user.id).order('created_at', { ascending: false }).limit(5)
        ]);

        const [
          { data: itinerariesCount },
          { data: locationsCount },
          { data: badgesCount },
        ] = statsResponse;
        
        const { data: recentData } = recentItinerariesResponse;

        setStats({ itineraries: itinerariesCount || 0, locations: locationsCount || 0, badges: badgesCount || 0 });
        setRecentItineraries(recentData || []);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        // Usamos um pequeno timeout para garantir que a animação seja visível
        setTimeout(() => setLoading(false), 500);
      }
    };

    fetchData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <motion.div 
      className="font-lexend"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* --- LÓGICA DO SKELETON LOADER APLICADA --- */}
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            {/* --- CARDS COM EFEITO GLASS E NÚMEROS ANIMADOS --- */}
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl flex items-center space-x-4">
              <div className="bg-blue-500/20 p-3 rounded-lg"><FiBookOpen className="text-blue-400" size={24}/></div>
              <div>
                <p className="text-gray-400 text-sm">Roteiros Criados</p>
                <AnimatedStat value={stats.itineraries} />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl flex items-center space-x-4">
              <div className="bg-orange-500/20 p-3 rounded-lg"><FiMapPin className="text-orange-400" size={24}/></div>
              <div>
                <p className="text-gray-400 text-sm">Locais Salvos</p>
                <AnimatedStat value={stats.locations} />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-xl flex items-center space-x-4">
              <div className="bg-green-500/20 p-3 rounded-lg"><FiAward className="text-green-400" size={24}/></div>
              <div>
                <p className="text-gray-400 text-sm">Badges Conquistados</p>
                <AnimatedStat value={stats.badges} />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      {/* --- CARD DE ROTEIROS RECENTES COM EFEITO GLASS --- */}
      <motion.div 
        className="mt-8 glass-card p-6 rounded-xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
       <h2 className="font-poppins text-xl font-bold mb-4 text-sherloc-text-bright">Roteiros Recentes</h2>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-gray-700/50 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : recentItineraries.length > 0 ? (
          <ul className="space-y-2">
            {recentItineraries.map(it => (
              <li key={it.id} className="text-gray-300 hover:text-sherloc-purple transition-colors">
                <Link to={`/roteiro/${it.id}`}>{it.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Crie seu primeiro roteiro para vê-lo aqui.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;