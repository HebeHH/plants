# Plant Species Dashboard - Documentation

Welcome to the comprehensive documentation for the Plant Species Dashboard project. This documentation is designed to help developers understand, maintain, and extend the application.

## 📚 Documentation Overview

### For New Developers

1. **Start Here**: [Quick Reference](./quick_reference.md) - Commands, patterns, and tips
2. **Understand Structure**: [Code Structure](./code_structure.md) - Architecture and organization
3. **Follow Standards**: [Style Guide](./style_guide.md) - Coding conventions and best practices

### For Contributing

1. **API Documentation**: [API Reference](./api_reference.md) - Hooks, utilities, and types
2. **Add Features**: [Code Structure → Adding Features](./code_structure.md#adding-new-features)
3. **Debug Issues**: [Troubleshooting Guide](./troubleshooting.md)

### Project History

- [Build Log](./build_log.md) - How the project was created and refactored
- [Bug Tracking](./bug_solving.md) - Known issues and resolutions

## 🗺️ Documentation Map

```
documentation/
├── README.md               # This file - documentation index
├── quick_reference.md      # Quick commands and patterns
├── code_structure.md       # Architecture and dev guide
├── api_reference.md        # Detailed API documentation
├── style_guide.md          # Coding standards
├── troubleshooting.md      # Common issues and solutions
├── build_log.md           # Project creation history
└── bug_solving.md         # Bug tracking log
```

## 🎯 Common Tasks

### Setting Up Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Check types
npm run type-check

# Build for production
npm run build
```

### Understanding the Codebase

1. **Data Flow**: [Code Structure → Data Flow](./code_structure.md#data-flow--state-management)
2. **Component Hierarchy**: [Code Structure → Component Structure](./code_structure.md#component-structure)
3. **Styling System**: [Code Structure → Styling Approach](./code_structure.md#styling-approach)

### Making Changes

1. **Add a Tab**: [Quick Reference → Adding Features](./quick_reference.md#-adding-a-new-feature)
2. **Add a Chart**: [Code Structure → Adding a New Chart](./code_structure.md#adding-a-new-chart)
3. **Modify Filters**: [API Reference → useFilters](./api_reference.md#usefilters)

## 🏗️ Architecture Summary

The application follows these key principles:

- **Unidirectional Data Flow**: State flows down, events flow up
- **Custom Hooks**: Business logic separated from UI
- **TypeScript First**: Full type safety throughout
- **Component Composition**: Small, focused, reusable components
- **Utility-First CSS**: Tailwind for all styling

## 📊 Key Technologies

| Technology | Purpose | Documentation |
|------------|---------|---------------|
| React 18 | UI Framework | [Component Patterns](./style_guide.md#react-patterns) |
| TypeScript | Type Safety | [TypeScript Style](./style_guide.md#typescript) |
| Vite | Build Tool | [Build Config](./code_structure.md#build-configuration) |
| Tailwind CSS | Styling | [Styling Patterns](./style_guide.md#tailwind-css-patterns) |
| Recharts | Charts | [Chart Components](./api_reference.md#adding-a-new-chart) |

## 🔍 Where to Find What

- **Components**: `/src/components/` organized by feature
- **Business Logic**: `/src/hooks/` and `/src/utils/`
- **Types**: `/src/types/index.ts`
- **Constants**: `/src/constants/`
- **Styles**: Inline with Tailwind classes

## 🚀 Getting Started Checklist

- [ ] Read [Quick Reference](./quick_reference.md)
- [ ] Understand [Data Flow](./code_structure.md#data-flow--state-management)
- [ ] Review [Component Structure](./code_structure.md#component-structure)
- [ ] Check [Style Guide](./style_guide.md)
- [ ] Try adding a simple feature
- [ ] Run the app with sample data

## 💡 Tips for Success

1. **Follow Patterns**: The codebase is consistent - copy existing patterns
2. **Type Everything**: TypeScript will catch many bugs before runtime
3. **Component Focus**: Keep components small and focused
4. **Use DevTools**: React DevTools is invaluable for debugging
5. **Ask Questions**: When in doubt, check existing code or documentation

## 📞 Need Help?

1. Search the codebase for similar patterns
2. Check [Troubleshooting Guide](./troubleshooting.md)
3. Review [API Reference](./api_reference.md)
4. Look at [Build Log](./build_log.md) for context

---

*This documentation is a living document. Please update it when making significant changes to the application architecture or adding new patterns.*