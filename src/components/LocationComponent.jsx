import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { clinics } from "../data/clinicsData";
import "../styles/location.css";

const API_KEY = "AIzaSyAp1RD8e5YsoGU4E3InF90E2PoSbS_jIK8";

const mapContainerStyle = {
  width: "100%",
  height: "700px",
};

const mapStyles = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#4a6fa5" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#b3d1ff" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#4da6ff" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#e6f2ff" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#d9ecff" }] },
];

const handleDirectionsClick = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
};

function LocationComponent() {
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userAccuracy, setUserAccuracy] = useState(null);
  const [showUserInfo, setShowUserInfo] = useState(false);

  const [mapRef, setMapRef] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const dropdownRef = useRef(null);

  // PC draggable
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const defaultSearchPos = { x: 20, y: window.innerHeight / 2 };
  const [searchPosition, setSearchPosition] = useState(defaultSearchPos);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  // Detect window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const keyboardDetected = viewportHeight < window.innerHeight * 0.75;
        setKeyboardOpen(keyboardDetected);
      } else {
        setKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    if (window.visualViewport) window.visualViewport.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport) window.visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  // Drag handlers
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    dragOffset.current = {
      x: clientX - searchPosition.x,
      y: clientY - searchPosition.y,
    };
  };

  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    setSearchPosition({
      x: clientX - dragOffset.current.x,
      y: clientY - dragOffset.current.y,
    });
  };

  const handleMouseDown = (e) => startDrag(e.clientX, e.clientY);
  const handleTouchStart = (e) => startDrag(e.touches[0].clientX, e.touches[0].clientY);
  const handleMouseMove = (e) => handleMove(e.clientX, e.clientY);
  const handleTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const endDrag = () => setIsDragging(false);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", endDrag);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", endDrag);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", endDrag);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", endDrag);
    };
  }, [isDragging]);

  const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: API_KEY });

  const onMapLoad = (map) => {
    setMapRef(map);
    const bounds = new window.google.maps.LatLngBounds();
    clinics.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  };

  const handleFindMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const newLoc = { lat: latitude, lng: longitude };
        setUserLocation(newLoc);
        setUserAccuracy(accuracy);
        setShowUserInfo(true);
        mapRef?.panTo(newLoc);
        mapRef?.setZoom(14);
      },
      () => {
        const fallbackLoc = { lat: 10.8505, lng: 76.2711 };
        setUserLocation(fallbackLoc);
        setShowUserInfo(true);
        mapRef?.panTo(fallbackLoc);
        mapRef?.setZoom(10);
        alert("Unable to get your location, showing default Kerala.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setSearchQuery(clinic.name);
    setIsDropdownVisible(false);
    mapRef?.panTo({ lat: clinic.lat, lng: clinic.lng });
    mapRef?.setZoom(14);
  };

  const filteredClinics = clinics.filter(
    (clinic) =>
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (dropdownRef.current)
      setIsScrollable(dropdownRef.current.scrollHeight > dropdownRef.current.clientHeight);
  }, [filteredClinics, isDropdownVisible]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-wrapper" style={{ position: "relative", width: "100%", height: "700px" }}>
      <GoogleMap mapContainerStyle={{ width: "100%", height: "100%" }} onLoad={onMapLoad} options={{ styles: mapStyles }}>
        {/* User Location */}
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
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40),
            }}
            onClick={() => setShowUserInfo(true)}
          />
        )}

        {userLocation && showUserInfo && (
          <InfoWindow position={userLocation} onCloseClick={() => setShowUserInfo(false)} options={{ pixelOffset: new window.google.maps.Size(0, -40) }}>
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

        {/* Clinic markers */}
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
              scaledSize: new window.google.maps.Size(40, 40),
            }}
            onClick={() => setSelectedClinic(clinic)}
          />
        ))}

        {selectedClinic && (
          <InfoWindow
            position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
            onCloseClick={() => setSelectedClinic(null)}
            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
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
                onClick={() => handleDirectionsClick(selectedClinic.lat, selectedClinic.lng)}
              >
                🚀 View on Google Maps
              </button>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Search box inside map */}
      <div
        className="draggable-search"
        style={
          isMobile
            ? {
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                width: "90%",
                zIndex: 100,
                bottom: keyboardOpen ? "auto" : "20px",
                top: keyboardOpen ? "60px" : "auto",
              }
            : {
                position: "absolute",
                top: "50%",
                left: "20px",
                transform: "translateY(-50%)",
                width: "300px",
                zIndex: 100,
                cursor: isDragging ? "grabbing" : "grab",
                userSelect: "none",
                touchAction: "none",
              }
        }
        onMouseDown={isMobile ? null : handleMouseDown}
        onTouchStart={isMobile ? null : handleTouchStart}
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
          style={{ width: "100%" }}
        />
        <button onClick={handleFindMyLocation} style={{ width: "100%", marginTop: "5px" }}>
          📍 Find My Location
        </button>

        {/* Dropdown */}
        {isDropdownVisible && searchQuery && filteredClinics.length > 0 && (
          <div
            className="clinic-dropdown"
            ref={dropdownRef}
            style={{
              overflowY: "auto",
              maxHeight: "400px",
              width: "100%",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              ...(isScrollable && {
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)",
              }),
            }}
          >
            {filteredClinics.map((clinic) => (
              <div key={clinic.id} className="clinic-item" onClick={() => handleClinicSelect(clinic)}>
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
  );
}

export default LocationComponent;
