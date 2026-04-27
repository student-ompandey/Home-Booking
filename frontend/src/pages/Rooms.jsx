import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/rooms/RoomCard';
import RoomFilter from '../components/rooms/RoomFilter';
import RoomsMap from '../components/rooms/RoomsMap';
import Loader from '../components/ui/Loader';
import { ChevronLeft, ChevronRight, Frown, Map as MapIcon, Grid } from 'lucide-react';

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    roomType: searchParams.get('roomType') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 20,
  });

  // Re-sync URL search params into filters
  useEffect(() => {
    const search = searchParams.get('search');
    const roomType = searchParams.get('roomType');
    if (search !== null || roomType !== null) {
      setFilters((prev) => ({
        ...prev,
        search: search || prev.search,
        roomType: roomType || prev.roomType,
        page: 1,
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        // Build clean params (strip empty values)
        const params = {};
        Object.entries(filters).forEach(([key, val]) => {
          if (val !== '' && val !== undefined) params[key] = val;
        });

        const { data } = await roomAPI.getAll(params);
        setRooms(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rooms');
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [filters]);

  return (
    <div className="bg-[#f8f8f9] min-h-screen text-black pb-24">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 md:pt-36">
        
        {/* Massive Editorial Header */}
        <div className="mb-10 flex flex-col items-start">
           <div className="flex gap-4 items-start mb-5">
              <div className="w-[2px] h-6 bg-black rounded-full"></div>
              <p className="text-[12px] font-bold tracking-widest uppercase text-gray-500 mt-1">EXPLORE</p>
           </div>
           <h1 className="text-[36px] md:text-[56px] font-bold tracking-tight text-black leading-tight">
             Discover our <br className="hidden md:block"/>
             <span className="inline-block bg-[#1a1a1a] text-white px-5 pt-0.5 pb-2 rounded-full align-middle shadow-md border border-black/10 mt-2 md:mt-0">Collection</span>
           </h1>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <RoomFilter filters={filters} onFilterChange={setFilters} />
        </div>

        {/* Results Info & View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 pb-6 border-b border-gray-200">
          <p className="text-[15px] font-semibold text-gray-500">
            {pagination.total !== undefined ? (
              <>{rooms.length} of {pagination.total} extraordinary stays</>
            ) : 'Loading collection...'}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 shadow-sm ${viewMode === 'list' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
            >
              <Grid className="w-4 h-4" /> List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-bold transition-all duration-300 shadow-sm ${viewMode === 'map' ? 'bg-[#1a1a1a] text-white' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'}`}
            >
              <MapIcon className="w-4 h-4" /> Map
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-32">
             <Loader text="Curating properties..." />
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[24px] border border-gray-100 shadow-sm animate-fade-in mx-auto max-w-2xl mt-8">
            <div className="w-20 h-20 bg-[#f8f8f9] rounded-full flex items-center justify-center mx-auto mb-5">
              <Frown className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-[24px] font-bold text-black mb-2">No exact matches</h3>
            <p className="text-[15px] text-gray-500 max-w-sm mx-auto">Try changing or removing some of your filters or adjusting your search area.</p>
          </div>
        ) : (
          <>
            {viewMode === 'map' ? (
              <div className="animate-fade-in rounded-[24px] overflow-hidden border border-gray-200 shadow-sm h-[500px]">
                <RoomsMap rooms={rooms} />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in">
                {rooms.map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.pages > 1 && viewMode === 'list' && (
              <div className="flex flex-col items-center mt-16">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:border-black hover:text-black disabled:opacity-30 disabled:hover:border-gray-200 disabled:hover:text-gray-400 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 ml-0.5" />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).slice(
                      Math.max(0, filters.page - 3),
                      filters.page + 2
                    ).map((p) => (
                      <button
                        key={p}
                        onClick={() => setFilters({ ...filters, page: p })}
                        className={`w-10 h-10 text-[14px] font-bold rounded-full transition-colors ${
                          p === filters.page 
                            ? 'bg-black text-white' 
                            : 'text-black hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="w-10 h-10 flex items-center justify-center rounded-full border border-black text-black hover:bg-black hover:text-white disabled:opacity-30 disabled:border-gray-200 disabled:text-gray-400 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 mr-0.5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
