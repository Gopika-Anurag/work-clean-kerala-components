import React, { useState } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker, // Use Marker instead of AdvancedMarker
  InfoWindow,
} from "@react-google-maps/api";
import { clinics } from "../data/clinicsData"; 
import "../styles/location.css"

// --- CONFIGURATION ---
const API_KEY = "AIzaSyBdJzgDP91TnDtxfH8yE_kx4KiEh-H-utg"; // <-- Make sure this is correct

  const handleDirectionsClick = (lat, lng) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    window.open(url, "_blank");
  };

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const mapStyles = [
  {
    featureType: "all",
    elementType: "labels.text.fill",
    stylers: [{ color: "#4a6fa5" }],
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#b3d1ff" }],
  },
  {
    featureType: "road",
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "water",
    elementType: "geometry.fill",
    stylers: [{ color: "#4da6ff" }],
  },
  {
    featureType: "landscape",
    elementType: "geometry.fill",
    stylers: [{ color: "#e6f2ff" }],
  },
  {
    featureType: "poi",
    elementType: "geometry.fill",
    stylers: [{ color: "#d9ecff" }],
  },
];

function LocationComponent() {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [mapRef, setMapRef] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: API_KEY,
  });

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    clinics.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleFindMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newLoc = { lat: latitude, lng: longitude };
          setUserLocation(newLoc);

          if (mapRef) {
            mapRef.panTo(newLoc);
            mapRef.setZoom(14);
          }
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation not supported.");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      {/* 🔹 Find My Location Button */}
      <div style={{ margin: "10px 0", textAlign: "center" }}>
        <button
          onClick={handleFindMyLocation}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "10px 15px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          📍 Find My Location
        </button>
      </div>

      <div className="map-wrapper">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          onLoad={onMapLoad}
          options={{ styles: mapStyles }}
        >
          {/* Clinic Markers (Blue) */}
          {clinics.map((clinic) => (
            <Marker
              key={clinic.id}
              position={{ lat: clinic.lat, lng: clinic.lng }}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" 
                         viewBox="0 0 24 24" fill="#1216da" stroke="white" stroke-width="2">
                      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"/>
                      <circle cx="12" cy="9" r="2.5" fill="white"/>
                    </svg>
                  `),
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => setSelectedClinic(clinic)}
            />
          ))}

          {/* User Location Marker (Red) */}
          {userLocation && (
            <Marker
              position={userLocation}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" 
                         viewBox="0 0 24 24" fill="#FF3B30" stroke="white" stroke-width="2">
                      <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z"/>
                      <circle cx="12" cy="9" r="3" fill="white"/>
                    </svg>
                  `),
                scaledSize: new window.google.maps.Size(45, 45),
              }}
            />
          )}

          {/* Info Window for Clinics */}
          {selectedClinic && (
  <InfoWindow
    position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
    onCloseClick={() => setSelectedClinic(null)}
  >
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        padding: "12px 16px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        maxWidth: "220px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h4
        style={{
          margin: 0,
          color: "#1216da",
          fontSize: "16px",
          fontWeight: "600",
        }}
      >
        {selectedClinic.name}
      </h4>
      <p
        style={{
          margin: "6px 0",
          fontSize: "14px",
          color: "#555",
        }}
      >
        📍 {selectedClinic.address}
      </p>

      <button
        onClick={() =>
          handleDirectionsClick(selectedClinic.lat, selectedClinic.lng)
        }
        style={{
          marginTop: "8px",
          background: "linear-gradient(135deg, #4285F4, #2a68d8)",
          color: "white",
          border: "none",
          padding: "8px 12px",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) =>
          (e.target.style.background = "linear-gradient(135deg, #2a68d8, #1b4fb8)")
        }
        onMouseOut={(e) =>
          (e.target.style.background = "linear-gradient(135deg, #4285F4, #2a68d8)")
        }
      >
        🚀 View on Google Maps
      </button>
    </div>
  </InfoWindow>
)}

        </GoogleMap>

        {/* Fade edges left & right */}
        <div className="map-fade-edges"></div>
      </div>
    </div>
  );
}

export default LocationComponent;