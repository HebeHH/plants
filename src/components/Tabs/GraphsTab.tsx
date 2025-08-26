import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { SummaryStatistics } from '@/types';
import { PIE_COLORS, BAR_COLORS } from '@/constants/colors';

interface GraphsTabProps {
  summaryStats: SummaryStatistics;
  hortDevChartData: any[];
  familyByOriginChartData: any[];
  growthFormVsCladeData: any[];
  growthHabitVsHortDevData: any[];
  hortDevVsCommercialData: any[];
  commercialVsSourceData: any[];
  generalLocationData: any[];
  growthFormVsLifeFormData: any[];
  hemisphereVsOrderData: any[];
}

export const GraphsTab: React.FC<GraphsTabProps> = ({ 
  summaryStats, 
  hortDevChartData, 
  familyByOriginChartData,
  growthFormVsCladeData,
  growthHabitVsHortDevData,
  hortDevVsCommercialData,
  commercialVsSourceData,
  generalLocationData,
  growthFormVsLifeFormData,
  hemisphereVsOrderData
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Form vs Clade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthFormVsCladeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(growthFormVsCladeData[0] || {}).filter(key => key !== 'name').map((clade, index) => (
                <Bar key={clade} dataKey={clade} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Row 2 */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Habit vs Horticultural Development</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthHabitVsHortDevData}>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Horticultural Development vs Commercial Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hortDevVsCommercialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="None" stackId="a" fill="#fbbf24" />
              <Bar dataKey="Limited" stackId="a" fill="#f59e0b" />
              <Bar dataKey="Major" stackId="a" fill="#d97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Row 3 */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Commercial Status vs Source (Geographic Origin)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={commercialVsSourceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(commercialVsSourceData[0] || {}).filter(key => key !== 'name').map((source, index) => (
                <Bar key={source} dataKey={source} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Geographic Origin Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generalLocationData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Row 4 */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Growth Form vs Life-form Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={growthFormVsLifeFormData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(growthFormVsLifeFormData[0] || {}).filter(key => key !== 'name').map((lifeForm, index) => (
                <Bar key={lifeForm} dataKey={lifeForm} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 min-w-[500px] flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hemisphere vs Order</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hemisphereVsOrderData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(hemisphereVsOrderData[0] || {}).filter(key => key !== 'name').map((order, index) => (
                <Bar key={order} dataKey={order} stackId="a" fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};