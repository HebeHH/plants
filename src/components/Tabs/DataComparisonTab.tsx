import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { parseCSV } from '@/utils/csvParser';

interface DataComparisonTabProps {}

interface ComparisonData {
  fileName: string;
  shortName: string;
  data: Record<string, any>[];
}

interface ChartData {
  name: string;
  [key: string]: any;
}

const COLUMNS_TO_COMPARE = [
  'SPECIES',
  'LITERAL LATIN',
  'COMMON NAME',
  'COMMON GENUS NAME',
  'COMMON FAMILY NAME',
  'LIFE-FORM TYPE',
  'GROWTH FORM',
  'GEOGRAPHIC ORIGIN',
  'SPECIFIC LOCATION',
  'GENERAL LOCATION',
  'HEMISPHERE',
  'NOTES',
  'IMAGE'
];

const EMPTY_VALUES = ['', null, undefined, 'NA', 'n/a', 'N/A', '-'];

export const DataComparisonTab: React.FC<DataComparisonTabProps> = () => {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComparisonData = async () => {
      try {
        setIsLoading(true);
        const csvFiles = [
          'enhanced_species_table_ChatGPTAgent.csv',
          'enhanced_species_table_ClaudeCode.csv',
          // 'enhanced_species_table_ogSonnet.csv',
          'enhanced_species_table_SonnetChat.csv'
        ];

        const loadedData: ComparisonData[] = [];

        for (const fileName of csvFiles) {
          try {
            const response = await fetch(`/competingEnrichedData/${fileName}`);
            if (!response.ok) continue;
            
            const csvText = await response.text();
            const parsedData = await parseCSV(csvText);
            
            const shortName = fileName.split('_').pop()?.replace('.csv', '') || fileName;
            
            loadedData.push({
              fileName,
              shortName,
              data: parsedData
            });
          } catch (err) {
            console.error(`Failed to load ${fileName}:`, err);
          }
        }

        setComparisonData(loadedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load comparison data');
      } finally {
        setIsLoading(false);
      }
    };

    loadComparisonData();
  }, []);

  const processColumnData = (column: string): ChartData[] => {
    const chartData: ChartData[] = [];

    comparisonData.forEach(({ shortName, data }) => {
      const columnKey = Object.keys(data[0] || {}).find(
        key => key.toUpperCase() === column.toUpperCase()
      );

      if (!columnKey) return;

      const values = data.map(row => row[columnKey]);
      const uniqueValues = [...new Set(values)].filter(v => v !== undefined);
      const totalCount = values.length;

      const emptyCount = values.filter(v => 
        EMPTY_VALUES.includes(v) || (typeof v === 'string' && v.trim() === '')
      ).length;

      const filledCount = totalCount - emptyCount;

      if (uniqueValues.length <= 10 && uniqueValues.length > 1) {
        const valueCounts: Record<string, number> = {};
        
        values.forEach(value => {
          const normalizedValue = EMPTY_VALUES.includes(value) || (typeof value === 'string' && value.trim() === '') 
            ? 'Empty/NA' 
            : String(value);
          valueCounts[normalizedValue] = (valueCounts[normalizedValue] || 0) + 1;
        });

        const dataPoint: ChartData = { name: shortName };
        Object.entries(valueCounts).forEach(([value, count]) => {
          dataPoint[value] = count;
        });
        
        chartData.push(dataPoint);
      } else {
        chartData.push({
          name: shortName,
          'Empty/NA': emptyCount,
          'Filled': filledCount
        });
      }
    });

    return chartData;
  };

  const getUniqueValues = (column: string): string[] => {
    const allValues: Set<string> = new Set();
    
    comparisonData.forEach(({ data }) => {
      const columnKey = Object.keys(data[0] || {}).find(
        key => key.toUpperCase() === column.toUpperCase()
      );
      
      if (columnKey) {
        data.forEach(row => {
          const value = row[columnKey];
          if (!EMPTY_VALUES.includes(value) && value !== '') {
            allValues.add(String(value));
          }
        });
      }
    });

    return Array.from(allValues).sort();
  };

  const getStackColors = (values: string[]): Record<string, string> => {
    const colors: Record<string, string> = {
      'Empty/NA': '#9CA3AF',
      'Filled': '#10B981'
    };

    const predefinedColors = [
      '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#EF4444',
      '#14B8A6', '#6366F1', '#84CC16', '#F97316', '#06B6D4'
    ];

    values.forEach((value, index) => {
      if (!colors[value]) {
        colors[value] = predefinedColors[index % predefinedColors.length];
      }
    });

    return colors;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="ml-4 text-gray-600">Loading comparison data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-red-600 text-center">
          <p className="font-semibold">Error loading comparison data</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Data Density Comparison</h2>
        <p className="text-gray-600 mb-6">
          Comparing data quality across {comparisonData.length} enriched CSV files. 
          Each chart shows the density of data for a specific column.
        </p>
      </div>

      {COLUMNS_TO_COMPARE.map(column => {
        const chartData = processColumnData(column);
        const uniqueValues = getUniqueValues(column);
        const hasMultipleValues = uniqueValues.length <= 10 && uniqueValues.length > 1;
        const stackValues = hasMultipleValues 
          ? ['Empty/NA', ...uniqueValues]
          : ['Empty/NA', 'Filled'];
        const colors = getStackColors(stackValues);

        return (
          <div key={column} className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{column}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  label={{ value: 'Count', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  formatter={(value: any) => `${Number(value).toLocaleString()}`}
                />
                <Legend />
                {stackValues.map(value => (
                  <Bar
                    key={value}
                    dataKey={value}
                    stackId="a"
                    fill={colors[value]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
            {hasMultipleValues && (
              <p className="text-sm text-gray-600 mt-2">
                Showing distribution of {uniqueValues.length} unique values
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};