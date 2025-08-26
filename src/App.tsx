import React, { useState, useEffect } from 'react';
import { PlantSpecies } from '@/types';
import { Header } from '@/components/Common/Header';
import { TabNavigation, TabType } from '@/components/Common/TabNavigation';
import { DataSourceSelector, dataSources } from '@/components/Common/DataSourceSelector';
import { SummaryTab } from '@/components/Tabs/SummaryTab';
import { GraphsTab } from '@/components/Tabs/GraphsTab';
import { TaxonomyTab } from '@/components/Tabs/TaxonomyTab';
import { TableTab } from '@/components/Tabs/TableTab';
import { DataComparisonTab } from '@/components/Tabs/DataComparisonTab';
import { useDataProcessing } from '@/hooks/useDataProcessing';
import { useFilters } from '@/hooks/useFilters';
import { useSorting } from '@/hooks/useSorting';
import { parseCSV } from '@/utils/csvParser';

function App() {
  const [data, setData] = useState<PlantSpecies[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [selectedSource, setSelectedSource] = useState<string>('sonnet-chat');

  const { summaryStats, hortDevChartData, familyByOriginChartData } = useDataProcessing(data);
  const { filters, filteredData, handleFilterChange, activeFilterCount } = useFilters(data);
  const { sortedData, sortConfig, handleSort } = useSorting(filteredData);

  // Load CSV data when data source changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const source = dataSources.find(s => s.id === selectedSource);
        if (!source) {
          throw new Error('Invalid data source selected');
        }
        const response = await fetch(source.path);
        if (!response.ok) {
          throw new Error('Failed to load species data');
        }
        const csvText = await response.text();
        const parsedData = await parseCSV(csvText);
        setData(parsedData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedSource]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading species data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 text-center mb-2">Error Loading Data</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <Header 
          totalSpecies={data.length} 
          taxonomyValidation={summaryStats.taxonomyValidation}
        />
        
        <div className="mb-6">
          <DataSourceSelector 
            selectedSource={selectedSource}
            onSourceChange={setSelectedSource}
          />
        </div>
        
        <TabNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {activeTab === 'summary' && (
          <SummaryTab summaryStats={summaryStats} />
        )}

        {activeTab === 'graphs' && (
          <GraphsTab 
            summaryStats={summaryStats}
            hortDevChartData={hortDevChartData}
            familyByOriginChartData={familyByOriginChartData}
          />
        )}

        {activeTab === 'taxonomy' && (
          <TaxonomyTab summaryStats={summaryStats} speciesData={data} />
        )}

        {activeTab === 'table' && (
          <TableTab
            data={data}
            sortedData={sortedData}
            filters={filters}
            sortConfig={sortConfig}
            activeFilterCount={activeFilterCount}
            onFilterChange={handleFilterChange}
            onSort={handleSort}
          />
        )}

        {activeTab === 'comparison' && (
          <DataComparisonTab />
        )}
      </div>
    </div>
  );
}

export default App;