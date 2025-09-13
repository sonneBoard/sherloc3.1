// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import ExplorePage from './pages/ExplorePage'; // 1. Importe a nova página
import SmoothScroll from './components/SmoothScroll'; 

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
    <SmoothScroll>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas que usam o Layout Principal */}
        <Route element={<MainLayout />}>
          {/* 2. ADICIONE A ROTA "EXPLORAR" AQUI */}
          <Route path="/explorar" element={<ExplorePage />} />

          {/* Rotas Protegidas (precisam de login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/mapa" element={<MapPage />} />
            <Route path="/roteiros" element={<MyItineraries />} />
            <Route path="/perfil" element={<Profile />} />
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </SmoothScroll> 
  </React.StrictMode>,
);

