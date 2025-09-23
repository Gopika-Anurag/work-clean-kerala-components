import React, { useState, useRef, useEffect } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { clinics } from "../data/clinicsData";
import "../styles/location.css";

const API_KEY = "AIzaSyAp1RD8e5YsoGU4E3InF90E2PoSbS_jIK8";

const handleDirectionsClick = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
};

const mapContainerStyle = {
  width: "100%",
  height: "700px",
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
    const [userAccuracy, setUserAccuracy] = useState(null);   // ✅ NEW
  const [showUserInfo, setShowUserInfo] = useState(false);  // ✅ NEW

  const [mapRef, setMapRef] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const dropdownRef = useRef(null);
  const [userSelectedColor, setUserSelectedColor] = useState("#1b156dff"); // default white
 const [searchPosition, setSearchPosition] = useState({ x: 20, y: 20 });
const [isDragging, setIsDragging] = useState(false);
const dragOffset = useRef({ x: 0, y: 0 });


// --- PC mouse drag ---
const startDrag = (clientX, clientY) => {
  setIsDragging(true);
  dragOffset.current = {
    x: clientX - searchPosition.x,
    y: clientY - searchPosition.y,
  };
};

const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
const handleTouchStart = (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY);

const handleMove = (clientX, clientY) => {
  if (!isDragging) return;
  setSearchPosition({
    x: clientX - dragOffset.current.x,
    y: clientY - dragOffset.current.y,
  });
};

const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
const handleTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);

const endDrag = () => setIsDragging(false);

useEffect(() => {
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchmove", handleTouchMove);
  window.addEventListener("touchend", endDrag);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", endDrag);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchend", endDrag);
  };
}, [isDragging]);




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
        const { latitude, longitude, accuracy } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLocation(newLoc);
        setUserAccuracy(accuracy);
        setShowUserInfo(true);

        if (mapRef) {
          mapRef.panTo(newLoc);
          mapRef.setZoom(14);
        }
      },
      (err) => {
        console.error("Geolocation error:", err.message);

        // fallback location (Kerala example)
        const fallbackLoc = { lat: 10.8505, lng: 76.2711 };
        setUserLocation(fallbackLoc);
        setUserAccuracy(null);
        setShowUserInfo(true);

        if (mapRef) {
          mapRef.panTo(fallbackLoc);
          mapRef.setZoom(10);
        }

        alert("Unable to get your location, showing default Kerala location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  } else {
    alert("Geolocation not supported in this browser.");
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
 useEffect(() => {
    console.log("User Location:", userLocation, "Accuracy:", userAccuracy);
  }, [userLocation]);
  
  // 🔍 Detect if dropdown is scrollable
  useEffect(() => {
    if (dropdownRef.current) {
      setIsScrollable(
        dropdownRef.current.scrollHeight > dropdownRef.current.clientHeight
      );
    }
  }, [filteredClinics, isDropdownVisible]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
<div className="map-wrapper" style={{ backgroundColor: 'lightblue' }}>
      <div className="map-controls">
      <div
  className="draggable-search"
  style={{
    position: "absolute",
    top: searchPosition.y,
    left: searchPosition.x,
    zIndex: 10,
    cursor: isDragging ? "grabbing" : "grab",
    userSelect: "none",
    touchAction: "none", // important for mobile to stop map panning
  }}
  onMouseDown={(e) => {
    handleMouseDown(e);
    e.stopPropagation();
  }}
  onTouchStart={(e) => {
    handleTouchStart(e);
    e.stopPropagation();
  }}
  onTouchMove={(e) => {
    handleTouchMove(e);
    e.stopPropagation();
  }}
  onTouchEnd={(e) => {
    endDrag();
    e.stopPropagation();
  }}
>

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
  <button onClick={handleFindMyLocation}>📍 Find My Location</button>

  {isDropdownVisible && searchQuery && filteredClinics.length > 0 && (
    <div
      className="clinic-dropdown"
      ref={dropdownRef}
      style={{
        overflowY: "auto",
        maxHeight: "300px",
        ...(isScrollable && {
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
        }),
      }}
    >
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
</div>

<div
  className="map-mask-wrapper"
  style={{ backgroundColor: 'transparent' }} // background layer

>
  <GoogleMap
    mapContainerStyle={mapContainerStyle}
    onLoad={onMapLoad}
    options={{ styles: mapStyles }}
  >

    {/* User Location Marker */}
  {/* User Location Marker (Red) */}
{/* User Location Marker (Red) */}
{userLocation && (
  <Marker
    position={userLocation}
    icon={{
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z" fill="#ff3333"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
      scaledSize: new window.google.maps.Size(40, 40),   // ✅ forces correct size
      anchor: new window.google.maps.Point(20, 40),      // ✅ ensures bottom tip aligns
    }}
    onClick={() => setShowUserInfo(true)}
  />
)}


{/* InfoWindow for User Location */}
{userLocation && showUserInfo && (
  <InfoWindow
    position={userLocation}
    onCloseClick={() => setShowUserInfo(false)}
    options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
  >
    <div style={{ minWidth: "160px" }}>
      <strong>You are here</strong>
      <p style={{ fontSize: "12px", margin: 0 }}>
        Lat: {userLocation.lat.toFixed(5)} <br />
        Lng: {userLocation.lng.toFixed(5)} <br />
        {userAccuracy && <>Accuracy: ±{Math.round(userAccuracy)} m</>}
      </p>
    </div>
  </InfoWindow>
)}

    {/* Filtered Clinic Markers (Blue) */}
    {/* All filtered clinic markers */}
{filteredClinics.map((clinic) => (
  <Marker
    key={clinic.id}
    position={{ lat: clinic.lat, lng: clinic.lng }}
    icon={{
      url:
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(`
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
            <path d="M12 2C8.14 2 5 5.14 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.86-3.14-7-7-7z" fill="#1216da"/>
            <circle cx="12" cy="9" r="2.5" fill="white"/>
          </svg>
        `),
      scaledSize: new window.google.maps.Size(40, 40), // make sure size matches your SVG
    }}
    onClick={() => setSelectedClinic(clinic)}
  />
))}

{/* InfoWindow for selected clinic */}
{selectedClinic && (
  <InfoWindow
    position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
    onCloseClick={() => setSelectedClinic(null)}
    options={{
      pixelOffset: new window.google.maps.Size(0, -40), // popup above marker
    }}
  >
    <div className="info-window-content" style={{ minWidth: "180px" }}>
      <h4 style={{ margin: "0 0 5px 0" }}>{selectedClinic.name}</h4>
      <p style={{ margin: "0 0 10px 0" }}>📍 {selectedClinic.address}</p>
      <button
        style={{
          padding: "8px 12px",
          backgroundColor: "#1216da",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() =>
          handleDirectionsClick(selectedClinic.lat, selectedClinic.lng)
        }
      >
        🚀 View on Google Maps
      </button>
    </div>
  </InfoWindow>
)}

  </GoogleMap>
  
</div>


    </div>
  );
}

export default LocationComponent;