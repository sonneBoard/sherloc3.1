import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' // 1. Importamos a ferramenta 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // 2. Adicionamos esta seção 'resolve' para ensinar o atalho ao Vite
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})