// src/components/Mapa.jsx

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient';

// --- 1. DEFINIÇÃO DOS NOSSOS ÍCONES PERSONALIZADOS (SVG) ---
const goldPinSvg = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#FBBF24"/>
  </svg>
`;

const coralPinSvg = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EF4444"/>
  </svg>
`;

// --- 2. CRIAÇÃO DOS ÍCONES LEAFLET ---
const goldIcon = L.divIcon({
  html: goldPinSvg,
  className: '', // Remove a classe padrão para não ter fundo branco
  iconSize: [32, 32],
  iconAnchor: [16, 32], // A ponta do pino
  popupAnchor: [0, -32] // Onde o popup deve aparecer em relação ao ícone
});

const coralIcon = L.divIcon({
  html: coralPinSvg,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});


const Mapa = ({ onAddRequest }) => {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);

  // Seus useEffects para buscar locais e iniciar o mapa continuam os mesmos
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;
        if (data) setLocations(data);
      } catch (error) {
        console.error("Erro ao buscar os locais:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    if (!mapRef.current) {
      const position = [-20.7205, -47.8885]; 
      const map = L.map('map').setView(position, 15);
      mapRef.current = map;
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      setTimeout(() => map.invalidateSize(), 10);
    }
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // --- 3. EFEITO ATUALIZADO PARA ADICIONAR MARCADORES PERSONALIZADOS ---
  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      locations.forEach(location => {
        // Usamos o nosso ícone dourado personalizado como padrão
        const marker = L.marker([location.latitude, location.longitude], { 
          icon: goldIcon 
        }).addTo(mapRef.current);
        
        const popupContent = `
          <div style="font-family: 'Lexend', sans-serif;">
            <h3 style="font-family: 'Poppins', sans-serif; font-weight: bold; font-size: 16px; margin-bottom: 5px;">${location.name}</h3>
            <p style="font-size: 12px; margin-bottom: 10px; color: #888;">${location.category}</p>
            <button class="add-to-itinerary-btn"> 
              Adicionar ao Roteiro
            </button>
          </div>
        `;
        
        marker.bindPopup(popupContent);

        // Adicionamos os eventos de HOVER
        marker.on('mouseover', function (e) {
          this.setIcon(coralIcon); // Muda para o ícone coral
        });
        marker.on('mouseout', function (e) {
          this.setIcon(goldIcon); // Volta para o ícone dourado
        });

        // A "ponte" entre Leaflet e React continua a mesma
        marker.on('popupopen', (e) => {
          const btn = e.popup.getElement().querySelector('.add-to-itinerary-btn');
          if (btn) {
            btn.onclick = () => {
              onAddRequest(location);
            };
          }
        });
      });
    }
  }, [locations, onAddRequest]);

  // Seu JSX com o hack de estilo para o botão do popup
  return (
    <>
      <style>
        {`
          .add-to-itinerary-btn {
            background-color: #FBBF24; /* Dourado */
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            font-family: 'Lexend', sans-serif;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
          }
          .add-to-itinerary-btn:hover {
            background-color: #EF4444; /* Coral */
          }
        `}
      </style>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </>
  );
};

export default Mapa;