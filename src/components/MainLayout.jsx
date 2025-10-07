// src/components/MainLayout.jsx
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
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedItineraryId, setSelectedItineraryId] = useState(null);
  const [editingItineraryId, setEditingItineraryId] = useState(null);

  // Expor função global para abrir modal de edição
  useEffect(() => {
    window.openEditModal = (id) => {
      setEditingItineraryId(id);
    };
    return () => {
      delete window.openEditModal;
    };
  }, []);

  const handleItineraryUpdated = (updatedItinerary) => {
    updateItinerary(updatedItinerary);
  };
  
  // --- FUNÇÃO CORRIGIDA COM VERIFICAÇÃO DE PROPRIEDADE ---
  const handleDeleteItinerary = async (itineraryId) => {
    // 1. Busca o usuário logado e o dono do roteiro
    const { data: { user } } = await supabase.auth.getUser();
    const { data: itineraryToDelete, error: fetchError } = await supabase
      .from('itineraries')
      .select('created_by')
      .eq('id', itineraryId)
      .single();

    if (fetchError) {
      toast.error("Não foi possível verificar as permissões do roteiro.");
      return;
    }

    // 2. Compara os IDs. Se não for o dono, bloqueia a ação.
    if (!user || user.id !== itineraryToDelete?.created_by) {
      toast.error("Você não tem permissão para apagar este roteiro.");
      return;
    }

    // 3. Se for o dono, prossegue com a confirmação e exclusão
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // A função getTitle não é usada, mas pode ser mantida se você planeja usá-la
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

        <div className="relative">
          <motion.header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'}`}
            animate={{ paddingLeft: isSidebarOpen ? '16rem' : '5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Header />
          </motion.header>

          <motion.main 
            className="p-8"
            animate={{ marginLeft: isSidebarOpen ? '16rem' : '5rem' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <Outlet />
          </motion.main>
        </div>

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
