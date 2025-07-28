# Style Guide

## Code Style

### TypeScript

#### Interfaces vs Types
- Use `interface` for object shapes that might be extended
- Use `type` for unions, intersections, and aliases

```tsx
// ✅ Good - extendable object shape
interface PlantSpecies {
  genus: string;
  species: string;
}

// ✅ Good - union type
type ViewType = 'upload' | 'dashboard';

// ❌ Bad - using type for simple object
type PlantSpecies = {
  genus: string;
  species: string;
};
```

#### Type Annotations
- Always type function parameters
- Let TypeScript infer return types when obvious
- Explicitly type when inference would be `any`

```tsx
// ✅ Good - explicit parameter types
const processData = (data: PlantSpecies[]): SummaryStats => {
  return calculateStats(data);
};

// ✅ Good - obvious return type can be inferred
const getName = (species: PlantSpecies) => {
  return species.genus; // TypeScript infers string
};

// ❌ Bad - missing parameter types
const processData = (data) => {
  return calculateStats(data);
};
```

#### Optional vs Undefined
- Use optional (`?`) for properties that might not exist
- Avoid explicit `| undefined` unless needed for clarity

```tsx
// ✅ Good
interface PlantSpecies {
  species?: string;
  genus?: string;
}

// ❌ Bad - unnecessary union with undefined
interface PlantSpecies {
  species: string | undefined;
  genus: string | undefined;
}
```

### React Patterns

#### Component Definition
Always use function components with `React.FC`:

```tsx
// ✅ Good
export const MyComponent: React.FC<Props> = ({ data, onAction }) => {
  return <div>{/* content */}</div>;
};

// ❌ Bad - missing FC type
export const MyComponent = ({ data, onAction }: Props) => {
  return <div>{/* content */}</div>;
};
```

#### Props Interface Naming
- Always suffix with `Props`
- Define inline above component

```tsx
// ✅ Good
interface SummaryTabProps {
  data: PlantSpecies[];
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ data }) => {
  // ...
};

// ❌ Bad - poor naming
interface Summary {
  data: PlantSpecies[];
}
```

#### Event Handlers
- Prefix with `handle`
- Use arrow functions in component body

```tsx
// ✅ Good
const handleSubmit = () => {
  // handle submission
};

const handleFilterChange = (value: string) => {
  // handle change
};

// ❌ Bad - poor naming
const submit = () => {};
const onFilterUpdate = () => {};
```

#### Hooks Usage
- Custom hooks start with `use`
- Call hooks at top level only
- Extract complex logic to custom hooks

```tsx
// ✅ Good
const useSpeciesData = (rawData: PlantSpecies[]) => {
  const processed = useMemo(() => processData(rawData), [rawData]);
  const [filters, setFilters] = useState<Filters>({});
  
  return { processed, filters, setFilters };
};

// ❌ Bad - conditional hook
if (needsData) {
  const data = useState([]); // Never do this!
}
```

### Tailwind CSS Patterns

#### Class Organization
Order: Layout → Spacing → Typography → Colors → Effects

```tsx
// ✅ Good - organized classes
<div className="flex items-center justify-between p-6 text-lg font-semibold text-gray-800 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">

// ❌ Bad - random order
<div className="shadow-sm text-gray-800 flex bg-white p-6 hover:shadow-md rounded-xl items-center font-semibold transition-shadow text-lg justify-between">
```

#### Responsive Design
- Mobile-first approach
- Use responsive prefixes in ascending order

```tsx
// ✅ Good - mobile first
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">

// ❌ Bad - desktop first
<div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1">
```

#### Conditional Classes
- Use template literals for complex conditions
- Extract to variables for readability

```tsx
// ✅ Good - clear conditions
const buttonClass = `
  px-4 py-2 rounded-lg transition-colors
  ${isActive 
    ? 'bg-green-600 text-white hover:bg-green-700' 
    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
  }
