import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LuBook, LuMapPin, LuAward } from "react-icons/lu";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ itineraries: 0, locations: 0, badges: 0 });
  const [recentItineraries, setRecentItineraries] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscas em paralelo
        const [statsPromise, recentItinerariesPromise] = await Promise.all([
          Promise.all([
            supabase.rpc('get_total_itineraries'),
            supabase.rpc('get_total_locations_in_itineraries'),
            supabase.rpc('get_total_badges'),
          ]),
          supabase.from('itineraries').select('id, name').eq('created_by', user.id).order('created_at', { ascending: false }).limit(5)
        ]);

        const [
          { data: itinerariesCount, error: itinerariesError },
          { data: locationsCount, error: locationsError },
          { data: badgesCount, error: badgesError },
        ] = statsPromise;
        
        const { data: recentData, error: recentError } = recentItinerariesPromise;

        if (itinerariesError || locationsError || badgesError || recentError) {
            console.error(itinerariesError || locationsError || badgesError || recentError);
            return;
        }

        setStats({ itineraries: itinerariesCount, locations: locationsCount, badges: badgesCount });
        setRecentItineraries(recentData);

      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Carregando...</div>;
  }

  return (
    <div className="font-lexend">
      {/* Grid para os cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="bg-blue-500/20 p-3 rounded-lg"><LuBook className="text-blue-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Roteiros Criados</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.itineraries}</p>
          </div>
        </div>
        <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="bg-orange-500/20 p-3 rounded-lg"><LuMapPin className="text-orange-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Locais Salvos</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.locations}</p>
          </div>
        </div>
        <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg flex items-center space-x-4">
          <div className="bg-green-500/20 p-3 rounded-lg"><LuAward className="text-green-400" size={24}/></div>
          <div>
            <p className="text-gray-400 text-sm">Badges Conquistados</p>
            <p className="font-poppins text-2xl font-bold text-sherloc-text">{stats.badges}</p>
          </div>
        </div>
      </div>

      {/* Módulo de Roteiros Recentes */}
      <div className="mt-8 bg-sherloc-dark-2 p-6 rounded-lg shadow-lg">
        <h2 className="font-poppins text-xl font-bold mb-4">Roteiros Recentes</h2>
        {recentItineraries.length > 0 ? (
          <ul className="space-y-2">
            {recentItineraries.map(it => (
              <li key={it.id} className="text-gray-300 hover:text-sherloc-yellow">
                <Link to={`/roteiro/${it.id}`}>{it.name}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">Crie seu primeiro roteiro para vê-lo aqui.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;