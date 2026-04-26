import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomAPI } from '../services/api';
import RoomCard from '../components/rooms/RoomCard';
import RoomFilter from '../components/rooms/RoomFilter';
import SearchBar from '../components/rooms/SearchBar';
import Loader from '../components/ui/Loader';
import { ChevronLeft, ChevronRight, Frown } from 'lucide-react';

export default function Rooms() {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    roomType: searchParams.get('roomType') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search */}
      <div className="max-w-xl mb-8">
        <SearchBar />
      </div>

      {/* Filters */}
      <div className="mb-8">
        <RoomFilter filters={filters} onFilterChange={setFilters} />
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-warm">
          {pagination.total !== undefined ? (
            <>Showing <span className="font-medium text-dark">{rooms.length}</span> of <span className="font-medium text-dark">{pagination.total}</span> rooms</>
          ) : 'Loading...'}
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <Loader text="Finding rooms..." />
      ) : error ? (
        <div className="text-center py-16">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20 animate-fade-in">
          <Frown className="w-12 h-12 text-gray-border mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-dark mb-1">No rooms found</h3>
          <p className="text-sm text-gray-warm">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={!pagination.hasPrev}
                className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: pagination.pages }, (_, i) => i + 1).slice(
                Math.max(0, filters.page - 3),
                filters.page + 2
              ).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilters({ ...filters, page: p })}
                  className={`w-9 h-9 text-sm font-medium rounded-lg transition-colors ${
                    p === filters.page ? 'bg-dark text-white' : 'hover:bg-gray-light text-gray-warm'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={!pagination.hasNext}
                className="p-2 rounded-lg border border-gray-border hover:bg-gray-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
