import React, { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  LuCross,
  LuSchool,
  LuShoppingCart,
  LuTrees,
  LuUtensils,
} from "react-icons/lu";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const iconMap = {
  school: new L.Icon({
    iconUrl: "/icons/school.png",
    iconSize: [20, 30],
    iconAnchor: [12, 20],
  }),
  park: new L.Icon({
    iconUrl: "/icons/park.png",
    iconSize: [20, 30],
    iconAnchor: [12, 20],
  }),
  hospital: new L.Icon({
    iconUrl: "/icons/hospital.png",
    iconSize: [20, 30],
    iconAnchor: [12, 20],
  }),
  restaurant: new L.Icon({
    iconUrl: "/icons/cutlery.png",
    iconSize: [20, 30],
    iconAnchor: [12, 20],
  }),
  supermarket: new L.Icon({
    iconUrl: "/icons/shopping-cart.png",
    iconSize: [20, 30],
    iconAnchor: [12, 20],
  }),
};

export default function ProjectMapContainer({
  center,
  zoom = 13,
  projectName,
}) {
  const markerRef = useRef({});
  const mapRef = useRef();
  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("school");

  const amenityQueryMap = {
    school: `node["amenity"="school"]`,
    park: `node["leisure"="park"]`,
    supermarket: `node["shop"="supermarket"]`,
    hospital: `node["amenity"="hospital"]`,
    restaurant: `node["amenity"="restaurant"]`,
  };

  useEffect(() => {
    const baseQuery =
      amenityQueryMap[currentAmenity] || amenityQueryMap["restaurant"];

    const query = `
      [out:json];
      (
        ${baseQuery}(around:5000, ${center[0]}, ${center[1]});
      );
      out;
    `;

    fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: query,
    })
      .then((res) => res.json())
      .then((data) => {
        setAmenities(data.elements);
      })
      .catch((err) => {
        console.error("Failed to fetch Overpass data:", err);
      });
  }, [center, currentAmenity]);

  const haversineDistance = ([lat1, lon1], [lat2, lon2]) => {
    const R = 6371;
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000;
  };

  const mapInstance = useMemo(
    () => (
      <div className="rounded-lg border border-gray-300">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: "400px", width: "100%" }}
          className="rounded-t-lg z-40"
          scrollWheelZoom={true}
          zoomControl={true}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={center} icon={customIcon}>
            <Popup>{projectName}</Popup>
          </Marker>

          {/* Amenity Markers */}
          {amenities.map((item) => {
            const category =
              item.tags.amenity || item.tags.leisure || item.tags.shop;
            return (
              <Marker
                key={item.id}
                position={[item.lat, item.lon]}
                icon={iconMap[category]}
                ref={(ref) => {
                  if (ref) markerRef.current[item.id] = ref;
                }}
              >
                <Popup>{item.tags.name || "Unnamed " + category}</Popup>
              </Marker>
            );
          })}
        </MapContainer>

        <ul className="flex items-center gap-3 border-b border-gray-300">
          {[
            {
              name: "Trường học",
              icon: <LuSchool />,
              value: "school",
            },
            {
              name: "Siêu thị",
              icon: <LuShoppingCart />,
              value: "supermarket",
            },
            {
              name: "Công viên",
              icon: <LuTrees />,
              value: "park",
            },
            { name: "Bệnh viện", icon: <LuCross />, value: "hospital" },
            { name: "Nhà hàng", icon: <LuUtensils />, value: "restaurant" },
          ].map((item, index) => (
            <li
              key={index}
              className={`flex items-center gap-2 p-2 py-2 text-lg cursor-pointer ${
                currentAmenity === item.value ? "bg-orange-600 text-white" : ""
              }`}
              onClick={() => setCurrentAmenity(item.value)}
            >
              {item.icon} {item.name}
            </li>
          ))}
        </ul>

        <div className="pb-3 max-h-96 overflow-auto">
          {amenities.map((item, index) => {
            const distance =
              haversineDistance(center, [item.lat, item.lon]) / 1000;

            const handleClick = () => {
              const marker = markerRef.current[item.id];
              const map = mapRef.current;

              if (map && marker) {
                map.flyTo([item.lat, item.lon], 14); // or your preferred zoom
                setTimeout(() => {
                  marker.openPopup();
                }, 500); // allow time for fly animation
              }
            };

            return (
              item.tags.name && (
                <div
                  className="p-2 py-4 border-t cursor-pointer flex items-center justify-between hover:bg-gray-100"
                  key={index}
                  onClick={handleClick}
                >
                  <h1>{item.tags.name || "Không tên"}</h1>
                  <p>{distance.toFixed(1)} km</p>
                </div>
              )
            );
          })}
        </div>
      </div>
    ),
    [center, zoom, amenities]
  );

  return mapInstance;
}
