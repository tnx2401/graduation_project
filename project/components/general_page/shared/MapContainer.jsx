import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41], // width, height
  iconAnchor: [12, 41], // center bottom
  popupAnchor: [1, -34],
});

export default function MapComponent({ center, zoom = 16 }) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
      scrollWheelZoom={true}
      zoomControl={true}
    >
      {/* Tile Layer (Base Map) */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Marker */}
      <Marker position={center} icon={customIcon}>
        <Popup>Khu vực bất động sản</Popup>
      </Marker>
    </MapContainer>
  );
}
