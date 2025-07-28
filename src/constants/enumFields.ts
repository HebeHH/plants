import { EnumFields } from '@/types';

export const enumFields: EnumFields = {
  'GROWTH FORM': ['Tree', 'Herb', 'Shrub', 'Vine'],
  'GEOGRAPHIC ORIGIN': [
    'Europe', 'Asia', 'Eastern North America', 'Western North America', 
    'Mediterranean', 'Australia', 'Africa', 'Central America', 
    'South America', 'Southeast Asia', 'Indian Subcontinent', 
    'Middle East', 'Northern Hemisphere', 'Tropical regions', 
    'Madagascar', 'New Zealand', 'Canary Islands', 'China', 'Japan'
  ],
  'GROWTH HABIT': ['Wild', 'Cultivated', 'Both'],
  'HORTICULTURAL DEVELOPMENT': ['Low', 'Moderate', 'High'],
  'COMMERCIAL STATUS': ['None', 'Limited', 'Major'],
  'CONSERVATION STATUS': [
    'Widespread/Common', 'Locally common', 'Uncommon', 
    'Rare', 'Very rare/Endangered'
  ]
};