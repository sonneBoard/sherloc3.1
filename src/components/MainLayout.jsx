import React, { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import useAppStore from '../store/appStore';
import { motion } from 'framer-motion';
import ItineraryDetailModal from './ItineraryDetailModal';
import EditItineraryModal from './EditItineraryModal';

const ModalContext = createContext();
export const useModals = () => useContext(ModalContext);

const MainLayout = () => {
  const { isSidebarOpen, updateItinerary, removeItinerary } = useAppStore();
  const location = useLocation();
  
  // 1. Novo estado para controlar se a página foi rolada
  const [isScrolled, setIsScrolled] = useState(false);

  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingItineraryId, setEditingItineraryId] = useState(null);

  const handleItineraryUpdated = (updatedItinerary) => {
    updateItinerary(updatedItinerary);
  };
  
  const handleDeleteItinerary = async (itineraryId) => {
    if (window.confirm("Tem certeza que deseja apagar este roteiro?")) {
      try {
        const { error } = await supabase.from('itineraries').delete().eq('id', itineraryId);
        if (error) throw error;
        removeItinerary(itineraryId);
        toast.success("Roteiro apagado com sucesso!");
      } catch (error) {
        toast.error("Erro ao apagar o roteiro.");
      }
    }
  };

  // 2. Efeito que deteta o scroll da página
  useEffect(() => {
    const handleScroll = () => {
      // Se o scroll vertical for maior que 10 pixels, ativamos o estado
      setIsScrolled(window.scrollY > 10);
    };

    // Adiciona o "ouvinte" de scroll
    window.addEventListener('scroll', handleScroll);
    // Limpa o "ouvinte" quando o componente é desmontado para evitar erros
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard';
      case '/mapa': return 'Mapa Interativo';
      case '/roteiros': return 'Meus Roteiros';
      case '/perfil': return 'Meu Perfil';
      case '/explorar': return 'Explorar Roteiros';
      default: return 'Sherloc';
    }
  };

  return (
    <ModalContext.Provider value={{ setSelectedItineraryId, setEditingItineraryId }}>
      <div className="min-h-screen bg-primary text-text-primary">
        <Toaster position="top-center" toastOptions={{ className: 'glass-card', style: { background: 'rgba(26, 27, 38, 0.7)', color: '#E0E0E0' }, }}/>
        <Sidebar />
        <motion.main 
          className="p-8"
          animate={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {/* 3. O Header agora está dentro de um container sticky */}
          <motion.header
            className={`sticky top-0 z-40 transition-all duration-300 mb-8 -mx-8 px-8 ${isScrolled ? 'pt-6 pb-4 glass-card' : 'pt-0 pb-0'}`}
          >
            <Header title={getTitle()} />
          </motion.header>
          
          <Outlet />
        </motion.main>

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
    </ModalContext.Provider>
  );
};

export default MainLayout;