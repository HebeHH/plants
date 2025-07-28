import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap } from 'recharts';
import { SummaryStatistics } from '@/types';
import { SunburstChart } from '@/components/Charts/SunburstChart';
import { PIE_COLORS, BAR_COLORS } from '@/constants/colors';

interface TaxonomyTabProps {
  summaryStats: SummaryStatistics;
}

export const TaxonomyTab: React.FC<TaxonomyTabProps> = ({ summaryStats }) => {
  return (
    <div className="space-y-6">
      {/* Taxonomy Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomic Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {Object.keys(summaryStats.cladeCounts || {}).length}
            </div>
            <div className="text-sm text-gray-600">Clades</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaryStats.orderDistributionData?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaryStats.treemapData?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Top Families</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {summaryStats.taxonomicDataCount || 0}
            </div>
            <div className="text-sm text-gray-600">Complete Records</div>
          </div>
        </div>
      </div>

      {/* Hierarchical Sunburst Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomic Hierarchy Sunburst</h3>
        <p className="text-sm text-gray-600 mb-4">
          Interactive hierarchical view: Clade (inner) → Order → Family → Genus (outer). Scroll to zoom, drag to pan.
        </p>
        <SunburstChart 
          data={summaryStats.sunburstHierarchy || []} 
          width={1000} 
          height={700} 
        />
      </div>

      {/* Order Distribution Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Species Distribution by Order</h3>
        <div className="flex items-center">
          <ResponsiveContainer width="70%" height={400}>
            <PieChart>
              <Pie
                data={summaryStats.orderDistributionData || []}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => percent > 0.05 ? `${name} (${(percent * 100).toFixed(1)}%)` : ''}
                labelLine={false}
              >
                {(summaryStats.orderDistributionData || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="w-[30%] pl-4">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(summaryStats.orderDistributionData || []).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                  <span className="font-medium">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Family Treemap */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top 20 Families by Species Count</h3>
        <ResponsiveContainer width="100%" height={400}>
          <Treemap
            data={summaryStats.treemapData || []}
            dataKey="value"
            aspectRatio={4/3}
            stroke="#fff"
          >
            {summaryStats.treemapData?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
            ))}
          </Treemap>
        </ResponsiveContainer>
      </div>

      {/* Clade Distribution Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Species Distribution by Clade</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={Object.entries(summaryStats.cladeCounts || {}).map(([name, value]) => ({ name, value }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              fontSize={12}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981">
              {Object.entries(summaryStats.cladeCounts || {}).map((entry, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};