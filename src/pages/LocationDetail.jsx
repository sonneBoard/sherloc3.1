import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { toast } from 'react-hot-toast';

// --- COMPONENTE MODAL ATUALIZADO COM NOTIFICAÇÕES TOAST ---
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
            const { data, error } = await supabase.from('itineraries').select('id, name').eq('created_by', user.id);
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
      // Alterado para toast.error
      toast.error('Por favor, dê um nome ao novo roteiro.');
      return;
    }
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado.");

      const { data: itineraryData, error: itineraryError } = await supabase.from('itineraries').insert({ name: newItineraryName, created_by: user.id }).select().single();
      if (itineraryError) throw itineraryError;

      const { error: locationError } = await supabase.from('itinerary_locations').insert({ itinerary_id: itineraryData.id, location_id: locationId, visit_order: 1 });
      if (locationError) throw locationError;
      
      // Alterado para toast.success
      toast.success(`'${locationName}' foi adicionado ao novo roteiro '${newItineraryName}'!`);
      onClose();
    } catch (error) {
      // Alterado para toast.error
      toast.error(error.message);
    }
  };

  const handleAddToExisting = async (itineraryId) => {
    try {
        const { data: existing, error: checkError } = await supabase.from('itinerary_locations').select().eq('itinerary_id', itineraryId).eq('location_id', locationId);
        if (checkError) throw checkError;
        if (existing.length > 0) {
            // Alterado para toast.error, pois é um aviso de falha
            toast.error('Este local já está neste roteiro.');
            return;
        }
        
        const { count, error: countError } = await supabase.from('itinerary_locations').select('*', { count: 'exact', head: true }).eq('itinerary_id', itineraryId);
        if (countError) throw countError;

        const { error: insertError } = await supabase.from('itinerary_locations').insert({ itinerary_id: itineraryId, location_id: locationId, visit_order: (count || 0) + 1 });
        if (insertError) throw insertError;
        
        // Alterado para toast.success
        toast.success(`'${locationName}' foi adicionado ao roteiro!`);
        onClose();
    } catch (error) {
        // Alterado para toast.error
        toast.error(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[2000]">
      <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-poppins text-xl font-bold mb-4">Adicionar "{locationName}"</h2>
        <hr className="border-gray-600"/>
        
        <div className="mt-4">
          <h4 className="font-semibold mb-2">Criar Novo Roteiro</h4>
          <input 
            type="text" 
            placeholder="Nome do novo roteiro"
            value={newItineraryName}
            onChange={(e) => setNewItineraryName(e.target.value)}
            className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg block w-full p-2.5"
          />
          <button onClick={handleCreateAndAdd} className="mt-2 w-full text-black bg-sherloc-yellow hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
            Criar e Adicionar
          </button>
        </div>

        <hr className="my-6 border-gray-600" />

        <div>
          <h4 className="font-semibold mb-2">Adicionar a um Roteiro Existente</h4>
          {loading ? (
            <p>Carregando roteiros...</p>
          ) : existingItineraries.length > 0 ? (
            <ul className="list-none p-0 max-h-32 overflow-y-auto space-y-2">
              {existingItineraries.map(it => (
                <li key={it.id} className="flex justify-between items-center bg-sherloc-dark p-2 rounded-md">
                  <span>{it.name}</span>
                  <button onClick={() => handleAddToExisting(it.id)} className="bg-sherloc-purple/50 hover:bg-sherloc-purple/80 text-white text-xs font-bold py-1 px-2 rounded">Adicionar</button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">Você ainda não tem roteiros.</p>
          )}
        </div>

        <button onClick={onClose} className="mt-6 w-full text-white bg-transparent border border-gray-600 hover:bg-gray-700 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  );
};


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

  if (loading) return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Carregando...</div>;
  if (!location) return <div className="bg-sherloc-dark min-h-screen text-sherloc-text p-8">Local não encontrado.</div>;

  return (
    <div className="bg-sherloc-dark min-h-screen text-sherloc-text font-lexend p-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-sherloc-yellow hover:underline mb-6 inline-block">&larr; Voltar para o Mapa</Link>
        
        <div className="bg-sherloc-dark-2 p-6 rounded-lg shadow-lg">
          <h1 className="font-poppins text-4xl font-bold mb-4">{location.name}</h1>
          <p><strong className="text-gray-400">Categoria:</strong> {location.category}</p>
          <p className="mt-4"><strong className="text-gray-400">Descrição:</strong> {location.description || 'Nenhuma descrição disponível.'}</p>
          
          <button 
            style={{ marginTop: '20px' }}
            className="w-full sm:w-auto text-black bg-sherloc-yellow hover:bg-yellow-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center transition-colors"
            onClick={() => setIsModalOpen(true)}
          >
            Adicionar ao Roteiro
          </button>
        </div>
      </div>
      
      <AddToItineraryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        locationId={locationId}
        locationName={location.name}
      />
    </div>
  );
};

export default LocationDetail;