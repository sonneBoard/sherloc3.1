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

  // --- NOVA FUNÇÃO PARA APAGAR UM ROTEIRO ---
  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm("Tem certeza que deseja apagar este roteiro permanentemente? Esta ação não pode ser desfeita.")) {
      try {
        // Comando para deletar da tabela 'itineraries' o roteiro com o ID correspondente
        const { error } = await supabase
          .from('itineraries')
          .delete()
          .eq('id', itineraryId);

        if (error) throw error;

        // Atualiza a lista na tela removendo o roteiro que foi apagado
        // Isso evita a necessidade de buscar os dados do banco novamente
        setItineraries(itineraries.filter(it => it.id !== itineraryId));
        alert("Roteiro apagado com sucesso!");

      } catch (error) {
        alert("Erro ao apagar o roteiro.");
        console.error("Erro ao apagar o roteiro:", error);
      }
    }
  };
  // -----------------------------------------

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
            <li key={itinerary.id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to={`/roteiro/${itinerary.id}`}>{itinerary.name}</Link>
              {/* --- NOVO BOTÃO DE APAGAR --- */}
              <button onClick={() => handleDeleteItinerary(itinerary.id)} style={{ marginLeft: '20px' }}>
                Apagar
              </button>
              {/* ------------------------- */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyItineraries;