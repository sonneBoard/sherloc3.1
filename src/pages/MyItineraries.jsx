import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('itineraries')
            .select('id, name')
            .eq('created_by', user.id)
            .order('created_at', { ascending: false });

          if (error) throw error;
          if (data) setItineraries(data);
        }
      } catch (error) {
        console.error("Erro ao buscar roteiros:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItineraries();
  }, []);

  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm("Tem certeza que deseja apagar este roteiro permanentemente? Esta ação não pode ser desfeita.")) {
      try {
        const { error } = await supabase
          .from('itineraries')
          .delete()
          .eq('id', itineraryId);

        if (error) throw error;
        setItineraries(itineraries.filter(it => it.id !== itineraryId));
        alert("Roteiro apagado com sucesso!");
      } catch (error) {
        alert("Erro ao apagar o roteiro.");
        console.error("Erro ao apagar o roteiro:", error);
      }
    }
  };

  if (loading) {
    return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando seus roteiros...</div>;
  }

  return (
    // Container principal da página
    <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sherloc-yellow hover:underline mb-6 inline-block">&larr; Voltar para o Mapa</Link>
        <h1 className="font-poppins text-4xl font-bold mb-6">Meus Roteiros</h1>
        
        {itineraries.length === 0 ? (
          <p className="bg-sherloc-dark-2 p-4 rounded-lg">Você ainda não criou nenhum roteiro.</p>
        ) : (
          // Container da lista
          <ul className="space-y-4">
            {itineraries.map(itinerary => (
              // Card de cada item da lista
              <li key={itinerary.id} className="bg-sherloc-dark-2 p-4 rounded-lg flex justify-between items-center shadow-lg transition-transform hover:scale-105">
                <Link to={`/roteiro/${itinerary.id}`} className="font-poppins font-semibold text-lg hover:text-sherloc-yellow">
                  {itinerary.name}
                </Link>
                <button 
                  onClick={() => handleDeleteItinerary(itinerary.id)} 
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Apagar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MyItineraries;