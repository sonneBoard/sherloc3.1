import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importações de Componentes e Páginas
import App from './App.jsx';
import MainLayout from './components/MainLayout.jsx';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import MyItineraries from './pages/MyItineraries.jsx';
import ItineraryDetail from './pages/ItineraryDetail.jsx';
import Profile from './pages/Profile.jsx';
import LocationDetail from './pages/LocationDetail.jsx';

// --- VERIFIQUE SE ESTAS DUAS LINHAS DE CSS ESTÃO AQUI ---
import './index.css';
import 'leaflet/dist/leaflet.css';
// ---------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
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