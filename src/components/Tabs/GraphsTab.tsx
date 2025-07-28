import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SummaryStatistics } from '@/types';
import { PIE_COLORS, BAR_COLORS } from '@/constants/colors';

interface GraphsTabProps {
  summaryStats: SummaryStatistics;
  hortDevChartData: any[];
  familyByOriginChartData: any[];
}

export const GraphsTab: React.FC<GraphsTabProps> = ({ 
  summaryStats, 
  hortDevChartData, 
  familyByOriginChartData 
}) => {
  return (
    <div className="space-y-6">
      {/* Pie Charts Row */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Conservation Status Distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="70%" height={300}>
              <PieChart>
                <Pie
                  data={summaryStats.conservationChartData || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {(summaryStats.conservationChartData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[30%] pl-4">
              <div className="space-y-2">
                {(summaryStats.conservationChartData || []).map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Status Distribution</h3>
          <div className="flex items-center">
            <ResponsiveContainer width="70%" height={300}>
              <PieChart>
                <Pie
                  data={summaryStats.commercialChartData || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
                >
                  {(summaryStats.commercialChartData || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-[30%] pl-4">
              <div className="space-y-2">
                {(summaryStats.commercialChartData || []).map((entry, index) => (
                  <div key={entry.name} className="flex items-center space-x-2 text-sm">
                    <div 
                      className="w-3 h-3 rounded"
                      style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                    />
                    <span className="text-gray-700">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Charts Row */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Horticultural Development by Growth Habit</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hortDevChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Low" stackId="a" fill="#10b981" />
              <Bar dataKey="Moderate" stackId="a" fill="#059669" />
              <Bar dataKey="High" stackId="a" fill="#047857" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Families by Geographic Origin</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={familyByOriginChartData}>
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
              <Legend />
              {familyByOriginChartData.length > 0 && Object.keys(familyByOriginChartData[0])
                .filter(key => key !== 'name')
                .slice(0, 8) // Limit to 8 origins for readability
                .map((origin, index) => (
                  <Bar 
                    key={origin} 
                    dataKey={origin} 
                    stackId="a" 
                    fill={BAR_COLORS[index % BAR_COLORS.length]} 
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};