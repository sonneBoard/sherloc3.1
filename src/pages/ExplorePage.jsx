// src/pages/ExplorePage.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton';
import ItineraryDetailModal from '../components/ItineraryDetailModal'; // 1. Importamos o modal
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

const ExplorePage = () => {
  const [publicItineraries, setPublicItineraries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null); // 2. Novo estado para o modal
  const navigate = useNavigate();
  const fetchItineraries = useAppStore(state => state.fetchItineraries);

  useEffect(() => {
    // A sua função para buscar os roteiros públicos continua a mesma
    const fetchPublicItineraries = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('itineraries')
          .select('*, profiles(username)')
          .eq('is_public', true)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPublicItineraries(data || []);
      } catch (error) {
        toast.error("Não foi possível carregar os roteiros públicos.");
        console.error("Erro ao buscar roteiros públicos:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPublicItineraries();
  }, []);
  
  // --- 5. LÓGICA DE CLONAGEM IMPLEMENTADA ---
  const handleCloneItinerary = async (itineraryId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para salvar um roteiro.");
        navigate('/login');
        return;
      }
      
      toast.loading('Salvando roteiro na sua conta...');
      
      // Chamamos a nossa função do banco de dados (RPC)
      const { error } = await supabase.rpc('clone_itinerary', {
        source_itinerary_id: itineraryId
      });

      if (error) throw error;
      
      toast.dismiss();
      toast.success("Roteiro salvo com sucesso!");

      // Forçamos a atualização da lista de roteiros no nosso store
      await fetchItineraries(true); // O 'true' força a re-busca dos dados

      // Redirecionamos o usuário para a página dele
      navigate('/roteiros');

    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Não foi possível salvar o roteiro.");
      console.error("Erro ao clonar roteiro:", error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  return (
    <div>
      <h1 className="font-poppins text-4xl font-bold mb-2 text-text-primary">Explorar Roteiros</h1>
      <p className="text-text-secondary mb-8">Descubra e inspire-se com as aventuras criadas pela comunidade Sherloc.</p>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
        </div>
      ) : publicItineraries.length === 0 ? (
        <div className="glass-card p-6 rounded-lg text-center">
            <h3 className="font-poppins font-semibold text-text-primary">Nenhum roteiro público por aqui ainda!</h3>
            <p className="text-text-secondary mt-2 text-sm">Seja o primeiro a compartilhar uma aventura! Marque um dos seus roteiros como público.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {publicItineraries.map(itinerary => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              variant="explore"
              onClone={() => handleCloneItinerary(itinerary.id)}
              // 3. O botão agora define o ID do roteiro a ser visualizado
              onViewMore={setSelectedItineraryId}
            />
          ))}
        </motion.div>
      )}

      {/* 4. Renderizamos o modal quando um roteiro é selecionado */}
      {selectedItineraryId && (
        <ItineraryDetailModal
          itineraryId={selectedItineraryId}
          onClose={() => setSelectedItineraryId(null)}
          // Passamos a função de apagar vazia, pois não se pode apagar um roteiro público
          onDelete={null} 
        />
      )}
    </div>
  );
};

export default ExplorePage;