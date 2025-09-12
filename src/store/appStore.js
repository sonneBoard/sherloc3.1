// src/store/appStore.js

import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useAppStore = create((set, get) => ({
  // --- Estado da Sidebar (mantido) ---
  isSidebarOpen: false,
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),

  // --- ESTADO E AÇÕES PARA ROTEIROS ---
  itineraries: [],
  isLoadingItineraries: true,
  
  // Ação para buscar os roteiros no Supabase
  fetchItineraries: async () => {
    // A lógica de otimização foi levemente ajustada para a nova função de limpeza
    if (get().itineraries.length > 0 && !get().isLoadingItineraries) {
      return;
    }

    try {
      set({ isLoadingItineraries: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('itineraries')
          .select('id, name, description, image_url')
          .eq('created_by', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        set({ itineraries: data || [] });
      }
    } catch (error) {
      console.error("Erro no store ao buscar roteiros:", error);
    } finally {
      set({ isLoadingItineraries: false });
    }
  },

  // Ação para adicionar um novo roteiro à lista
  addItinerary: (newItinerary) => {
    set(state => ({
      itineraries: [newItinerary, ...state.itineraries]
    }));
  },

  // Ação para atualizar um roteiro na lista
  updateItinerary: (updatedItinerary) => {
    set(state => ({
      itineraries: state.itineraries.map(it => 
        it.id === updatedItinerary.id ? updatedItinerary : it
      )
    }));
  },

  // Ação para remover um roteiro
  removeItinerary: (itineraryId) => {
    set(state => ({
      itineraries: state.itineraries.filter(it => it.id !== itineraryId)
    }));
  },

  // --- NOVA AÇÃO PARA LIMPAR A SESSÃO ---
  clearUserSession: () => {
    set({
      itineraries: [],
      isLoadingItineraries: true,
    });
  },
}));

export default useAppStore;