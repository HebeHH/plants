# Reliable Plant Data Processor

A robust plant data processing system that fetches information from authoritative botanical databases with proper validation, caching, and source attribution.

## Features

- **Multiple Data Sources**: Integrates with GBIF, Tropicos, IPNI, POWO, and EOL
- **Data Validation**: Validates species names, life forms, hemispheres, and sources
- **Caching**: Intelligent caching to reduce API calls and improve performance
- **Source Attribution**: Tracks which database provided each piece of information
- **Confidence Scoring**: Calculates reliability scores based on data completeness and source quality
- **Error Handling**: Comprehensive error handling and logging
- **Data Quality Reports**: Generates detailed reports on data completeness and quality

## Setup

1. **Install Requirements**:
   ```bash
   pip install pandas numpy requests
   ```

2. **Configure API Keys**:
   - Copy `config.json.example` to `config.json`
   - Add your API keys for the various services:
     - Tropicos: Register at https://www.tropicos.org/services/help
     - IPNI: Register at https://www.ipni.org/api
     - EOL: Register at https://eol.org/api

3. **Run the Processor**:
   ```bash
   python reliable_plant_processor.py
   ```

## Data Sources

### GBIF (Global Biodiversity Information Facility)
- **Reliability Score**: 0.9
- **Data Provided**: Common names, distribution data
- **API**: Free, no key required
- **Documentation**: https://www.gbif.org/developer/summary

### Tropicos (Missouri Botanical Garden)
- **Reliability Score**: 0.85
- **Data Provided**: Etymology, nomenclature
- **API**: Requires free API key
- **Documentation**: https://www.tropicos.org/services/help

### IPNI (International Plant Names Index)
- **Reliability Score**: 0.9
- **Data Provided**: Nomenclature, publication details
- **API**: Requires registration
- **Documentation**: https://www.ipni.org/api

### POWO (Plants of the World Online - Kew)
- **Reliability Score**: 0.95
- **Data Provided**: Distribution, uses, descriptions
- **API**: Part of Kew's data services
- **Documentation**: http://www.plantsoftheworldonline.org/

### EOL (Encyclopedia of Life)
- **Reliability Score**: 0.8
- **Data Provided**: General information, media
- **API**: Requires API key
- **Documentation**: https://eol.org/api

## Output Format

The processor adds several new columns to track data quality:

- **DATA_SOURCES**: JSON object showing which database provided each field
- **CONFIDENCE_SCORE**: 0-1 score indicating data reliability
- **DATA_QUALITY_SCORE**: Overall quality score for the record
- **LAST_UPDATED**: Timestamp of last data fetch

## Data Quality Report

After processing, a `data_quality_report.json` is generated containing:
- Total records processed
- Field completeness percentages
- Average confidence scores
- Data source distribution

## Validation Rules

### Species Names
- Must be in binomial format (genus species)
- Genus must be capitalized
- Species epithet must be lowercase

### Life Forms (Raunkiær System)
- phanerophyte: Trees and shrubs (buds >25cm above ground)
- chamaephyte: Small shrubs (buds near ground, <25cm)
- hemicryptophyte: Perennial herbs (buds at soil surface)
- cryptophyte: Bulbs and rhizomes (buds below ground)
- therophyte: Annual plants
- geophyte: Plants with underground storage
- hydrophyte: Aquatic plants
- helophyte: Marsh plants
- epiphyte: Plants growing on other plants
- lithophyte: Plants growing on rocks
- aerophyte: Air plants

### Hemispheres
- northern
- southern
- both

### Sources
- natural: Wild origin
- bred: Cultivated/bred
- hybrid: Hybrid origin
- cultivar: Cultivated variety

## Troubleshooting

1. **API Rate Limits**: Adjust `rate_limit_delay` in config.json
2. **Cache Issues**: Delete the `cache/` directory to force fresh data
3. **Validation Errors**: Check `plant_processor.log` for details
4. **Missing Data**: Some species may not be in all databases

## Future Improvements

1. Add more data sources (iNaturalist, USDA PLANTS)
2. Implement parallel processing for faster execution
3. Add image fetching capabilities
4. Support for subspecies and varieties
5. Machine learning for data conflict resolution