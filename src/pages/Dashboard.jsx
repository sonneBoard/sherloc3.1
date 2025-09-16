import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiMapPin, FiAward } from "react-icons/fi";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { useModals } from '../components/MainLayout';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton';
import ActivityFeed from '../components/ActivityFeed'; // Importamos o novo componente de Feed

const CardSkeleton = ({ className = '' }) => (
  <div className={`glass-card p-6 rounded-2xl flex items-center space-x-4 ${className}`}>
    <div className="bg-secondary/50 p-3 rounded-lg w-12 h-12 animate-pulse"></div>
    <div className="w-full">
      <div className="h-4 bg-secondary/50 rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-8 bg-secondary/50 rounded w-1/2 animate-pulse"></div>
    </div>
  </div>
);

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
  const [nextBadge, setNextBadge] = useState(null);
  const [activities, setActivities] = useState([]); // Trocamos 'allLocations' por 'activities'
  const { setSelectedItineraryId, setEditingItineraryId } = useModals();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const [statsPromise, recentItinerariesPromise, nextBadgePromise, activityFeedPromise] = await Promise.all([
          Promise.all([
            supabase.rpc('get_total_itineraries'),
            supabase.rpc('get_total_locations_in_itineraries'),
            supabase.rpc('get_total_badges'),
          ]),
          supabase.from('itineraries').select('*').order('created_at', { ascending: false }).limit(2),
          supabase.rpc('get_next_badge_to_earn'),
          supabase.from('activity_feed').select('*').order('created_at', { ascending: false }).limit(5) // Buscamos o feed de atividades
        ]);

        const [{ data: itinerariesCount }, { data: locationsCount }, { data: badgesCount }] = statsPromise;
        const { data: recentData } = recentItinerariesPromise;
        const { data: nextBadgeData } = nextBadgePromise;
        const { data: activityData } = activityFeedPromise;

        setStats({ itineraries: itinerariesCount || 0, locations: locationsCount || 0, badges: badgesCount || 0 });
        setRecentItineraries(recentData || []);
        setNextBadge(nextBadgeData || null);
        setActivities(activityData || []); // Guardamos as atividades no estado

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
    >
      {/* O Mapa foi substituído pelo Feed de Atividades */}
      <div className="mb-8">
        <ActivityFeed activities={activities} loading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link to="/roteiros" className="glass-card p-6 rounded-2xl flex items-center space-x-4 hover:border-white/20 transition-all duration-300">
          <div className="bg-accent-gold/10 p-3 rounded-lg"><FiBookOpen className="text-accent-gold" size={24}/></div>
          <div>
            <p className="text-text-secondary text-sm font-semibold">Roteiros Criados</p>
            {loading ? <div className="h-8 w-12 bg-secondary/50 rounded animate-pulse mt-1"></div> : <AnimatedStat value={stats.itineraries} />}
          </div>
        </Link>
        <div className="glass-card p-6 rounded-2xl flex items-center space-x-4">
          <div className="bg-accent-gold/10 p-3 rounded-lg"><FiMapPin className="text-accent-gold" size={24}/></div>
          <div>
            <p className="text-text-secondary text-sm font-semibold">Locais Salvos</p>
            {loading ? <div className="h-8 w-12 bg-secondary/50 rounded animate-pulse mt-1"></div> : <AnimatedStat value={stats.locations} />}
          </div>
        </div>
        <Link to="/perfil" className="glass-card p-6 rounded-2xl flex items-center space-x-4 hover:border-white/20 transition-all duration-300">
          <div className="bg-accent-gold/10 p-3 rounded-lg"><FiAward className="text-accent-gold" size={24}/></div>
          <div>
            <p className="text-text-secondary text-sm font-semibold">Badges Conquistados</p>
            {loading ? <div className="h-8 w-12 bg-secondary/50 rounded animate-pulse mt-1"></div> : <AnimatedStat value={stats.badges} />}
          </div>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="font-poppins text-xl font-bold mb-4 text-text-primary">Continue de Onde Parou</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ItineraryCardSkeleton />
              <ItineraryCardSkeleton />
            </div>
          ) : recentItineraries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {recentItineraries.map(it => (
                <ItineraryCard 
                  key={it.id} 
                  itinerary={it} 
                  onViewMore={setSelectedItineraryId}
                  onEdit={setEditingItineraryId}
                />
              ))}
            </div>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center h-full flex flex-col justify-center">
              <h3 className="font-poppins font-semibold text-text-primary">Nenhum roteiro por aqui ainda!</h3>
              <p className="text-text-secondary mt-2 text-sm">Vá para o mapa e comece a planejar.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <h2 className="font-poppins text-xl font-bold mb-4 text-text-primary">Próxima Conquista</h2>
          {loading ? (
            <div className="glass-card p-6 rounded-2xl animate-pulse h-full min-h-[200px]"></div>
          ) : (
            <div className="glass-card p-6 rounded-2xl text-center h-full flex flex-col justify-center items-center">
              {nextBadge ? (
                <>
                  <img src={nextBadge.image_url} alt={nextBadge.name} className="w-20 h-20 mx-auto mb-4" />
                  <h3 className="font-poppins font-bold text-lg text-accent-glow">{nextBadge.name}</h3>
                  <p className="text-text-secondary mt-2 text-sm">{nextBadge.description}</p>
                </>
              ) : (
                <>
                  <FiAward size={40} className="text-accent-gold mx-auto mb-4" />
                  <h3 className="font-poppins font-bold text-lg text-accent-glow">Mestre dos Roteiros!</h3>
                  <p className="text-text-secondary mt-2 text-sm">Parabéns! Você conquistou todos os badges disponíveis.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;