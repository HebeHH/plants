export interface PlantSpecies {
  'SPECIES'?: string;
  'GENUS'?: string;
  'FAMILY'?: string;
  'ORDER'?: string;
  'CLADE'?: string;
  'GROWTH FORM'?: string;
  'GEOGRAPHIC ORIGIN'?: string;
  'GENERAL LOCATION'?: string;
  'GROWTH HABIT'?: string;
  'HORTICULTURAL DEVELOPMENT'?: string;
  'COMMERCIAL STATUS'?: string;
  'CONSERVATION STATUS'?: string;
  'HEMISPHERE'?: string;
  'LIFE-FORM TYPE'?: string;
  [key: string]: string | undefined;
}

export type GrowthForm = 'Tree' | 'Herb' | 'Shrub' | 'Vine';
export type GrowthHabit = 'Wild' | 'Cultivated' | 'Both';
export type HorticulturalDevelopment = 'Low' | 'Moderate' | 'High';
export type CommercialStatus = 'None' | 'Limited' | 'Major';
export type ConservationStatus = 'Widespread/Common' | 'Locally common' | 'Uncommon' | 'Rare' | 'Very rare/Endangered';

export interface EnumFields {
  'GROWTH FORM': GrowthForm[];
  'GEOGRAPHIC ORIGIN': string[];
  'GROWTH HABIT': GrowthHabit[];
  'HORTICULTURAL DEVELOPMENT': HorticulturalDevelopment[];
  'COMMERCIAL STATUS': CommercialStatus[];
  'CONSERVATION STATUS': ConservationStatus[];
}

export interface Filters {
  [column: string]: string | string[] | undefined;
}

export interface SortConfig {
  key: string | null;
  direction: 'asc' | 'desc';
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TreemapDataPoint extends ChartDataPoint {
  order?: string;
}

export interface SunburstNode {
  name: string;
  value: number;
  children?: SunburstNode[];
}

export interface TaxonomyValidation {
  totalRecords: number;
  missingData: {
    clade: number;
    order: number;
    family: number;
    genus: number;
    species: number;
  };
  completeRecords: number;
  hierarchyViolations: HierarchyViolation[];
  isValid: boolean;
}

export interface HierarchyViolation {
  type: string;
  item: string;
  issue: string;
  level: string;
}

export interface SummaryStatistics {
  totalSpecies: number;
  growthFormCounts: Record<string, number>;
  topGeographic: [string, number][];
  commercialCounts: Record<string, number>;
  conservationConcern: number;
  humanInfluence: number;
  conservationChartData: ChartDataPoint[];
  commercialChartData: ChartDataPoint[];
  hortDevByGrowthHabit: Record<string, Record<string, number>>;
  familyByOrigin: Record<string, Record<string, number>>;
  taxonomicDataCount: number;
  sunburstData: SunburstNode[];
  sunburstHierarchy: SunburstNode[];
  treemapData: TreemapDataPoint[];
  orderDistributionData: ChartDataPoint[];
  cladeCounts: Record<string, number>;
  taxonomyValidation: TaxonomyValidation;
}