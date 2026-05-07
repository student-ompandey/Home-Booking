import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { roomAPI, chatAPI } from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Heart, MapPin, ArrowLeft, Calendar, Tag, Wifi, Wind, ChefHat, Car, Tv, ShowerHead, MessageCircle, Star } from 'lucide-react';
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
    <div className="text-center py-20 bg-canvas-white min-h-screen">
      <p className="text-rausch mb-4 text-subtitle">{error}</p>
      <button onClick={() => navigate('/rooms')} className="text-[14px] font-semibold text-ink-black underline">← Back to rooms</button>
    </div>
  );
  if (!room) return null;

  const wishlisted = isInWishlist(room._id);
  const placeholderImg = `https://placehold.co/800x500/F7F7F7/717171?text=${encodeURIComponent(room.roomType)}`;
  const images = room.images?.length > 0 ? room.images : [placeholderImg];

  return (
    <div className="bg-[#f8f8f9] min-h-screen text-black animate-fade-in pb-32">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-[32px] md:text-[44px] font-bold tracking-tight text-black leading-tight mb-4">
            {room.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-[14px] font-bold text-gray-600">
             {room.numReviews > 0 && (
              <span className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm text-black">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {room.averageRating} <span className="text-gray-400 font-medium ml-1">({room.numReviews} reviews)</span>
              </span>
             )}
            <span className="flex items-center gap-1.5 bg-white px-4 py-1.5 rounded-full border border-gray-200 shadow-sm text-black">
              <MapPin className="w-4 h-4 text-gray-400" />
              {room.location}
            </span>
          </div>
        </div>

        {/* Premium Bento-Box Gallery */}
        <div className="mb-12">
          <div className={`grid gap-3 ${images.length >= 3 ? 'grid-cols-1 md:grid-cols-4 md:grid-rows-2 h-[350px] md:h-[500px]' : 'grid-cols-1 h-[350px] md:h-[500px]'}`}>
            
            {/* Primary Large Image */}
            <div className={`relative rounded-[24px] overflow-hidden shadow-sm group ${images.length >= 3 ? 'md:col-span-3 md:row-span-2' : ''}`}>
              <img src={images[0]} alt={room.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <button 
                onClick={() => wishlisted ? removeFromWishlist(room._id) : addToWishlist(room)} 
                className="absolute top-5 right-5 p-3.5 bg-white/40 backdrop-blur-md rounded-full border border-white/50 shadow-sm hover:bg-white/60 transition-all"
              >
                <Heart className={`w-5 h-5 transition-colors ${wishlisted ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
            </div>

            {/* Secondary Images (if available) */}
            {images.length >= 3 && (
              <>
                <div className="hidden md:block relative rounded-[24px] overflow-hidden shadow-sm group">
                  <img src={images[1]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                </div>
                <div className="hidden md:block relative rounded-[24px] overflow-hidden shadow-sm group">
                  <img src={images[2]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                  {images.length > 3 && (
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/50 transition-colors">
                       <span className="text-white text-[16px] font-bold tracking-wide">+{images.length - 3}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Details Layout */}
        <div className="grid lg:grid-cols-3 gap-10 relative">
          
          {/* Main Info Column (Wrapped in a white card for elegance) */}
          <div className="lg:col-span-2 bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
            
            {/* Host Section */}
            <div className="flex items-center justify-between pb-8 border-b border-gray-100">
              <div>
                <h2 className="text-[24px] md:text-[28px] font-bold text-black mb-2">Hosted by {room.owner?.name || 'SettelInn Host'}</h2>
                <span className="text-[12px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg uppercase tracking-widest">{room.roomType}</span>
              </div>
              {room.owner && (
                <div className="w-14 h-14 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center shrink-0 shadow-sm">
                  <span className="font-bold text-xl">{room.owner.name?.charAt(0).toUpperCase()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="py-10 border-b border-gray-100">
              <h2 className="text-[20px] font-bold text-black mb-5">About this space</h2>
              <p className="text-[15px] leading-relaxed text-gray-600 font-medium whitespace-pre-line">{room.description}</p>
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div className="py-10 border-b border-gray-100">
                <h2 className="text-[20px] font-bold text-black mb-6">What this place offers</h2>
                <div className="grid grid-cols-2 gap-y-5 gap-x-6">
                  {room.amenities.map((a) => {
                    const Icon = AMENITY_ICONS[a.toLowerCase()] || Tag;
                    return (
                      <div key={a} className="flex items-center gap-4 group">
                        <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
                        </div>
                        <span className="text-[15px] font-semibold text-black capitalize">{a}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Location Map */}
            {room.coordinates && room.coordinates.lat && room.coordinates.lng && (
              <div className="py-10 border-b border-gray-100">
                <h2 className="text-[20px] font-bold text-black mb-6">Where you'll be</h2>
                <div className="h-[350px] rounded-[24px] overflow-hidden bg-gray-100 shadow-inner z-0 border border-gray-200">
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
            
            {/* Reviews */}
            <div className="pt-10">
               <ReviewSection roomId={room._id} />
            </div>

          </div>

          {/* Sidebar — Floating Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-100 rounded-[32px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all">
              
              <div className="mb-8 pb-8 border-b border-gray-100">
                <div className="flex items-end gap-2">
                  <span className="text-[32px] md:text-[36px] font-bold text-black leading-none tracking-tight">₹{room.price?.toLocaleString('en-IN')}</span>
                  <span className="text-gray-400 font-medium text-[15px] mb-0.5">/ month</span>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-3">
                <button
                  onClick={() => {
                    if (!isAuthenticated) { navigate('/login'); return; }
                    toast.success('Booking request sent! Owner will contact you.');
                  }}
                  disabled={room.isAvailable === false}
                  className="w-full py-4 text-[15px] font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed shadow-sm transition-colors"
                >
                  {room.isAvailable === false ? 'Currently Booked' : 'Reserve'}
                </button>
                
                <p className="text-center text-[12px] font-semibold text-gray-400 mb-2">You won't be charged yet</p>

                {/* Chat with Owner */}
                {room.owner && (
                  <button
                    onClick={async () => {
                      if (!isAuthenticated) { navigate('/login'); return; }
                      if (room.owner._id === user?._id) {
                         toast.error("You can't chat with yourself!"); 
                         return; 
                      }
                      try {
                        const { data } = await chatAPI.createChat({ ownerId: room.owner._id, roomId: room._id });
                        navigate(`/chat/${data.data._id}`);
                      } catch (err) {
                        toast.error('Failed to start chat');
                      }
                    }}
                    className="w-full py-4 text-[15px] font-bold text-gray-700 bg-white border border-gray-300 rounded-xl transition-colors flex items-center justify-center gap-2 hover:bg-gray-50"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Contact Host
                  </button>
                )}
                
                <div className="mt-4 pt-6 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <Calendar className="w-3.5 h-3.5" />
                  Listed {new Date(room.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
