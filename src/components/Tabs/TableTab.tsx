import React from 'react';
import { Copy, Download } from 'lucide-react';
import Papa from 'papaparse';
import { PlantSpecies, Filters, SortConfig } from '@/types';
import { FilterSection } from '@/components/Filters/FilterSection';

interface TableTabProps {
  data: PlantSpecies[];
  sortedData: PlantSpecies[];
  filters: Filters;
  sortConfig: SortConfig;
  activeFilterCount: number;
  onFilterChange: (column: string, value: string | string[], isMultiSelect?: boolean) => void;
  onSort: (column: string) => void;
}

export const TableTab: React.FC<TableTabProps> = ({
  data,
  sortedData,
  filters,
  sortConfig,
  activeFilterCount,
  onFilterChange,
  onSort
}) => {
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  const downloadCSV = () => {
    const csv = Papa.unparse(sortedData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'filtered_plant_species.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    const csv = Papa.unparse(sortedData);
    try {
      await navigator.clipboard.writeText(csv);
      alert('Data copied to clipboard!');
    } catch (err) {
      alert('Failed to copy data');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Species Data</h2>
          <div className="flex space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </button>
            <button
              onClick={downloadCSV}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        </div>
        
        <p className="text-gray-600">
          Showing {sortedData.length} of {data.length} species
          {activeFilterCount > 0 && (
            <span className="ml-2 text-green-600">
              ({activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active)
            </span>
          )}
        </p>
      </div>

      <FilterSection
        data={data}
        filters={filters}
        onFilterChange={onFilterChange}
      />

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th
                  key={column}
                  onClick={() => onSort(column)}
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-1">
                    <span>{column}</span>
                    {sortConfig.key === column && (
                      <span className="text-green-600">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                {columns.map(column => (
                  <td key={column} className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {row[column] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};