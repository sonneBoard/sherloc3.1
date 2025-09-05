import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importações
import App from './App.jsx';
import MainLayout from './components/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx'; // Nova Landing Page
import LoginPage from './pages/LoginPage.jsx';     // Nova Página de Login
import Dashboard from './pages/Dashboard.jsx';
import MyItineraries from './pages/MyItineraries.jsx';
import ItineraryDetail from './pages/ItineraryDetail.jsx';
import Profile from './pages/Profile.jsx';
import LocationDetail from './pages/LocationDetail.jsx';

import './index.css';
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota principal agora é a Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Rota dedicada para o Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas protegidas que usam o Layout com Sidebar */}
        <Route element={<MainLayout />}>
          <Route path="/mapa" element={<App />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/roteiros" element={<MyItineraries />} />
          <Route path="/roteiro/:id" element={<ItineraryDetail />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/local/:id" element={<LocationDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);