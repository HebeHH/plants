#!/usr/bin/env python3
"""
Reliable Plant Data Processor
Fetches plant data from authoritative sources with proper validation and attribution.
"""

import pandas as pd
import numpy as np
import json
import requests
import time
import logging
from typing import Dict, List, Optional, Tuple
from datetime import datetime
from pathlib import Path
import hashlib
from dataclasses import dataclass, asdict
from enum import Enum

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('plant_processor.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class DataSource(Enum):
    """Enum for data sources with reliability scores"""
    GBIF = ("GBIF", 0.9)  # Global Biodiversity Information Facility
    TROPICOS = ("Tropicos", 0.85)  # Missouri Botanical Garden
    IPNI = ("IPNI", 0.9)  # International Plant Names Index
    POWO = ("POWO", 0.95)  # Plants of the World Online (Kew)
    EOL = ("EOL", 0.8)  # Encyclopedia of Life
    MANUAL = ("Manual", 0.3)  # Manual entry (lowest reliability)
    
    def __init__(self, display_name: str, reliability: float):
        self.display_name = display_name
        self.reliability = reliability

@dataclass
class PlantData:
    """Data class for plant information with source tracking"""
    species: str
    literal_latin: Optional[str] = None
    common_name: Optional[str] = None
    life_form: Optional[str] = None
    specific_location: Optional[str] = None
    general_location: Optional[str] = None
    hemisphere: Optional[str] = None
    source: Optional[str] = None
    data_sources: Dict[str, str] = None
    confidence_score: float = 0.0
    last_updated: str = None
    
    def __post_init__(self):
        if self.data_sources is None:
            self.data_sources = {}
        if self.last_updated is None:
            self.last_updated = datetime.now().isoformat()

class PlantDataValidator:
    """Validates plant data for consistency and accuracy"""
    
    VALID_LIFE_FORMS = {
        'phanerophyte', 'chamaephyte', 'hemicryptophyte', 
        'cryptophyte', 'therophyte', 'geophyte', 'hydrophyte',
        'helophyte', 'epiphyte', 'lithophyte', 'aerophyte'
    }
    
    VALID_HEMISPHERES = {'northern', 'southern', 'both'}
    
    VALID_SOURCES = {'natural', 'bred', 'hybrid', 'cultivar'}
    
    @staticmethod
    def validate_life_form(life_form: str) -> Tuple[bool, str]:
        """Validate life form against Raunkiær system"""
        if not life_form:
            return True, ""
        
        life_form_lower = life_form.lower().strip()
        if life_form_lower in PlantDataValidator.VALID_LIFE_FORMS:
            return True, ""
        
        return False, f"Invalid life form: {life_form}. Must be one of {PlantDataValidator.VALID_LIFE_FORMS}"
    
    @staticmethod
    def validate_hemisphere(hemisphere: str) -> Tuple[bool, str]:
        """Validate hemisphere value"""
        if not hemisphere:
            return True, ""
        
        hemisphere_lower = hemisphere.lower().strip()
        if hemisphere_lower in PlantDataValidator.VALID_HEMISPHERES:
            return True, ""
        
        return False, f"Invalid hemisphere: {hemisphere}. Must be one of {PlantDataValidator.VALID_HEMISPHERES}"
    
    @staticmethod
    def validate_source(source: str) -> Tuple[bool, str]:
        """Validate source type"""
        if not source:
            return True, ""
        
        source_lower = source.lower().strip()
        if source_lower in PlantDataValidator.VALID_SOURCES:
            return True, ""
        
        return False, f"Invalid source: {source}. Must be one of {PlantDataValidator.VALID_SOURCES}"
    
    @staticmethod
    def validate_species_name(species: str) -> Tuple[bool, str]:
        """Validate scientific name format"""
        if not species:
            return False, "Species name cannot be empty"
        
        parts = species.strip().split()
        if len(parts) < 2:
            return False, f"Invalid species name format: {species}. Must be binomial"
        
        # Check if first letter of genus is capitalized
        if not parts[0][0].isupper():
            return False, f"Genus name must be capitalized: {species}"
        
        # Check if species epithet is lowercase
        if not parts[1].islower():
            return False, f"Species epithet must be lowercase: {species}"
        
        return True, ""

class DataSourceAdapter:
    """Base class for data source adapters"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.session = requests.Session()
        self.cache_dir = Path("cache")
        self.cache_dir.mkdir(exist_ok=True)
    
    def get_cache_key(self, query: str) -> str:
        """Generate cache key for query"""
        return hashlib.md5(f"{self.__class__.__name__}:{query}".encode()).hexdigest()
    
    def get_cached_data(self, query: str) -> Optional[Dict]:
        """Get cached data if available and fresh"""
        cache_file = self.cache_dir / f"{self.get_cache_key(query)}.json"
        
        if cache_file.exists():
            with open(cache_file, 'r') as f:
                cache_data = json.load(f)
            
            # Check if cache is less than 7 days old
            cache_time = datetime.fromisoformat(cache_data['timestamp'])
            if (datetime.now() - cache_time).days < 7:
                return cache_data['data']
        
        return None
    
    def save_to_cache(self, query: str, data: Dict):
        """Save data to cache"""
        cache_file = self.cache_dir / f"{self.get_cache_key(query)}.json"
        
        cache_data = {
            'timestamp': datetime.now().isoformat(),
            'query': query,
            'data': data
        }
        
        with open(cache_file, 'w') as f:
            json.dump(cache_data, f)
    
    def fetch_plant_data(self, species: str) -> Optional[PlantData]:
        """Fetch plant data from source - to be implemented by subclasses"""
        raise NotImplementedError

class GBIFAdapter(DataSourceAdapter):
    """Adapter for GBIF (Global Biodiversity Information Facility) API"""
    
    BASE_URL = "https://api.gbif.org/v1"
    
    def fetch_plant_data(self, species: str) -> Optional[PlantData]:
        """Fetch plant data from GBIF"""
        # Check cache first
        cached = self.get_cached_data(species)
        if cached:
            logger.info(f"Using cached GBIF data for {species}")
            return self._parse_gbif_response(cached, species)
        
        try:
            # Search for species
            search_url = f"{self.BASE_URL}/species/match"
            params = {"name": species, "kingdom": "Plantae"}
            
            response = self.session.get(search_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data.get('matchType') == 'NONE':
                logger.warning(f"No GBIF match found for {species}")
                return None
            
            # Get detailed species info
            species_key = data.get('usageKey')
            if species_key:
                detail_url = f"{self.BASE_URL}/species/{species_key}"
                detail_response = self.session.get(detail_url)
                detail_response.raise_for_status()
                
                detailed_data = detail_response.json()
                
                # Cache the response
                self.save_to_cache(species, detailed_data)
                
                return self._parse_gbif_response(detailed_data, species)
                
        except Exception as e:
            logger.error(f"Error fetching GBIF data for {species}: {e}")
            return None
    
    def _parse_gbif_response(self, data: Dict, species: str) -> PlantData:
        """Parse GBIF response into PlantData"""
        plant_data = PlantData(
            species=species,
            common_name=data.get('vernacularName'),
            data_sources={'common_name': DataSource.GBIF.display_name}
        )
        
        # Try to determine hemisphere from distribution data
        if 'distributions' in data:
            # This would require additional API calls for distribution data
            pass
        
        return plant_data

class TropicosAdapter(DataSourceAdapter):
    """Adapter for Tropicos (Missouri Botanical Garden) API"""
    
    BASE_URL = "https://services.tropicos.org"
    
    def fetch_plant_data(self, species: str) -> Optional[PlantData]:
        """Fetch plant data from Tropicos"""
        if not self.api_key:
            logger.warning("Tropicos API key not configured")
            return None
        
        # Check cache first
        cached = self.get_cached_data(species)
        if cached:
            logger.info(f"Using cached Tropicos data for {species}")
            return self._parse_tropicos_response(cached, species)
        
        try:
            # Search for name
            search_url = f"{self.BASE_URL}/Name/Search"
            params = {
                "name": species,
                "type": "exact",
                "apikey": self.api_key,
                "format": "json"
            }
            
            response = self.session.get(search_url, params=params)
            response.raise_for_status()
            
            data = response.json()
            
            if data:
                # Cache the response
                self.save_to_cache(species, data[0])
                return self._parse_tropicos_response(data[0], species)
                
        except Exception as e:
            logger.error(f"Error fetching Tropicos data for {species}: {e}")
            return None
    
    def _parse_tropicos_response(self, data: Dict, species: str) -> PlantData:
        """Parse Tropicos response into PlantData"""
        return PlantData(
            species=species,
            literal_latin=data.get('Etymology'),
            data_sources={'literal_latin': DataSource.TROPICOS.display_name}
        )

class ReliablePlantProcessor:
    """Main processor class that aggregates data from multiple sources"""
    
    def __init__(self, config_file: str = "config.json"):
        self.config = self._load_config(config_file)
        self.validator = PlantDataValidator()
        self.adapters = self._initialize_adapters()
        self.processed_data: List[PlantData] = []
    
    def _load_config(self, config_file: str) -> Dict:
        """Load configuration from file or use defaults"""
        default_config = {
            "api_keys": {
                "tropicos": "",
                "ipni": "",
                "eol": ""
            },
            "timeout": 30,
            "max_retries": 3,
            "rate_limit_delay": 1.0
        }
        
        config_path = Path(config_file)
        if config_path.exists():
            with open(config_path, 'r') as f:
                loaded_config = json.load(f)
                default_config.update(loaded_config)
        else:
            # Create default config file
            with open(config_path, 'w') as f:
                json.dump(default_config, f, indent=2)
            logger.info(f"Created default config file: {config_file}")
        
        return default_config
    
    def _initialize_adapters(self) -> List[DataSourceAdapter]:
        """Initialize data source adapters"""
        adapters = [
            GBIFAdapter(),
            TropicosAdapter(api_key=self.config['api_keys'].get('tropicos'))
        ]
        return adapters
    
    def process_csv(self, input_file: str, output_file: str):
        """Process CSV file with plant species"""
        logger.info(f"Processing {input_file}")
        
        # Read input CSV
        df = pd.read_csv(input_file)
        
        # Process each species
        for idx, row in df.iterrows():
            species_raw = str(row['SPECIES']).strip()
            
            if not species_raw or species_raw.lower() == 'nan':
                continue
            
            # Properly capitalize species name (Genus species)
            species_parts = species_raw.lower().split()
            if len(species_parts) >= 2:
                # Capitalize genus, keep species epithet lowercase
                species = species_parts[0].capitalize() + ' ' + ' '.join(species_parts[1:])
            else:
                species = species_raw
            
            # Validate species name
            is_valid, error_msg = self.validator.validate_species_name(species)
            if not is_valid:
                logger.warning(f"Row {idx}: {error_msg}")
                continue
            
            logger.info(f"Processing {species} ({idx + 1}/{len(df)})")
            
            # Aggregate data from all sources
            aggregated_data = self._aggregate_plant_data(species)
            
            # Update DataFrame with aggregated data
            self._update_dataframe_row(df, idx, aggregated_data)
            
            # Rate limiting
            time.sleep(self.config['rate_limit_delay'])
        
        # Add metadata columns
        df['DATA_QUALITY_SCORE'] = df.apply(self._calculate_quality_score, axis=1)
        df['LAST_UPDATED'] = datetime.now().isoformat()
        
        # Save output
        df.to_csv(output_file, index=False)
        logger.info(f"Saved processed data to {output_file}")
        
        # Generate data quality report
        self._generate_quality_report(df)
    
    def _aggregate_plant_data(self, species: str) -> PlantData:
        """Aggregate data from multiple sources"""
        aggregated = PlantData(species=species)
        
        for adapter in self.adapters:
            try:
                plant_data = adapter.fetch_plant_data(species)
                if plant_data:
                    # Merge data, preferring higher reliability sources
                    self._merge_plant_data(aggregated, plant_data)
            except Exception as e:
                logger.error(f"Error with {adapter.__class__.__name__}: {e}")
        
        # Calculate confidence score based on data completeness and source reliability
        aggregated.confidence_score = self._calculate_confidence_score(aggregated)
        
        return aggregated
    
    def _merge_plant_data(self, target: PlantData, source: PlantData):
        """Merge plant data from source into target"""
        fields = ['literal_latin', 'common_name', 'life_form', 
                 'specific_location', 'general_location', 'hemisphere', 'source']
        
        for field in fields:
            source_value = getattr(source, field)
            if source_value and not getattr(target, field):
                setattr(target, field, source_value)
                
                # Track data source
                if source.data_sources and field in source.data_sources:
                    if target.data_sources is None:
                        target.data_sources = {}
                    target.data_sources[field] = source.data_sources[field]
    
    def _calculate_confidence_score(self, plant_data: PlantData) -> float:
        """Calculate confidence score based on data completeness and sources"""
        score = 0.0
        weights = {
            'species': 0.2,
            'literal_latin': 0.1,
            'common_name': 0.15,
            'life_form': 0.15,
            'specific_location': 0.1,
            'general_location': 0.1,
            'hemisphere': 0.1,
            'source': 0.1
        }
        
        for field, weight in weights.items():
            if getattr(plant_data, field):
                # Get source reliability score
                source_name = plant_data.data_sources.get(field, 'MANUAL')
                source_reliability = 0.3  # Default for manual
                
                for data_source in DataSource:
                    if data_source.display_name == source_name:
                        source_reliability = data_source.reliability
                        break
                
                score += weight * source_reliability
        
        return round(score, 2)
    
    def _update_dataframe_row(self, df: pd.DataFrame, idx: int, plant_data: PlantData):
        """Update DataFrame row with plant data"""
        # Only update empty fields
        if pd.isna(df.at[idx, 'LITERAL LATIN']) or df.at[idx, 'LITERAL LATIN'] == '':
            df.at[idx, 'LITERAL LATIN'] = plant_data.literal_latin or ''
        
        if pd.isna(df.at[idx, 'COMMON NAME']) or df.at[idx, 'COMMON NAME'] == '':
            df.at[idx, 'COMMON NAME'] = plant_data.common_name or ''
        
        if pd.isna(df.at[idx, 'LIFE FORM']) or df.at[idx, 'LIFE FORM'] == '':
            df.at[idx, 'LIFE FORM'] = plant_data.life_form or ''
        
        if pd.isna(df.at[idx, 'SPECIFIC LOCATION']) or df.at[idx, 'SPECIFIC LOCATION'] == '':
            df.at[idx, 'SPECIFIC LOCATION'] = plant_data.specific_location or ''
        
        if pd.isna(df.at[idx, 'GENERAL LOCATION']) or df.at[idx, 'GENERAL LOCATION'] == '':
            df.at[idx, 'GENERAL LOCATION'] = plant_data.general_location or ''
        
        if pd.isna(df.at[idx, 'HEMISPHERE']) or df.at[idx, 'HEMISPHERE'] == '':
            df.at[idx, 'HEMISPHERE'] = plant_data.hemisphere or ''
        
        if pd.isna(df.at[idx, 'SOURCE']) or df.at[idx, 'SOURCE'] == '':
            df.at[idx, 'SOURCE'] = plant_data.source or ''
        
        # Add data sources as JSON
        df.at[idx, 'DATA_SOURCES'] = json.dumps(plant_data.data_sources)
        df.at[idx, 'CONFIDENCE_SCORE'] = plant_data.confidence_score
    
    def _calculate_quality_score(self, row) -> float:
        """Calculate data quality score for a row"""
        try:
            return float(row.get('CONFIDENCE_SCORE', 0.0))
        except:
            return 0.0
    
    def _generate_quality_report(self, df: pd.DataFrame):
        """Generate data quality report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_records': len(df),
            'fields_completeness': {},
            'average_confidence': df['DATA_QUALITY_SCORE'].mean() if 'DATA_QUALITY_SCORE' in df else 0,
            'data_source_distribution': {}
        }
        
        # Calculate field completeness
        for column in df.columns:
            if column not in ['DATA_SOURCES', 'CONFIDENCE_SCORE', 'DATA_QUALITY_SCORE', 'LAST_UPDATED']:
                non_empty = df[column].notna() & (df[column] != '')
                report['fields_completeness'][column] = f"{(non_empty.sum() / len(df) * 100):.1f}%"
        
        # Save report
        report_file = 'data_quality_report.json'
        with open(report_file, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"Data quality report saved to {report_file}")

def main():
    """Main function"""
    processor = ReliablePlantProcessor()
    
    input_file = 'data/enhanced_species_table_final.csv'
    output_file = 'data/enhanced_species_table_reliable.csv'
    
    processor.process_csv(input_file, output_file)

if __name__ == "__main__":
    main()