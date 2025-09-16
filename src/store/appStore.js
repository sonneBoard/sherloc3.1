// src/store/appStore.js

import { create } from 'zustand';
import { supabase } from '../supabaseClient';

const useAppStore = create((set, get) => ({
  // --- Estado da Sidebar ---
  isSidebarOpen: false,
  isSidebarPinned: false, // Novo estado para controlar se a sidebar está fixa
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebarPin: () => set(state => ({ isSidebarPinned: !state.isSidebarPinned })), // Nova ação

  // --- ESTADO E AÇÕES PARA ROTEIROS ---
  itineraries: [],
  isLoadingItineraries: true,
  
  fetchItineraries: async (forceRefetch = false) => {
    if (!forceRefetch && get().itineraries.length > 0 && !get().isLoadingItineraries) {
      return;
    }

    try {
      set({ isLoadingItineraries: true });
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('itineraries')
          .select('*') // Buscamos todos os dados para o ItineraryListItem
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

  addItinerary: (newItinerary) => {
    set(state => ({
      itineraries: [newItinerary, ...state.itineraries]
    }));
  },

  updateItinerary: (updatedItinerary) => {
    set(state => ({
      itineraries: state.itineraries.map(it => 
        it.id === updatedItinerary.id ? { ...it, ...updatedItinerary } : it
      )
    }));
  },

  removeItinerary: (itineraryId) => {
    set(state => ({
      itineraries: state.itineraries.filter(it => it.id !== itineraryId)
    }));
  },

  clearUserSession: () => {
    set({
      itineraries: [],
      isLoadingItineraries: true,
      // Resetamos também o estado da sidebar ao sair
      isSidebarOpen: false,
      isSidebarPinned: false,
    });
  },

  // --- AÇÃO DE LOGOUT CENTRALIZADA ---
  logoutUser: async (navigate) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      get().clearUserSession();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error.message);
      throw error;
    }
  },
}));

export default useAppStore;