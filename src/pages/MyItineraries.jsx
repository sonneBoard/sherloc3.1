// src/pages/MyItineraries.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryDetailModal from '../components/ItineraryDetailModal';
import EditItineraryModal from '../components/EditItineraryModal'; // 1. Importamos o modal de edição

const MyItineraries = () => {
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingItineraryId, setEditingItineraryId] = useState(null); // 2. Novo estado para controlar o modal de edição

  // Sua função para buscar os roteiros continua a mesma
  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from('itineraries')
            .select('id, name, description, image_url')
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

  // 3. Função para atualizar a lista na tela após uma edição
  const handleItineraryUpdated = (updatedItinerary) => {
    setItineraries(prevItineraries => 
      prevItineraries.map(it => 
        it.id === updatedItinerary.id ? updatedItinerary : it
      )
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (loading) {
    return <div>Carregando...</div>; // TODO: Criar Skeleton Loader para os cards aqui
  }

  return (
    <div className="p-8">
      <h1 className="font-poppins text-4xl font-bold mb-8 text-sherloc-text-bright">Meus Roteiros</h1>
      
      {itineraries.length === 0 ? (
        <p className="glass-card p-6 rounded-lg text-center">Você ainda não criou nenhum roteiro.</p>
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
              // 4. O botão 'onEdit' agora define qual roteiro editar, abrindo o modal
              onEdit={setEditingItineraryId}
            />
          ))}
        </motion.div>
      )}

      {/* O modal de detalhes continua o mesmo */}
      {selectedItineraryId && (
        <ItineraryDetailModal 
          itineraryId={selectedItineraryId} 
          onClose={() => setSelectedItineraryId(null)} 
        />
      )}

      {/* 5. Renderizamos o novo modal de edição */}
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