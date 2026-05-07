import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { roomAPI } from '../services/api';
import { Clock, CheckCircle, XCircle, Plus, Home } from 'lucide-react';
import Loader from '../components/ui/Loader';

const STATUS_STYLE = {
  pending: { icon: Clock, class: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  approved: { icon: CheckCircle, class: 'bg-green-100 text-green-800 border-green-200' },
  rejected: { icon: XCircle, class: 'bg-red-100 text-red-800 border-red-200' },
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
    <div className="bg-[#f8f8f9] min-h-screen pb-24 pt-28 md:pt-32">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">My Listings</h1>
            <p className="text-gray-500 font-medium">{rooms.length} property{rooms.length !== 1 ? 's' : ''} listed</p>
          </div>
          <Link to="/add-room" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-xl shadow-sm transition-colors whitespace-nowrap">
            <Plus className="w-4 h-4" /> Add Property
          </Link>
        </div>

        {rooms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Home className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No properties listed yet</h3>
            <p className="text-gray-500 font-medium mb-6">Start by listing your first property on SettelInn.</p>
            <Link to="/add-room" className="inline-flex items-center gap-1.5 text-rose-500 font-bold hover:text-rose-600 hover:underline transition-colors pb-0.5">
              List a property <Plus className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid gap-5">
            {rooms.map((room) => {
              const st = STATUS_STYLE[room.status] || STATUS_STYLE.pending;
              const StIcon = st.icon;
              return (
                <div key={room._id} className="bg-white rounded-[24px] border border-gray-200 p-5 flex flex-col sm:flex-row items-start sm:items-stretch gap-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-[220px] shrink-0">
                    <img 
                      src={room.images?.[0] || `https://placehold.co/800x500/F7F7F7/717171?text=${room.roomType}`}
                      className="w-full h-[180px] sm:h-[140px] rounded-[16px] object-cover bg-gray-50" 
                      alt={room.title} 
                    />
                  </div>
                  <div className="flex-1 flex flex-col min-w-0 w-full py-1">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-1">
                      <Link to={`/rooms/${room._id}`} className="text-xl font-bold text-gray-900 hover:text-rose-500 transition-colors line-clamp-1 block">
                        {room.title}
                      </Link>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-bold rounded-full border uppercase tracking-wider shrink-0 ${st.class}`}>
                        <StIcon className="w-3.5 h-3.5" /> {room.status}
                      </span>
                    </div>
                    
                    <p className="text-[14px] font-medium text-gray-500 mb-3 line-clamp-1">{room.location}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-auto gap-3">
                       <span className="text-lg font-bold text-gray-900 leading-none">
                         ₹{room.price?.toLocaleString('en-IN')} <span className="text-gray-400 text-sm font-medium">/ month</span>
                       </span>
                       {room.adminNote && room.status === 'rejected' && (
                         <span className="text-[12px] font-bold text-red-500 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg max-w-full sm:max-w-[60%] line-clamp-2">
                           Note: {room.adminNote}
                         </span>
                       )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
