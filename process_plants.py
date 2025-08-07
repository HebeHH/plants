#!/usr/bin/env python3
import pandas as pd
import re
import numpy as np

# Read the CSV file
df = pd.read_csv('data/enhanced_species_table.csv')

# Create new columns
df['LIFE FORM'] = ''
df['SPECIFIC LOCATION'] = ''
df['GENERAL LOCATION'] = ''
df['HEMISPHERE'] = ''
df['SOURCE'] = ''
df['NOTES'] = ''
df['IMAGE'] = ''

# Function to determine Raunkiær life form based on growth form and other characteristics
def get_life_form(row):
    growth_form = str(row.get('GROWTH FORM', '')).lower()
    life_form_type = str(row.get('LIFE-FORM TYPE', '')).lower()
    species = str(row.get('SPECIES', '')).lower()
    
    # Handle specific life-form types that already exist
    if 'hydrophyte' in life_form_type:
        return 'hydrophyte'
    elif 'halophyte' in life_form_type:
        return 'hemicryptophyte'  # Most halophytes are hemicryptophytes
    elif 'geophyte' in life_form_type:
        return 'geophyte'
    elif 'epiphyte' in life_form_type:
        return 'epiphyte'
    elif 'chamaephyte' in life_form_type:
        return 'chamaephyte'
    
    # Based on growth form
    if growth_form == 'tree':
        return 'phanerophyte'
    elif growth_form == 'shrub':
        # Most shrubs are phanerophytes, but some small ones might be chamaephytes
        return 'phanerophyte'
    elif growth_form == 'herb':
        # Most herbs are hemicryptophytes, but annuals are therophytes
        # and bulbs/corms are geophytes
        if any(term in species for term in ['annual', 'annua']):
            return 'therophyte'
        elif any(term in species for term in ['bulb', 'corm', 'tuber']):
            return 'geophyte'
        else:
            return 'hemicryptophyte'
    elif growth_form == 'vine':
        return 'phanerophyte'  # Most vines are phanerophytes
    
    return ''

# Function to clean up growth form
def clean_growth_form(value):
    if pd.isna(value) or value == 'NA':
        return 'unknown'
    value = str(value).lower().strip()
    if value in ['herb', 'shrub', 'tree', 'vine']:
        return value
    elif 'tree' in value:
        return 'tree'
    elif 'shrub' in value:
        return 'shrub'
    elif 'herb' in value:
        return 'herb'
    elif 'vine' in value:
        return 'vine'
    else:
        return 'other'

# Function to split geographic origin
def split_geographic_origin(origin):
    if pd.isna(origin) or origin == 'NA':
        return '', '', ''
    
    origin = str(origin).lower()
    
    # Hemisphere
    hemisphere = ''
    if 'northern' in origin or any(loc in origin for loc in ['europe', 'north america', 'asia', 'mediterranean', 'japan', 'china']):
        hemisphere = 'northern'
    elif 'southern' in origin or any(loc in origin for loc in ['australia', 'south america', 'africa', 'new zealand']):
        hemisphere = 'southern'
    elif 'worldwide' in origin or 'tropical' in origin:
        hemisphere = 'both'
    
    # Specific and general locations
    specific = ''
    general = ''
    
    # Map origins to locations
    if 'spain' in origin:
        specific = 'Spain'
        general = 'Europe'
    elif 'japan' in origin:
        specific = 'Japan'
        general = 'East Asia'
    elif 'china' in origin:
        specific = 'China'
        general = 'East Asia'
    elif 'australia' in origin:
        specific = 'Australia'
        general = 'Oceania'
    elif 'mediterranean' in origin:
        specific = ''
        general = 'Mediterranean'
    elif 'eastern north america' in origin:
        specific = 'Eastern United States'
        general = 'North America'
    elif 'western north america' in origin:
        specific = 'Western United States'
        general = 'North America'
    elif 'north america' in origin:
        specific = ''
        general = 'North America'
    elif 'south america' in origin:
        specific = ''
        general = 'South America'
    elif 'central america' in origin:
        specific = ''
        general = 'Central America'
    elif 'europe' in origin:
        specific = ''
        general = 'Europe'
    elif 'africa' in origin:
        specific = ''
        general = 'Africa'
    elif 'asia' in origin:
        specific = ''
        general = 'Asia'
    elif 'southeast asia' in origin:
        specific = ''
        general = 'Southeast Asia'
    elif 'central asia' in origin:
        specific = ''
        general = 'Central Asia'
    elif 'indian subcontinent' in origin:
        specific = 'India'
        general = 'South Asia'
    elif 'canary islands' in origin:
        specific = 'Canary Islands'
        general = 'Macaronesia'
    elif 'worldwide' in origin:
        specific = ''
        general = 'Worldwide'
    
    return specific, general, hemisphere

# Function to determine source (natural vs bred)
def get_source(row):
    horticultural = str(row.get('HORTICULTURAL DEVELOPMENT', '')).lower()
    growth_habit = str(row.get('GROWTH HABIT', '')).lower()
    
    if horticultural == 'high' or growth_habit == 'cultivated':
        return 'bred'
    else:
        return 'natural'

# Process each row
for idx, row in df.iterrows():
    # Skip empty rows
    if pd.isna(row['SPECIES']) or row['SPECIES'] == '':
        continue
    
    # Clean growth form
    df.at[idx, 'GROWTH FORM'] = clean_growth_form(row['GROWTH FORM'])
    
    # Get life form
    df.at[idx, 'LIFE FORM'] = get_life_form(row)
    
    # Split geographic origin
    specific, general, hemisphere = split_geographic_origin(row['GEOGRAPHIC ORIGIN'])
    df.at[idx, 'SPECIFIC LOCATION'] = specific
    df.at[idx, 'GENERAL LOCATION'] = general
    df.at[idx, 'HEMISPHERE'] = hemisphere
    
    # Get source
    df.at[idx, 'SOURCE'] = get_source(row)

# Remove the old LIFE-FORM TYPE column
df = df.drop(columns=['LIFE-FORM TYPE'])

# Reorder columns
column_order = [
    'SPECIES', 'LITERAL LATIN', 'COMMON NAME', 'GENUS', 'FAMILY', 'ORDER', 
    'CLADE', 'COMMON GENUS NAME', 'COMMON FAMILY NAME', 'LIFE FORM', 
    'SEEN AT', 'GROWTH FORM', 'SPECIFIC LOCATION', 'GENERAL LOCATION', 
    'HEMISPHERE', 'GROWTH HABIT', 'HORTICULTURAL DEVELOPMENT', 
    'COMMERCIAL STATUS', 'CONSERVATION STATUS', 'SOURCE', 'NOTES', 'IMAGE'
]

# Remove duplicate 'GEOGRAPHIC ORIGIN' column
df = df[column_order]

# Save intermediate result
df.to_csv('data/plants_processing.csv', index=False)
print(f"Processed {len(df)} rows")
print("Initial processing complete. Now need to fill missing data...")