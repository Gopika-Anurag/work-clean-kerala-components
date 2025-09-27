import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { clinics } from "../data/clinicsRatingData";
import "../styles/location.css";

const API_KEY = "AIzaSyAp1RD8e5YsoGU4E3InF90E2PoSbS_jIK8";

// Map style
const mapStyles = [
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#4a6fa5" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#b3d1ff" }] },
  { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#4da6ff" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#e6f2ff" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#d9ecff" }] },
];

// Renders stars with golden fill
const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "14px" }}>★</span>); // full star
    } else if (rating >= i - 0.5) {
      stars.push(<span key={i} style={{ color: "#FFD700", fontSize: "14px" }}>☆</span>); // half star (optional)
    } else {
      stars.push(<span key={i} style={{ color: "#ccc", fontSize: "14px" }}>★</span>); // empty star
    }
  }
  return <span>{stars}</span>;
};

// Haversine formula to calculate distance (km)
const getDistance = (lat1, lng1, lat2, lng2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const handleDirectionsClick = (lat, lng) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, "_blank");
};

function ClinicsRating() {
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
  const [showPermissionPopup, setShowPermissionPopup] = useState(true);

  const defaultCenter = { lat: 9.9312, lng: 76.2673 }; // Kochi
  const ITEM_HEIGHT = 60; // height of one clinic item

useEffect(() => {
  if (mapRef && userLocation) {
    mapRef.panTo(userLocation);
    mapRef.setZoom(14); // or keep previous zoom if you prefer
  }
}, [userLocation, mapRef]);

  // Detect window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile && window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        setKeyboardOpen(viewportHeight < window.innerHeight * 0.75);
      } else {
        setKeyboardOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    if (window.visualViewport)
      window.visualViewport.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("resize", handleResize);
      if (window.visualViewport)
        window.visualViewport.removeEventListener("resize", handleResize);
    };
  }, []);

  // Drag handlers
  const startDrag = (clientX, clientY) => {
    setIsDragging(true);
    dragOffset.current = { x: clientX - searchPosition.x, y: clientY - searchPosition.y };
  };
  const handleMove = (clientX, clientY) => {
    if (!isDragging) return;
    setSearchPosition({ x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y });
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
  if (!userLocation) {
    const bounds = new window.google.maps.LatLngBounds();
    clinics.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
    map.fitBounds(bounds);
  }
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
      (err) => {
        setUserLocation(null);
        setShowUserInfo(false);
        mapRef?.panTo(defaultCenter);
        mapRef?.setZoom(12);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    const permissionGranted = localStorage.getItem("locationPermissionGranted");
    if (permissionGranted === "true") {
      setShowPermissionPopup(false);
      handleFindMyLocation();
    } else if (permissionGranted === "false") {
      setShowPermissionPopup(false);
    } else {
      setShowPermissionPopup(true);
    }
  }, []);

  const handleClinicSelect = (clinic) => {
    setSelectedClinic(clinic);
    setSearchQuery(clinic.name);
    setIsDropdownVisible(false);
    mapRef?.panTo({ lat: clinic.lat, lng: clinic.lng });
    mapRef?.setZoom(14);
  };

  // Filtered clinics: top-rated within 20km + ad clinics on top
  const filteredClinics = (() => {
  let list = [];

  if (userLocation) {
    list = clinics
      .map((clinic) => ({
        ...clinic,
        distance: getDistance(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng),
      }))
      .filter((clinic) => clinic.distance <= 20)
      .sort((a, b) => b.rating - a.rating);

    // ✅ fallback: if no clinic found within 20km, show all sorted by rating
    if (list.length === 0) {
      list = clinics.sort((a, b) => b.rating - a.rating);
    }
  } else {
    list = clinics.filter(
      (clinic) =>
        clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        clinic.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const adClinics = list.filter((clinic) => clinic.isAd);
  const normalClinics = list.filter((clinic) => !clinic.isAd);

  return [...adClinics, ...normalClinics];
})();


  useEffect(() => {
    if (dropdownRef.current)
      setIsScrollable(dropdownRef.current.scrollHeight > dropdownRef.current.clientHeight);
  }, [filteredClinics, isDropdownVisible]);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className="map-wrapper" style={{ position: "relative", width: "100%", height: "100vh",}}>
      <div className="map-mask-wrapper">
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onMapLoad}
          center={userLocation || defaultCenter}
          zoom={12}
          options={{
            styles: mapStyles,
            disableDefaultUI: true,
          }}
        >
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
                <p style={{ margin: "0 0 5px 0" }}>📍 {selectedClinic.address}</p>
                <div>
  {renderStars(selectedClinic.rating)}
  <small style={{ marginLeft: "4px", fontSize: "12px", color: "#555" }}>
    {selectedClinic.rating.toFixed(1)}
  </small>
</div>

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
      </div>

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
          style={{ width: "100%", padding: "8px", borderRadius: "6px" }}
        />

        {/* Dropdown */}
        {((isDropdownVisible && filteredClinics.length > 0) || userLocation) && (
          <div
  className="clinic-dropdown"
  ref={dropdownRef}
  style={{
    overflowY: "auto",
    width: "100%",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginTop: "5px",
    maxHeight: isMobile ? `${ITEM_HEIGHT * 5.5}px` : "400px", // 5.5 items on mobile
  }}
>

            {filteredClinics.map((clinic) => (
              <div
                key={clinic.id}
                className="clinic-item"
                onClick={() => handleClinicSelect(clinic)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  backgroundColor: clinic.isAd ? "#fff4e5" : "#fff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <strong>{clinic.name}</strong>
                    {!isMobile && <p style={{ margin: 0, fontSize: "12px" }}>{clinic.address}</p>}
                  </div>
<div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
  <div>{renderStars(clinic.rating)}</div>
  <small style={{ fontSize: "12px", color: "#555" }}>{clinic.rating.toFixed(1)}</small>
</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Button */}
        <button
          onClick={() => {
            const permission = localStorage.getItem("locationPermissionGranted");
            if (permission === "false") {
              setShowPermissionPopup(true);
            } else {
              handleFindMyLocation();
            }
          }}
          style={{ width: "100%", marginTop: "5px", padding: "8px", borderRadius: "6px", cursor: "pointer" }}
        >
          📍 Find My Location
        </button>
      </div>

      {/* Permission popup */}
      {showPermissionPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              maxWidth: "300px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3>📍 Location Permission</h3>
            <p>We’d like to access your location to show the nearest clinics.</p>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "center" }}>
              <button
                onClick={() => {
                  localStorage.setItem("locationPermissionGranted", "true");
                  setShowPermissionPopup(false);
                  handleFindMyLocation();
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#1216da",
                  color: "#fff",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Allow
              </button>
              <button
                onClick={() => {
                  localStorage.setItem("locationPermissionGranted", "false");
                  setShowPermissionPopup(false);
                }}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClinicsRating;
