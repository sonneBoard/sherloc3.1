import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Importação das Páginas e Layouts
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import MainLayout from './components/MainLayout';
import Dashboard from './pages/Dashboard';
import MapPage from './pages/MapPage';

// --- CORREÇÃO AQUI ---
// Mudamos de volta para os nomes originais dos seus componentes
import MyItineraries from './pages/MyItineraries'; 
import Profile from './pages/Profile';
// import ItineraryDetail from './pages/ItineraryDetail';
// import LocationDetail from './pages/LocationDetail';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas Privadas (dentro do nosso layout principal) */}
        <Route element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/mapa" element={<MapPage />} />
          
          {/* --- CORREÇÃO AQUI --- */}
          {/* Usamos os componentes com os nomes corretos */}
          <Route path="/roteiros" element={<MyItineraries />} />
          <Route path="/perfil" element={<Profile />} />
          
          {/* Rotas de detalhe que você pode ter */}
          {/* <Route path="/roteiro/:id" element={<ItineraryDetail />} /> */}
          {/* <Route path="/local/:id" element={<LocationDetail />} /> */}
        </Route>
        
        {/* Rota de fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);