`;

// ❌ Bad - inline complexity
<button className={`px-4 py-2 rounded-lg transition-colors ${isActive ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
```

### File Organization

#### Import Order
1. React and built-in modules
2. Third-party libraries
3. Types
4. Utils and constants
5. Components

```tsx
// ✅ Good
import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { Upload } from 'lucide-react';

import { PlantSpecies, SummaryStatistics } from '@/types';
import { parseCSV } from '@/utils/csvParser';
import { PIE_COLORS } from '@/constants/colors';

import { Header } from '@/components/Common/Header';
import { FilterSection } from '@/components/Filters/FilterSection';
```

#### Export Style
- Named exports for components
- Default exports only for pages/App

```tsx
// ✅ Good - named export
export const SummaryTab: React.FC<Props> = () => {};

// ✅ Good - default for App
export default App;

// ❌ Bad - default export for component
export default SummaryTab;
```

### Naming Conventions

#### Files and Folders
- Components: PascalCase (`SummaryTab.tsx`)
- Utilities: camelCase (`csvParser.ts`)
- Constants: camelCase (`enumFields.ts`)
- Types: camelCase (`index.ts`)

#### Variables and Functions
```tsx
// Constants - UPPER_SNAKE or camelCase
const MAX_ITEMS = 100;
const enumFields = { /* ... */ };

// Functions - camelCase
const calculateStatistics = () => {};
const parseCSVData = () => {};

// Components - PascalCase
const DataTable = () => {};

// Booleans - is/has/should prefix
const isLoading = false;
const hasError = false;
const shouldUpdate = true;
```

### Comments and Documentation

#### When to Comment
- Complex algorithms
- Non-obvious business logic
- Workarounds or hacks
- Public APIs

```tsx
// ✅ Good - explains why
// Recharts Treemap doesn't support strokeWidth prop despite docs
<Treemap stroke="#fff" />

// ❌ Bad - explains what (obvious)
// Set loading to true
setLoading(true);
```

#### JSDoc for Utilities
```tsx
/**
 * Parses CSV string into structured plant species data
 * @param csvInput - Raw CSV string
 * @returns Promise resolving to parsed data array
 * @throws Error if CSV parsing fails
 */
export const parseCSV = async (csvInput: string): Promise<PlantSpecies[]> => {
  // implementation
};
```

### Error Handling

#### User-Facing Errors
- Always provide helpful error messages
- Use try-catch for async operations
- Show errors in UI, not just console

```tsx
// ✅ Good
try {
  const data = await parseCSV(input);
  setData(data);
} catch (error) {
  setError(error instanceof Error ? error.message : 'Failed to parse CSV');
}

// ❌ Bad - no error handling
const data = await parseCSV(input);
setData(data);
```

### Performance

#### Memoization
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable references
- Don't over-optimize

```tsx
// ✅ Good - expensive calculation
const statistics = useMemo(() => {
  return calculateComplexStats(data);
}, [data]);

// ❌ Bad - premature optimization
const simpleSum = useMemo(() => {
  return a + b;
}, [a, b]);
```

### Testing Considerations

Although tests aren't implemented yet, write testable code:

#### Pure Functions
```tsx
// ✅ Good - pure, testable
export const calculateConservationRate = (data: PlantSpecies[]): number => {
  const endangered = data.filter(d => d['CONSERVATION STATUS'] === 'Endangered');
  return (endangered.length / data.length) * 100;
};

// ❌ Bad - side effects, hard to test
export const updateAndCalculate = (data: PlantSpecies[]) => {
  globalData = data; // Side effect!
  document.title = 'Updated'; // DOM manipulation!
  return data.length;
};
```

#### Component Props
```tsx
// ✅ Good - all data via props
export const Chart: React.FC<{ data: ChartData[] }> = ({ data }) => {
  return <PieChart data={data} />;
};

// ❌ Bad - direct data access
export const Chart = () => {
  const data = window.chartData; // Hard to test!
  return <PieChart data={data} />;
};
```

## Design Patterns

### Container/Presentational
- Containers: Handle data and logic
- Presentational: Pure UI components

```tsx
// Container
const DashboardContainer = () => {
  const data = useDataProcessing();
  return <Dashboard data={data} />;
};

// Presentational
const Dashboard: React.FC<{ data: ProcessedData }> = ({ data }) => {
  return <div>{/* Pure UI */}</div>;
};
```

### Composition over Inheritance
```tsx
// ✅ Good - composition
const CardWithTitle = ({ title, children }) => (
  <Card>
    <CardTitle>{title}</CardTitle>
    {children}
  </Card>
);

// ❌ Bad - trying to extend components
class TitledCard extends Card { // Don't do this in React
  // ...
}
```

## Git Commit Messages

Follow conventional commits:

```
feat: add taxonomy validation to CSV import
fix: correct filter logic for multi-select dropdowns  
refactor: extract chart components from GraphsTab
docs: update API reference for new hooks
style: format code with prettier
chore: update dependencies
```

---

Remember: Consistency > Perfection. When in doubt, follow existing patterns in the codebase.