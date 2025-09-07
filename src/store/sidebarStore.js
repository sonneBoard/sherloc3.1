import { create } from 'zustand';

const useSidebarStore = create((set) => ({
  isOpen: false, // Vamos começar com ela fechada por padrão
  openSidebar: () => set({ isOpen: true }),
  closeSidebar: () => set({ isOpen: false }),
}));

export default useSidebarStore;