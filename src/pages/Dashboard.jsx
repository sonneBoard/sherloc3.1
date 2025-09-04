import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    itineraries: 0,
    locations: 0,
    badges: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Usamos o método .rpc() para chamar nossas funções PostgreSQL
        const { data: itinerariesCount, error: itinerariesError } = await supabase.rpc('get_total_itineraries');
        if (itinerariesError) throw itinerariesError;

        const { data: locationsCount, error: locationsError } = await supabase.rpc('get_total_locations_in_itineraries');
        if (locationsError) throw locationsError;

        const { data: badgesCount, error: badgesError } = await supabase.rpc('get_total_badges');
        if (badgesError) throw badgesError;

        setStats({
          itineraries: itinerariesCount,
          locations: locationsCount,
          badges: badgesCount,
        });

      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando seu dashboard...</div>;
  }

  return (
    <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sherloc-yellow hover:underline mb-6 inline-block">&larr; Voltar para o Mapa</Link>
        <h1 className="font-poppins text-4xl font-bold mb-6">Dashboard</h1>

        {/* Grid para os cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card de Roteiros */}
          <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg">
            <h2 className="font-poppins text-lg font-bold text-gray-400">Roteiros Criados</h2>
            <p className="font-poppins text-5xl font-bold text-sherloc-yellow mt-2">{stats.itineraries}</p>
          </div>

          {/* Card de Locais */}
          <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg">
            <h2 className="font-poppins text-lg font-bold text-gray-400">Locais Salvos</h2>
            <p className="font-poppins text-5xl font-bold text-sherloc-yellow mt-2">{stats.locations}</p>
          </div>

          {/* Card de Badges */}
          <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg">
            <h2 className="font-poppins text-lg font-bold text-gray-400">Badges Conquistados</h2>
            <p className="font-poppins text-5xl font-bold text-sherloc-yellow mt-2">{stats.badges}</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;