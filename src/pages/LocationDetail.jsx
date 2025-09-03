import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

// --- COMPONENTE MODAL COM LÓGICA FINAL ---
const AddToItineraryModal = ({ isOpen, onClose, locationId, locationName }) => {
  const [loading, setLoading] = useState(true);
  const [existingItineraries, setExistingItineraries] = useState([]);
  const [newItineraryName, setNewItineraryName] = useState("");

  useEffect(() => {
    if (isOpen) {
      const fetchItineraries = async () => {
        setLoading(true);
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data, error } = await supabase
              .from('itineraries')
              .select('id, name')
              .eq('created_by', user.id);
            
            if (error) throw error;
            if (data) setExistingItineraries(data);
          }
        } catch (error) {
          console.error("Erro ao buscar roteiros existentes:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchItineraries();
    }
  }, [isOpen]);

  const handleCreateAndAdd = async () => {
    if (newItineraryName.trim() === '') {
      alert('Por favor, dê um nome ao novo roteiro.');
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado.");

      const { data: itineraryData, error: itineraryError } = await supabase
        .from('itineraries')
        .insert({ name: newItineraryName, created_by: user.id })
        .select()
        .single();
      if (itineraryError) throw itineraryError;

      const { error: locationError } = await supabase
        .from('itinerary_locations')
        .insert({ itinerary_id: itineraryData.id, location_id: locationId, visit_order: 1 });
      if (locationError) throw locationError;
      
      alert(`'${locationName}' foi adicionado ao novo roteiro '${newItineraryName}'!`);
      onClose();
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  const handleAddToExisting = async (itineraryId) => {
    try {
        const { data: existing, error: checkError } = await supabase
            .from('itinerary_locations')
            .select()
            .eq('itinerary_id', itineraryId)
            .eq('location_id', locationId);

        if (checkError) throw checkError;
        if (existing.length > 0) {
            alert('Este local já está neste roteiro.');
            return;
        }
        
        const { count, error: countError } = await supabase
            .from('itineraries')
            .select('*', { count: 'exact', head: true })
            .eq('id', itineraryId);
        
        if (countError) throw countError;

        const { error: insertError } = await supabase
            .from('itinerary_locations')
            .insert({ itinerary_id: itineraryId, location_id: locationId, visit_order: (count || 0) + 1 });
        if (insertError) throw insertError;
        
        alert(`'${locationName}' foi adicionado ao roteiro!`);
        onClose();
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Adicionar "{locationName}" a um Roteiro</h2>
        <hr />
        <h4>Criar Novo Roteiro</h4>
        <input 
          type="text" 
          placeholder="Nome do novo roteiro"
          value={newItineraryName}
          onChange={(e) => setNewItineraryName(e.target.value)}
          style={{ width: '95%', padding: '8px' }}
        />
        <button onClick={handleCreateAndAdd} style={{ marginTop: '10px' }}>
          Criar e Adicionar
        </button>
        <hr style={{ margin: '20px 0' }} />
        <h4>Adicionar a um Roteiro Existente</h4>
        {loading ? (
          <p>Carregando roteiros...</p>
        ) : existingItineraries.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, maxHeight: '150px', overflowY: 'auto' }}>
            {existingItineraries.map(it => (
              <li key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span>{it.name}</span>
                <button onClick={() => handleAddToExisting(it.id)}>Adicionar</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não tem roteiros.</p>
        )}
        <button onClick={onClose} style={styles.closeButton}>Cancelar</button>
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL QUE ESTAVA FALTANDO ---
const LocationDetail = () => {
  const { id: locationId } = useParams();
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchLocation = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('locations').select('*').eq('id', locationId).single();
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

  if (loading) return <div>Carregando...</div>;
  if (!location) return <div>Local não encontrado.</div>;

  return (
    <div style={{ padding: '20px' }}>
      <Link to="/">&larr; Voltar para o Mapa</Link>
      <h1>{location.name}</h1>
      <p><strong>Categoria:</strong> {location.category}</p>
      <p><strong>Descrição:</strong> {location.description || 'Nenhuma descrição disponível.'}</p>
      <button 
        style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}
        onClick={() => setIsModalOpen(true)}
      >
        Adicionar ao Roteiro
      </button>
      <AddToItineraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        locationId={locationId}
        locationName={location.name}
      />
    </div>
  );
};

// Estilos básicos para o modal
const styles = {
  overlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
  },
  modal: {
    background: 'white', padding: '20px', borderRadius: '5px',
    minWidth: '400px', maxWidth: '90%', color: 'black',
  },
  closeButton: {
    marginTop: '20px',
  }
};

export default LocationDetail;