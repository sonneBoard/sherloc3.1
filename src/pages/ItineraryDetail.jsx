import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ItineraryDetail = () => {
  const { id } = useParams();
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItineraryDetails = async () => {
    // A função de busca de dados não precisa de setLoading, pois o 'loading' principal já trata disso
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select(`id, name, itinerary_locations(locations(id, name, category))`)
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          console.warn('Roteiro não encontrado com o id:', id);
          setItinerary(null);
        } else {
          throw error;
        }
      }
      
      if (data) {
        setItinerary(data);
      }
    } catch (error) {
      console.error("Erro ao buscar detalhes do roteiro:", error);
    } finally {
      // Apenas o 'loading' principal deve controlar o estado final
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraryDetails();
  }, [id]);

  const handleRemoveLocation = async (locationIdToRemove) => {
    if (window.confirm("Tem certeza que deseja remover este local do roteiro?")) {
      try {
        const { error } = await supabase
          .from('itinerary_locations')
          .delete()
          .eq('itinerary_id', id)
          .eq('location_id', locationIdToRemove);
        
        if (error) throw error;

        // Atualiza a tela buscando os dados novamente para refletir a remoção
        fetchItineraryDetails();
        alert("Local removido com sucesso!");

      } catch (error) {
        alert("Erro ao remover o local.");
        console.error("Erro ao remover local do roteiro:", error);
      }
    }
  };

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando detalhes do roteiro...</div>;
  }

  if (!itinerary) {
    return (
      <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
          <Link to="/roteiros">&larr; Voltar para Meus Roteiros</Link>
          <h1 className="font-poppins text-4xl font-bold mt-4">Roteiro não encontrado.</h1>
          <p>O roteiro que você está tentando acessar pode ter sido excluído ou o link está incorreto.</p>
      </div>
    );
  }

  return (
    // Container principal da página
    <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/roteiros" className="text-sherloc-yellow hover:underline mb-6 inline-block">&larr; Voltar para Meus Roteiros</Link>
        <h1 className="font-poppins text-4xl font-bold mb-2">Roteiro: {itinerary.name}</h1>
        
        <h3 className="font-poppins text-2xl font-bold mt-6 mb-4">Locais neste Roteiro:</h3>
        {itinerary.itinerary_locations.length > 0 ? (
          <ul className="space-y-4">
            {itinerary.itinerary_locations.map(item => (
              // Card para cada local
              <li key={item.locations.id} className="bg-sherloc-dark-2 p-4 rounded-lg flex justify-between items-center shadow-lg">
                <div>
                  <p className="font-poppins font-semibold text-lg">{item.locations.name}</p>
                  <p className="text-sm text-gray-400">{item.locations.category}</p>
                </div>
                <button 
                  onClick={() => handleRemoveLocation(item.locations.id)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-lg transition-colors text-sm"
                >
                  Remover
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="bg-sherloc-dark-2 p-4 rounded-lg">Ainda não há locais neste roteiro. Adicione locais a partir do mapa!</p>
        )}
      </div>
    </div>
  );
};

export default ItineraryDetail;