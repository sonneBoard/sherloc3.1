import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Importa o plugin do vite

// https://vitejs.dev/config/
export default defineConfig({
  // Adiciona o tailwindcss() à lista de plugins
  plugins: [react(), tailwindcss()],
})