import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        // Pega o usuário logado
        const { data: { user } } = await supabase.auth.getUser();

        // Busca na tabela 'itineraries' todos os roteiros criados pelo usuário
        const { data, error } = await supabase
          .from('itineraries')
          .select('id, name') // Só precisamos do id e do nome por enquanto
          .eq('created_by', user.id)
          .order('created_at', { ascending: false }); // Mostra os mais recentes primeiro

        if (error) throw error;

        if (data) {
          setItineraries(data);
        }
      } catch (error) {
        console.error("Erro ao buscar roteiros:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraries();
  }, []);

  if (loading) {
    return <div>Carregando seus roteiros...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Voltar para o Mapa</Link>
      <h1>Meus Roteiros</h1>

      {itineraries.length === 0 ? (
        <p>Você ainda não criou nenhum roteiro.</p>
      ) : (
        <ul>
          {itineraries.map(itinerary => (
  <li key={itinerary.id}>
    <Link to={`/roteiro/${itinerary.id}`}>
      {itinerary.name}
    </Link>
  </li>
))}
        </ul>
      )}
    </div>
  );
};

export default MyItineraries;