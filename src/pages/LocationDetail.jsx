import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const LocationDetail = () => {
  const { id: locationId } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*')
          .eq('id', locationId)
          .single();

        if (error) throw error;
        if (data) setLocation(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes do local:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [locationId]);

  const handleAddToItinerary = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Você precisa estar logado para criar um roteiro.");

      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({
          name: 'Meu Novo Roteiro',
          created_by: user.id,
        })
        .select()
        .single();

      if (itineraryError) throw itineraryError;

      // --- CORREÇÃO AQUI ---
      const { error: locationError } = await supabase
        .from('itinerary_locations')
        .insert({
          itinerary_id: itineraryData.id,
          location_id: locationId,
          visit_order: 1, // Adicionamos a ordem da visita como 1
        });
      // --------------------
      
      if (locationError) throw locationError;

      alert(`'${location.name}' foi adicionado com sucesso ao '${itineraryData.name}'!`);

    } catch (error) {
      alert(error.message);
      console.error("Erro ao adicionar ao roteiro:", error);
    }
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!location) {
    return <div>Local não encontrado.</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Voltar para o Mapa</Link>
      
      <h1>{location.name}</h1>
      <p><strong>Categoria:</strong> {location.category}</p>
      <p><strong>Descrição:</strong> {location.description || 'Nenhuma descrição disponível.'}</p>
      
      <button 
        style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
        onClick={handleAddToItinerary}
      >
        Adicionar ao Roteiro
      </button>
    </div>
  );
};

export default LocationDetail;