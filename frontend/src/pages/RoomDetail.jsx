import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI, chatAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, MapPin, ArrowLeft, User, Calendar, Tag, Wifi, Wind, ChefHat, Car, Tv, ShowerHead, MessageCircle } from 'lucide-react';
import Loader from '../components/ui/Loader';
import toast from 'react-hot-toast';
import ReviewSection from '../components/rooms/ReviewSection';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const AMENITY_ICONS = {
  wifi: Wifi, ac: Wind, kitchen: ChefHat, parking: Car, tv: Tv, geyser: ShowerHead,
};

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { isAuthenticated, user } = useAuth();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const { data } = await roomAPI.getById(id);
        setRoom(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Room not found');
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <Loader text="Loading room details..." />;
  if (error) return (
    <div className="text-center py-20">
      <p className="text-red-500 mb-4">{error}</p>
      <button onClick={() => navigate('/rooms')} className="text-sm text-primary hover:underline">← Back to rooms</button>
    </div>
  );
  if (!room) return null;

  const wishlisted = isInWishlist(room._id);
  const placeholderImg = `https://placehold.co/800x500/F7F7F7/717171?text=${encodeURIComponent(room.roomType)}`;
  const images = room.images?.length > 0 ? room.images : [placeholderImg];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-warm hover:text-dark mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      {/* Image Gallery */}
      <div className="rounded-2xl overflow-hidden mb-8">
        <div className="relative aspect-[16/9] bg-gray-light">
          <img src={images[activeImg]} alt={room.title} className="w-full h-full object-cover" />
          {!room.isAvailable && (
            <div className="absolute top-4 left-4 px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">Booked</div>
          )}
          <button onClick={() => wishlisted ? removeFromWishlist(room._id) : addToWishlist(room)} className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white shadow transition-colors">
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-primary text-primary' : 'text-dark/60'}`} />
          </button>
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
            {images.map((img, i) => (
              <button key={i} onClick={() => setActiveImg(i)} className={`shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImg ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide bg-primary/10 text-primary rounded-full">{room.roomType}</span>
              {room.isAvailable !== false && <span className="px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-600 rounded-full">Available</span>}
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-dark">{room.title}</h1>
            <div className="flex items-center gap-1.5 mt-2 text-gray-warm">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{room.location}</span>
            </div>
          </div>

          <hr className="border-gray-border" />

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-dark mb-3">About this place</h2>
            <p className="text-sm text-gray-warm leading-relaxed whitespace-pre-line">{room.description}</p>
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-dark mb-3">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {room.amenities.map((a) => {
                  const Icon = AMENITY_ICONS[a.toLowerCase()] || Tag;
                  return (
                    <div key={a} className="flex items-center gap-2.5 px-3 py-2.5 bg-gray-light rounded-xl">
                      <Icon className="w-4 h-4 text-gray-warm" />
                      <span className="text-sm text-dark capitalize">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Location Map */}
          {room.coordinates && room.coordinates.lat && room.coordinates.lng && (
            <div>
              <h2 className="text-lg font-semibold text-dark mb-3">Location Map</h2>
              <div className="h-64 rounded-2xl overflow-hidden border border-gray-border">
                <MapContainer 
                  center={[room.coordinates.lat, room.coordinates.lng]} 
                  zoom={15} 
                  scrollWheelZoom={false} 
                  className="w-full h-full z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[room.coordinates.lat, room.coordinates.lng]} />
                </MapContainer>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar — Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-gray-border rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
              <span className="text-2xl font-bold text-dark">₹{room.price?.toLocaleString('en-IN')}</span>
              <span className="text-gray-warm text-sm"> / month</span>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) { navigate('/login'); return; }
                toast.success('Booking request sent! Owner will contact you.');
              }}
              disabled={room.isAvailable === false}
              className="w-full py-3 text-sm font-semibold text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors disabled:bg-gray-border disabled:text-gray-warm disabled:cursor-not-allowed"
            >
              {room.isAvailable === false ? 'Currently Booked' : 'Book Now'}
            </button>

            {/* Chat with Owner */}
            {room.owner && room.owner._id !== user?._id && (
              <button
                onClick={async () => {
                  if (!isAuthenticated) { navigate('/login'); return; }
                  try {
                    const { data } = await chatAPI.createChat({ ownerId: room.owner._id, roomId: room._id });
                    navigate(`/chat/${data.data._id}`);
                  } catch (err) {
                    toast.error('Failed to start chat');
                  }
                }}
                className="w-full mt-2 py-3 text-sm font-semibold text-primary bg-primary/10 hover:bg-primary/20 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Chat with Owner
              </button>
            )}

            {/* Owner */}
            {room.owner && (
              <div className="mt-5 pt-5 border-t border-gray-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-dark rounded-full flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-dark">{room.owner.name}</p>
                    <p className="text-xs text-gray-warm">{room.owner.email}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-warm">
              <Calendar className="w-3.5 h-3.5" />
              Listed {new Date(room.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewSection roomId={room._id} />
    </div>
  );
}
