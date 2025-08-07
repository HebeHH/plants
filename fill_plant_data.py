#!/usr/bin/env python3
import pandas as pd
import numpy as np

# Read the processed CSV
df = pd.read_csv('data/plants_processing.csv')

# Dictionary to store plant data that we'll fill in manually
plant_data = {
    'abies balsamea': {
        'literal_latin': 'resinous (balsamic) fir',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern Canada',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Abies_balsamea_001.JPG'
    },
    'abies concolor': {
        'literal_latin': 'fir the same colour all over',
        'life_form': 'phanerophyte',
        'specific_location': 'Western United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d0/Abies_concolor.jpg'
    },
    'abies grandis': {
        'literal_latin': 'big fir',
        'life_form': 'phanerophyte',
        'specific_location': 'Pacific Northwest',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/09/Abies_grandis_cone.jpg'
    },
    'abies pinsapo': {
        'literal_latin': 'pine-like fir',
        'common_name': 'Spanish fir',
        'life_form': 'phanerophyte',
        'specific_location': 'Southern Spain',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Endemic to mountains of southern Spain',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Abies_pinsapo_01_by_Line1.jpg'
    },
    'acacia auriculiformis': {
        'literal_latin': 'acacia of ear-like form',
        'life_form': 'phanerophyte',
        'specific_location': 'Northern Australia',
        'general_location': 'Oceania',
        'hemisphere': 'southern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Starr_031108-0008_Acacia_auriculiformis.jpg'
    },
    'acacia baileyana': {
        'literal_latin': "Bailey's acacia",
        'common_name': 'Cootamundra wattle',
        'life_form': 'phanerophyte',
        'specific_location': 'New South Wales',
        'general_location': 'Australia',
        'hemisphere': 'southern',
        'source': 'natural',
        'notes': 'Popular ornamental with grey-green foliage',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/3/3b/Acacia_baileyana.jpg'
    },
    'acacia linifolia': {
        'literal_latin': 'flax-leaved acacia',
        'common_name': 'flax-leaved wattle',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern Australia',
        'general_location': 'Australia',
        'hemisphere': 'southern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/1/17/Acacia_linifolia_Eastwood.jpg'
    },
    'acacia longifolia': {
        'literal_latin': 'long-leaved acacia',
        'common_name': 'Sydney golden wattle',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern Australia',
        'general_location': 'Australia',
        'hemisphere': 'southern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d9/Acacia_longifolia.jpg'
    },
    'acalypha hispida': {
        'literal_latin': 'rough acalypha',
        'common_name': 'chenille plant',
        'life_form': 'phanerophyte',
        'specific_location': 'Indonesia',
        'general_location': 'Southeast Asia',
        'hemisphere': 'southern',
        'source': 'natural',
        'notes': 'Named for its fuzzy red flower spikes',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Acalypha_hispida_%28Chenille_Plant%29_W_IMG_2768.jpg'
    },
    'acanthus mollis': {
        'literal_latin': 'soft thorn',
        'life_form': 'hemicryptophyte',
        'specific_location': '',
        'general_location': 'Mediterranean',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Leaves inspired Corinthian column capitals',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Acanthus_mollis_1.jpg'
    },
    'acca sellowiana': {
        'literal_latin': "Sellow's acca",
        'common_name': 'pineapple guava',
        'life_form': 'phanerophyte',
        'specific_location': 'Southern Brazil',
        'general_location': 'South America',
        'hemisphere': 'southern',
        'source': 'natural',
        'notes': 'Edible fruit and flower petals',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/Feijoa_sellowiana_fruit.jpg'
    },
    'acer campestre': {
        'literal_latin': 'field maple',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/a/a1/Acer_campestre_006.jpg'
    },
    'acer circinatum': {
        'literal_latin': 'circular maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Pacific Northwest',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Leaves arranged in circles',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/5/51/Acer_circinatum_9643.JPG'
    },
    'acer griseum': {
        'literal_latin': 'grey maple',
        'common_name': 'paperbark maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Central China',
        'general_location': 'East Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Distinctive peeling cinnamon-colored bark',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/9/92/Acer_griseum_01.jpg'
    },
    'acer japonicum': {
        'literal_latin': 'maple from Japan',
        'common_name': 'downy Japanese maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Japan',
        'general_location': 'East Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Acer_japonicum_03.jpg'
    },
    'acer monspessulanum': {
        'literal_latin': 'Montpellier maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Southern Europe',
        'general_location': 'Mediterranean',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Acer_monspessulanum_005.jpg'
    },
    'acer negundo': {
        'literal_latin': 'negundo maple',
        'common_name': 'box elder',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Only maple with compound leaves',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/4/42/2014-04-07_Acer_negundo_2.jpg'
    },
    'acer nigrum': {
        'literal_latin': 'black maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/a/a2/Acer_nigrum.jpg'
    },
    'acer palmatum': {
        'literal_latin': 'hand-shaped maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Japan',
        'general_location': 'East Asia',
        'hemisphere': 'northern',
        'source': 'bred',
        'notes': 'Hundreds of cultivars exist',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Acer_palmatum_003.jpg'
    },
    'acer pensylvanicum': {
        'literal_latin': 'maple from Pennsylvania',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Green bark with white stripes',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/6/61/Acer_pensylvanicum.jpg'
    },
    'acer platanoides': {
        'literal_latin': 'maple that\'s like a plane tree',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Acer_platanoides_006.jpg'
    },
    'acer pseudoplatanus': {
        'literal_latin': 'false plane tree',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Acer_pseudoplatanus_002.jpg'
    },
    'acer rubrum': {
        'literal_latin': 'red maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/5/52/Acer_rubrum_001.jpg'
    },
    'acer saccharinum': {
        'literal_latin': 'sugary maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Fast-growing with silvery leaf undersides',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Acer_saccharinum_20090423.jpg'
    },
    'acer saccharum': {
        'literal_latin': 'sugar maple',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Primary source of maple syrup',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/04/Acer_saccharum_1-jgreenlee.jpg'
    },
    'acer spicatum': {
        'literal_latin': 'maple with a spike',
        'life_form': 'phanerophyte',
        'specific_location': 'Eastern Canada',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/2/26/Acer_spicatum.jpg'
    },
    'acer tataricum': {
        'literal_latin': 'Tatar maple',
        'common_name': 'Tatarian maple',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'Eastern Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Acer_tataricum_1.jpg'
    },
    'acer tetramerum': {
        'literal_latin': 'four-part maple',
        'life_form': 'phanerophyte',
        'specific_location': 'China',
        'general_location': 'East Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/b/b7/Acer_tetramerum_var._betulifolium.JPG'
    },
    'achillea filipendulina': {
        'literal_latin': 'achilles that\'s like meadowsweet',
        'life_form': 'hemicryptophyte',
        'specific_location': 'Caucasus',
        'general_location': 'Central Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Achillea_filipendulina_002.JPG'
    },
    'achillea millefolium': {
        'literal_latin': 'achilles with a thousand leaves',
        'life_form': 'hemicryptophyte',
        'specific_location': '',
        'general_location': 'Northern Hemisphere',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Traditional medicinal plant',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0a/Achillea_millefolium_20041012_2574.jpg'
    },
    'adansonia digitata': {
        'literal_latin': 'finger-like Adansonia',
        'common_name': 'African baobab',
        'life_form': 'phanerophyte',
        'specific_location': '',
        'general_location': 'Africa',
        'hemisphere': 'southern',
        'source': 'natural',
        'notes': 'Can live over 1000 years',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/a/a8/Adansonia_digitata_2.jpg'
    },
    'adenium obesum': {
        'literal_latin': 'fat adenium',
        'life_form': 'phanerophyte',
        'specific_location': 'East Africa',
        'general_location': 'Africa',
        'hemisphere': 'southern',
        'source': 'bred',
        'notes': 'Succulent with swollen trunk',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Adenium_obesum_%27Singapore%27_01.jpg'
    },
    'adiantum capillus-veneris': {
        'literal_latin': 'Venus\'s hair',
        'life_form': 'hemicryptophyte',
        'specific_location': '',
        'general_location': 'Worldwide',
        'hemisphere': 'both',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/b/b4/Adiantum_capillus-veneris_1.jpg'
    },
    'adiantum jordanii': {
        'literal_latin': 'Jordan\'s maidenhair',
        'life_form': 'hemicryptophyte',
        'specific_location': 'California',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Adiantum_jordanii_9.jpg'
    },
    'adonidia merrilii': {
        'literal_latin': 'Merrill\'s adonidia',
        'common_name': 'Christmas palm',
        'life_form': 'phanerophyte',
        'specific_location': 'Philippines',
        'general_location': 'Southeast Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Red fruits appear around Christmas',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/0/0d/Adonidia_merrillii.jpg'
    },
    'adonis aestivalis': {
        'literal_latin': 'summer Adonis',
        'life_form': 'therophyte',
        'specific_location': '',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Annual wildflower',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/e/e5/Adonis_aestivalis_flowers.jpg'
    },
    'aechmea bracteata': {
        'literal_latin': 'bracted aechmea',
        'life_form': 'epiphyte',
        'specific_location': 'Mexico',
        'general_location': 'Central America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/8/83/Aechmea_bracteata_1.jpg'
    },
    'aechmea fasciata': {
        'literal_latin': 'banded aechmea',
        'common_name': 'silver vase plant',
        'life_form': 'epiphyte',
        'specific_location': 'Brazil',
        'general_location': 'South America',
        'hemisphere': 'southern',
        'source': 'natural',
        'notes': 'Popular houseplant bromeliad',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Aechmea_fasciata_-_JBM.jpg'
    },
    'aegle marmelos': {
        'literal_latin': 'marmalade aegle',
        'common_name': 'bael fruit',
        'life_form': 'phanerophyte',
        'specific_location': 'India',
        'general_location': 'South Asia',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Sacred tree in Hinduism',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Bael_%28Aegle_marmelos%29_tree_at_Narendrapur_W_IMG_4116.jpg'
    },
    'aegopodium podagraria': {
        'literal_latin': 'goat\'s foot for gout',
        'life_form': 'hemicryptophyte',
        'specific_location': '',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Invasive garden weed',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Aegopodium_podagraria1.jpg'
    },
    'aeonium arboreum': {
        'literal_latin': 'tree-like aeonium',
        'life_form': 'chamaephyte',
        'specific_location': 'Canary Islands',
        'general_location': 'Macaronesia',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Succulent rosettes on woody stems',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/6/63/Aeonium_arboreum_kz1.JPG'
    },
    'aesculus hippocastanum': {
        'literal_latin': 'horse chestnut',
        'life_form': 'phanerophyte',
        'specific_location': 'Balkans',
        'general_location': 'Europe',
        'hemisphere': 'northern',
        'source': 'natural',
        'notes': 'Seeds used in conkers game',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/3/31/Aesculus_hippocastanum_fruit.jpg'
    },
    'aesculus parviflora': {
        'literal_latin': 'small-flowered horse chestnut',
        'life_form': 'phanerophyte',
        'specific_location': 'Southeastern United States',
        'general_location': 'North America',
        'hemisphere': 'northern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/4/46/Aesculus_parviflora_kz01.jpg'
    },
    'afrocarpus falcatus': {
        'literal_latin': 'sickle-shaped African fruit',
        'life_form': 'phanerophyte',
        'specific_location': 'South Africa',
        'general_location': 'Africa',
        'hemisphere': 'southern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Podocarpus-falcatus-20080330.JPG'
    },
    'agapanthus praecox': {
        'literal_latin': 'love flower that develops early',
        'life_form': 'hemicryptophyte',
        'specific_location': 'South Africa',
        'general_location': 'Africa',
        'hemisphere': 'southern',
        'source': 'natural',
        'image': 'https://upload.wikimedia.org/wikipedia/commons/7/75/Agapanthus_praecox_orientalis_Willd_01.jpg'
    }
}

