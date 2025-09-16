import React, { useState, useEffect } from 'react';
import useAppStore from '../store/appStore';
import MapControlSidebar from '../components/MapControlSidebar';
import MapContainer from '../components/MapContainer'; // Importante: o MapContainer está de volta
import CreateItineraryModal from '../components/CreateItineraryModal';
import AddToItineraryModal from '../components/AddToItineraryModal';

const MapPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [initialLocationForCreate, setInitialLocationForCreate] = useState(null);

  const { 
    itineraries, 
    isLoadingItineraries, 
    fetchItineraries,
    addItinerary 
  } = useAppStore();

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const handleItineraryCreated = (newItinerary) => {
    addItinerary(newItinerary);
  };

  const openCreateFromChoice = () => {
    setInitialLocationForCreate(selectedLocation);
    setSelectedLocation(null);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="h-[calc(100vh-150px)] flex gap-8">
      <MapControlSidebar 
        onNewItinerary={() => {
          setInitialLocationForCreate(null);
          setIsCreateModalOpen(true);
        }}
        itineraries={itineraries}
        isLoading={isLoadingItineraries}
      />
      
      {/* O div foi substituído pelo componente MapContainer, que renderiza o mapa */}
      <MapContainer setSelectedLocation={setSelectedLocation} />
      
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