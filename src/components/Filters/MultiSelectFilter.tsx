import React from 'react';

interface MultiSelectFilterProps {
  column: string;
  value: string[];
  options: string[];
  onChange: (values: string[]) => void;
}

export const MultiSelectFilter: React.FC<MultiSelectFilterProps> = ({ 
  column, 
  value, 
  options,
  onChange 
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    onChange(selectedOptions);
  };

  return (
    <div className="min-w-[280px] flex-1">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {column}
      </label>
      <div className="relative">
        <select
          multiple
          value={value}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          size={Math.min(options.length, 4)}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};