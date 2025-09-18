import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker, // Use Marker instead of AdvancedMarker
  InfoWindow,
} from "@react-google-maps/api";
import { clinics } from "../data/clinicsData"; 

// --- CONFIGURATION ---
const API_KEY = "AIzaSyDILbdbHGrvl-UlEwT97ti2L95TUpBw-2g"; // <-- Make sure this is correct

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

// --- COMPONENT ---
function LocationComponent() {
  const [selectedClinic, setSelectedClinic] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
    // We do NOT need a mapId for the old Marker
  });

  const onMapLoad = (map) => {
    const bounds = new window.google.maps.LatLngBounds();
    clinics.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <GoogleMap
        // mapId is NOT needed or used here
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
      >
        {clinics.map((clinic) => (
          // Use the <Marker> component
          <Marker
            key={clinic.id}
            position={{ lat: clinic.lat, lng: clinic.lng }}
            onClick={() => {
              setSelectedClinic(clinic);
            }}
          />
        ))}

        {selectedClinic && (
          <InfoWindow
            position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
            onCloseClick={() => setSelectedClinic(null)}
          >
            <div style={{ color: 'black', maxWidth: '200px' }}>
              <h4 style={{ margin: 0 }}>{selectedClinic.name}</h4>
              <p style={{ margin: '5px 0' }}>{selectedClinic.address}</p>
              <button
                onClick={() => handleDirectionsClick(selectedClinic.lat, selectedClinic.lng)}
                style={{
                  backgroundColor: '#4285F4',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                View on Google Maps
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

export default LocationComponent;