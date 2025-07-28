import { useState, useMemo } from 'react';
import { SortConfig } from '@/types';

export const useSorting = <T extends Record<string, any>>(data: T[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: 'asc'
  });

  const handleSort = (column: string) => {
    setSortConfig(prev => ({
      key: column,
      direction: prev.key === column && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key!] || '';
      const bVal = b[sortConfig.key!] || '';
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortConfig]);

  return {
    sortedData,
    sortConfig,
    handleSort
  };
};