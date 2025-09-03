import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraryDetails = async () => {
      try {
        // --- CONSULTA CORRIGIDA ---
        // A consulta agora passa pela tabela de junção para encontrar os locais.
        const { data, error } = await supabase
          .from('itineraries')
          .select(`
            id,
            name,
            itinerary_locations (
              locations (
                id,
                name,
                category
              )
            )
          `)
          .eq('id', id)
          .single();
        // -------------------------

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
    return <div>mamaguebo.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/roteiros">&larr; Voltar para Meus Roteiros</Link>
      <h1>Roteiro: {itinerary.name}</h1>
      
      <h3>Locais neste Roteiro:</h3>
      {/* --- EXIBIÇÃO CORRIGIDA --- */}
      {/* Acessamos os locais através da tabela de junção */}
      {itinerary.itinerary_locations.length > 0 ? (
        <ul>
          {itinerary.itinerary_locations.map(item => (
            <li key={item.locations.id}>
              {item.locations.name} ({item.locations.category})
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