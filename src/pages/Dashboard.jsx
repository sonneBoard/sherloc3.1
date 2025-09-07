import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FiBookOpen, FiMapPin, FiAward } from "react-icons/fi";
import { motion } from 'framer-motion'; // 1. Importamos o motion

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ itineraries: 0, locations: 0, badges: 0 });
  const [recentItineraries, setRecentItineraries] = useState([]);

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

    fetchData();
  }, []);

  // 2. Definimos as variantes para a animação do container e dos itens
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Atraso entre a animação de cada card
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <motion.div 
      className="font-lexend"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 3. Aplicamos as animações no container dos cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="bg-sherloc-dark-2 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <div className="bg-blue-500/20 p-3 rounded-lg"><FiBookOpen className="text-blue-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Roteiros Criados</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.itineraries}</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-sherloc-dark-2 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <div className="bg-orange-500/20 p-3 rounded-lg"><FiMapPin className="text-orange-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Locais Salvos</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.locations}</p>
          </div>
        </motion.div>
        <motion.div variants={itemVariants} className="bg-sherloc-dark-2 p-6 rounded-xl shadow-lg flex items-center space-x-4">
          <div className="bg-green-500/20 p-3 rounded-lg"><FiAward className="text-green-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Badges Conquistados</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.badges}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="mt-8 bg-sherloc-dark-2 p-6 rounded-xl shadow-lg"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="font-poppins text-xl font-bold mb-4">Roteiros Recentes</h2>
        {recentItineraries.length > 0 ? (
          <ul className="space-y-2">
            {recentItineraries.map(it => (
              <li key={it.id} className="text-gray-300 hover:text-sherloc-purple">
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