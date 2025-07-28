import React from 'react';
import { Search } from 'lucide-react';

interface TextFilterProps {
  column: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const TextFilter: React.FC<TextFilterProps> = ({ 
  column, 
  value, 
  onChange, 
  placeholder 
}) => {
  return (
    <div className="min-w-[280px] flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {column}
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder={placeholder || `Search ${column.toLowerCase()}...`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-9 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
        />
      </div>
    </div>
  );
};