import React from 'react';
import { BarChart3, TreePine, Users, Globe } from 'lucide-react';
import { StatCard } from '@/components/Common/StatCard';
import { SummaryStatistics } from '@/types';

interface SummaryTabProps {
  summaryStats: SummaryStatistics;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ summaryStats }) => {
  return (
    <>
      <div className="flex flex-wrap gap-4 mb-6">
        <StatCard
          icon={BarChart3}
          title="Total Species"
          value={summaryStats.totalSpecies?.toLocaleString()}
        />
        
        <StatCard
          icon={TreePine}
          title="Trees"
          value={summaryStats.growthFormCounts?.Tree || 0}
          subtitle={`${Math.round(((summaryStats.growthFormCounts?.Tree || 0) / summaryStats.totalSpecies) * 100)}% of total`}
        />
        
        <StatCard
          icon={Users}
          title="Human Influence"
          value={`${summaryStats.humanInfluence}%`}
          subtitle="Cultivated or both"
        />
        
        <StatCard
          icon={Globe}
          title="Conservation Concern"
          value={summaryStats.conservationConcern}
          subtitle="Rare/Endangered species"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Form Distribution</h3>
          <div className="space-y-2">
            {Object.entries(summaryStats.growthFormCounts || {}).map(([form, count]) => (
              <div key={form} className="flex justify-between items-center">
                <span className="text-gray-600">{form}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Geographic Origins</h3>
          <div className="space-y-2">
            {(summaryStats.topGeographic || []).map(([origin, count]) => (
              <div key={origin} className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{origin}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[320px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Status</h3>
          <div className="space-y-2">
            {Object.entries(summaryStats.commercialCounts || {}).map(([status, count]) => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600">{status}</span>
                <span className="font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};