import React, { useState , useRef } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { clinics } from "../data/clinicsData";
import "../styles/location.css";

// --- CONFIGURATION ---
const API_KEY = "AIzaSyAp1RD8e5YsoGU4E3InF90E2PoSbS_jIK8"; // <-- Make sure this is correct

const handleDirectionsClick = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
};

const mapContainerStyle = {
  width: "100%",
  height: "900px",
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
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setSearchQuery(clinic.name);
    setIsDropdownVisible(false);
    if (mapRef) {
      mapRef.panTo({ lat: clinic.lat, lng: clinic.lng });
      mapRef.setZoom(14);
    }
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-wrapper">
      <div className="map-controls">
        <input
          type="text"
          placeholder="Search for a clinic..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsDropdownVisible(true);
          }}
          onFocus={() => setIsDropdownVisible(true)}
        />
        <button onClick={handleFindMyLocation}>
          📍 Find My Location
        </button>

        {/* Search Results Dropdown */}
        {isDropdownVisible && searchQuery && filteredClinics.length > 0 && (
  <div className="clinic-dropdown" ref={dropdownRef}>
    {filteredClinics.map((clinic) => (
      <div
        key={clinic.id}
        className="clinic-item"
        onClick={() => handleClinicSelect(clinic)}
      >
        <span>📍</span>
        <div>
            <strong>{clinic.name}</strong>
            <p>{clinic.address}</p>
        </div>
      </div>
    ))}
  </div>
)}
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        onLoad={onMapLoad}
        options={{ styles: mapStyles }}
      >
        {/* Filtered Clinic Markers (Blue) */}
          {filteredClinics.map((clinic) => (
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
        {/* User Location Marker */}
        {userLocation && <Marker position={userLocation} />}

        {/* Info Window */}
        {selectedClinic && (
          <InfoWindow
            position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
            onCloseClick={() => setSelectedClinic(null)}
          >
            <div className="info-window-content">
              <h4>{selectedClinic.name}</h4>
              <p>📍 {selectedClinic.address}</p>
              <button onClick={() => handleDirectionsClick(selectedClinic.lat, selectedClinic.lng)}>
                🚀 View on Google Maps
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      <div className="map-fade-edges"></div>
    </div>
  );
}

export default LocationComponent;