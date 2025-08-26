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

  // Growth form vs Clade
  const growthFormVsCladeData = useMemo(() => {
    const growthFormCladeCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const growthForm = row['GROWTH FORM'];
      const clade = row['CLADE'];
      if (growthForm && clade) {
        if (!growthFormCladeCounts[growthForm]) {
          growthFormCladeCounts[growthForm] = {};
        }
        growthFormCladeCounts[growthForm][clade] = (growthFormCladeCounts[growthForm][clade] || 0) + 1;
      }
    });
    
    const clades = [...new Set(data.map(row => row['CLADE']).filter(Boolean))];
    
    return Object.entries(growthFormCladeCounts).map(([growthForm, cladeCounts]) => {
      const result: Record<string, any> = { name: growthForm };
      clades.forEach(clade => {
        if (clade) {
          result[clade] = cladeCounts[clade] || 0;
        }
      });
      return result;
    });
  }, [data]);

  // Growth habit vs Horticultural development
  const growthHabitVsHortDevData = useMemo(() => {
    const habitDevCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const habit = row['GROWTH HABIT'];
      const dev = row['HORTICULTURAL DEVELOPMENT'];
      if (habit && dev) {
        if (!habitDevCounts[habit]) {
          habitDevCounts[habit] = {};
        }
        habitDevCounts[habit][dev] = (habitDevCounts[habit][dev] || 0) + 1;
      }
    });
    
    return Object.entries(habitDevCounts).map(([habit, devCounts]) => {
      const result: Record<string, any> = { name: habit };
      ['Low', 'Moderate', 'High'].forEach(dev => {
        result[dev] = devCounts[dev] || 0;
      });
      return result;
    });
  }, [data]);

  // Horticultural development vs Commercial status
  const hortDevVsCommercialData = useMemo(() => {
    const devCommercialCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const dev = row['HORTICULTURAL DEVELOPMENT'];
      const commercial = row['COMMERCIAL STATUS'];
      if (dev && commercial) {
        if (!devCommercialCounts[dev]) {
          devCommercialCounts[dev] = {};
        }
        devCommercialCounts[dev][commercial] = (devCommercialCounts[dev][commercial] || 0) + 1;
      }
    });
    
    return Object.entries(devCommercialCounts).map(([dev, commercialCounts]) => {
      const result: Record<string, any> = { name: dev };
      ['None', 'Limited', 'Major'].forEach(status => {
        result[status] = commercialCounts[status] || 0;
      });
      return result;
    });
  }, [data]);

  // Commercial status vs Source (Geographic origin)
  const commercialVsSourceData = useMemo(() => {
    const commercialSourceCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const commercial = row['COMMERCIAL STATUS'];
      const source = row['GENERAL LOCATION'] || row['GEOGRAPHIC ORIGIN'];
      if (commercial && source) {
        if (!commercialSourceCounts[commercial]) {
          commercialSourceCounts[commercial] = {};
        }
        commercialSourceCounts[commercial][source] = (commercialSourceCounts[commercial][source] || 0) + 1;
      }
    });
    
    // Get top 10 sources
    const allSources = new Set<string>();
    Object.values(commercialSourceCounts).forEach(sources => {
      Object.keys(sources).forEach(source => allSources.add(source));
    });
    
    const sourceCountTotals: Record<string, number> = {};
    allSources.forEach(source => {
      sourceCountTotals[source] = Object.values(commercialSourceCounts).reduce((sum, sources) => 
        sum + (sources[source] || 0), 0);
    });
    
    const topSources = Object.entries(sourceCountTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([source]) => source);
    
    return Object.entries(commercialSourceCounts).map(([commercial, sourceCounts]) => {
      const result: Record<string, any> = { name: commercial };
      topSources.forEach(source => {
        result[source] = sourceCounts[source] || 0;
      });
      return result;
    });
  }, [data]);

  // General location bar chart
  const generalLocationData = useMemo(() => {
    const locationCounts: Record<string, number> = {};
    
    data.forEach(row => {
      const location = row['GENERAL LOCATION'] || row['GEOGRAPHIC ORIGIN'];
      if (location) {
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });
    
    const result = Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
    
    return result;
  }, [data]);

  // Growth form vs Life-form type
  const growthFormVsLifeFormData = useMemo(() => {
    const growthFormLifeFormCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const growthForm = row['GROWTH FORM'];
      const lifeForm = row['LIFE-FORM TYPE'];
      if (growthForm && lifeForm) {
        if (!growthFormLifeFormCounts[growthForm]) {
          growthFormLifeFormCounts[growthForm] = {};
        }
        growthFormLifeFormCounts[growthForm][lifeForm] = (growthFormLifeFormCounts[growthForm][lifeForm] || 0) + 1;
      }
    });
    
    const lifeFormTypes = [...new Set(data.map(row => row['LIFE-FORM TYPE']).filter(Boolean))];
    
    return Object.entries(growthFormLifeFormCounts).map(([growthForm, lifeFormCounts]) => {
      const result: Record<string, any> = { name: growthForm };
      lifeFormTypes.forEach(lifeForm => {
        if (lifeForm) {
          result[lifeForm] = lifeFormCounts[lifeForm] || 0;
        }
      });
      return result;
    });
  }, [data]);

  // Hemisphere vs Order
  const hemisphereVsOrderData = useMemo(() => {
    const hemisphereOrderCounts: Record<string, Record<string, number>> = {};
    
    data.forEach(row => {
      const hemisphere = row['HEMISPHERE'];
      const order = row['ORDER'];
      if (hemisphere && order) {
        if (!hemisphereOrderCounts[hemisphere]) {
          hemisphereOrderCounts[hemisphere] = {};
        }
        hemisphereOrderCounts[hemisphere][order] = (hemisphereOrderCounts[hemisphere][order] || 0) + 1;
      }
    });
    
    // Get top 10 orders by total count
    const orderTotals: Record<string, number> = {};
    Object.values(hemisphereOrderCounts).forEach(orders => {
      Object.entries(orders).forEach(([order, count]) => {
        orderTotals[order] = (orderTotals[order] || 0) + count;
      });
    });
    
    const topOrders = Object.entries(orderTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([order]) => order);
    
    return Object.entries(hemisphereOrderCounts).map(([hemisphere, orderCounts]) => {
      const result: Record<string, any> = { name: hemisphere };
      topOrders.forEach(order => {
        result[order] = orderCounts[order] || 0;
      });
      return result;
    });
  }, [data]);

  return {
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
  };
};