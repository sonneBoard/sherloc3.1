import React, { useState, useEffect } from 'react'; // <-- LINHA CORRIGIDA
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Map.css';

const MapComponent = ({ currentFilter }) => {
  const position = [-20.72, -47.88];
  const [locations, setLocations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getLocations = async () => {
      try {
        let query = supabase.from('locations').select('*');

        if (currentFilter !== 'all') {
          query = query.eq('category', currentFilter);
        }

        const { data, error } = await query;

        if (error) {
          throw error;
        }
        if (data) {
          setLocations(data);
        }
      } catch (error) {
        console.error("Erro detalhado ao buscar locais:", error);
      }
    };

    getLocations();
  }, [currentFilter]);

  const handleNavigateToDetail = (locationId) => {
    navigate(`/local/${locationId}`);
  };

  return (
    <MapContainer center={position} zoom={15}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {locations.map(location => (
        <Marker 
          key={location.id} 
          position={[location.latitude, location.longitude]}
        >
          <Popup>
            <strong>{location.name}</strong><br />
            {location.category}
            <br />
            <button onClick={() => handleNavigateToDetail(location.id)}>
              Ver detalhes
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;