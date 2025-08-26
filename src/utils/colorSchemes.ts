import { PlantSpecies } from '@/types';

export interface ColorScheme {
  [key: string]: string;
}

// Color palettes for different attributes
const COLOR_PALETTES = {
  default: [
    '#059669', // emerald-600
    '#3b82f6', // blue-500
    '#8b5cf6', // violet-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#10b981', // green-500
  ],
  conservation: {
    'Widespread/Common': '#059669',
    'Locally common': '#10b981',
    'Uncommon': '#fbbf24',
    'Rare': '#f97316',
    'Very rare/Endangered': '#dc2626',
  },
  commercial: {
    'Major': '#059669',
    'Limited': '#3b82f6',
    'None': '#94a3b8',
  },
  hortDev: {
    'High': '#059669',
    'Moderate': '#3b82f6',
    'Low': '#94a3b8',
  },
  growthHabit: {
    'Cultivated': '#059669',
    'Wild': '#3b82f6',
    'Both': '#8b5cf6',
  },
  growthForm: {
    'tree': '#059669',
    'shrub': '#3b82f6',
    'herb': '#8b5cf6',
    'vine': '#f59e0b',
    'other': '#6b7280',
    'unknown': '#d1d5db',
  }
};

const UNKNOWN_COLOR = '#d1d5db'; // gray-300
const OTHER_COLOR = '#6b7280'; // gray-500

// Check if a value represents unknown/empty
const isUnknown = (value: string | undefined): boolean => {
  if (!value) return true;
  const normalized = value.toLowerCase().trim();
  return normalized === '' || normalized === '-' || normalized === 'unknown' || normalized === 'n/a' || normalized === 'null';
};

// Get top N values by count
const getTopValues = (values: string[], n: number = 8): { topValues: string[], counts: Map<string, number> } => {
  const counts = new Map<string, number>();
  
  values.forEach(value => {
    if (!isUnknown(value)) {
      counts.set(value, (counts.get(value) || 0) + 1);
    }
  });
  
  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, n);
  
  return {
    topValues: sorted.map(([value]) => value),
    counts
  };
};

// Create color mapping for a given attribute
export const createColorMapping = (
  data: PlantSpecies[],
  attribute: string,
  colorBy: string
): ColorScheme => {
  const colorScheme: ColorScheme = {};
  
  // Handle special cases with predefined color schemes
  if (colorBy === 'conservation' && attribute === 'CONSERVATION STATUS' && COLOR_PALETTES.conservation) {
    Object.entries(COLOR_PALETTES.conservation).forEach(([status, color]) => {
      colorScheme[status] = color;
    });
  } else if (colorBy === 'commercial' && attribute === 'COMMERCIAL STATUS' && COLOR_PALETTES.commercial) {
    Object.entries(COLOR_PALETTES.commercial).forEach(([status, color]) => {
      colorScheme[status] = color;
    });
  } else if (colorBy === 'horticultural' && attribute === 'HORTICULTURAL DEVELOPMENT' && COLOR_PALETTES.hortDev) {
    Object.entries(COLOR_PALETTES.hortDev).forEach(([level, color]) => {
      colorScheme[level] = color;
    });
  } else if (colorBy === 'growthHabit' && attribute === 'GROWTH HABIT' && COLOR_PALETTES.growthHabit) {
    Object.entries(COLOR_PALETTES.growthHabit).forEach(([habit, color]) => {
      colorScheme[habit] = color;
    });
  } else if (colorBy === 'growthForm' && attribute === 'GROWTH FORM' && COLOR_PALETTES.growthForm) {
    Object.entries(COLOR_PALETTES.growthForm).forEach(([form, color]) => {
      colorScheme[form] = color;
    });
  } else {
    // Generic color assignment for top 8 values
    const values = data.map(d => d[attribute] || '');
    const { topValues } = getTopValues(values);
    
    topValues.forEach((value, index) => {
      colorScheme[value] = COLOR_PALETTES.default[index % COLOR_PALETTES.default.length];
    });
  }
  
  return colorScheme;
};

// Get color for a specific value
export const getColorForValue = (
  value: string | undefined,
  colorScheme: ColorScheme
): string => {
  if (isUnknown(value)) {
    return UNKNOWN_COLOR;
  }
  
  return colorScheme[value || ''] || OTHER_COLOR;
};

// Color by options configuration
export const COLOR_BY_OPTIONS = [
  { value: 'clade', label: 'Clade', attribute: 'CLADE' },
  { value: 'lifeForm', label: 'Life Form Type', attribute: 'LIFE FORM' },
  { value: 'growthForm', label: 'Growth Form', attribute: 'GROWTH FORM' },
  { value: 'location', label: 'General Location', attribute: 'GEOGRAPHIC ORIGIN' },
  { value: 'growthHabit', label: 'Growth Habit', attribute: 'GROWTH HABIT' },
  { value: 'horticultural', label: 'Horticultural Development', attribute: 'HORTICULTURAL DEVELOPMENT' },
  { value: 'commercial', label: 'Commercial Status', attribute: 'COMMERCIAL STATUS' },
  { value: 'conservation', label: 'Conservation Status', attribute: 'CONSERVATION STATUS' },
  { value: 'source', label: 'Source', attribute: 'SOURCE' },
];