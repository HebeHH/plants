# Troubleshooting Guide

## Common Issues and Solutions

### Build & Development Issues

#### TypeScript Errors

**Problem**: "Cannot find module '@/components/...'"
```
Module not found: Error: Can't resolve '@/components/Header'
```

**Solution**: Check that path aliases are configured:
1. Verify `tsconfig.json` has the path mapping:
   ```json
   "paths": {
     "@/*": ["src/*"]
   }
   ```
2. Verify `vite.config.ts` has the alias:
   ```ts
   resolve: {
     alias: {
       '@': path.resolve(__dirname, './src'),
     },
   },
   ```

---

**Problem**: Type errors with Recharts components
```
Type '{ children: Element[]; data: any; ... }' is not assignable to type...
```

**Solution**: 
- Recharts has tricky TypeScript definitions
- Remove unsupported props (like `strokeWidth` on Treemap)
- Use simpler implementations when custom content causes issues
- Check Recharts documentation for exact prop types

---

#### Vite/Build Issues

**Problem**: "The CJS build of Vite's Node API is deprecated"

**Solution**: Already fixed by adding `"type": "module"` to package.json

---

**Problem**: Large chunk warnings during build
```
Some chunks are larger than 500 kB after minification
```

**Solution**: Already implemented code splitting in `vite.config.ts`. Can be further optimized by:
- Lazy loading tabs
- Dynamic imports for heavy components
- Adjusting `build.chunkSizeWarningLimit` if needed

---

### Runtime Issues

#### Data Loading Errors

**Problem**: "Failed to load species data"

**Common Causes**:
1. **CSV file not in public directory**
   - Ensure `/public/enhanced_species_table.csv` exists
   - Check file permissions

2. **Development server issues**
   - Try restarting the dev server
   - Clear browser cache

3. **File path mismatch**
   - The app expects the file at `/enhanced_species_table.csv`
   - This maps to `/public/enhanced_species_table.csv` in your project

**To use a different CSV file**:
1. Place your CSV in the `/public` directory
2. Update the fetch URL in `App.tsx`:
   ```tsx
   const response = await fetch('/your-file-name.csv');
   ```

---

#### CSV Parsing Errors

**Problem**: "Error parsing CSV: ..."

**Common Causes & Solutions**:

1. **Encoding issues**
   - Ensure CSV is UTF-8 encoded
   - Try opening in Excel and re-saving as CSV

2. **Delimiter issues**
   - Papaparse expects comma-delimited files
   - For other delimiters, modify `parseCSV` utility:
   ```tsx
   Papa.parse(csvInput, {
     delimiter: '\t', // for tab-delimited
     // ... other options
   });
   ```

3. **Quote/escape character issues**
   - Check for unmatched quotes in data
   - Ensure special characters are properly escaped

---

#### Data Display Issues

**Problem**: Charts not showing data

**Debugging Steps**:
1. Check console for errors
2. Add logging to data processing:
   ```tsx
   console.log('Raw data:', data);
   console.log('Summary stats:', summaryStats);
   ```
3. Verify data has required columns (case-sensitive)
4. Check for null/undefined values

---

**Problem**: Filters not working

**Common Causes**:
- Column names don't match (they're case-sensitive)
- Data contains unexpected characters
- Multi-select not handling array properly

**Debug by**:
```tsx
// In useFilters hook
console.log('Filters:', filters);
console.log('Filtered data length:', filteredData.length);
```

---

#### Performance Issues

**Problem**: App slows down with large datasets

**Solutions**:

1. **Virtualization for table**:
   ```tsx
   npm install react-window
   // Implement virtual scrolling for TableTab
   ```

2. **Memoize expensive calculations**:
   ```tsx
   const expensiveResult = useMemo(() => {
     return heavyCalculation(data);
   }, [data]);
   ```

3. **Debounce filter inputs**:
   ```tsx
   import { debounce } from 'lodash';
   const debouncedFilter = debounce(handleFilterChange, 300);
   ```

