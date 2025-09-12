// src/components/MainLayout.jsx
import React, { useState, createContext, useContext } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { Toaster, toast } from 'react-hot-toast';
import { supabase } from '../supabaseClient';
import useAppStore from '../store/appStore';
import { motion } from 'framer-motion';
import ItineraryDetailModal from './ItineraryDetailModal';
import EditItineraryModal from './EditItineraryModal';

// 1. Criamos um Contexto para partilhar as funções dos modais
const ModalContext = createContext();
export const useModals = () => useContext(ModalContext);

const MainLayout = () => {
  const { isSidebarOpen, updateItinerary, removeItinerary } = useAppStore();
  const location = useLocation();

  // 2. O estado que controla os modais agora vive aqui, no componente-pai
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingItineraryId, setEditingItineraryId] = useState(null);

  // 3. As funções de Ação (editar e apagar) também vivem aqui
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

  const getTitle = () => {
    switch (location.pathname) {
      case '/dashboard': return 'Dashboard'; //
      case '/mapa': return 'Mapa Interativo'; //
      case '/roteiros': return 'Meus Roteiros'; //
      case '/perfil': return 'Meu Perfil'; //
      case '/explorar': return 'Explorar Roteiros'; // Adicionado para a nova página
      default: return 'Sherloc'; //
    }
  };

  return (
    // 4. O Provider "disponibiliza" os valores para todas as páginas filhas
    <ModalContext.Provider value={{ setSelectedItineraryId, setEditingItineraryId }}>
      <div className="min-h-screen bg-primary text-text-primary">
        <Toaster position="top-center" toastOptions={{ className: 'glass-card', style: { background: 'rgba(26, 27, 38, 0.7)', color: '#E0E0E0' }, }}/>
        <Sidebar />
        <motion.main 
          className="p-8"
          animate={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <Header title={getTitle()} />
          <Outlet />
        </motion.main>

        {/* 5. Os modais agora são renderizados aqui, no topo da aplicação */}
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