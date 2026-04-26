import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, Plus, Home } from 'lucide-react';
import Loader from '../components/ui/Loader';

const STATUS_STYLE = {
  pending: { icon: Clock, class: 'bg-amber-100 text-amber-700' },
  approved: { icon: CheckCircle, class: 'bg-green-100 text-green-700' },
  rejected: { icon: XCircle, class: 'bg-red-100 text-red-700' },
};

export default function MyListings() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await roomAPI.getMyRooms();
        setRooms(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <Loader text="Loading your listings..." />;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-dark">My Listings</h1>
          <p className="text-sm text-gray-warm mt-1">{rooms.length} room{rooms.length !== 1 ? 's' : ''} listed</p>
        </div>
        <Link to="/add-room" className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-dark rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> Add Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-20">
          <Home className="w-12 h-12 text-gray-border mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark mb-1">No rooms listed yet</h3>
          <p className="text-sm text-gray-warm mb-4">Start by listing your first room.</p>
          <Link to="/add-room" className="text-sm text-primary font-medium hover:underline">Add a room →</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room) => {
            const st = STATUS_STYLE[room.status] || STATUS_STYLE.pending;
            const StIcon = st.icon;
            return (
              <div key={room._id} className="bg-white rounded-2xl border border-gray-border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:shadow-sm transition-shadow">
                <img src={room.images?.[0] || `https://placehold.co/80x60/F7F7F7/717171?text=${room.roomType}`}
                  className="w-20 h-15 rounded-xl object-cover bg-gray-light shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <Link to={`/rooms/${room._id}`} className="text-sm font-semibold text-dark hover:text-primary transition-colors line-clamp-1">{room.title}</Link>
                  <p className="text-xs text-gray-warm mt-0.5">{room.location} · ₹{room.price?.toLocaleString('en-IN')}/mo</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full capitalize ${st.class}`}>
                    <StIcon className="w-3 h-3" /> {room.status}
                  </span>
                </div>
                {room.adminNote && room.status === 'rejected' && (
                  <p className="text-xs text-red-500 sm:ml-2">Reason: {room.adminNote}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
