import { useState } from 'react';
import { Search } from 'lucide-react';
import type { SortOption } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSortChange: (sort: SortOption) => void;
  currentSort: SortOption;
}

export function SearchBar({ onSearch, onSortChange, currentSort }: SearchBarProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-4">
      <div className="max-w-5xl mx-auto flex gap-3">
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="게시글 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-[#FFCC00] text-gray-900 rounded-lg hover:bg-[#E6B800] transition-colors"
          >
            검색
          </button>
        </form>

        <select
          value={currentSort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFCC00]"
        >
          <option value="latest">최신순</option>
          <option value="views">조회수순</option>
          <option value="comments">댓글수순</option>
        </select>
      </div>
    </div>
  );
}