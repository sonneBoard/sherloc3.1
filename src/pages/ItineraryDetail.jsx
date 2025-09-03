import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Criamos uma função separada para poder chamá-la novamente após a exclusão
  const fetchItineraryDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('itineraries')
        .select(`id, name, itinerary_locations(locations(id, name, category))`)
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) setItinerary(data);
    } catch (error) {
      console.error("Erro ao buscar detalhes do roteiro:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraryDetails();
  }, [id]);

  // --- NOVA FUNÇÃO PARA REMOVER UM LOCAL ---
  const handleRemoveLocation = async (locationIdToRemove) => {
    // Pede confirmação ao usuário antes de apagar
    if (window.confirm("Tem certeza que deseja remover este local do roteiro?")) {
      try {
        // Comando para deletar da tabela de junção 'itinerary_locations'
        // a linha que conecta o roteiro atual (id) com o local a ser removido.
        const { error } = await supabase
          .from('itinerary_locations')
          .delete()
          .eq('itinerary_id', id)
          .eq('location_id', locationIdToRemove);
        
        if (error) throw error;

        // Atualiza a lista de locais na tela sem precisar recarregar a página
        fetchItineraryDetails();
        alert("Local removido com sucesso!");

      } catch (error) {
        alert("Erro ao remover o local.");
        console.error("Erro ao remover local do roteiro:", error);
      }
    }
  };
  // ------------------------------------

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
      {itinerary.itinerary_locations.length > 0 ? (
        <ul>
          {itinerary.itinerary_locations.map(item => (
            <li key={item.locations.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{item.locations.name} ({item.locations.category})</span>
              {/* --- NOVO BOTÃO DE REMOVER --- */}
              <button onClick={() => handleRemoveLocation(item.locations.id)}>
                Remover
              </button>
              {/* --------------------------- */}
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