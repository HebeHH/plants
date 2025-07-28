import React from 'react';
import { TextFilter } from './TextFilter';
import { MultiSelectFilter } from './MultiSelectFilter';
import { PlantSpecies, Filters } from '@/types';
import { enumFields } from '@/constants/enumFields';
import { getUniqueValues } from '@/utils/chartHelpers';

interface FilterSectionProps {
  data: PlantSpecies[];
  filters: Filters;
  onFilterChange: (column: string, value: string | string[], isMultiSelect?: boolean) => void;
}

export const FilterSection: React.FC<FilterSectionProps> = ({ 
  data, 
  filters, 
  onFilterChange 
}) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="p-6 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-wrap gap-4">
        {columns.map(column => {
          const isEnum = enumFields[column as keyof typeof enumFields];
          
          if (isEnum) {
            return (
              <MultiSelectFilter
                key={column}
                column={column}
                value={(filters[column] as string[]) || []}
                options={getUniqueValues(data, column)}
                onChange={(values) => onFilterChange(column, values, true)}
              />
            );
          } else {
            return (
              <TextFilter
                key={column}
                column={column}
                value={(filters[column] as string) || ''}
                onChange={(value) => onFilterChange(column, value)}
              />
            );
          }
        })}
      </div>
    </div>
  );
};