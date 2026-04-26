import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapEvents({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function LocationPicker({ position, onChange }) {
  const [mapPosition, setMapPosition] = useState(position || { lat: 28.6139, lng: 77.2090 }); // Default to New Delhi

  useEffect(() => {
    if (position) {
      setMapPosition(position);
    }
  }, [position]);

  const handleLocationSelect = (newPosition) => {
    setMapPosition(newPosition);
    if (onChange) {
      onChange(newPosition);
    }
  };

  return (
    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-border">
      <MapContainer
        center={mapPosition}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {position && <Marker position={mapPosition} />}
        <MapEvents onLocationSelect={handleLocationSelect} />
      </MapContainer>
    </div>
  );
}
