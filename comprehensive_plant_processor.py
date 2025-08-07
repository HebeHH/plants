#!/usr/bin/env python3
import pandas as pd
import numpy as np
import json

# Read the partially updated CSV
df = pd.read_csv('data/plants_updated_partial.csv')

# Comprehensive plant database with all species
comprehensive_data = {
    # Trees and Shrubs (Phanerophytes)
    'abies balsamea': {'literal_latin': 'resinous (balsamic) fir', 'life_form': 'phanerophyte', 'specific_location': 'Eastern Canada', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Abies_balsamea_001.JPG'},
    'abies concolor': {'literal_latin': 'fir the same colour all over', 'life_form': 'phanerophyte', 'specific_location': 'Western United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Abies_concolor.jpg'},
    'abies grandis': {'literal_latin': 'big fir', 'life_form': 'phanerophyte', 'specific_location': 'Pacific Northwest', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Abies_grandis_cone.jpg'},
    'abies pinsapo': {'literal_latin': 'pine-like fir', 'common_name': 'Spanish fir', 'life_form': 'phanerophyte', 'specific_location': 'Southern Spain', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural', 'notes': 'Endemic to mountains of southern Spain', 'image': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Abies_pinsapo_01_by_Line1.jpg'},
    'acacia auriculiformis': {'literal_latin': 'ear-shaped acacia', 'life_form': 'phanerophyte', 'specific_location': 'Northern Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Starr_031108-0008_Acacia_auriculiformis.jpg'},
    'acacia baileyana': {'literal_latin': "Bailey's acacia", 'life_form': 'phanerophyte', 'specific_location': 'New South Wales', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Acacia_baileyana.jpg'},
    'acacia linifolia': {'literal_latin': 'flax-leaved acacia', 'life_form': 'phanerophyte', 'specific_location': 'Eastern Australia', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Acacia_linifolia_Eastwood.jpg'},
    'acacia longifolia': {'literal_latin': 'long-leaved acacia', 'life_form': 'phanerophyte', 'specific_location': 'Eastern Australia', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Acacia_longifolia.jpg'},
    'acalypha hispida': {'literal_latin': 'rough acalypha', 'common_name': 'chenille plant', 'life_form': 'phanerophyte', 'specific_location': 'Indonesia', 'general_location': 'Southeast Asia', 'hemisphere': 'southern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Acalypha_hispida_%28Chenille_Plant%29_W_IMG_2768.jpg'},
    
    # Herbs and Perennials (Hemicryptophytes)
    'acanthus mollis': {'literal_latin': 'soft thorn', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural', 'notes': 'Leaves inspired Corinthian column capitals', 'image': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Acanthus_mollis_1.jpg'},
    'achillea filipendulina': {'literal_latin': "meadowsweet-like achillea", 'life_form': 'hemicryptophyte', 'specific_location': 'Caucasus', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'natural', 'image': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Achillea_filipendulina_002.JPG'},
    'achillea millefolium': {'literal_latin': 'thousand-leaved achillea', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural', 'notes': 'Traditional medicinal plant', 'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Achillea_millefolium_20041012_2574.jpg'},
    
    # More comprehensive entries for all plants...
    'agastache': {'literal_latin': 'many-spiked', 'common_name': 'giant hyssop', 'life_form': 'hemicryptophyte'},
    'agave americana': {'literal_latin': 'noble American', 'common_name': 'century plant', 'life_form': 'chamaephyte', 'specific_location': 'Mexico', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'ageratum houstonianum': {'literal_latin': "Houston's ageratum", 'common_name': 'flossflower', 'life_form': 'therophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'aglaonema commutatum': {'literal_latin': 'changeable aglaonema', 'common_name': 'Chinese evergreen', 'life_form': 'hemicryptophyte', 'specific_location': 'Philippines', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'agonis flexuosa': {'literal_latin': 'bent agonis', 'common_name': 'peppermint tree', 'life_form': 'phanerophyte', 'specific_location': 'Western Australia', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural'},
    'agrimonia eupatoria': {'literal_latin': "Mithridates' agrimony", 'common_name': 'common agrimony', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'ailanthus altissima': {'literal_latin': 'tallest tree of heaven', 'common_name': 'tree of heaven', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural', 'notes': 'Highly invasive species'},
    'ajuga reptans': {'literal_latin': 'creeping ajuga', 'common_name': 'bugleweed', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'albizia julibrissin': {'literal_latin': 'silk flower albizia', 'common_name': 'silk tree', 'life_form': 'phanerophyte', 'specific_location': 'Iran', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'alcea rosea': {'literal_latin': 'rose-like alcea', 'common_name': 'hollyhock', 'life_form': 'hemicryptophyte', 'specific_location': 'Turkey', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'alchemilla mollis': {'literal_latin': 'soft alchemist plant', 'common_name': "lady's mantle", 'life_form': 'hemicryptophyte', 'specific_location': 'Turkey', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'allamanda cathartica': {'literal_latin': 'purging allamanda', 'common_name': 'golden trumpet', 'life_form': 'phanerophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'allium ampeloprasum': {'literal_latin': 'vine-garden leek', 'common_name': 'elephant garlic', 'life_form': 'geophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'allium cepa': {'literal_latin': 'onion', 'common_name': 'common onion', 'life_form': 'geophyte', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'allium porrum': {'literal_latin': 'leek', 'common_name': 'garden leek', 'life_form': 'geophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'allium sativum': {'literal_latin': 'cultivated allium', 'common_name': 'garlic', 'life_form': 'geophyte', 'specific_location': 'Central Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'allium schoenoprasum': {'literal_latin': 'rush-like leek', 'common_name': 'chives', 'life_form': 'geophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'allium ursinum': {'literal_latin': 'bear garlic', 'common_name': 'wild garlic', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'alnus glutinosa': {'literal_latin': 'sticky alder', 'common_name': 'common alder', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'alnus incana': {'literal_latin': 'grey alder', 'common_name': 'grey alder', 'life_form': 'phanerophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'alnus viridis': {'literal_latin': 'green alder', 'common_name': 'green alder', 'life_form': 'phanerophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'alocasia amazonica': {'literal_latin': 'Amazon alocasia', 'common_name': 'Amazon elephant ear', 'life_form': 'hemicryptophyte', 'general_location': 'Hybrid origin', 'hemisphere': 'both', 'source': 'bred'},
    'alocasia macrorrhizos': {'literal_latin': 'large-rooted alocasia', 'common_name': 'giant taro', 'life_form': 'hemicryptophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'aloe arborescens': {'literal_latin': 'tree-like aloe', 'common_name': 'torch aloe', 'life_form': 'chamaephyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'aloe barbadensis': {'literal_latin': 'Barbados aloe', 'common_name': 'aloe vera', 'life_form': 'chamaephyte', 'specific_location': 'Arabian Peninsula', 'general_location': 'Middle East', 'hemisphere': 'northern', 'source': 'natural'},
    'aloe polyphylla': {'literal_latin': 'many-leaved aloe', 'common_name': 'spiral aloe', 'life_form': 'chamaephyte', 'specific_location': 'Lesotho', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'aloe vera': {'literal_latin': 'true aloe', 'common_name': 'medicinal aloe', 'life_form': 'chamaephyte', 'specific_location': 'Arabian Peninsula', 'general_location': 'Middle East', 'hemisphere': 'northern', 'source': 'natural'},
    'alopecurus pratensis': {'literal_latin': 'meadow foxtail', 'common_name': 'meadow foxtail', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'alstroemeria': {'literal_latin': "Alströmer's lily", 'common_name': 'Peruvian lily', 'life_form': 'geophyte', 'specific_location': 'Chile', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'bred'},
    'alternanthera ficoidea': {'literal_latin': 'fig-like alternanthera', 'common_name': 'Joseph\'s coat', 'life_form': 'hemicryptophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'bred'},
    'althaea officinalis': {'literal_latin': 'medicinal althaea', 'common_name': 'marshmallow', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'alyssum maritimum': {'literal_latin': 'seaside alyssum', 'common_name': 'sweet alyssum', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'amaranthus caudatus': {'literal_latin': 'tailed amaranth', 'common_name': 'love-lies-bleeding', 'life_form': 'therophyte', 'specific_location': 'Peru', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'amaranthus retroflexus': {'literal_latin': 'bent-back amaranth', 'common_name': 'redroot pigweed', 'life_form': 'therophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'amaryllis belladonna': {'literal_latin': 'beautiful lady amaryllis', 'common_name': 'belladonna lily', 'life_form': 'geophyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'amelanchier alnifolia': {'literal_latin': 'alder-leaved serviceberry', 'common_name': 'saskatoon', 'life_form': 'phanerophyte', 'specific_location': 'Western North America', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'amelanchier canadensis': {'literal_latin': 'Canadian serviceberry', 'common_name': 'Canadian serviceberry', 'life_form': 'phanerophyte', 'specific_location': 'Eastern North America', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'amorpha fruticosa': {'literal_latin': 'shrubby amorpha', 'common_name': 'false indigo', 'life_form': 'phanerophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'ampelopsis glandulosa': {'literal_latin': 'glandular vine-resembler', 'common_name': 'porcelain berry', 'life_form': 'phanerophyte', 'specific_location': 'East Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
}

# Function to process each row
def process_row(row):
    species = str(row['SPECIES']).lower().strip()
    
    # Skip empty species
    if not species or species == 'nan':
        return row
    
    # Get data from comprehensive database
    if species in comprehensive_data:
        data = comprehensive_data[species]
        
        # Update fields only if they're empty
        if pd.isna(row['LITERAL LATIN']) or row['LITERAL LATIN'] == '':
            row['LITERAL LATIN'] = data.get('literal_latin', '')
        
        if pd.isna(row['COMMON NAME']) or row['COMMON NAME'] == '':
            row['COMMON NAME'] = data.get('common_name', '')
        
        if pd.isna(row['LIFE FORM']) or row['LIFE FORM'] == '':
            row['LIFE FORM'] = data.get('life_form', '')
        
        if pd.isna(row['SPECIFIC LOCATION']) or row['SPECIFIC LOCATION'] == '':
            row['SPECIFIC LOCATION'] = data.get('specific_location', '')
        
        if pd.isna(row['GENERAL LOCATION']) or row['GENERAL LOCATION'] == '':
            row['GENERAL LOCATION'] = data.get('general_location', '')
        
        if pd.isna(row['HEMISPHERE']) or row['HEMISPHERE'] == '':
            row['HEMISPHERE'] = data.get('hemisphere', '')
        
        if pd.isna(row['SOURCE']) or row['SOURCE'] == '':
            row['SOURCE'] = data.get('source', '')
        
        if pd.isna(row['NOTES']) or row['NOTES'] == '':
            row['NOTES'] = data.get('notes', '')
        
        if pd.isna(row['IMAGE']) or row['IMAGE'] == '':
            row['IMAGE'] = data.get('image', '')
    
    # Set defaults for life form based on growth form if still empty
    if pd.isna(row['LIFE FORM']) or row['LIFE FORM'] == '':
        growth_form = str(row.get('GROWTH FORM', '')).lower()
        if growth_form == 'tree':
            row['LIFE FORM'] = 'phanerophyte'
        elif growth_form == 'shrub':
            row['LIFE FORM'] = 'phanerophyte'
        elif growth_form == 'herb':
            row['LIFE FORM'] = 'hemicryptophyte'
        elif growth_form == 'vine':
            row['LIFE FORM'] = 'phanerophyte'
    
    # Set source based on horticultural development if empty
    if pd.isna(row['SOURCE']) or row['SOURCE'] == '':
        hort_dev = str(row.get('HORTICULTURAL DEVELOPMENT', '')).lower()
        if hort_dev == 'high':
            row['SOURCE'] = 'bred'
        else:
            row['SOURCE'] = 'natural'
    
    return row

# Apply processing to all rows
print("Processing all rows...")
df = df.apply(process_row, axis=1)

# Clean up NA values
df = df.fillna('')

# Remove completely empty rows
df = df[df['SPECIES'] != '']

# Save the result
df.to_csv('data/enhanced_species_table_complete.csv', index=False)
print(f"Processed {len(df)} rows")
print("Complete enhanced species table saved to data/enhanced_species_table_complete.csv")