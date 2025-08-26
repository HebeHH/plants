import { PlantSpecies, SummaryStatistics, TaxonomyValidation, HierarchyViolation, SunburstNode } from '@/types';
import { getTopNWithOthers } from './chartHelpers';

export const calculateSummaryStatistics = (data: PlantSpecies[]): SummaryStatistics => {
  if (!data.length) {
    return {
      totalSpecies: 0,
      growthFormCounts: {},
      topGeographic: [],
      commercialCounts: {},
      conservationConcern: 0,
      humanInfluence: 0,
      conservationChartData: [],
      commercialChartData: [],
      hortDevByGrowthHabit: {},
      familyByOrigin: {},
      taxonomicDataCount: 0,
      sunburstData: [],
      sunburstHierarchy: [],
      treemapData: [],
      orderDistributionData: [],
      cladeCounts: {},
      taxonomyValidation: {
        totalRecords: 0,
        missingData: { clade: 0, order: 0, family: 0, genus: 0, species: 0 },
        completeRecords: 0,
        hierarchyViolations: [],
        isValid: true
      }
    };
  }

  // Count by growth form
  const growthFormCounts: Record<string, number> = {};
  data.forEach(row => {
    const form = row['GROWTH FORM'];
    if (form) growthFormCounts[form] = (growthFormCounts[form] || 0) + 1;
  });

  // Count by geographic origin (top 5)
  const geographicCounts: Record<string, number> = {};
  data.forEach(row => {
    const origin = row['GENERAL LOCATION'] || row['GEOGRAPHIC ORIGIN'];
    if (origin) geographicCounts[origin] = (geographicCounts[origin] || 0) + 1;
  });

  // Commercial status breakdown
  const commercialCounts: Record<string, number> = {};
  data.forEach(row => {
    const status = row['COMMERCIAL STATUS'];
    if (status) commercialCounts[status] = (commercialCounts[status] || 0) + 1;
  });

  // Conservation status counts
  const conservationCounts: Record<string, number> = {};
  data.forEach(row => {
    const status = row['CONSERVATION STATUS'];
    if (status) conservationCounts[status] = (conservationCounts[status] || 0) + 1;
  });

  // Conservation concern count
  const conservationConcern = data.filter(row => 
    ['Rare', 'Very rare/Endangered'].includes(row['CONSERVATION STATUS'] || '')
  ).length;

  // Human influence
  const cultivatedCount = data.filter(row => 
    ['Cultivated', 'Both'].includes(row['GROWTH HABIT'] || '')
  ).length;

  // Horticultural development by growth habit
  const hortDevByGrowthHabit: Record<string, Record<string, number>> = {};
  data.forEach(row => {
    const habit = row['GROWTH HABIT'];
    const development = row['HORTICULTURAL DEVELOPMENT'];
    if (habit && development) {
      if (!hortDevByGrowthHabit[habit]) {
        hortDevByGrowthHabit[habit] = {};
      }
      hortDevByGrowthHabit[habit][development] = (hortDevByGrowthHabit[habit][development] || 0) + 1;
    }
  });

  // Family by geographic origin
  const familyByOrigin: Record<string, Record<string, number>> = {};
  data.forEach(row => {
    const family = row['FAMILY'];
    const origin = row['GENERAL LOCATION'] || row['GEOGRAPHIC ORIGIN'];
    if (family && origin) {
      if (!familyByOrigin[family]) {
        familyByOrigin[family] = {};
      }
      familyByOrigin[family][origin] = (familyByOrigin[family][origin] || 0) + 1;
    }
  });

  // Taxonomic data processing
  const validTaxonomicData = data.filter(row => {
    return row['CLADE'] && row['ORDER'] && row['FAMILY'] && row['GENUS'];
  });

  // Build proper hierarchical structure for sunburst
  const hierarchyBuilder: Record<string, Record<string, Record<string, Record<string, number>>>> = {};
  
  validTaxonomicData.forEach(row => {
    const clade = row['CLADE']!;
    const order = row['ORDER']!;
    const family = row['FAMILY']!;
    const genus = row['GENUS']!;
    
    if (!hierarchyBuilder[clade]) {
      hierarchyBuilder[clade] = {};
    }
    if (!hierarchyBuilder[clade][order]) {
      hierarchyBuilder[clade][order] = {};
    }
    if (!hierarchyBuilder[clade][order][family]) {
      hierarchyBuilder[clade][order][family] = {};
    }
    if (!hierarchyBuilder[clade][order][family][genus]) {
      hierarchyBuilder[clade][order][family][genus] = 0;
    }
    hierarchyBuilder[clade][order][family][genus]++;
  });

  // Convert to sunburst format
  const sunburstHierarchy = Object.entries(hierarchyBuilder).map(([clade, orders]) => {
    const cladeNode: SunburstNode = {
      name: clade,
      children: [],
      value: 0
    };

    Object.entries(orders).forEach(([order, families]) => {
      const orderNode: SunburstNode = {
        name: order,
        children: [],
        value: 0
      };

      Object.entries(families).forEach(([family, genera]) => {
        const familyNode: SunburstNode = {
          name: family,
          children: [],
          value: 0
        };

        Object.entries(genera).forEach(([genus, count]) => {
          const genusNode: SunburstNode = {
            name: genus,
            value: count
          };
          familyNode.children!.push(genusNode);
          familyNode.value += count;
        });

        orderNode.children!.push(familyNode);
        orderNode.value += familyNode.value;
      });

      cladeNode.children!.push(orderNode);
      cladeNode.value += orderNode.value;
    });

    return cladeNode;
  }).sort((a, b) => b.value - a.value);

  // Count by clade
  const cladeCounts: Record<string, number> = {};
  validTaxonomicData.forEach(row => {
    const clade = row['CLADE'];
    if (clade) cladeCounts[clade] = (cladeCounts[clade] || 0) + 1;
  });

  // Count by order
  const orderCounts: Record<string, number> = {};
  validTaxonomicData.forEach(row => {
    const order = row['ORDER'];
    if (order) orderCounts[order] = (orderCounts[order] || 0) + 1;
  });

  // Create treemap data for top families
  const familyTotals: Record<string, number> = {};
  validTaxonomicData.forEach(row => {
    const family = row['FAMILY'];
    if (family) {
      familyTotals[family] = (familyTotals[family] || 0) + 1;
    }
  });

  const treemapData = Object.entries(familyTotals)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 20)
    .map(([family, count]) => ({
      name: family,
      value: count,
      order: validTaxonomicData.find(row => row['FAMILY'] === family)?.['ORDER'] || 'Unknown'
    }));

  // Taxonomy validation
  const taxonomyValidation = validateTaxonomy(data);

  return {
    totalSpecies: data.length,
    growthFormCounts,
    topGeographic: Object.entries(geographicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5),
    commercialCounts,
    conservationConcern,
    humanInfluence: Math.round((cultivatedCount / data.length) * 100),
    conservationChartData: getTopNWithOthers(conservationCounts),
    commercialChartData: getTopNWithOthers(commercialCounts),
    hortDevByGrowthHabit,
    familyByOrigin,
    taxonomicDataCount: validTaxonomicData.length,
    sunburstData: [], // Legacy, keeping for compatibility
    sunburstHierarchy,
    treemapData,
    orderDistributionData: getTopNWithOthers(orderCounts, 12),
    cladeCounts,
    taxonomyValidation
  };
};

