import { Link } from 'react-router-dom';
import { Heart, Star } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

export default function RoomCard({ room }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const wishlisted = isInWishlist(room._id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    wishlisted ? removeFromWishlist(room._id) : addToWishlist(room);
  };

  const placeholderImg = `https://placehold.co/400x300/F7F7F7/6A6A6A?text=${encodeURIComponent(room.roomType || 'Room')}`;

  return (
    <Link
      to={`/rooms/${room._id}`}
      className="group block animate-fade-in bg-white p-3 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 hover:border-gray-200 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] mb-3 bg-gray-50">
        <img
          src={room.images?.[0] || placeholderImg}
          alt={room.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Wishlist Heart */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 transition-transform active:scale-[0.92] hover:bg-white/40"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              wishlisted ? 'fill-[#1a1a1a] text-[#1a1a1a]' : 'fill-transparent text-white'
            }`}
          />
        </button>

        {/* Room Type Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold text-black bg-white/90 backdrop-blur-md rounded-[6px] shadow-sm uppercase tracking-wider">
          {room.roomType}
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 px-1.5 pb-1">
        <div className="flex items-start justify-between mb-0.5">
          <h3 className="text-[16px] font-bold text-black line-clamp-1 pr-2">
            {room.location}
          </h3>
          {room.numReviews > 0 && (
            <div className="flex items-center gap-1 shrink-0 bg-gray-50 px-1.5 py-0.5 rounded-[6px]">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-[12px] font-bold text-black">{room.averageRating}</span>
            </div>
          )}
        </div>

        <p className="text-[13px] font-medium text-gray-500 line-clamp-1">{room.title}</p>
        
        <p className="text-[13px] font-medium text-gray-400">
           {room.isAvailable === false ? 'Currently Booked' : 'Available now'}
        </p>

        <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex justify-between items-center">
          <p className="text-[15px] text-black">
            <span className="font-bold">₹{room.price?.toLocaleString('en-IN')}</span>
            <span className="text-[12px] font-medium text-gray-500 ml-1">/ month</span>
          </p>
          <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#1a1a1a] group-hover:text-white text-black transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
