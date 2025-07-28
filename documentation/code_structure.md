# Plant Species Dashboard - Developer Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Data Flow & State Management](#data-flow--state-management)
3. [Component Structure](#component-structure)
4. [Styling Approach](#styling-approach)
5. [Adding New Features](#adding-new-features)
6. [Code Organization Principles](#code-organization-principles)
7. [Build & Development](#build--development)

## Architecture Overview

This application follows a **unidirectional data flow** architecture with React hooks for state management. There's no global state management library (Redux, MobX, etc.) - instead, we use React's built-in state management with custom hooks for data processing.

### Key Architectural Decisions:

1. **No Global State Store**: All state is managed at the App component level and passed down via props
2. **Custom Hooks for Logic**: Business logic is extracted into custom hooks (`useDataProcessing`, `useFilters`, `useSorting`)
3. **TypeScript First**: Every component and function is fully typed for safety and developer experience
4. **Component Composition**: Complex UI is built from small, reusable components
5. **Separation of Concerns**: Data processing, UI components, and utilities are strictly separated

## Data Flow & State Management

### State Hierarchy

```
App.tsx (Root State Container)
├── data: PlantSpecies[] (raw CSV data)
├── currentView: 'upload' | 'dashboard'
├── activeTab: 'summary' | 'graphs' | 'taxonomy' | 'table'
│
├── Derived State (via hooks):
│   ├── summaryStats (useDataProcessing)
│   ├── filteredData (useFilters)
│   └── sortedData (useSorting)
│
└── Child Components (receive props)
    ├── FileUpload (onDataLoaded callback)
    ├── Header (totalSpecies, onUploadNew)
    ├── TabNavigation (activeTab, onTabChange)
    └── Tab Components (various props)
```

### Data Flow Pattern

1. **Initial Load**: App mounts → fetch `/enhanced_species_table.csv` → `parseCSV` utility → App state
2. **Data Processing**: Raw data → `useDataProcessing` hook → calculated statistics → components
3. **Filtering**: User interacts with filters → `handleFilterChange` → `useFilters` hook → filtered data
4. **Sorting**: User clicks column → `handleSort` → `useSorting` hook → sorted data

### State Management Rules

- **State Location**: State lives in the lowest common ancestor that needs it
- **Props Drilling**: Limited to 2-3 levels max (use composition if deeper)
- **Derived State**: Always calculate in hooks/memos, never store in state
- **Callbacks**: Pass callbacks down for child-to-parent communication

## Component Structure

### Component Categories

1. **Container Components** (`App.tsx`)
   - Manage state and data flow
   - Handle routing between views
   - Orchestrate child components

2. **Feature Components** (in `/components/`)
   - `FileUpload/`: Handles CSV import and validation display
   - `Tabs/`: Each tab is a self-contained feature
   - `Charts/`: Specialized visualization components
   - `Filters/`: Reusable filter UI components
   - `Common/`: Shared UI components

3. **Hook Components** (`/hooks/`)
   - `useDataProcessing`: Transforms raw data into statistics
   - `useFilters`: Manages filter state and filtering logic
   - `useSorting`: Handles table sorting

### Component Anatomy

Each component follows this structure:
```tsx
// 1. Imports (React, types, utilities, components)
import React from 'react';
import { ComponentProps } from '@/types';

// 2. Interface definition
interface MyComponentProps {
  data: SomeType;
  onAction: (param: Type) => void;
}

// 3. Component definition
export const MyComponent: React.FC<MyComponentProps> = ({ 
  data, 
  onAction 
}) => {
  // 4. Local state (if needed)
  const [localState, setLocalState] = useState();
  
  // 5. Computed values/memos
  const computed = useMemo(() => {}, [deps]);
  
  // 6. Event handlers
  const handleClick = () => {};
  
  // 7. Render
  return <div>...</div>;
};
```

## Styling Approach

### Styling Strategy

1. **Tailwind CSS Utility-First**: All styling is done with Tailwind classes directly in components
2. **No Global Styles**: Only Tailwind's base styles in `index.css`
3. **No CSS Modules or Styled Components**: Keeping it simple with utilities
4. **Component-Level Styling**: Each component owns its styling

### Styling Patterns

```tsx
// Consistent spacing and layout
<div className="bg-white rounded-xl shadow-sm p-6">

// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

// Interactive states
<button className="hover:bg-green-700 transition-colors">

// Conditional styling
<div className={`${isActive ? 'border-green-500' : 'border-gray-300'}`}>
```

### Design System Constants

- **Colors**: Defined in `/constants/colors.ts` for charts
- **Spacing**: Using Tailwind's spacing scale (4, 6, 8, etc.)
- **Border Radius**: Consistently using `rounded-lg` or `rounded-xl`
- **Shadows**: `shadow-sm` for subtle elevation

## Adding New Features

### Adding a New Tab

1. **Create the component** in `/components/Tabs/NewTab.tsx`:
```tsx
interface NewTabProps {
  summaryStats: SummaryStatistics;
  // Add other needed props
}

export const NewTab: React.FC<NewTabProps> = ({ summaryStats }) => {
  return (
    <div className="space-y-6">
      {/* Your tab content */}
    </div>
  );
};
```

2. **Add to TabNavigation** in `/components/Common/TabNavigation.tsx`:
```tsx
const tabs = [
  // ... existing tabs
  { id: 'newtab' as TabType, label: 'New Tab', icon: NewIcon },
];
```

3. **Update TabType** in the same file:
```tsx
export type TabType = 'summary' | 'graphs' | 'taxonomy' | 'table' | 'newtab';
```

4. **Add to App.tsx**:
```tsx
{activeTab === 'newtab' && (
  <NewTab summaryStats={summaryStats} />
)}
```

### Adding a New Chart

1. **Create the component** in `/components/Charts/NewChart.tsx`:
```tsx
interface NewChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
}

export const NewChart: React.FC<NewChartProps> = ({ data, width = 400, height = 300 }) => {
  return (
    <ResponsiveContainer width={width} height={height}>
      {/* Your Recharts component */}
    </ResponsiveContainer>
  );
};
```

2. **Add data processing** in `/utils/dataProcessing.ts` if needed:
```tsx
const newChartData = calculateNewChartData(data);
```

3. **Use in a tab component**:
```tsx
<NewChart data={summaryStats.newChartData} />
```

### Adding a New Filter Type

1. **Create filter component** in `/components/Filters/NewFilter.tsx`
2. **Add to FilterSection** logic
3. **Update filter handling** in `useFilters` hook if needed

## Code Organization Principles

### Directory Structure Explained

```
src/
├── components/          # UI components organized by feature
│   ├── Charts/         # Visualization components
│   ├── Common/         # Shared UI elements
│   ├── FileUpload/     # CSV import feature
│   ├── Filters/        # Filter UI components
│   └── Tabs/           # Main view components
│
├── constants/          # App-wide constants
│   ├── colors.ts      # Chart color schemes
│   └── enumFields.ts  # Data field definitions
│
├── hooks/             # Custom React hooks
│   ├── useDataProcessing.ts  # Statistics calculation
│   ├── useFilters.ts        # Filter logic
│   └── useSorting.ts        # Sort logic
│
├── types/             # TypeScript definitions
│   └── index.ts      # All type definitions
│
├── utils/             # Pure utility functions
│   ├── chartHelpers.ts      # Chart data formatting
│   ├── csvParser.ts         # CSV parsing logic
│   └── dataProcessing.ts    # Data transformation
│
└── App.tsx           # Root component
```

### Import Order Convention

```tsx
// 1. React and core libraries
import React, { useState, useMemo } from 'react';

// 2. Third-party libraries
import { PieChart, Pie } from 'recharts';
import { Upload } from 'lucide-react';

// 3. Types
import { PlantSpecies, SummaryStatistics } from '@/types';

// 4. Utils and constants
import { parseCSV } from '@/utils/csvParser';
import { PIE_COLORS } from '@/constants/colors';

// 5. Components
import { Header } from '@/components/Common/Header';
```

### Naming Conventions

- **Components**: PascalCase (`FileUpload`, `SummaryTab`)
- **Hooks**: camelCase with 'use' prefix (`useFilters`, `useDataProcessing`)
- **Utilities**: camelCase (`parseCSV`, `getTopNWithOthers`)
- **Types/Interfaces**: PascalCase (`PlantSpecies`, `SummaryStatistics`)
- **Constants**: UPPER_SNAKE_CASE or camelCase (`PIE_COLORS`, `enumFields`)

## Build & Development

### Technology Stack Details

- **React 18**: Using functional components and hooks exclusively
- **TypeScript 5.3**: Strict mode enabled for maximum type safety
- **Vite 5**: Lightning-fast HMR and optimized builds
- **Tailwind CSS 3**: Utility-first styling approach
- **Recharts 2**: Declarative charting library
- **Papaparse 5**: Robust CSV parsing
- **Lucide React**: Consistent icon system

### Build Configuration

**Vite Configuration** (`vite.config.ts`):
- Path aliases: `@/` maps to `src/`
- Code splitting: Vendor chunks for better caching
- React plugin: Fast Refresh enabled

**TypeScript Configuration** (`tsconfig.json`):
- Strict mode: All strict checks enabled
- Module resolution: Bundler mode for Vite
- JSX: react-jsx for automatic runtime

### Performance Considerations

1. **Code Splitting**: Large dependencies are split into separate chunks
2. **Memoization**: Heavy calculations cached with `useMemo`
3. **React.memo**: Not used yet, but can be added for expensive components
4. **Lazy Loading**: Not implemented, but tabs could be lazy-loaded

### Development Workflow

1. **Start dev server**: `npm run dev`
2. **Type checking**: `npm run type-check` (runs automatically on build)
3. **Building**: `npm run build` (TypeScript → Vite build)
4. **Preview**: `npm run preview` (test production build locally)

### Common Development Tasks

**Adding a new dependency**:
```bash
npm install package-name
npm install -D @types/package-name  # If TypeScript types needed
```

**Debugging data flow**:
1. Add `console.log` in hooks to trace data transformation
2. Use React DevTools to inspect props and state
3. Check Network tab for CSV parsing issues

**Performance profiling**:
1. Use React DevTools Profiler
2. Look for unnecessary re-renders
3. Add `React.memo` or `useMemo` as needed

## Best Practices & Guidelines

### Do's
- ✅ Keep components focused on a single responsibility
- ✅ Use TypeScript types for all props and function parameters
- ✅ Extract complex logic into custom hooks
- ✅ Use semantic HTML and ARIA labels for accessibility
- ✅ Test with large CSV files (10k+ rows)

### Don'ts
- ❌ Don't store derived state (calculate it instead)
- ❌ Don't use `any` type (use `unknown` if type is truly unknown)
- ❌ Don't mutate state directly
- ❌ Don't put business logic in components (use hooks/utils)
- ❌ Don't use inline styles (use Tailwind classes)

### Code Review Checklist
- [ ] Types are properly defined
- [ ] Component is focused and reusable
- [ ] Props are minimal and necessary
- [ ] No unnecessary re-renders
- [ ] Accessibility considered
- [ ] Error cases handled
- [ ] Code follows existing patterns

---

This documentation is meant to be a living document. Please update it when making significant architectural changes or adding new patterns.