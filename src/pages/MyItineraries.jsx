import React, { useState, useEffect, useMemo } from 'react';
import useAppStore from '../store/appStore';
import { motion, AnimatePresence } from 'framer-motion';
import ItineraryCard from '../components/ItineraryCard';
import ItineraryListItem from '../components/ItineraryListItem'; // 1. Importamos o novo componente
import ItineraryDetailModal from '../components/ItineraryDetailModal';
import EditItineraryModal from '../components/EditItineraryModal';
import { toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import ItineraryCardSkeleton from '../components/ItineraryCardSkeleton';
import { FiPlus, FiSearch, FiInbox, FiChevronDown, FiGrid, FiList } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const MyItineraries = () => {
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingItineraryId, setEditingItineraryId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('created_at_desc');
  const [layout, setLayout] = useState('grid'); // 2. Novo estado para o layout
  const navigate = useNavigate();

  const {
    itineraries,
    isLoadingItineraries,
    fetchItineraries,
    updateItinerary,
    removeItinerary
  } = useAppStore();

  useEffect(() => { fetchItineraries(); }, [fetchItineraries]);

  const processedItineraries = useMemo(() => {
    let items = [...itineraries];

    // Filtragem
    if (searchTerm) {
      items = items.filter(itinerary =>
        itinerary.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenação
    switch (sortOption) {
      case 'created_at_asc':
        items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case 'name_asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'created_at_desc':
      default:
        items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
    }

    return items;
  }, [searchTerm, itineraries, sortOption]);

  const handleItineraryUpdated = (updatedItinerary) => { updateItinerary(updatedItinerary); };
  
  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm("Tem certeza que deseja apagar este roteiro? Esta ação não pode ser desfeita.")) {
      try {
        const { error } = await supabase.from('itineraries').delete().eq('id', itineraryId);
        if (error) throw error;
        
        removeItinerary(itineraryId);
        toast.success("Roteiro apagado com sucesso!");
        
      } catch (error) {
        toast.error("Erro ao apagar o roteiro.");
        console.error("Erro ao apagar roteiro:", error);
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <h1 className="font-poppins text-4xl font-bold text-text-primary">Meus Roteiros</h1>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" />
            <input 
              type="text"
              placeholder="Pesquisar..."
              className="w-full md:w-48 bg-secondary/50 rounded-full py-2 pl-12 pr-4 text-sm text-text-primary placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-1 p-1 rounded-full glass-card">
            <button onClick={() => setLayout('grid')} className={`p-1.5 rounded-full transition-colors ${layout === 'grid' ? 'bg-accent-gold text-primary' : 'text-text-secondary hover:bg-secondary/50'}`} title="Visualização em Grelha">
              <FiGrid />
            </button>
            <button onClick={() => setLayout('list')} className={`p-1.5 rounded-full transition-colors ${layout === 'list' ? 'bg-accent-gold text-primary' : 'text-text-secondary hover:bg-secondary/50'}`} title="Visualização em Lista">
              <FiList />
            </button>
          </div>
          
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="appearance-none bg-secondary/50 rounded-full py-2 pl-4 pr-10 text-sm text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent-gold cursor-pointer"
            >
              <option value="created_at_desc">Mais Recentes</option>
              <option value="created_at_asc">Mais Antigos</option>
              <option value="name_asc">Alfabética</option>
            </select>
            <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none" />
          </div>

          <button 
            onClick={() => navigate('/mapa')}
            className="flex-shrink-0 flex items-center gap-2 bg-accent-gold text-primary font-semibold text-sm py-2 px-4 rounded-full hover:brightness-110 transition-colors"
          >
            <FiPlus />
            <span className="hidden lg:block">Criar Novo</span>
          </button>
        </div>
      </div>
      
      {isLoadingItineraries ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => <ItineraryCardSkeleton key={i} />)}
        </div>
      ) : itineraries.length === 0 ? (
        <div className="glass-card p-8 rounded-2xl text-center flex flex-col items-center justify-center min-h-[300px]">
            <FiInbox size={48} className="text-accent-gold/50 mb-4" />
            <h3 className="font-poppins font-semibold text-xl text-text-primary">Sua coleção de roteiros está vazia</h3>
            <p className="text-text-secondary mt-2 text-sm max-w-xs">Comece a sua jornada clicando no botão para criar o seu primeiro roteiro.</p>
             <button 
                onClick={() => navigate('/mapa')}
                className="mt-6 flex items-center gap-2 bg-accent-gold text-primary font-semibold text-sm py-2 px-4 rounded-full hover:brightness-110 transition-colors"
              >
                <FiPlus />
                <span>Criar Meu Primeiro Roteiro</span>
              </button>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={layout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {layout === 'grid' ? (
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {processedItineraries.map(itinerary => (
                  <ItineraryCard 
                    key={itinerary.id} 
                    itinerary={itinerary}
                    onViewMore={setSelectedItineraryId}
                    onEdit={setEditingItineraryId}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div className="flex flex-col gap-4">
                {processedItineraries.map(itinerary => (
                  <ItineraryListItem 
                    key={itinerary.id}
                    itinerary={itinerary}
                    onView={setSelectedItineraryId}
                    onEdit={setEditingItineraryId}
                  />
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

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