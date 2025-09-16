import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton';
import { useModals } from '../components/MainLayout';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import useAppStore from '../store/appStore';

const ExplorePage = () => {
  const [loading, setLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [sortBy, setSortBy] = useState('clone_count');
  const [activeTag, setActiveTag] = useState(null);
  const { setSelectedItineraryId } = useModals();
  const navigate = useNavigate();
  const fetchItinerariesStore = useAppStore(state => state.fetchItineraries);

  const fetchItineraries = useCallback(async (currentSort, currentTag) => {
    setIsFiltering(true);
    try {
      let query = supabase
        .from('itineraries')
        .select('*, profiles(username)')
        .eq('is_public', true);

      if (currentTag) {
        query = query.contains('tags', [currentTag]);
      }
      query = query.order(currentSort, { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      setItineraries(data || []);
    } catch (error) {
      toast.error("Não foi possível carregar os roteiros.");
    } finally {
      setIsFiltering(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const [itinerariesResult, tagsResult] = await Promise.all([
          supabase.from('itineraries').select('*, profiles(username)').eq('is_public', true).order('clone_count', { ascending: false }),
          supabase.rpc('get_distinct_public_tags')
        ]);

        if (itinerariesResult.error) throw itinerariesResult.error;
        if (tagsResult.error) throw tagsResult.error;
        
        setItineraries(itinerariesResult.data || []);
        setAvailableTags(tagsResult.data.map(t => t.tag) || []);
      } catch (error) {
        toast.error("Erro ao carregar a página.");
        console.error("Erro na busca inicial:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    // Evita a re-busca na primeira renderização, pois os dados já foram carregados
    if (loading === false) { 
      fetchItineraries(sortBy, activeTag);
    }
  }, [sortBy, activeTag, loading, fetchItineraries]);

  const handleCloneItinerary = async (itineraryId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logado para salvar um roteiro.");
        navigate('/login');
        return;
      }
      toast.loading('Salvando roteiro na sua conta...');
      const { error } = await supabase.rpc('clone_itinerary', {
        source_itinerary_id: itineraryId
      });
      if (error) throw error;
      toast.dismiss();
      toast.success("Roteiro salvo com sucesso!");
      await fetchItinerariesStore(true);
      navigate('/roteiros');
    } catch (error) {
      toast.dismiss();
      toast.error(error.message || "Não foi possível salvar o roteiro.");
      console.error("Erro ao clonar roteiro:", error);
    }
  };

  const featuredItinerary = itineraries.length > 0 ? itineraries[0] : null;
  const galleryItineraries = (sortBy === 'clone_count' && !activeTag && itineraries.length > 1) 
    ? itineraries.slice(1) 
    : itineraries;
    
  if (loading) {
    return (
      <div>
        <div className="w-full h-80 rounded-2xl bg-secondary/50 animate-pulse mb-12"></div>
        <div className="h-10 w-full bg-secondary/50 animate-pulse mb-8 rounded-full"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      {!activeTag && sortBy === 'clone_count' && featuredItinerary && (
        <motion.div 
          className="mb-12 rounded-2xl overflow-hidden relative h-80 flex flex-col justify-end p-8 text-white shadow-lg"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
          <img src={featuredItinerary.image_url || 'https://images.unsplash.com/photo-1528543606781-2f6e6857f318'} 
            alt={featuredItinerary.name} 
            className="absolute inset-0 w-full h-full object-cover" 
          />
          <div className="relative z-20">
            <span className="text-sm font-semibold bg-accent-gold text-primary py-1 px-3 rounded-full">Roteiro em Destaque</span>
            <h2 className="font-poppins text-4xl font-bold mt-4">{featuredItinerary.name}</h2>
            <p className="text-sm mt-2 max-w-lg">{featuredItinerary.description}</p>
            <div className="mt-6 flex gap-4">
              <button 
                onClick={() => handleCloneItinerary(featuredItinerary.id)}
                className="bg-accent-gold text-primary font-semibold py-2 px-6 rounded-lg hover:brightness-110 transition-colors"
              >
                Salvar Roteiro
              </button>
              <button 
                onClick={() => setSelectedItineraryId(featuredItinerary.id)}
                className="bg-white/20 text-white font-semibold py-2 px-6 rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
              >
                Ver Detalhes
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h2 className="font-poppins text-2xl font-bold text-text-primary">Todos os Roteiros</h2>
        <div className="flex items-center gap-4 flex-wrap justify-center">
          <div className="flex gap-2 p-1 rounded-full glass-card">
            <button onClick={() => setSortBy('created_at')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'created_at' ? 'bg-accent-gold text-primary' : 'text-text-secondary hover:bg-secondary/50'}`}>
              Mais Recentes
            </button>
            <button onClick={() => setSortBy('clone_count')} className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${sortBy === 'clone_count' ? 'bg-accent-gold text-primary' : 'text-text-secondary hover:bg-secondary/50'}`}>
              Mais Populares
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3 mb-8 overflow-x-auto pb-3 -mx-8 px-8">
        <button onClick={() => setActiveTag(null)} className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${!activeTag ? 'bg-accent-gold text-primary' : 'glass-card text-text-secondary hover:bg-secondary/50'}`}>
            Todos
        </button>
        {availableTags.map(tag => (
          <button 
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`flex-shrink-0 px-4 py-1.5 text-sm font-semibold rounded-full transition-colors ${activeTag === tag ? 'bg-accent-gold text-primary' : 'glass-card text-text-secondary hover:bg-secondary/50'}`}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {isFiltering ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
        </div>
      ) : itineraries.length === 0 ? (
         <div className="glass-card p-6 rounded-lg text-center h-48 flex flex-col justify-center">
            <h3 className="font-poppins font-semibold text-text-primary">Nenhum roteiro encontrado.</h3>
            <p className="text-text-secondary mt-2 text-sm">Tente um filtro ou ordenação diferente.</p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {galleryItineraries.map(it => (
            <motion.div key={it.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ItineraryCard 
                itinerary={it} 
                variant="explore"
                onViewMore={setSelectedItineraryId}
                onClone={() => handleCloneItinerary(it.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ExplorePage;