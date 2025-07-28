import React from 'react';
import { TrendingUp, Target, GitBranch, Table } from 'lucide-react';

export type TabType = 'summary' | 'graphs' | 'taxonomy' | 'table';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: 'summary' as TabType, label: 'Summary', icon: TrendingUp },
  { id: 'graphs' as TabType, label: 'Graphs', icon: Target },
  { id: 'taxonomy' as TabType, label: 'Taxonomy', icon: GitBranch },
  { id: 'table' as TabType, label: 'Data Table', icon: Table },
];

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </div>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};