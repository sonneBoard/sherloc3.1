// src/components/Mapa.jsx

import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '../supabaseClient';

// ... (O código de configuração dos ícones do Leaflet continua o mesmo)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});
// --------------------------------------------------------------------


// --- 1. O componente agora aceita a propriedade 'onAddRequest' ---
const Mapa = ({ onAddRequest }) => {
  const mapRef = useRef(null);
  const [locations, setLocations] = useState([]);

  // O seu useEffect para buscar os locais continua exatamente o mesmo
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data, error } = await supabase
           .from('locations')
          .select('*');
        
        if (error) throw error;
        if (data) setLocations(data);
      } catch (error) {
        console.error("Erro ao buscar os locais:", error);
      }
    };
    fetchLocations();
  }, []);

  // O seu useEffect para inicializar o mapa continua exatamente o mesmo
  useEffect(() => {
    if (!mapRef.current) {
      const position = [-20.7205, -47.8885]; 
      const map = L.map('map').setView(position, 15);
      mapRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setTimeout(() => {
        map.invalidateSize();
      }, 10);
    }
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // --- 2. O useEffect dos marcadores foi atualizado ---
  useEffect(() => {
    if (mapRef.current && locations.length > 0) {
      locations.forEach(location => {
        const marker = L.marker([location.latitude, location.longitude]).addTo(mapRef.current);
        
        // Removemos o 'onclick' do botão, pois ele será adicionado dinamicamente
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

        // --- 3. A "PONTE" entre Leaflet e React ---
        // Quando um pop-up é aberto...
        marker.on('popupopen', (e) => {
          // ...encontramos o botão dentro dele...
          const btn = e.popup.getElement().querySelector('.add-to-itinerary-btn');
          if (btn) {
            // ...e adicionamos um evento de clique que chama a função do React!
            btn.onclick = () => {
              onAddRequest(location);
            };
          }
        });
      });
    }
  }, [locations, onAddRequest]); // Adicionamos onAddRequest às dependências

  // O seu JSX continua o mesmo
  return (
    <>
      <style>{`...`}</style>
      <div id="map" style={{ height: '100%', width: '100%' }}></div>
    </>
  );
};

export default Mapa;