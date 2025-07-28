import { useState, useMemo } from 'react';
import { PlantSpecies, Filters } from '@/types';

export const useFilters = (data: PlantSpecies[]) => {
  const [filters, setFilters] = useState<Filters>({});

  const handleFilterChange = (column: string, value: string | string[], isMultiSelect = false) => {
    setFilters(prev => {
      if (isMultiSelect && Array.isArray(value)) {
        return { ...prev, [column]: value.length > 0 ? value : undefined };
      } else if (isMultiSelect && typeof value === 'string') {
        const currentValues = (prev[column] as string[]) || [];
        const newValues = currentValues.includes(value)
          ? currentValues.filter(v => v !== value)
          : [...currentValues, value];
        return { ...prev, [column]: newValues.length > 0 ? newValues : undefined };
      } else {
        return { ...prev, [column]: value || undefined };
      }
    });
  };

  const clearFilters = () => {
    setFilters({});
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([column, filterValue]) => {
        if (!filterValue) return true;
        
        const cellValue = row[column]?.toLowerCase() || '';
        
        if (Array.isArray(filterValue)) {
          // Multi-select filter
          return filterValue.some(val => cellValue.includes(val.toLowerCase()));
        } else {
          // Text search filter
          return cellValue.includes(filterValue.toLowerCase());
        }
      });
    });
  }, [data, filters]);

  return {
    filters,
    filteredData,
    handleFilterChange,
    clearFilters,
    activeFilterCount: Object.keys(filters).filter(key => filters[key] !== undefined).length
  };
};