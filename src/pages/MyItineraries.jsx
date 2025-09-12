// src/pages/MyItineraries.jsx
import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import { motion } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryDetailModal from '../components/ItineraryDetailModal';
import EditItineraryModal from '../components/EditItineraryModal';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton'; // Importamos o Skeleton

const MyItineraries = () => {
  const [selectedItineraryId, setSelectedItineraryId] = useState(null); //
  const [editingItineraryId, setEditingItineraryId] = useState(null); //

  const {
    itineraries,
    isLoadingItineraries,
    fetchItineraries,
    updateItinerary,
    removeItinerary
  } = useAppStore(); //

  useEffect(() => { fetchItineraries(); }, [fetchItineraries]); //

  const handleItineraryUpdated = (updatedItinerary) => { updateItinerary(updatedItinerary); }; //
  
  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm("Tem certeza que deseja apagar este roteiro? Esta ação não pode ser desfeita.")) { //
      try {
        const { error } = await supabase.from('itineraries').delete().eq('id', itineraryId); //
        if (error) throw error; //
        
        removeItinerary(itineraryId); //
        toast.success("Roteiro apagado com sucesso!"); //
        
      } catch (error) {
        toast.error("Erro ao apagar o roteiro."); //
        console.error("Erro ao apagar roteiro:", error); //
      }
    }
  };

  // As variantes de animação foram movidas para dentro do return para simplificar
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div>
      <h1 className="font-poppins text-4xl font-bold mb-8 text-text-primary">Meus Roteiros</h1>
      
      {/* --- LÓGICA DE CARREGAMENTO ATUALIZADA --- */}
      {isLoadingItineraries ? (
        // Mostra a grelha de Skeletons durante o carregamento
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Cria um array de 6 posições para renderizar 6 skeletons */}
          {[...Array(6)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
        </div>
      ) : itineraries.length === 0 ? (
        // Mensagem de estado vazio
        <div className="glass-card p-6 rounded-lg text-center">
            <h3 className="font-poppins font-semibold text-text-primary">Nenhum roteiro por aqui ainda!</h3>
            <p className="text-text-secondary mt-2 text-sm">Vá para o mapa e comece a planejar.</p>
        </div>
      ) : (
        // Mostra os cards reais quando o carregamento termina
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
          onDelete={() => {
            handleDeleteItinerary(selectedItineraryId);
            setSelectedItineraryId(null);
          }}
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