import { useMemo } from 'react';
import { PlantSpecies, SummaryStatistics } from '@/types';
import { calculateSummaryStatistics } from '@/utils/dataProcessing';

export const useDataProcessing = (data: PlantSpecies[]) => {
  const summaryStats = useMemo(() => {
    return calculateSummaryStatistics(data);
  }, [data]);

  const hortDevChartData = useMemo(() => {
    const habits = Object.keys(summaryStats.hortDevByGrowthHabit || {});
    const developments = ['Low', 'Moderate', 'High'];
    
    return habits.map(habit => {
      const result: Record<string, any> = { name: habit };
      developments.forEach(dev => {
        result[dev] = summaryStats.hortDevByGrowthHabit[habit][dev] || 0;
      });
      return result;
    });
  }, [summaryStats.hortDevByGrowthHabit]);

  const familyByOriginChartData = useMemo(() => {
    if (!summaryStats.familyByOrigin) return [];
    
    // Get top 9 families by total count
    const familyTotals: Record<string, number> = {};
    Object.entries(summaryStats.familyByOrigin).forEach(([family, origins]) => {
      familyTotals[family] = Object.values(origins).reduce((sum, count) => sum + count, 0);
    });
    
    const topFamilies = Object.entries(familyTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 9)
      .map(([family]) => family);
    
    // Get all unique origins
    const allOrigins = new Set<string>();
    Object.values(summaryStats.familyByOrigin).forEach(origins => {
      Object.keys(origins).forEach(origin => allOrigins.add(origin));
    });
    
    const origins = Array.from(allOrigins).slice(0, 10); // Limit origins for readability
    
    return topFamilies.map(family => {
      const result: Record<string, any> = { name: family };
      origins.forEach(origin => {
        result[origin] = summaryStats.familyByOrigin[family][origin] || 0;
      });
      return result;
    });
  }, [summaryStats.familyByOrigin]);

  return {
    summaryStats,
    hortDevChartData,
    familyByOriginChartData
  };
};