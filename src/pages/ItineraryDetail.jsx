import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ItineraryDetail = () => {
  const { id } = useParams(); // Pega o ID do roteiro da URL
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        // Esta é uma query poderosa do Supabase!
        // Ela busca o roteiro com o ID correspondente E, ao mesmo tempo,
        // busca todos os 'locations' associados a ele através da tabela de junção.
        const { data, error } = await supabase
          .from('itineraries')
          .select(`
            id,
            name,
            locations (
              id,
              name,
              category
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        if (data) {
          setItinerary(data);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes do roteiro:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItineraryDetails();
  }, [id]);

  if (loading) {
    return <div>Carregando detalhes do roteiro...</div>;
  }

  if (!itinerary) {
    return <div>Roteiro não encontrado.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/roteiros">&larr; Voltar para Meus Roteiros</Link>
      <h1>Roteiro: {itinerary.name}</h1>

      <h3>Locais neste Roteiro:</h3>
      {itinerary.locations.length > 0 ? (
        <ul>
          {itinerary.locations.map(location => (
            <li key={location.id}>
              {location.name} ({location.category})
            </li>
          ))}
        </ul>
      ) : (
        <p>Ainda não há locais neste roteiro.</p>
      )}
    </div>
  );
};

export default ItineraryDetail;