// src/components/Mapa.jsx

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient';

// --- As suas definições de SVG e Ícones Personalizados foram mantidas ---
const goldPinSvg = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#CCA43B"/>
  </svg>
`;

const coralPinSvg = `
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="32">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#EF4444"/>
  </svg>
`;

const goldIcon = L.divIcon({ html: goldPinSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }); //
const coralIcon = L.divIcon({ html: coralPinSvg, className: '', iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -32] }); //


const Mapa = ({ onAddRequest }) => {
  const mapContainerRef = useRef(null); // Ref para o <div> do mapa
  const mapRef = useRef(null);          // Ref para a instância do mapa
  const [locations, setLocations] = useState([]); //

  // useEffect para buscar os locais foi mantido
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('*'); //
        if (error) throw error; //
        if (data) setLocations(data); //
      } catch (error) {
        console.error("Erro ao buscar os locais:", error); //
      }
    };
    fetchLocations();
  }, []); //

  // useEffect ÚNICO e ROBUSTO para gerir o mapa e os marcadores
  useEffect(() => {
    // Só inicializa o mapa se o <div> existir e o mapa ainda não tiver sido criado
    if (mapContainerRef.current && !mapRef.current) {
      const position = [-20.7205, -47.8885]; 
      // Passamos a ref do <div> diretamente para o L.map()
      const map = L.map(mapContainerRef.current).setView(position, 15);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // invalidateSize agora é chamado com segurança, pois o mapa já tem um container
      setTimeout(() => map.invalidateSize(), 10);
    }

    // Lógica para adicionar/atualizar marcadores (foi mantida)
    if (mapRef.current && locations.length > 0) {
      // Limpa marcadores antigos para evitar duplicação
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapRef.current.removeLayer(layer);
        }
      });

      locations.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude], { icon: goldIcon }).addTo(mapRef.current); //
        const popupContent = `
          <div style="font-family: 'Lexend', sans-serif;">
            <h3 style="font-family: 'Poppins', sans-serif; font-weight: bold; font-size: 16px; margin-bottom: 5px;">${location.name}</h3>
            <p style="font-size: 12px; margin-bottom: 10px; color: #888;">${location.category}</p>
            <button class="add-to-itinerary-btn"> 
              Adicionar ao Roteiro
            </button>
          </div>
        `; //
        
        marker.bindPopup(popupContent); //
        
        marker.on('mouseover', function () { this.setIcon(coralIcon); }); //
        marker.on('mouseout', function () { this.setIcon(goldIcon); }); //

        marker.on('popupopen', (e) => {
          const btn = e.popup.getElement().querySelector('.add-to-itinerary-btn'); //
          if (btn) {
            btn.onclick = () => onAddRequest(location); //
          }
        }); //
      });
    }
  }, [locations, onAddRequest]); // Depende das localizações para atualizar os marcadores

  return (
    <>
      <style>
        {`
          /* Seus estilos para o botão do popup e z-index foram mantidos */
          .add-to-itinerary-btn {
            background-color: #CCA43B;
            color: #0D0D12;
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
            filter: brightness(1.1);
          }
          .leaflet-marker-pane {
            z-index: 650 !important;
          }
          .leaflet-popup-pane {
            z-index: 700 !important;
          }
        `}
      </style>
      {/* Ligamos a ref ao nosso <div>, que agora não precisa mais de um id="map" */}
      <div ref={mapContainerRef} style={{ height: '100%', width: '100%' }}></div>
    </>
  );
};

export default Mapa;