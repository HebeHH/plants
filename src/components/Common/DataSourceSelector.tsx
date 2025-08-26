import React from 'react';

interface DataSource {
  id: string;
  name: string;
  path: string;
}

interface DataSourceSelectorProps {
  selectedSource: string;
  onSourceChange: (sourceId: string) => void;
}

const dataSources: DataSource[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    path: '/competingEnrichedData/enhanced_species_table_ClaudeCode.csv'
  },
  {
    id: 'chatgpt-agent',
    name: 'ChatGPT Agent',
    path: '/competingEnrichedData/enhanced_species_table_ChatGPTAgent.csv'
  },
  {
    id: 'og-sonnet',
    name: 'OG Sonnet',
    path: '/competingEnrichedData/enhanced_species_table_ogSonnet.csv'
  },
  {
    id: 'sonnet-chat',
    name: 'Sonnet Chat',
    path: '/competingEnrichedData/enhanced_species_table_SonnetChat.csv'
  }
];

export const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  selectedSource,
  onSourceChange
}) => {
  return (
    <div className="flex items-center space-x-3">
      <label htmlFor="data-source" className="text-sm font-medium text-gray-700">
        Data Source:
      </label>
      <select
        id="data-source"
        value={selectedSource}
        onChange={(e) => onSourceChange(e.target.value)}
        className="block w-64 px-3 py-2 text-sm bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      >
        {dataSources.map((source) => (
          <option key={source.id} value={source.id}>
            {source.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export { dataSources };