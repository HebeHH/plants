import { ChartDataPoint } from '@/types';

export const getTopNWithOthers = (counts: Record<string, number>, n: number = 9): ChartDataPoint[] => {
  const sorted = Object.entries(counts).sort(([,a], [,b]) => b - a);
  const topN = sorted.slice(0, n);
  const others = sorted.slice(n);
  
  const result = topN.map(([name, value]) => ({ name, value }));
  
  if (others.length > 0) {
    const otherSum = others.reduce((sum, [,value]) => sum + value, 0);
    result.push({ name: 'Other', value: otherSum });
  }
  
  return result;
};

export const getUniqueValues = (data: any[], columnName: string): string[] => {
  const values = data.map(row => row[columnName]).filter(Boolean);
  return [...new Set(values)].sort();
};