4. **Limit chart data points**:
   - Already implemented with `getTopNWithOthers`
   - Adjust the limit if needed

---

### Data Quality Issues

#### Taxonomy Validation Errors

**Problem**: "Hierarchy violations detected"

**Understanding the errors**:
- **"Species X appears in multiple genera"**: Same species name shouldn't be in different genera
- **"Genus X appears in multiple families"**: Genus should belong to only one family
- etc.

**Solutions**:
1. Fix data at source (preferred)
2. Add data cleaning logic:
   ```tsx
   // In parseCSV or dataProcessing
   const cleanedData = data.map(row => ({
     ...row,
     GENUS: row.GENUS?.trim().replace(/\s+/g, ' ')
   }));
   ```
3. Ignore validation for specific cases if needed

---

#### Missing Data

**Problem**: Statistics show unexpected zeros

**Common Causes**:
- Column names have extra spaces
- Values have inconsistent casing
- Data uses different terminology than expected

**Debug**:
```tsx
// Check unique values in console
const uniqueGrowthForms = [...new Set(data.map(d => d['GROWTH FORM']))];
console.log('Growth forms:', uniqueGrowthForms);
```

---

### Browser Compatibility

**Minimum Requirements**:
- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

**Common Issues**:

1. **Clipboard API not available**
   - Fallback already shows alert
   - Only works in secure contexts (HTTPS)

2. **FileReader API issues**
   - Very old browsers might not support
   - Consider polyfill if needed

---

### Development Environment

#### Hot Module Replacement (HMR) Issues

**Problem**: Changes not reflecting in browser

**Solutions**:
1. Hard refresh: Ctrl+Shift+R (Cmd+Shift+R on Mac)
2. Clear Vite cache:
   ```bash
   rm -rf node_modules/.vite
   npm run dev
   ```
3. Check for syntax errors in console

---

#### ESLint/TypeScript Warnings

**Unused variable warnings**

Already disabled in `tsconfig.json`:
```json
"noUnusedLocals": false,
"noUnusedParameters": false
```

To re-enable for cleaner code:
1. Set both to `true`
2. Fix warnings by removing unused code
3. Use `_` prefix for intentionally unused parameters

---

### Deployment Issues

#### Build Fails in CI/CD

**Common Causes**:
1. **Node version mismatch**
   - Specify Node version in `.nvmrc` or CI config
   - Use Node 18+ for best compatibility

2. **Missing dependencies**
   - Ensure all deps are in `dependencies` not `devDependencies`
   - Run `npm ci` instead of `npm install` in CI

3. **TypeScript strict errors**
   - CI might use different tsconfig
   - Run `npm run type-check` locally first

---

#### Production Performance

**Optimization Checklist**:
- [ ] Enable gzip/brotli compression on server
- [ ] Set proper cache headers for assets
- [ ] Use CDN for static assets
- [ ] Consider server-side rendering for SEO
- [ ] Monitor with tools like Lighthouse

---

## Debug Mode

To add debug mode to the app:

```tsx
// In App.tsx
const DEBUG = import.meta.env.DEV;

if (DEBUG) {
  console.log('=== DEBUG INFO ===');
  console.log('Data rows:', data.length);
  console.log('Active filters:', filters);
  console.log('Summary stats:', summaryStats);
}
```

---

## Getting Help

1. **Check the console** - Most errors will show there
2. **Read error messages carefully** - They often point to the exact issue
3. **Use React DevTools** - Great for inspecting component props/state
4. **Search the codebase** - Similar patterns might already exist
5. **Check dependencies docs** - Especially for Recharts, Tailwind

### Useful Resources

- [Recharts Documentation](https://recharts.org/en-US/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)

---

## Reporting Bugs

When reporting issues, include:

1. **Environment**:
   ```
   Node version: 
   npm version: 
   OS: 
   Browser: 
   ```

2. **Steps to reproduce**:
   - What you did
   - What you expected
   - What actually happened

3. **Error messages** (full stack trace)

4. **Sample data** (if applicable, sanitized)

5. **Screenshots** (for UI issues)