// src/components/MapContainer.jsx

import React from 'react';
// Importe o seu componente de mapa que você refatorou no Passo 1
import Mapa from './Mapa'; 

// Em src/components/MapContainer.jsx
const MapContainer = ({ onAddRequest }) => {
  return (
    <div className="flex-1 rounded-2xl overflow-hidden h-full shadow-lg">
      <Mapa onAddRequest={onAddRequest} />
    </div>
  );
};
export default MapContainer;