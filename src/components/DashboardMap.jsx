// src/components/DashboardMap.jsx
import React from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DashboardMap = ({ locations }) => {
  // Define uma posição central e zoom iniciais
  const initialCenter = [20, 0]; // Centro do mundo
  const initialZoom = 2;

  return (
    <div className="h-64 w-full rounded-2xl overflow-hidden glass-card shadow-lg">
      <MapContainer 
        center={initialCenter} 
        zoom={initialZoom} 
        style={{ height: '100%', width: '100%', backgroundColor: '#1A1B26' }}
        scrollWheelZoom={false}
        zoomControl={false}
        dragging={false}
        doubleClickZoom={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        {locations.map((loc, index) => (
          <CircleMarker
            key={index}
            center={[loc.latitude, loc.longitude]}
            radius={4} // Tamanho do ponto
            pathOptions={{ 
              color: '#CCA43B', // Cor accent-gold
              fillColor: '#CCA43B',
              fillOpacity: 0.7 
            }}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default DashboardMap;