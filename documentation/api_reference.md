# API Reference

This document provides detailed information about the hooks, utilities, and key functions in the Plant Species Dashboard.

## Table of Contents
- [Hooks](#hooks)
- [Utilities](#utilities)
- [Types](#types)
- [Constants](#constants)

## Hooks

### `useDataProcessing`

Processes raw plant species data and calculates comprehensive statistics.

**Location**: `/src/hooks/useDataProcessing.ts`

**Usage**:
```tsx
const { summaryStats, hortDevChartData, familyByOriginChartData } = useDataProcessing(data);
```

**Parameters**:
- `data: PlantSpecies[]` - Raw CSV data array

**Returns**:
- `summaryStats: SummaryStatistics` - Comprehensive statistics object containing:
  - `totalSpecies: number`
  - `growthFormCounts: Record<string, number>`
  - `topGeographic: [string, number][]`
  - `commercialCounts: Record<string, number>`
  - `conservationConcern: number`
  - `humanInfluence: number` (percentage)
  - `conservationChartData: ChartDataPoint[]`
  - `commercialChartData: ChartDataPoint[]`
  - `hortDevByGrowthHabit: Record<string, Record<string, number>>`
  - `familyByOrigin: Record<string, Record<string, number>>`
  - `taxonomicDataCount: number`
  - `sunburstHierarchy: SunburstNode[]`
  - `treemapData: TreemapDataPoint[]`
  - `orderDistributionData: ChartDataPoint[]`
  - `cladeCounts: Record<string, number>`
  - `taxonomyValidation: TaxonomyValidation`
- `hortDevChartData: any[]` - Formatted data for horticultural development chart
- `familyByOriginChartData: any[]` - Formatted data for family by origin chart

**Notes**:
- Heavy calculations are memoized for performance
- Handles empty data gracefully
- Validates taxonomic hierarchy automatically

### `useFilters`

Manages filter state and provides filtered data based on user selections.

**Location**: `/src/hooks/useFilters.ts`

**Usage**:
```tsx
const { 
  filters, 
  filteredData, 
  handleFilterChange, 
  clearFilters, 
  activeFilterCount 
} = useFilters(data);
```

**Parameters**:
- `data: PlantSpecies[]` - Original data to filter

**Returns**:
- `filters: Filters` - Current filter state object
- `filteredData: PlantSpecies[]` - Data after applying filters
- `handleFilterChange: (column: string, value: string | string[], isMultiSelect?: boolean) => void`
- `clearFilters: () => void` - Reset all filters
- `activeFilterCount: number` - Number of active filters

**Filter Behavior**:
- Text filters: Case-insensitive substring match
- Multi-select filters: OR logic (matches any selected value)
- Multiple filters: AND logic (must match all filters)

### `useSorting`

Provides sorting functionality for tabular data.

**Location**: `/src/hooks/useSorting.ts`

**Usage**:
```tsx
const { sortedData, sortConfig, handleSort } = useSorting(data);
```

**Parameters**:
- `data: T[]` - Array of objects to sort

**Returns**:
- `sortedData: T[]` - Sorted array
- `sortConfig: SortConfig` - Current sort configuration
  - `key: string | null` - Column being sorted
  - `direction: 'asc' | 'desc'` - Sort direction
- `handleSort: (column: string) => void` - Toggle sort for column

**Notes**:
- Clicking same column toggles between asc/desc
- Handles null/undefined values (treated as empty strings)
- Generic implementation works with any object type

## Utilities

### `parseCSV`

Parses CSV string into structured plant species data.

**Location**: `/src/utils/csvParser.ts`

**Usage**:
```tsx
const data = await parseCSV(csvInput);
```

**Parameters**:
- `csvInput: string` - Raw CSV string

**Returns**:
- `Promise<PlantSpecies[]>` - Parsed and cleaned data

**Features**:
- Trims whitespace from headers
- Skips empty lines
- Preserves all columns from CSV
- Error handling with rejected promise

### `calculateSummaryStatistics`

Core data processing function that generates all statistics from raw data.

**Location**: `/src/utils/dataProcessing.ts`

**Usage**:
```tsx
const stats = calculateSummaryStatistics(data);
```

**Parameters**:
- `data: PlantSpecies[]` - Raw plant species data

**Returns**:
- `SummaryStatistics` - Complete statistics object (see `useDataProcessing` return type)

**Processing Steps**:
1. Counts by categories (growth form, origin, status)
2. Calculates conservation metrics
3. Builds taxonomic hierarchy
4. Validates taxonomy relationships
5. Formats data for various chart types

### `validateTaxonomy`

Validates taxonomic hierarchy for consistency.

**Location**: `/src/utils/dataProcessing.ts`

**Usage**:
```tsx
const validation = validateTaxonomy(data);
```

**Parameters**:
- `data: PlantSpecies[]` - Data to validate

**Returns**:
- `TaxonomyValidation` object containing:
  - `totalRecords: number`
  - `missingData: { clade, order, family, genus, species: number }`
  - `completeRecords: number`
  - `hierarchyViolations: HierarchyViolation[]`
  - `isValid: boolean`

**Validation Rules**:
- Each species belongs to exactly one genus
- Each genus belongs to exactly one family
- Each family belongs to exactly one order
- Each order belongs to exactly one clade

### `getTopNWithOthers`

Groups data by showing top N items and bucketing rest as "Other".

**Location**: `/src/utils/chartHelpers.ts`

**Usage**:
```tsx
const chartData = getTopNWithOthers(counts, 9);
```

**Parameters**:
- `counts: Record<string, number>` - Object with counts by category
- `n: number = 9` - Number of top items to show

**Returns**:
- `ChartDataPoint[]` - Array of `{ name, value }` objects

### `getUniqueValues`

Extracts unique values from a data column.

**Location**: `/src/utils/chartHelpers.ts`

**Usage**:
```tsx
const uniqueOrigins = getUniqueValues(data, 'GEOGRAPHIC ORIGIN');
```

**Parameters**:
- `data: any[]` - Data array
- `columnName: string` - Column to extract from

**Returns**:
- `string[]` - Sorted array of unique values

## Types

### Core Data Types

```tsx
interface PlantSpecies {
  'SPECIES'?: string;
  'GENUS'?: string;
  'FAMILY'?: string;
  'ORDER'?: string;
  'CLADE'?: string;
  'GROWTH FORM'?: string;
  'GEOGRAPHIC ORIGIN'?: string;
  'GROWTH HABIT'?: string;
  'HORTICULTURAL DEVELOPMENT'?: string;
  'COMMERCIAL STATUS'?: string;
  'CONSERVATION STATUS'?: string;
  [key: string]: string | undefined;
}

interface SummaryStatistics {
  totalSpecies: number;
  growthFormCounts: Record<string, number>;
  topGeographic: [string, number][];
  commercialCounts: Record<string, number>;
  conservationConcern: number;
  humanInfluence: number;
  // ... additional fields
}
```

### Chart Data Types

```tsx
interface ChartDataPoint {
  name: string;
  value: number;
}

interface TreemapDataPoint extends ChartDataPoint {
  order?: string;
}

interface SunburstNode {
  name: string;
  value: number;
  children?: SunburstNode[];
}
```

### Validation Types

```tsx
interface TaxonomyValidation {
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

interface HierarchyViolation {
  type: string;      // e.g., "Species → Genus"
  item: string;      // The item with violations
  issue: string;     // Description of the violation
  level: string;     // Taxonomic level
}
```

## Constants

### `enumFields`

Defines valid values for categorical fields.

**Location**: `/src/constants/enumFields.ts`

```tsx
const enumFields = {
  'GROWTH FORM': ['Tree', 'Herb', 'Shrub', 'Vine'],
  'GEOGRAPHIC ORIGIN': ['Europe', 'Asia', /* ... */],
  'GROWTH HABIT': ['Wild', 'Cultivated', 'Both'],
  'HORTICULTURAL DEVELOPMENT': ['Low', 'Moderate', 'High'],
  'COMMERCIAL STATUS': ['None', 'Limited', 'Major'],
  'CONSERVATION STATUS': ['Widespread/Common', /* ... */]
};
```

### Color Schemes

**Location**: `/src/constants/colors.ts`

```tsx
// For pie charts and categorical data
const PIE_COLORS = [
  '#059669', '#dc2626', '#2563eb', '#7c2d12', '#9333ea', 
  '#0891b2', '#ea580c', '#4338ca', '#be123c', '#166534'
];

// For bar charts and sequential data
const BAR_COLORS = [
  '#10b981', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#6366f1', '#ec4899', '#84cc16',
  '#f43f5e', '#14b8a6', '#a855f7', '#22c55e', '#eab308'
];
```

---

## Usage Examples

### Complete Data Processing Flow

```tsx
// 1. Parse CSV
const rawData = await parseCSV(csvString);

// 2. Process data in component
const { summaryStats } = useDataProcessing(rawData);

// 3. Apply filters
const { filteredData, handleFilterChange } = useFilters(rawData);

// 4. Sort for table display
const { sortedData, handleSort } = useSorting(filteredData);

// 5. Display in components
<SummaryTab summaryStats={summaryStats} />
<TableTab data={sortedData} onSort={handleSort} />
```

### Adding Custom Data Processing

```tsx
// In useDataProcessing or dataProcessing.ts
const customMetric = useMemo(() => {
  return data.reduce((acc, species) => {
    // Custom calculation
    return acc;
  }, 0);
}, [data]);
```

### Creating Filtered Views

```tsx
// Pre-filter for specific view
const endangeredSpecies = useMemo(() => {
  return data.filter(species => 
    species['CONSERVATION STATUS'] === 'Very rare/Endangered'
  );
}, [data]);
```