export const validateTaxonomy = (data: PlantSpecies[]): TaxonomyValidation => {
  const validation: TaxonomyValidation = {
    totalRecords: data.length,
    missingData: {
      clade: data.filter(row => !row['CLADE']).length,
      order: data.filter(row => !row['ORDER']).length,
      family: data.filter(row => !row['FAMILY']).length,
      genus: data.filter(row => !row['GENUS']).length,
      species: data.filter(row => !row['SPECIES']).length
    },
    completeRecords: data.filter(row => 
      row['CLADE'] && row['ORDER'] && row['FAMILY'] && row['GENUS']
    ).length,
    hierarchyViolations: [],
    isValid: true
  };

  // Check hierarchy consistency
  const hierarchyChecks = {
    speciesGenusCheck: {} as Record<string, Set<string>>,
    genusFamilyCheck: {} as Record<string, Set<string>>,
    familyOrderCheck: {} as Record<string, Set<string>>,
    orderCladeCheck: {} as Record<string, Set<string>>
  };

  // Collect relationships
  data.forEach((row) => {
    const species = row['SPECIES'];
    const genus = row['GENUS'];
    const family = row['FAMILY'];
    const order = row['ORDER'];
    const clade = row['CLADE'];

    if (species && genus) {
      if (!hierarchyChecks.speciesGenusCheck[species]) {
        hierarchyChecks.speciesGenusCheck[species] = new Set();
      }
      hierarchyChecks.speciesGenusCheck[species].add(genus);
    }

    if (genus && family) {
      if (!hierarchyChecks.genusFamilyCheck[genus]) {
        hierarchyChecks.genusFamilyCheck[genus] = new Set();
      }
      hierarchyChecks.genusFamilyCheck[genus].add(family);
    }

    if (family && order) {
      if (!hierarchyChecks.familyOrderCheck[family]) {
        hierarchyChecks.familyOrderCheck[family] = new Set();
      }
      hierarchyChecks.familyOrderCheck[family].add(order);
    }

    if (order && clade) {
      if (!hierarchyChecks.orderCladeCheck[order]) {
        hierarchyChecks.orderCladeCheck[order] = new Set();
      }
      hierarchyChecks.orderCladeCheck[order].add(clade);
    }
  });

  // Check for violations
  Object.entries(hierarchyChecks.speciesGenusCheck).forEach(([species, genera]) => {
    if (genera.size > 1) {
      validation.hierarchyViolations.push({
        type: 'Species → Genus',
        item: species,
        issue: `Species "${species}" appears in multiple genera: ${Array.from(genera).join(', ')}`,
        level: 'species'
      });
    }
  });

  Object.entries(hierarchyChecks.genusFamilyCheck).forEach(([genus, families]) => {
    if (families.size > 1) {
      validation.hierarchyViolations.push({
        type: 'Genus → Family',
        item: genus,
        issue: `Genus "${genus}" appears in multiple families: ${Array.from(families).join(', ')}`,
        level: 'genus'
      });
    }
  });

  Object.entries(hierarchyChecks.familyOrderCheck).forEach(([family, orders]) => {
    if (orders.size > 1) {
      validation.hierarchyViolations.push({
        type: 'Family → Order',
        item: family,
        issue: `Family "${family}" appears in multiple orders: ${Array.from(orders).join(', ')}`,
        level: 'family'
      });
    }
  });

  Object.entries(hierarchyChecks.orderCladeCheck).forEach(([order, clades]) => {
    if (clades.size > 1) {
      validation.hierarchyViolations.push({
        type: 'Order → Clade',
        item: order,
        issue: `Order "${order}" appears in multiple clades: ${Array.from(clades).join(', ')}`,
        level: 'order'
      });
    }
  });

  validation.isValid = validation.hierarchyViolations.length === 0;

  return validation;
};