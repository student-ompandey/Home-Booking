import { useWishlist } from '../context/WishlistContext';
import RoomCard from '../components/rooms/RoomCard';
import { Heart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist, clearWishlist } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Your Wishlist</h1>
          <p className="text-gray-500">{wishlist.length} saved properties</p>
        </div>
        {wishlist.length > 0 && (
          <button onClick={clearWishlist} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-8">
          <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No saved properties</h3>
          <p className="text-gray-500 mb-6">Click the heart on any property to save it for later.</p>
          <Link to="/rooms" className="text-sm font-bold text-white bg-rose-500 px-6 py-3 rounded-xl hover:bg-rose-600 transition-colors shadow-sm">Browse properties</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
      )}
    </div>
  );
}
