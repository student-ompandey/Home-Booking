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
          <h1 className="text-2xl font-bold text-dark">Your Wishlist</h1>
          <p className="text-sm text-gray-warm mt-1">{wishlist.length} saved rooms</p>
        </div>
        {wishlist.length > 0 && (
          <button onClick={clearWishlist} className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
            <Trash2 className="w-4 h-4" /> Clear all
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-12 h-12 text-gray-border mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark mb-1">No saved rooms</h3>
          <p className="text-sm text-gray-warm mb-4">Click the heart on any room to save it.</p>
          <Link to="/rooms" className="text-sm text-primary font-medium hover:underline">Browse rooms</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((room) => <RoomCard key={room._id} room={room} />)}
        </div>
      )}
    </div>
  );
}
