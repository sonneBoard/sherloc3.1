import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.jsx'
import LocationDetail from './pages/LocationDetail.jsx'; // Importamos nossa nova página
import MyItineraries from './pages/MyItineraries.jsx';
import ItineraryDetail from './pages/ItineraryDetail.jsx';
import './index.css'
import 'leaflet/dist/leaflet.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* O BrowserRouter é o componente que ativa o roteamento */}
    <BrowserRouter>
      {/* O Routes agrupa todas as nossas rotas */}
      <Routes>
        {/* Rota 1: A raiz do site ("/") renderiza nosso App principal (o mapa) */}
        <Route path="/" element={<App />} />
        
        {/* Rota 2: Uma URL como "/local/123" renderiza a página de detalhes */}
        {/* O ":id" é um parâmetro dinâmico, ou seja, pode ser qualquer coisa */}
        <Route path="/local/:id" element={<LocationDetail />} />
        {/* 2. Verifique se esta linha da rota existe e está escrita corretamente: */}
        <Route path="/roteiros" element={<MyItineraries />} />
        {/* VERIFIQUE SE ESTA LINHA DE ROTA EXISTE E ESTÁ ESCRITA CORRETAMENTE: */}
        <Route path="/roteiro/:id" element={<ItineraryDetail />} /> 
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)