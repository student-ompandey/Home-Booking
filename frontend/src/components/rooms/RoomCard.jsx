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

  const placeholderImg = `https://placehold.co/400x300/F7F7F7/717171?text=${encodeURIComponent(room.roomType || 'Room')}`;

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block rounded-2xl overflow-hidden bg-white border border-gray-border hover:shadow-lg transition-all duration-300 animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-light">
        <img
          src={room.images?.[0] || placeholderImg}
          alt={room.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              wishlisted ? 'fill-primary text-primary' : 'text-dark/60 hover:text-primary'
            }`}
          />
        </button>
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide bg-white/90 backdrop-blur-sm text-dark rounded-full">
          {room.roomType}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-semibold text-dark leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {room.title}
          </h3>
          {room.numReviews > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3.5 h-3.5 fill-dark text-dark" />
              <span className="text-xs font-medium">{room.averageRating}</span>
              <span className="text-xs text-gray-warm ml-0.5">({room.numReviews})</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mt-1.5">
          <MapPin className="w-3.5 h-3.5 text-gray-warm" />
          <span className="text-sm text-gray-warm line-clamp-1">{room.location}</span>
        </div>

        <p className="text-sm text-gray-warm mt-1.5 line-clamp-1">{room.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px]">
            <span className="font-bold text-dark">₹{room.price?.toLocaleString('en-IN')}</span>
            <span className="text-gray-warm text-sm"> / month</span>
          </p>
          {room.isAvailable === false && (
            <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
              Booked
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
