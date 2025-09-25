# LocationComponent Documentation

## Overview
`LocationComponent` is a React component built with the **Google Maps JavaScript API** (`@react-google-maps/api`).  
It displays:
- A styled Google Map  
- Clinic markers from `clinicsData`  
- User location detection with accuracy  
- Search box with filtering  
- Draggable search panel (desktop) & adaptive mobile layout  
- “View on Google Maps” directions

---

## Installed Packages
- `react`
- `react-dom`
- `@react-google-maps/api`

---

## Props
*(Currently none — component manages its own state and data via imports)*

---

## State Variables
- `selectedClinic` → Currently selected clinic  
- `userLocation` → User’s geolocation `{lat, lng}`  
- `userAccuracy` → Accuracy of location detection  
- `showUserInfo` → Toggle for user info window  
- `mapRef` → Google Maps instance reference  
- `searchQuery` → Search input string  
- `isDropdownVisible` → Shows/hides search results dropdown  
- `isScrollable` → Detects if dropdown scroll is needed  
- `isDragging` → Enables dragging of search panel (desktop)  
- `searchPosition` → Position of draggable search box  
- `isMobile` → True if screen width ≤ 768px  
- `keyboardOpen` → True if on-screen keyboard detected  

---

## Key Functions
- `handleDirectionsClick(lat, lng)` → Opens Google Maps with directions  
- `onMapLoad(map)` → Initializes map and fits all clinic bounds  
- `handleFindMyLocation()` → Centers map on user’s location  
- `handleClinicSelect(clinic)` → Focuses on a selected clinic  
- Drag handlers (`startDrag`, `handleMove`, `endDrag`) → Enable draggable search box  

---

## Rendering
- **Google Map** with:
  - Custom theme
  - User marker (red pin)
  - Clinic markers (blue pins)
  - Info windows for details
- **Search box**:
  - Mobile → fixed at bottom / moves for keyboard
  - Desktop → draggable box on left
- **Dropdown**:
  - Filtered clinics
  - Scrollable with fade mask

---

## Features
✅ Styled Google Map  
✅ Clinic search & pan-to selection  
✅ User location detection with accuracy/fallback  
✅ Directions link to Google Maps  
✅ Responsive layout (desktop/mobile)  
✅ Draggable search panel  
✅ Dropdown with scroll mask  
