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
      <div className="flex items-center glass rounded-full border border-white/20 shadow-[0_0_30px_rgba(34,211,238,0.15)] hover:shadow-[0_0_30px_rgba(34,211,238,0.25)] transition-shadow overflow-hidden p-1">
        <div className="flex items-center gap-3 pl-5 pr-2 py-3 flex-1">
          <MapPin className="w-5 h-5 text-secondary shrink-0 animate-pulse-soft" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by city, area, or room name..."
            className="w-full text-[15px] font-medium text-white placeholder:text-gray-400 outline-none bg-transparent"
          />
        </div>
        <button
          type="submit"
          className="m-1 px-6 py-3 btn-gradient flex items-center justify-center gap-2 group"
        >
          <Search className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline font-semibold">Search</span>
        </button>
      </div>
    </form>
  );
}