# Update the dataframe with the manual data
for idx, row in df.iterrows():
    species = str(row['SPECIES']).lower().strip()
    
    if species in plant_data:
        data = plant_data[species]
        
        # Update literal latin if empty
        if pd.isna(row['LITERAL LATIN']) or row['LITERAL LATIN'] == '':
            df.at[idx, 'LITERAL LATIN'] = data.get('literal_latin', '')
        
        # Update common name if empty
        if pd.isna(row['COMMON NAME']) or row['COMMON NAME'] == '':
            df.at[idx, 'COMMON NAME'] = data.get('common_name', '')
        
        # Update life form
        if row['LIFE FORM'] == '' and 'life_form' in data:
            df.at[idx, 'LIFE FORM'] = data['life_form']
        
        # Update locations
        if row['SPECIFIC LOCATION'] == '':
            df.at[idx, 'SPECIFIC LOCATION'] = data.get('specific_location', '')
        if row['GENERAL LOCATION'] == '':
            df.at[idx, 'GENERAL LOCATION'] = data.get('general_location', '')
        if row['HEMISPHERE'] == '':
            df.at[idx, 'HEMISPHERE'] = data.get('hemisphere', '')
        
        # Update source
        if row['SOURCE'] == '':
            df.at[idx, 'SOURCE'] = data.get('source', '')
        
        # Update notes
        if row['NOTES'] == '' and 'notes' in data:
            df.at[idx, 'NOTES'] = data['notes']
        
        # Update image
        if row['IMAGE'] == '' and 'image' in data:
            df.at[idx, 'IMAGE'] = data['image']

# Clean up empty rows
df = df[df['SPECIES'].notna() & (df['SPECIES'] != '')]

# Save the updated file
df.to_csv('data/plants_updated_partial.csv', index=False)
print(f"Updated {len(df)} rows with partial data")
print("This is a partial update. More comprehensive data filling needed...")