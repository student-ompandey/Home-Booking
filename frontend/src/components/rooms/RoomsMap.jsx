import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically fit bounds of all markers
function MapBounds({ rooms }) {
  const map = useMap();

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      const bounds = L.latLngBounds(rooms.filter(r => r.coordinates).map(r => [r.coordinates.lat, r.coordinates.lng]));
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
      }
    }
  }, [rooms, map]);

  return null;
}

export default function RoomsMap({ rooms }) {
  // Center on New Delhi if no rooms
  const defaultCenter = [28.6139, 77.2090]; 

  return (
    <div className="w-full h-[600px] rounded-2xl overflow-hidden border border-gray-border shadow-sm z-0 relative">
      <MapContainer 
        center={defaultCenter} 
        zoom={5} 
        scrollWheelZoom={true} 
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {rooms.filter(r => r.coordinates).map(room => (
          <Marker 
            key={room._id} 
            position={[room.coordinates.lat, room.coordinates.lng]}
          >
            <Popup className="room-popup rounded-xl overflow-hidden p-0 m-0 border-0 shadow-lg">
              <Link to={`/rooms/${room._id}`} className="block w-64 text-dark hover:text-dark">
                <div className="relative h-32 bg-gray-light">
                  <img 
                    src={room.images?.[0] || `https://placehold.co/400x300/F7F7F7/717171?text=${encodeURIComponent(room.roomType)}`} 
                    alt={room.title} 
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-white/90 rounded-full">
                    {room.roomType}
                  </span>
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-sm line-clamp-1 mb-1">{room.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-warm mb-2 line-clamp-1">
                    <MapPin className="w-3 h-3" /> {room.location}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold">₹{room.price?.toLocaleString('en-IN')}<span className="text-xs font-normal text-gray-warm">/mo</span></span>
                    {room.numReviews > 0 && (
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-dark text-dark" />
                        <span className="text-xs font-medium">{room.averageRating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </Popup>
          </Marker>
        ))}
        <MapBounds rooms={rooms} />
      </MapContainer>
    </div>
  );
}
