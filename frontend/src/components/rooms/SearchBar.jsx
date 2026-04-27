import { Search } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate('/rooms');
    }
  };

  return (
    <form onSubmit={handleSearch} className={`w-full ${className}`}>
      <div className="flex items-center bg-canvas-white rounded-full border border-hairline-gray shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-elevation-1 transition-shadow pl-8 pr-2 py-2">
        
        {/* Segment 1: Where */}
        <div className="flex-1 flex flex-col justify-center text-left">
          <label className="text-[12px] font-bold text-ink-black tracking-wide">Where</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destinations"
            className="w-full text-[14px] text-ink-black placeholder:text-ash-gray font-medium outline-none bg-transparent truncate"
          />
        </div>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-hairline-gray mx-4 hidden sm:block"></div>

        {/* Segment 2: When (Mock) */}
        <div className="flex-1 flex-col justify-center text-left hidden sm:flex cursor-pointer hover:bg-soft-cloud rounded-full px-4 -ml-4 py-2 transition-colors">
          <span className="text-[12px] font-bold text-ink-black tracking-wide">Check in</span>
          <span className="text-[14px] text-ash-gray font-medium truncate">Add dates</span>
        </div>

        {/* Divider */}
        <div className="w-[1px] h-8 bg-hairline-gray mx-4 hidden md:block"></div>

        {/* Segment 3: Who (Mock) */}
        <div className="flex-1 flex-col justify-center text-left hidden md:flex cursor-pointer hover:bg-soft-cloud rounded-full px-4 -ml-4 py-2 transition-colors">
          <span className="text-[12px] font-bold text-ink-black tracking-wide">Who</span>
          <span className="text-[14px] text-ash-gray font-medium truncate">Add guests</span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="ml-2 w-12 h-12 bg-rausch rounded-full flex items-center justify-center shrink-0 hover:bg-deep-rausch transition-colors"
        >
          <Search className="w-5 h-5 text-white" strokeWidth={3} />
        </button>
      </div>
    </form>
  );
}
