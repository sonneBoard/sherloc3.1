// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Importações
import App from './App'; // O "porteiro" da rota principal
import ProtectedRoute from './components/ProtectedRoute'; // O "guarda" das rotas protegidas
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';
import MyItineraries from './pages/MyItineraries';
import Profile from './pages/Profile';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota 1: O "Porteiro" para a raiz do site */}
        <Route path="/" element={<App />} />
        
        {/* Rota 2: A página de Login (pública) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota 3: O "Guarda" para todas as rotas protegidas */}
        <Route element={<ProtectedRoute />}>
          {/* Todas as rotas aqui dentro são protegidas. */}
          {/* Elas compartilham o mesmo layout principal. */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/roteiros" element={<MyItineraries />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
        </Route>
        
        {/* Rota de fallback para qualquer caminho não encontrado */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);