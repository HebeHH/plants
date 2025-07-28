# Quick Reference Card

## 🚀 Common Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run type-check   # Check TypeScript types
npm run preview      # Preview production build
```

## 📁 Where to Find Things

| What | Where | Example |
|------|-------|---------|
| Components | `/src/components/{feature}/` | `/src/components/Tabs/SummaryTab.tsx` |
| Types | `/src/types/index.ts` | `PlantSpecies`, `SummaryStatistics` |
| Hooks | `/src/hooks/` | `useDataProcessing`, `useFilters` |
| Utils | `/src/utils/` | `parseCSV`, `calculateSummaryStatistics` |
| Constants | `/src/constants/` | `enumFields`, `PIE_COLORS` |

## 🎨 Component Template

```tsx
import React from 'react';
import { MyType } from '@/types';

interface MyComponentProps {
  data: MyType;
  onAction: (value: string) => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      {/* Component content */}
    </div>
  );
};
```

## 🎯 Adding a New Feature

### New Tab
1. Create: `/src/components/Tabs/NewTab.tsx`
2. Add to: `/src/components/Common/TabNavigation.tsx`
3. Wire in: `/src/App.tsx`

### New Chart
1. Create: `/src/components/Charts/NewChart.tsx`
2. Process data: `/src/utils/dataProcessing.ts`
3. Use in tab component

### New Filter
1. Create: `/src/components/Filters/NewFilter.tsx`
2. Add to: `/src/components/Filters/FilterSection.tsx`
3. Update: `/src/hooks/useFilters.ts` (if needed)

## 🔧 Common Patterns

### Data Processing
```tsx
const processedData = useMemo(() => {
  return data.map(item => ({
    ...item,
    computed: calculateValue(item)
  }));
}, [data]);
```

### Filter Implementation
```tsx
const filtered = data.filter(item => {
  return item.field?.toLowerCase().includes(searchTerm.toLowerCase());
});
```

### Chart Data Format
```tsx
const chartData = [
  { name: 'Category 1', value: 100 },
  { name: 'Category 2', value: 200 }
];
```

## 🎨 Tailwind Classes

### Layout
- Container: `bg-white rounded-xl shadow-sm p-6`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
- Stack: `space-y-6` or `flex flex-col gap-6`

### Typography
- Heading: `text-lg font-semibold text-gray-800`
- Label: `text-sm font-medium text-gray-700`
- Value: `text-2xl font-bold text-gray-800`

### Interactive
- Button: `bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors`
- Input: `border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500`

## 🐛 Debug Helpers

```tsx
// Quick data check
console.log('Data shape:', {
  rows: data.length,
  columns: Object.keys(data[0] || {}),
  sample: data[0]
});

// Performance check
console.time('Processing');
const result = expensiveOperation();
console.timeEnd('Processing');

// State tracking
useEffect(() => {
  console.log('State changed:', { filters, data: data.length });
}, [filters, data]);
```

## 📊 Data Format

Required CSV columns:
- `SPECIES`, `GENUS`, `FAMILY`, `ORDER`, `CLADE`
- `GROWTH FORM` (Tree/Herb/Shrub/Vine)
- `GEOGRAPHIC ORIGIN`
- `GROWTH HABIT` (Wild/Cultivated/Both)
- `HORTICULTURAL DEVELOPMENT` (Low/Moderate/High)
- `COMMERCIAL STATUS` (None/Limited/Major)
- `CONSERVATION STATUS`

## ⚡ Performance Tips

1. **Use `useMemo`** for expensive calculations
2. **Use `useCallback`** for stable function references
3. **Limit chart data** with `getTopNWithOthers()`
4. **Virtualize long lists** (react-window)
5. **Debounce user input** for filters

## 🔍 Type Checking

```bash
# Check specific file
npx tsc --noEmit src/components/MyComponent.tsx

# Check all files
npm run type-check

# Watch mode
npx tsc --watch --noEmit
```

## 🚨 Common Gotchas

1. **Column names are case-sensitive** - `'GENUS'` not `'genus'`
2. **Recharts props are picky** - Check docs for exact prop names
3. **Tailwind purges unused classes** - Don't construct class names dynamically
4. **State updates are async** - Don't rely on state immediately after setting
5. **CSV parsing trims headers** - But not values

## 📚 Useful Links

- [Component Structure Guide](./code_structure.md#component-structure)
- [Adding Features Guide](./code_structure.md#adding-new-features)
- [API Reference](./api_reference.md)
- [Troubleshooting](./troubleshooting.md)