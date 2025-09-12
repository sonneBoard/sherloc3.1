// src/pages/MapPage.jsx
import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore'; // 1. Importamos o novo appStore
import MapControlSidebar from '../components/MapControlSidebar';
import MapContainer from '../components/MapContainer';
import CreateItineraryModal from '../components/CreateItineraryModal';
import AddToItineraryModal from '../components/AddToItineraryModal';

const MapPage = () => {
  // A lógica para os modais continua a ser local desta página
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLocationForCreate, setInitialLocationForCreate] = useState(null);

  // 2. Buscamos o estado e as ações dos roteiros do nosso store central
  const { 
    itineraries, 
    isLoadingItineraries, 
    fetchItineraries,
    addItinerary 
  } = useAppStore();

  // 3. O useEffect agora apenas chama a ação de busca do store
  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  // 4. A função de callback agora chama a ação 'addItinerary' do store
  const handleItineraryCreated = (newItinerary) => {
    addItinerary(newItinerary);
  };

  const openCreateFromChoice = () => {
    setInitialLocationForCreate(selectedLocation);
    setSelectedLocation(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="flex gap-8 h-[calc(100vh-120px)]">
      {/* 5. Passamos os dados do store diretamente para a sidebar */}
      <MapControlSidebar 
        onNewItinerary={() => {
          setInitialLocationForCreate(null);
          setIsCreateModalOpen(true);
        }}
        itineraries={itineraries}
        isLoading={isLoadingItineraries}
      />
      
      <MapContainer onAddRequest={setSelectedLocation} /> 
      
      <CreateItineraryModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onItineraryCreated={handleItineraryCreated}
        initialLocation={initialLocationForCreate}
      />
      
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