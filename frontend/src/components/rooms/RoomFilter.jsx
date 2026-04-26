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
    <div className="flex flex-col sm:flex-row flex-wrap gap-3">
      {/* Room Type */}
      <select
        value={filters.roomType || ''}
        onChange={(e) => update('roomType', e.target.value)}
        className="px-3 py-2 text-sm border border-gray-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
      >
        {ROOM_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </select>

      {/* Price Range */}
      <input
        type="number"
        placeholder="Min Price"
        value={filters.minPrice || ''}
        onChange={(e) => update('minPrice', e.target.value)}
        className="w-28 px-3 py-2 text-sm border border-gray-border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
      />
      <input
        type="number"
        placeholder="Max Price"
        value={filters.maxPrice || ''}
        onChange={(e) => update('maxPrice', e.target.value)}
        className="w-28 px-3 py-2 text-sm border border-gray-border rounded-lg bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
      />

      {/* Sort */}
      <select
        value={`${filters.sortBy || 'createdAt'}:${filters.sortOrder || 'desc'}`}
        onChange={(e) => {
          const [sortBy, sortOrder] = e.target.value.split(':');
          onFilterChange({ ...filters, sortBy, sortOrder, page: 1 });
        }}
        className="px-3 py-2 text-sm border border-gray-border rounded-lg bg-white text-dark focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
      >
        {SORT_OPTIONS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-1 px-3 py-2 text-sm text-primary hover:text-primary-dark font-medium transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Clear
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
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-gray-border rounded-lg hover:bg-gray-light transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" /> Filters
          {hasActiveFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
        </button>
        {showMobile && (
          <div className="mt-3 p-4 bg-white border border-gray-border rounded-xl animate-fade-in">
            <FilterContent />
          </div>
        )}
      </div>
    </div>
  );
}
