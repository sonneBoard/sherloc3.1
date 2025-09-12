// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiBookOpen, FiMapPin, FiAward } from "react-icons/fi";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useModals } from '../components/MainLayout'; // Importamos o hook do nosso Contexto

// --- Componente para o Skeleton Loader (completo) ---
const CardSkeleton = () => (
  <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
    <div className="bg-secondary/50 p-3 rounded-lg w-12 h-12 animate-pulse"></div>
    <div className="w-full">
      <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-8 bg-secondary/50 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
);

// --- Contador Animado (completo) ---
const AnimatedStat = ({ value }) => (
  <CountUp
    end={value}
    duration={2.5}
    separator="."
    className="font-poppins text-3xl font-bold text-accent-glow"
  />
);

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ itineraries: 0, locations: 0, badges: 0 });
  const [recentItineraries, setRecentItineraries] = useState([]);
  const { setSelectedItineraryId } = useModals(); // Usamos o hook para pegar a função de abrir o modal

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [statsPromise, recentItinerariesPromise] = await Promise.all([
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
        ] = statsPromise;
        
        const { data: recentData } = recentItinerariesPromise;

        setStats({ itineraries: itinerariesCount || 0, locations: locationsCount || 0, badges: badgesCount || 0 });
        setRecentItineraries(recentData || []);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    // Usando um timeout para garantir que vejamos a animação do skeleton
    const timer = setTimeout(() => {
      fetchData();
    }, 1500);

    return () => clearTimeout(timer);
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
      className="font-roboto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {loading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : (
          <>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex items-center space-x-4">
              <div className="bg-accent-gold/10 p-3 rounded-lg"><FiBookOpen className="text-accent-gold" size={24}/></div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Roteiros Criados</p>
                <AnimatedStat value={stats.itineraries} />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex items-center space-x-4">
               <div className="bg-accent-gold/10 p-3 rounded-lg"><FiMapPin className="text-accent-gold" size={24}/></div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Locais Salvos</p>
                <AnimatedStat value={stats.locations} />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="glass-card p-6 rounded-2xl flex items-center space-x-4">
               <div className="bg-accent-gold/10 p-3 rounded-lg"><FiAward className="text-accent-gold" size={24}/></div>
              <div>
                <p className="text-text-secondary text-sm font-semibold">Badges Conquistados</p>
                <AnimatedStat value={stats.badges} />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>

      <motion.div 
        className="mt-8 glass-card p-6 rounded-2xl"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h2 className="font-poppins text-xl font-bold mb-4 text-text-primary">Roteiros Recentes</h2>
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 bg-secondary/50 rounded w-3/4 animate-pulse"></div>
            <div className="h-4 bg-secondary/50 rounded w-1/2 animate-pulse"></div>
          </div>
        ) : recentItineraries.length > 0 ? (
          <ul className="space-y-3">
            {recentItineraries.map(it => (
              <li key={it.id}>
                <button 
                  onClick={() => setSelectedItineraryId(it.id)}
                  className="font-semibold text-text-secondary hover:text-accent-gold transition-colors text-left"
                >
                  {it.name}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-text-secondary">Crie seu primeiro roteiro para vê-lo aqui.</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;