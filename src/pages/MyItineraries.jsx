// src/pages/MyItineraries.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryDetailModal from '../components/ItineraryDetailModal';
import EditItineraryModal from '../components/EditItineraryModal';

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState([]); //
  const [loading, setLoading] = useState(true); //
  const [selectedItineraryId, setSelectedItineraryId] = useState(null); //
  const [editingItineraryId, setEditingItineraryId] = useState(null); //

  // A sua lógica para buscar os roteiros foi mantida
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser(); //
        if (user) {
          const { data, error } = await supabase
            .from('itineraries') //
            .select('id, name, description, image_url') //
            .eq('created_by', user.id) //
            .order('created_at', { ascending: false }); //

          if (error) throw error; //
          if (data) setItineraries(data); //
        }
      } catch (error) {
        console.error("Erro ao buscar roteiros:", error); //
      } finally {
        setLoading(false); //
      }
    };
    fetchItineraries();
  }, []); //

  // A sua função para atualizar os roteiros na tela foi mantida
  const handleItineraryUpdated = (updatedItinerary) => {
    setItineraries(prevItineraries => 
      prevItineraries.map(it => 
        it.id === updatedItinerary.id ? updatedItinerary : it
      )
    );
  }; //

  // As suas variantes de animação foram mantidas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }; //

  if (loading) {
    return <div>Carregando...</div>; // TODO: Criar um Skeleton Loader para os cards aqui
  }

  return (
    // O container principal herda o fundo do MainLayout
    <div>
      {/* Título atualizado com a nova cor de texto primária */}
      <h1 className="font-poppins text-4xl font-bold mb-8 text-text-primary">Meus Roteiros</h1>
      
      {/* Mensagem de "Estado Vazio" redesenhada para o tema claro */}
      {itineraries.length === 0 ? (
        <div className="bg-background border border-border-light p-6 rounded-lg text-center">
            <h3 className="font-poppins font-semibold text-text-primary">Nenhum roteiro por aqui ainda!</h3>
            <p className="text-text-secondary mt-2 text-sm">Vá para o mapa, descubra novos locais e comece a planejar sua próxima aventura.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {itineraries.map(itinerary => (
            <ItineraryCard 
              key={itinerary.id} 
              itinerary={itinerary}
              onViewMore={setSelectedItineraryId}
              onEdit={setEditingItineraryId}
            />
          ))}
        </motion.div>
      )}

      {/* A renderização dos modais foi mantida */}
      {selectedItineraryId && (
        <ItineraryDetailModal 
          itineraryId={selectedItineraryId} 
          onClose={() => setSelectedItineraryId(null)} 
        />
      )}
      
      {editingItineraryId && (
        <EditItineraryModal
          isOpen={!!editingItineraryId}
          itineraryId={editingItineraryId}
          onClose={() => setEditingItineraryId(null)}
          onItineraryUpdated={handleItineraryUpdated}
        />
      )}
    </div>
  );
};

export default MyItineraries;