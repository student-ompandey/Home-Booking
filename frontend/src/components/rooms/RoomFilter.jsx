import { SlidersHorizontal, X } from 'lucide-react';
import { useState } from 'react';

const ROOM_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'single', label: 'Single' },
  { value: 'double', label: 'Double' },
  { value: 'suite', label: 'Suite' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'hostel', label: 'Hostel' },
  { value: 'pg', label: 'PG' },
];

const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: 'Newest First' },
  { value: 'createdAt:asc', label: 'Oldest First' },
  { value: 'price:asc', label: 'Price: Low → High' },
  { value: 'price:desc', label: 'Price: High → Low' },
];

export default function RoomFilter({ filters, onFilterChange }) {
  const [showMobile, setShowMobile] = useState(false);

  const update = (key, value) => {
    onFilterChange({ ...filters, [key]: value, page: 1 });
  };

  const clearAll = () => {
    onFilterChange({ search: filters.search, page: 1 });
  };

  const hasActiveFilters = filters.roomType || filters.minPrice || filters.maxPrice || (filters.sortBy && filters.sortBy !== 'createdAt');

  const FilterContent = () => (
    <div className="flex flex-col sm:flex-row flex-wrap gap-4 items-center">
      {/* Room Type */}
      <div className="relative w-full sm:w-auto">
        <select
          value={filters.roomType || ''}
          onChange={(e) => update('roomType', e.target.value)}
          className="w-full appearance-none px-6 py-3.5 pr-10 text-[14px] font-semibold border border-gray-200 rounded-full bg-white text-black shadow-sm focus:ring-0 focus:border-black outline-none transition-colors cursor-pointer hover:border-gray-300"
        >
          {ROOM_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        {/* Min Price */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice || ''}
          onChange={(e) => update('minPrice', e.target.value)}
          className="w-full sm:w-32 px-5 py-3.5 text-[14px] font-semibold border border-gray-200 rounded-full bg-white text-black shadow-sm focus:ring-0 focus:border-black outline-none transition-colors placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
        />
        <span className="text-gray-300 font-bold self-center">-</span>
        {/* Max Price */}
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice || ''}
          onChange={(e) => update('maxPrice', e.target.value)}
          className="w-full sm:w-32 px-5 py-3.5 text-[14px] font-semibold border border-gray-200 rounded-full bg-white text-black shadow-sm focus:ring-0 focus:border-black outline-none transition-colors placeholder:text-gray-400 placeholder:font-medium hover:border-gray-300"
        />
      </div>

      {/* Sort */}
      <div className="relative w-full sm:w-auto">
        <select
          value={`${filters.sortBy || 'createdAt'}:${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split(':');
            onFilterChange({ ...filters, sortBy, sortOrder, page: 1 });
          }}
          className="w-full appearance-none px-6 py-3.5 pr-10 text-[14px] font-semibold border border-gray-200 rounded-full bg-white text-black shadow-sm focus:ring-0 focus:border-black outline-none transition-colors cursor-pointer hover:border-gray-300"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-black">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 px-5 py-3.5 text-[14px] text-black hover:bg-gray-100 rounded-full font-bold transition-colors border border-transparent hover:border-gray-200 ml-auto sm:ml-0"
        >
          <X className="w-4 h-4" /> Clear All
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Desktop */}
      <div className="hidden sm:block">
        <FilterContent />
      </div>

      {/* Mobile Toggle */}
      <div className="sm:hidden">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="flex items-center gap-2 px-6 py-3 text-[14px] font-bold border border-gray-200 rounded-full hover:bg-gray-50 transition-colors w-full justify-center shadow-sm"
        >
          <SlidersHorizontal className="w-4 h-4" /> 
          {showMobile ? 'Hide Filters' : 'Show Filters'}
          {hasActiveFilters && !showMobile && <span className="w-2 h-2 bg-black rounded-full ml-1" />}
        </button>
        {showMobile && (
          <div className="mt-4 p-5 bg-white border border-gray-100 shadow-[0_20px_40px_rgba(0,0,0,0.08)] rounded-[24px] animate-fade-in">
            <FilterContent />
          </div>
        )}
      </div>
    </div>
  );
}
