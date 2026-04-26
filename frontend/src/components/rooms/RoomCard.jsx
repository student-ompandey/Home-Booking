import { Link } from 'react-router-dom';
import { Heart, MapPin, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function RoomCard({ room }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(room._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlisted ? removeFromWishlist(room._id) : addToWishlist(room);
  };

  const placeholderImg = `https://placehold.co/400x300/1F2937/9CA3AF?text=${encodeURIComponent(room.roomType || 'Room')}`;

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block rounded-2xl overflow-hidden glass hover:shadow-[0_0_25px_rgba(124,58,237,0.3)] transition-all duration-500 hover:-translate-y-2 animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#1F2937]">
        <img
          src={room.images?.[0] || placeholderImg}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent opacity-80"></div>
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors shadow-lg"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              wishlisted ? 'fill-primary text-primary drop-shadow-[0_0_8px_rgba(124,58,237,0.8)]' : 'text-gray-300 hover:text-primary'
            }`}
          />
        </button>
        <span className="absolute top-3 left-3 px-3 py-1 text-[11px] font-bold uppercase tracking-widest bg-primary/80 backdrop-blur-md text-white rounded-full border border-white/20 shadow-lg">
          {room.roomType}
        </span>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[16px] font-semibold text-white leading-snug line-clamp-1 group-hover:text-secondary transition-colors">
            {room.title}
          </h3>
          {room.numReviews > 0 && (
            <div className="flex items-center gap-1 shrink-0 bg-white/5 px-2 py-1 rounded-md border border-white/5">
              <Star className="w-3.5 h-3.5 fill-accent text-accent" />
              <span className="text-xs font-semibold text-white">{room.averageRating}</span>
              <span className="text-[10px] text-gray-400">({room.numReviews})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-2.5">
          <MapPin className="w-4 h-4 text-secondary" />
          <span className="text-sm text-gray-300 line-clamp-1">{room.location}</span>
        </div>

        <p className="text-sm text-gray-400 mt-2 line-clamp-1">{room.description}</p>

        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
          <p className="text-[16px]">
            <span className="font-bold text-gradient text-lg">₹{room.price?.toLocaleString('en-IN')}</span>
            <span className="text-gray-400 text-xs ml-1">/ month</span>
          </p>
          {room.isAvailable === false && (
            <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
              Booked
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
