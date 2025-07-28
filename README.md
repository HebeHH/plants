# Plant Species Dashboard

A comprehensive React-based dashboard for visualizing and analyzing plant species data from CSV files.

## Features

### Data Import & Validation
- Upload CSV files or paste data directly
- Automatic data cleaning and validation
- Taxonomy hierarchy validation with detailed error reporting
- Support for incomplete records

### Interactive Visualizations
- **Sunburst Chart**: Hierarchical view of taxonomy (Clade → Order → Family → Genus) with zoom/pan controls
- **Pie Charts**: Conservation status, commercial status, and order distributions
- **Bar Charts**: Horticultural development by growth habit, families by geographic origin
- **Treemap**: Top 20 families by species count
- **Summary Cards**: Key metrics at a glance

### Data Table
- Sortable columns (click headers to sort)
- Advanced filtering:
  - Text search for any column
  - Multi-select dropdowns for categorical data
- Export filtered data to CSV
- Copy data to clipboard

### Summary Statistics
- Total species count
- Growth form distribution
- Conservation concern metrics
- Human influence percentage
- Geographic origin analysis

## Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd plants

# Install dependencies
npm install

# Start development server
npm run dev
```

## Usage

1. Start the application and navigate to http://localhost:5173
2. The app automatically loads the species data from `/public/enhanced_species_table.csv`
3. Click the "Data Validation" button in the header to view the taxonomy validation report
4. Use the tabs to navigate between different views:
   - **Summary**: Overview statistics
   - **Graphs**: Various chart visualizations
   - **Taxonomy**: Hierarchical data view
   - **Table**: Full data table with filtering

## CSV Data Format

The application expects CSV files with the following columns:

| Column | Description | Example |
|--------|-------------|---------|
| SPECIES | Scientific species name | *Quercus robur* |
| GENUS | Genus name | Quercus |
| FAMILY | Family name | Fagaceae |
| ORDER | Order name | Fagales |
| CLADE | Major clade | Eudicots |
| GROWTH FORM | Plant growth form | Tree, Herb, Shrub, Vine |
| GEOGRAPHIC ORIGIN | Native region | Europe, Asia, etc. |
| GROWTH HABIT | Cultivation status | Wild, Cultivated, Both |
| HORTICULTURAL DEVELOPMENT | Development level | Low, Moderate, High |
| COMMERCIAL STATUS | Commercial importance | None, Limited, Major |
| CONSERVATION STATUS | Conservation category | Common, Rare, Endangered, etc. |

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Build for production
npm run build

# Preview production build
npm run preview
```

## Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **CSV Parsing**: Papaparse
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/     # React components
│   ├── Charts/    # Chart components
│   ├── Common/    # Shared components
│   ├── FileUpload/# Upload interface
│   ├── Filters/   # Filter components
│   └── Tabs/      # Tab views
├── constants/     # App constants
├── hooks/         # Custom React hooks
├── types/         # TypeScript types
└── utils/         # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation

Comprehensive documentation is available in the `/documentation` directory:

- **[Code Structure & Architecture](./documentation/code_structure.md)** - Detailed guide for developers
- **[API Reference](./documentation/api_reference.md)** - Hooks, utilities, and type definitions
- **[Troubleshooting Guide](./documentation/troubleshooting.md)** - Common issues and solutions
- **[Build Log](./documentation/build_log.md)** - Project creation and refactoring history
- **[Bug Tracking](./documentation/bug_solving.md)** - Known issues and fixes

## License

This project is open source and available under the MIT License.