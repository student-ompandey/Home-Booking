import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className={`relative ${className}`}>
      <div className="flex items-center bg-white rounded-full border border-gray-border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="flex items-center gap-2 pl-5 pr-2 py-3 flex-1">
          <MapPin className="w-4.5 h-4.5 text-gray-warm shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, area, or room name..."
            className="w-full text-sm text-dark placeholder:text-gray-warm outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="m-1.5 p-2.5 bg-primary hover:bg-primary-dark text-white rounded-full transition-colors shrink-0"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
