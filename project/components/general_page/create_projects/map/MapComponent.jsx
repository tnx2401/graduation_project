import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const LocationPicker = ({ onLocationSelect, onPin }) => {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng); // When clicked, update the position
      onPin();
    },
  });
  return null;
};

const RecenterMap = ({ position }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position); // Re-center map
  }, [position]);
  return null;
};

const MapComponent = ({
  position,
  setPosition,
  setHasPinned,
  setPinnedPosition,
}) => {
  
  const [markerPosition, setMarkerPosition] = useState(position);

  useEffect(() => {
    setMarkerPosition(position); // Update marker position whenever `position` changes
  }, [position]);

  useEffect(() => {
    setPinnedPosition(markerPosition);
  }, [markerPosition]);

  return (
    <MapContainer
      center={position} // Map will center around the marker position
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={markerPosition} icon={customIcon}>
        <Popup>Địa điểm dự án</Popup>
      </Marker>
      <LocationPicker
        onLocationSelect={(latlng) => {
          setMarkerPosition([latlng.lat, latlng.lng]); // Update marker position
          setPosition([latlng.lat, latlng.lng]); // Update the parent component's state
        }}
        onPin={() => setHasPinned(true)}
      />
      <RecenterMap position={position} />
    </MapContainer>
  );
};

export default MapComponent;
