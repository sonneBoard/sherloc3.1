// src/pages/MapPage.jsx
import React, { useState } from 'react';
import MapControlSidebar from '../components/MapControlSidebar';
import MapContainer from '../components/MapContainer';
import CreateItineraryModal from '../components/CreateItineraryModal';
import AddToItineraryModal from '../components/AddToItineraryModal'; // Importamos o novo modal

const MapPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLocationForCreate, setInitialLocationForCreate] = useState(null);

  const handleItineraryCreated = (newItinerary) => {
    // Futuramente, atualizar a lista da sidebar aqui
    console.log("Novo roteiro criado:", newItinerary);
  };

  const openCreateFromChoice = () => {
    setInitialLocationForCreate(selectedLocation); // Guarda o local para o modal de criação
    setSelectedLocation(null); // Fecha o modal de escolha
    setIsCreateModalOpen(true); // Abre o modal de criação
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-120px)]">
      {/* O botão "Criar Novo" na sidebar abre o modal de criação sem um local inicial */}
      <MapControlSidebar onNewItinerary={() => {
        setInitialLocationForCreate(null);
        setIsCreateModalOpen(true);
      }} />

      {/* O mapa agora define o 'selectedLocation' para abrir o modal de escolha */}
      <MapContainer onAddRequest={setSelectedLocation} /> 
      
      {isCreateModalOpen && (
        <CreateItineraryModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onItineraryCreated={handleItineraryCreated}
          initialLocation={initialLocationForCreate}
        />
      )}

      {selectedLocation && (
        <AddToItineraryModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
          onNewItinerary={openCreateFromChoice}
        />
      )}
    </div>
  );
};

export default MapPage;