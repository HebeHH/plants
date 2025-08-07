#!/usr/bin/env python3
import pandas as pd
import numpy as np

# Read the CSV
df = pd.read_csv('data/enhanced_species_table_final.csv')

# Ultimate comprehensive plant database
plant_db = {
    # C continued
    'calathea zebrina': {'literal_latin': 'zebra-striped calathea', 'common_name': 'zebra plant', 'life_form': 'hemicryptophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'calendula officinalis': {'literal_latin': 'medicinal marigold', 'common_name': 'pot marigold', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'callistemon citrinus': {'literal_latin': 'lemon-scented bottlebrush', 'common_name': 'crimson bottlebrush', 'life_form': 'phanerophyte', 'specific_location': 'Eastern Australia', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural'},
    'calotropis procera': {'literal_latin': 'tall calotropis', 'common_name': 'apple of Sodom', 'life_form': 'phanerophyte', 'general_location': 'Africa', 'hemisphere': 'both', 'source': 'natural'},
    'caltha palustris': {'literal_latin': 'marsh marigold', 'common_name': 'kingcup', 'life_form': 'helophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'camellia japonica': {'literal_latin': 'Japanese camellia', 'common_name': 'common camellia', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'camellia sinensis': {'literal_latin': 'Chinese camellia', 'common_name': 'tea plant', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'campanula rotundifolia': {'literal_latin': 'round-leaved bellflower', 'common_name': 'harebell', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'campsis radicans': {'literal_latin': 'rooting trumpet vine', 'common_name': 'trumpet creeper', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'canavalia rosea': {'literal_latin': 'pink canavalia', 'common_name': 'beach bean', 'life_form': 'hemicryptophyte', 'general_location': 'Tropical coasts', 'hemisphere': 'both', 'source': 'natural'},
    'canna indica': {'literal_latin': 'Indian shot', 'common_name': 'Indian shot', 'life_form': 'geophyte', 'specific_location': 'Caribbean', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'cannabis sativa': {'literal_latin': 'cultivated hemp', 'common_name': 'hemp', 'life_form': 'therophyte', 'specific_location': 'Central Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'capparis spinosa': {'literal_latin': 'thorny caper', 'common_name': 'caper bush', 'life_form': 'chamaephyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'capsella bursa-pastoris': {'literal_latin': "shepherd's purse", 'common_name': "shepherd's purse", 'life_form': 'therophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'capsicum annuum': {'literal_latin': 'annual pepper', 'common_name': 'bell pepper', 'life_form': 'therophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'caragana arborescens': {'literal_latin': 'tree-like caragana', 'common_name': 'Siberian pea tree', 'life_form': 'phanerophyte', 'specific_location': 'Siberia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cardamine pratensis': {'literal_latin': 'meadow cress', 'common_name': "cuckooflower", 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'carduus nutans': {'literal_latin': 'nodding thistle', 'common_name': 'musk thistle', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'carex': {'literal_latin': 'sedge', 'common_name': 'sedge', 'life_form': 'hemicryptophyte', 'general_location': 'Worldwide', 'hemisphere': 'both', 'source': 'natural'},
    'carica papaya': {'literal_latin': 'papaya', 'common_name': 'papaya', 'life_form': 'phanerophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'carissa macrocarpa': {'literal_latin': 'large-fruited carissa', 'common_name': 'Natal plum', 'life_form': 'phanerophyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'carlina acaulis': {'literal_latin': 'stemless carline', 'common_name': 'stemless carline thistle', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'carpinus betulus': {'literal_latin': 'birch-like hornbeam', 'common_name': 'European hornbeam', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'carpobrotus edulis': {'literal_latin': 'edible fruit-capsule', 'common_name': 'hottentot fig', 'life_form': 'chamaephyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'carthamus tinctorius': {'literal_latin': 'dyer\'s safflower', 'common_name': 'safflower', 'life_form': 'therophyte', 'general_location': 'Middle East', 'hemisphere': 'northern', 'source': 'bred'},
    'carum carvi': {'literal_latin': 'caraway', 'common_name': 'caraway', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'bred'},
    'carya illinoinensis': {'literal_latin': 'Illinois hickory', 'common_name': 'pecan', 'life_form': 'phanerophyte', 'specific_location': 'Southern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'bred'},
    'caryophyllus aromaticus': {'literal_latin': 'aromatic clove', 'common_name': 'clove', 'life_form': 'phanerophyte', 'specific_location': 'Indonesia', 'general_location': 'Southeast Asia', 'hemisphere': 'southern', 'source': 'bred'},
    'caryota mitis': {'literal_latin': 'mild fishtail palm', 'common_name': 'clustering fishtail palm', 'life_form': 'phanerophyte', 'specific_location': 'Myanmar', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cassia fistula': {'literal_latin': 'pipe cassia', 'common_name': 'golden shower tree', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'castanea dentata': {'literal_latin': 'toothed chestnut', 'common_name': 'American chestnut', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'castanea sativa': {'literal_latin': 'cultivated chestnut', 'common_name': 'sweet chestnut', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'casuarina cunninghamiana': {'literal_latin': "Cunningham's she-oak", 'common_name': 'river she-oak', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'casuarina equisetifolia': {'literal_latin': 'horsetail-leaved she-oak', 'common_name': 'Australian pine', 'life_form': 'phanerophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'both', 'source': 'natural'},
    'catalpa bignonioides': {'literal_latin': 'bignonia-like catalpa', 'common_name': 'southern catalpa', 'life_form': 'phanerophyte', 'specific_location': 'Southeastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'catalpa speciosa': {'literal_latin': 'showy catalpa', 'common_name': 'northern catalpa', 'life_form': 'phanerophyte', 'specific_location': 'Central United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'catharanthus roseus': {'literal_latin': 'pure pink flower', 'common_name': 'Madagascar periwinkle', 'life_form': 'chamaephyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'cattleya': {'literal_latin': "Cattley's orchid", 'common_name': 'cattleya orchid', 'life_form': 'epiphyte', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'bred'},
    'ceanothus': {'literal_latin': 'spiny plant', 'common_name': 'California lilac', 'life_form': 'phanerophyte', 'specific_location': 'California', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'cecropia': {'literal_latin': "Cecrops' tree", 'common_name': 'trumpet tree', 'life_form': 'phanerophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'cedrus atlantica': {'literal_latin': 'Atlas cedar', 'common_name': 'Atlas cedar', 'life_form': 'phanerophyte', 'specific_location': 'Morocco', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'natural'},
    'cedrus deodara': {'literal_latin': 'divine cedar', 'common_name': 'deodar cedar', 'life_form': 'phanerophyte', 'specific_location': 'Himalayas', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cedrus libani': {'literal_latin': 'cedar of Lebanon', 'common_name': 'cedar of Lebanon', 'life_form': 'phanerophyte', 'specific_location': 'Lebanon', 'general_location': 'Middle East', 'hemisphere': 'northern', 'source': 'natural'},
    'ceiba pentandra': {'literal_latin': 'five-angled ceiba', 'common_name': 'kapok tree', 'life_form': 'phanerophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'celosia argentea': {'literal_latin': 'silvery celosia', 'common_name': 'silver cock\'s comb', 'life_form': 'therophyte', 'general_location': 'Africa', 'hemisphere': 'both', 'source': 'bred'},
    'celtis australis': {'literal_latin': 'southern hackberry', 'common_name': 'European nettle tree', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'cenchrus ciliaris': {'literal_latin': 'fringed sandbur', 'common_name': 'buffel grass', 'life_form': 'hemicryptophyte', 'general_location': 'Africa', 'hemisphere': 'both', 'source': 'natural'},
    'centaurea cyanus': {'literal_latin': 'blue centaury', 'common_name': 'cornflower', 'life_form': 'therophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'centaurea montana': {'literal_latin': 'mountain centaury', 'common_name': 'mountain cornflower', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'centaurium erythraea': {'literal_latin': 'red centaury', 'common_name': 'common centaury', 'life_form': 'therophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'centranthus ruber': {'literal_latin': 'red spur-flower', 'common_name': 'red valerian', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'cephalanthus occidentalis': {'literal_latin': 'western buttonbush', 'common_name': 'buttonbush', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'cerastium tomentosum': {'literal_latin': 'woolly mouse-ear', 'common_name': 'snow-in-summer', 'life_form': 'chamaephyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'ceratonia siliqua': {'literal_latin': 'pod-bearing carob', 'common_name': 'carob tree', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'ceratophyllum demersum': {'literal_latin': 'submerged horn-leaf', 'common_name': 'hornwort', 'life_form': 'hydrophyte', 'general_location': 'Worldwide', 'hemisphere': 'both', 'source': 'natural'},
    'ceratostigma plumbaginoides': {'literal_latin': 'leadwort-like ceratostigma', 'common_name': 'blue leadwort', 'life_form': 'hemicryptophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cercidiphyllum japonicum': {'literal_latin': 'Japanese Judas-tree-leaf', 'common_name': 'katsura', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cercis canadensis': {'literal_latin': 'Canadian Judas tree', 'common_name': 'eastern redbud', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'cercis chinensis': {'literal_latin': 'Chinese Judas tree', 'common_name': 'Chinese redbud', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cercis siliquastrum': {'literal_latin': 'pod-bearing Judas tree', 'common_name': 'Judas tree', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'cestrum nocturnum': {'literal_latin': 'night cestrum', 'common_name': 'night-blooming jasmine', 'life_form': 'phanerophyte', 'general_location': 'Caribbean', 'hemisphere': 'northern', 'source': 'natural'},
    'chaenomeles japonica': {'literal_latin': 'Japanese gaping apple', 'common_name': 'Japanese quince', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'chamaecyparis lawsoniana': {'literal_latin': "Lawson's ground cypress", 'common_name': 'Port Orford cedar', 'life_form': 'phanerophyte', 'specific_location': 'Oregon', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'chamaerops humilis': {'literal_latin': 'low ground bush', 'common_name': 'Mediterranean fan palm', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'chamerion angustifolium': {'literal_latin': 'narrow-leaved dwarf bay-willow', 'common_name': 'fireweed', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'chelidonium majus': {'literal_latin': 'greater celandine', 'common_name': 'greater celandine', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'chenopodium album': {'literal_latin': 'white goosefoot', 'common_name': 'lamb\'s quarters', 'life_form': 'therophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'chenopodium quinoa': {'literal_latin': 'quinoa goosefoot', 'common_name': 'quinoa', 'life_form': 'therophyte', 'specific_location': 'Peru', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'bred'},
    'choisya ternata': {'literal_latin': 'three-part choisya', 'common_name': 'Mexican orange', 'life_form': 'phanerophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'chromolaena odorata': {'literal_latin': 'fragrant chromolaena', 'common_name': 'Siam weed', 'life_form': 'phanerophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'cichorium intybus': {'literal_latin': 'endive chicory', 'common_name': 'common chicory', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cinchona ledgeriana': {'literal_latin': "Ledger's cinchona", 'common_name': 'quinine tree', 'life_form': 'phanerophyte', 'specific_location': 'Peru', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'cirsium arvense': {'literal_latin': 'field thistle', 'common_name': 'Canada thistle', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cirsium vulgare': {'literal_latin': 'common thistle', 'common_name': 'spear thistle', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cissus verticillata': {'literal_latin': 'whorled cissus', 'common_name': 'princess vine', 'life_form': 'phanerophyte', 'general_location': 'Tropical America', 'hemisphere': 'both', 'source': 'natural'},
    'cistanche phelypaea': {'literal_latin': "Phelypaea's cistanche", 'common_name': 'desert hyacinth', 'life_form': 'geophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'citrullus lanatus': {'literal_latin': 'woolly watermelon', 'common_name': 'watermelon', 'life_form': 'therophyte', 'specific_location': 'Southern Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'bred'},
    'citrus aurantium': {'literal_latin': 'golden citrus', 'common_name': 'bitter orange', 'life_form': 'phanerophyte', 'specific_location': 'Southeast Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'citrus limon': {'literal_latin': 'lemon citrus', 'common_name': 'lemon', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'clematis tangutica': {'literal_latin': 'Tangut clematis', 'common_name': 'golden clematis', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'clerodendrum paniculatum': {'literal_latin': 'panicled glory tree', 'common_name': 'pagoda flower', 'life_form': 'phanerophyte', 'specific_location': 'Indonesia', 'general_location': 'Southeast Asia', 'hemisphere': 'southern', 'source': 'natural'},
    'clerodendrum quadriloculare': {'literal_latin': 'four-chambered glory tree', 'common_name': 'bronze-leaved clerodendrum', 'life_form': 'phanerophyte', 'specific_location': 'Philippines', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'clerodendrum thomsoniae': {'literal_latin': "Thomson's glory tree", 'common_name': 'bleeding heart vine', 'life_form': 'phanerophyte', 'specific_location': 'West Africa', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'natural'},
    'clerodendrum trichotomum': {'literal_latin': 'three-forked glory tree', 'common_name': 'harlequin glorybower', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'clethra alnifolia': {'literal_latin': 'alder-leaved clethra', 'common_name': 'sweet pepperbush', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'clidemia hirta': {'literal_latin': 'hairy clidemia', 'common_name': "Koster's curse", 'life_form': 'phanerophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'clinopodium nepeta': {'literal_latin': 'catnip-like clinopodium', 'common_name': 'lesser calamint', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'cocos nucifera': {'literal_latin': 'nut-bearing coconut', 'common_name': 'coconut palm', 'life_form': 'phanerophyte', 'general_location': 'Indo-Pacific', 'hemisphere': 'both', 'source': 'natural'},
    'coffea arabica': {'literal_latin': 'Arabian coffee', 'common_name': 'arabica coffee', 'life_form': 'phanerophyte', 'specific_location': 'Ethiopia', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'bred'},
    'coleus blumei': {'literal_latin': "Blume's coleus", 'common_name': 'painted nettle', 'life_form': 'hemicryptophyte', 'specific_location': 'Indonesia', 'general_location': 'Southeast Asia', 'hemisphere': 'southern', 'source': 'bred'},
    'colocasia esculenta': {'literal_latin': 'edible colocasia', 'common_name': 'taro', 'life_form': 'geophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'combretum indicum': {'literal_latin': 'Indian combretum', 'common_name': 'Rangoon creeper', 'life_form': 'phanerophyte', 'specific_location': 'Myanmar', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'commelina benghalensis': {'literal_latin': 'Bengal dayflower', 'common_name': 'tropical spiderwort', 'life_form': 'hemicryptophyte', 'general_location': 'Tropical Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'convallaria majalis': {'literal_latin': 'May valley lily', 'common_name': 'lily of the valley', 'life_form': 'geophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'convolvulus arvensis': {'literal_latin': 'field bindweed', 'common_name': 'field bindweed', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'conyza canadensis': {'literal_latin': 'Canadian fleabane', 'common_name': 'horseweed', 'life_form': 'therophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'coprosma repens': {'literal_latin': 'creeping dung-smell', 'common_name': 'mirror plant', 'life_form': 'phanerophyte', 'specific_location': 'New Zealand', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'cordyline australis': {'literal_latin': 'southern club', 'common_name': 'cabbage tree', 'life_form': 'phanerophyte', 'specific_location': 'New Zealand', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'cordyline fruticosa': {'literal_latin': 'shrubby club', 'common_name': 'ti plant', 'life_form': 'phanerophyte', 'general_location': 'Pacific Islands', 'hemisphere': 'both', 'source': 'bred'},
    'coreopsis lanceolata': {'literal_latin': 'lance-leaved tickseed', 'common_name': 'lanceleaf coreopsis', 'life_form': 'hemicryptophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'coriandrum sativum': {'literal_latin': 'cultivated coriander', 'common_name': 'coriander', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'cornus canadensis': {'literal_latin': 'Canadian dogwood', 'common_name': 'bunchberry', 'life_form': 'chamaephyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'cornus florida': {'literal_latin': 'flowering dogwood', 'common_name': 'flowering dogwood', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'cornus mas': {'literal_latin': 'male dogwood', 'common_name': 'Cornelian cherry', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cornus sanguinea': {'literal_latin': 'blood-red dogwood', 'common_name': 'common dogwood', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cornus sericea': {'literal_latin': 'silky dogwood', 'common_name': 'red osier dogwood', 'life_form': 'phanerophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'coronilla varia': {'literal_latin': 'variable crown vetch', 'common_name': 'crown vetch', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cortaderia selloana': {'literal_latin': "Sellow's cortaderia", 'common_name': 'pampas grass', 'life_form': 'hemicryptophyte', 'specific_location': 'Argentina', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'corydalis flexuosa': {'literal_latin': 'zigzag corydalis', 'common_name': 'blue corydalis', 'life_form': 'geophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'corylus avellana': {'literal_latin': 'Avella hazel', 'common_name': 'common hazel', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'corylus maxima': {'literal_latin': 'largest hazel', 'common_name': 'filbert', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'bred'},
    'corymbia citriodora': {'literal_latin': 'lemon-scented corymbia', 'common_name': 'lemon-scented gum', 'life_form': 'phanerophyte', 'specific_location': 'Queensland', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural'},
    'corymbia ficifolia': {'literal_latin': 'fig-leaved corymbia', 'common_name': 'red flowering gum', 'life_form': 'phanerophyte', 'specific_location': 'Western Australia', 'general_location': 'Australia', 'hemisphere': 'southern', 'source': 'natural'},
    'cosmos bipinnatus': {'literal_latin': 'twice-feathered cosmos', 'common_name': 'garden cosmos', 'life_form': 'therophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'cosmos sulphureus': {'literal_latin': 'sulfur cosmos', 'common_name': 'sulfur cosmos', 'life_form': 'therophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'costus speciosus': {'literal_latin': 'showy costus', 'common_name': 'crepe ginger', 'life_form': 'hemicryptophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cotinus coggygria': {'literal_latin': 'smoke tree', 'common_name': 'smoke bush', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cotoneaster horizontalis': {'literal_latin': 'horizontal cotoneaster', 'common_name': 'rock cotoneaster', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cotyledon orbiculata': {'literal_latin': 'round-leaved cotyledon', 'common_name': "pig's ear", 'life_form': 'chamaephyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'crassula ovata': {'literal_latin': 'egg-shaped crassula', 'common_name': 'jade plant', 'life_form': 'chamaephyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'crataegus monogyna': {'literal_latin': 'one-seed hawthorn', 'common_name': 'common hawthorn', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'crataegus oxyacantha': {'literal_latin': 'sharp-thorned hawthorn', 'common_name': 'English hawthorn', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'crataegus phaenopyrum': {'literal_latin': 'bright-fruited hawthorn', 'common_name': 'Washington hawthorn', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'crepis rubra': {'literal_latin': 'red hawk\'s-beard', 'common_name': 'pink dandelion', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'crinum asiaticum': {'literal_latin': 'Asian crinum', 'common_name': 'poison bulb', 'life_form': 'geophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'crinum x powellii': {'literal_latin': "Powell's crinum", 'common_name': 'swamp lily', 'life_form': 'geophyte', 'general_location': 'Hybrid origin', 'hemisphere': 'both', 'source': 'bred'},
    'crocosmia x crocosmiiflora': {'literal_latin': 'crocosmia-flowered montbretia', 'common_name': 'montbretia', 'life_form': 'geophyte', 'general_location': 'Hybrid origin', 'hemisphere': 'both', 'source': 'bred'},
    'crocus sativus': {'literal_latin': 'cultivated crocus', 'common_name': 'saffron crocus', 'life_form': 'geophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'crocus vernus': {'literal_latin': 'spring crocus', 'common_name': 'spring crocus', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'crotalaria juncea': {'literal_latin': 'rush-like rattle-pod', 'common_name': 'sunn hemp', 'life_form': 'therophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'croton tiglium': {'literal_latin': 'tick croton', 'common_name': 'purging croton', 'life_form': 'phanerophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cryptomeria japonica': {'literal_latin': 'Japanese hidden part', 'common_name': 'Japanese cedar', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cryptostegia grandiflora': {'literal_latin': 'large-flowered rubber vine', 'common_name': 'rubber vine', 'life_form': 'phanerophyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'cucumis melo': {'literal_latin': 'apple cucumber', 'common_name': 'melon', 'life_form': 'therophyte', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'bred'},
    'cucumis sativus': {'literal_latin': 'cultivated cucumber', 'common_name': 'cucumber', 'life_form': 'therophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'cucurbita maxima': {'literal_latin': 'greatest gourd', 'common_name': 'winter squash', 'life_form': 'therophyte', 'specific_location': 'South America', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'bred'},
    'cucurbita pepo': {'literal_latin': 'melon gourd', 'common_name': 'pumpkin', 'life_form': 'therophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'cuminum cyminum': {'literal_latin': 'cumin', 'common_name': 'cumin', 'life_form': 'therophyte', 'general_location': 'Middle East', 'hemisphere': 'northern', 'source': 'bred'},
    'cupressus sempervirens': {'literal_latin': 'evergreen cypress', 'common_name': 'Mediterranean cypress', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'curcuma longa': {'literal_latin': 'long turmeric', 'common_name': 'turmeric', 'life_form': 'geophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'cuscuta': {'literal_latin': 'dodder', 'common_name': 'dodder', 'life_form': 'therophyte', 'general_location': 'Worldwide', 'hemisphere': 'both', 'source': 'natural'},
    'cyathea cooperi': {'literal_latin': "Cooper's tree fern", 'common_name': 'Australian tree fern', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'cyathea dealbata': {'literal_latin': 'whitened tree fern', 'common_name': 'silver fern', 'life_form': 'phanerophyte', 'specific_location': 'New Zealand', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'cyathea medullaris': {'literal_latin': 'pithy tree fern', 'common_name': 'black tree fern', 'life_form': 'phanerophyte', 'specific_location': 'New Zealand', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'cycas revoluta': {'literal_latin': 'rolled-back cycad', 'common_name': 'sago palm', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cyclamen': {'literal_latin': 'circle flower', 'common_name': 'cyclamen', 'life_form': 'geophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'cydonia oblonga': {'literal_latin': 'oblong Cydonian apple', 'common_name': 'quince', 'life_form': 'phanerophyte', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'cymbidium': {'literal_latin': 'boat-shaped', 'common_name': 'boat orchid', 'life_form': 'epiphyte', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'cymbopogon citratus': {'literal_latin': 'lemon boat-beard', 'common_name': 'lemongrass', 'life_form': 'hemicryptophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'cynara cardunculus': {'literal_latin': 'thistle-like dog', 'common_name': 'cardoon', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'cynara scolymus': {'literal_latin': 'artichoke', 'common_name': 'globe artichoke', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'cynodon dactylon': {'literal_latin': 'finger dog-tooth', 'common_name': 'Bermuda grass', 'life_form': 'hemicryptophyte', 'general_location': 'Africa', 'hemisphere': 'both', 'source': 'natural'},
    'cynoglossum officinale': {'literal_latin': 'medicinal hound\'s tongue', 'common_name': 'hound\'s tongue', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'cyperus papyrus': {'literal_latin': 'papyrus sedge', 'common_name': 'papyrus', 'life_form': 'helophyte', 'specific_location': 'Egypt', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'natural'},
    'cyperus rotundus': {'literal_latin': 'round sedge', 'common_name': 'nutgrass', 'life_form': 'geophyte', 'general_location': 'Worldwide', 'hemisphere': 'both', 'source': 'natural'},
    'cyrtostachys renda': {'literal_latin': 'curved spike palm', 'common_name': 'red sealing wax palm', 'life_form': 'phanerophyte', 'specific_location': 'Malaysia', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'cytisus scoparius': {'literal_latin': 'broom cytisus', 'common_name': 'Scotch broom', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    
    # D
    'daboecia cantabrica': {'literal_latin': 'Cantabrian daboecia', 'common_name': 'Irish heath', 'life_form': 'chamaephyte', 'general_location': 'Western Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'dactylis glomerata': {'literal_latin': 'clustered finger grass', 'common_name': 'cock\'s-foot', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'dahlia': {'literal_latin': 'Dahl\'s flower', 'common_name': 'dahlia', 'life_form': 'geophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'daphne mezereum': {'literal_latin': 'Persian daphne', 'common_name': 'February daphne', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'daphne odora': {'literal_latin': 'fragrant daphne', 'common_name': 'winter daphne', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dasylirion wheeleri': {'literal_latin': 'Wheeler\'s bear grass', 'common_name': 'desert spoon', 'life_form': 'phanerophyte', 'specific_location': 'Arizona', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'datura stramonium': {'literal_latin': 'stinking thorn-apple', 'common_name': 'jimsonweed', 'life_form': 'therophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'daucus carota': {'literal_latin': 'carrot', 'common_name': 'wild carrot', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'bred'},
    'davidia involucrata': {'literal_latin': 'wrapped Davidia', 'common_name': 'handkerchief tree', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'delonix regia': {'literal_latin': 'royal claw', 'common_name': 'royal poinciana', 'life_form': 'phanerophyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'delphinium elatum': {'literal_latin': 'tall larkspur', 'common_name': 'alpine delphinium', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'bred'},
    'dendrobium': {'literal_latin': 'tree-dwelling', 'common_name': 'dendrobium orchid', 'life_form': 'epiphyte', 'general_location': 'Asia', 'hemisphere': 'both', 'source': 'bred'},
    'deschampsia cespitosa': {'literal_latin': 'tufted deschampsia', 'common_name': 'tufted hairgrass', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'deutzia gracilis': {'literal_latin': 'slender deutzia', 'common_name': 'slender deutzia', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dianella tasmanica': {'literal_latin': 'Tasmanian dianella', 'common_name': 'Tasman flax lily', 'life_form': 'hemicryptophyte', 'specific_location': 'Tasmania', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'dianthus barbatus': {'literal_latin': 'bearded god-flower', 'common_name': 'sweet william', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'bred'},
    'dianthus caryophyllus': {'literal_latin': 'clove-scented god-flower', 'common_name': 'carnation', 'life_form': 'chamaephyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'dianthus chinensis': {'literal_latin': 'Chinese god-flower', 'common_name': 'Chinese pink', 'life_form': 'hemicryptophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'dicentra spectabilis': {'literal_latin': 'showy two-spurred', 'common_name': 'bleeding heart', 'life_form': 'hemicryptophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dicksonia antarctica': {'literal_latin': 'Antarctic Dicksonia', 'common_name': 'soft tree fern', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'dictamnus albus': {'literal_latin': 'white dittany', 'common_name': 'burning bush', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'dieffenbachia maculata': {'literal_latin': 'spotted dieffenbachia', 'common_name': 'dumb cane', 'life_form': 'hemicryptophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'digitalis purpurea': {'literal_latin': 'purple foxglove', 'common_name': 'common foxglove', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'digitaria sanguinalis': {'literal_latin': 'blood-red finger grass', 'common_name': 'hairy crabgrass', 'life_form': 'therophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'dillenia indica': {'literal_latin': 'Indian dillenia', 'common_name': 'elephant apple', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dillenia philippinensis': {'literal_latin': 'Philippine dillenia', 'common_name': 'katmon', 'life_form': 'phanerophyte', 'specific_location': 'Philippines', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dimocarpus longan': {'literal_latin': 'dragon eye', 'common_name': 'longan', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dionaea muscipula': {'literal_latin': 'fly trap', 'common_name': 'Venus flytrap', 'life_form': 'hemicryptophyte', 'specific_location': 'North Carolina', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'dioscorea': {'literal_latin': 'Dioscorides\' plant', 'common_name': 'yam', 'life_form': 'geophyte', 'general_location': 'Tropical regions', 'hemisphere': 'both', 'source': 'bred'},
    'diospyros kaki': {'literal_latin': 'divine wheat persimmon', 'common_name': 'Japanese persimmon', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'diospyros lotus': {'literal_latin': 'lotus persimmon', 'common_name': 'date-plum', 'life_form': 'phanerophyte', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'diospyros virginiana': {'literal_latin': 'Virginia persimmon', 'common_name': 'American persimmon', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'dipladenia sanderi': {'literal_latin': 'Sander\'s double-gland', 'common_name': 'Brazilian jasmine', 'life_form': 'phanerophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'dipsacus fullonum': {'literal_latin': 'fuller\'s teasel', 'common_name': 'wild teasel', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'dodonaea viscosa': {'literal_latin': 'sticky hopbush', 'common_name': 'hopbush', 'life_form': 'phanerophyte', 'general_location': 'Worldwide tropics', 'hemisphere': 'both', 'source': 'natural'},
    'dombeya wallichii': {'literal_latin': 'Wallich\'s dombeya', 'common_name': 'pink ball tree', 'life_form': 'phanerophyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'dorstenia contrajerva': {'literal_latin': 'antidote dorstenia', 'common_name': 'contra-yerba', 'life_form': 'hemicryptophyte', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'dracaena draco': {'literal_latin': 'dragon tree', 'common_name': 'dragon tree', 'life_form': 'phanerophyte', 'specific_location': 'Canary Islands', 'general_location': 'Macaronesia', 'hemisphere': 'northern', 'source': 'natural'},
    'dracaena fragrans': {'literal_latin': 'fragrant dragon tree', 'common_name': 'corn plant', 'life_form': 'phanerophyte', 'general_location': 'Tropical Africa', 'hemisphere': 'both', 'source': 'bred'},
    'dracaena marginata': {'literal_latin': 'margined dragon tree', 'common_name': 'Madagascar dragon tree', 'life_form': 'phanerophyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'dracocephalum moldavica': {'literal_latin': 'Moldavian dragonhead', 'common_name': 'Moldavian balm', 'life_form': 'therophyte', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'drimys winteri': {'literal_latin': 'Winter\'s drimys', 'common_name': 'Winter\'s bark', 'life_form': 'phanerophyte', 'specific_location': 'Chile', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'drosera': {'literal_latin': 'dewy', 'common_name': 'sundew', 'life_form': 'hemicryptophyte', 'general_location': 'Worldwide', 'hemisphere': 'both', 'source': 'natural'},
    'dryopteris filix-mas': {'literal_latin': 'male oak fern', 'common_name': 'male fern', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'duranta erecta': {'literal_latin': 'upright duranta', 'common_name': 'golden dewdrop', 'life_form': 'phanerophyte', 'general_location': 'Caribbean', 'hemisphere': 'northern', 'source': 'natural'},
    'durio zibethinus': {'literal_latin': 'civet durian', 'common_name': 'durian', 'life_form': 'phanerophyte', 'specific_location': 'Malaysia', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'dypsis lutescens': {'literal_latin': 'yellowish dypsis', 'common_name': 'areca palm', 'life_form': 'phanerophyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
}

# Additional comprehensive data for E-Z species
additional_data = {
    # E
    'echinacea purpurea': {'literal_latin': 'purple hedgehog', 'common_name': 'purple coneflower', 'life_form': 'hemicryptophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'echinocactus grusonii': {'literal_latin': 'Gruson\'s hedgehog cactus', 'common_name': 'golden barrel cactus', 'life_form': 'chamaephyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'natural'},
    'echinops ritro': {'literal_latin': 'blue hedgehog-face', 'common_name': 'small globe thistle', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'echium candicans': {'literal_latin': 'whitish viper\'s bugloss', 'common_name': 'pride of Madeira', 'life_form': 'phanerophyte', 'specific_location': 'Madeira', 'general_location': 'Macaronesia', 'hemisphere': 'northern', 'source': 'natural'},
    'echium vulgare': {'literal_latin': 'common viper\'s bugloss', 'common_name': 'viper\'s bugloss', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'egeria densa': {'literal_latin': 'dense waterweed', 'common_name': 'Brazilian waterweed', 'life_form': 'hydrophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'eichhornia crassipes': {'literal_latin': 'thick-stalked water hyacinth', 'common_name': 'water hyacinth', 'life_form': 'hydrophyte', 'specific_location': 'Amazon Basin', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'elaeagnus angustifolia': {'literal_latin': 'narrow-leaved oleaster', 'common_name': 'Russian olive', 'life_form': 'phanerophyte', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'elaeagnus umbellata': {'literal_latin': 'umbel-flowered oleaster', 'common_name': 'autumn olive', 'life_form': 'phanerophyte', 'specific_location': 'East Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'elaeis guineensis': {'literal_latin': 'Guinea oil palm', 'common_name': 'African oil palm', 'life_form': 'phanerophyte', 'specific_location': 'West Africa', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'bred'},
    'elaeocarpus angustifolius': {'literal_latin': 'narrow-leaved olive-fruit', 'common_name': 'blue quandong', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'elettaria cardamomum': {'literal_latin': 'cardamom', 'common_name': 'green cardamom', 'life_form': 'hemicryptophyte', 'specific_location': 'Western Ghats', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'eleusine coracana': {'literal_latin': 'crow-like finger millet', 'common_name': 'finger millet', 'life_form': 'therophyte', 'specific_location': 'Ethiopia', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'bred'},
    'elodea canadensis': {'literal_latin': 'Canadian waterweed', 'common_name': 'Canadian pondweed', 'life_form': 'hydrophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'elymus repens': {'literal_latin': 'creeping wild rye', 'common_name': 'couch grass', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'embothrium coccineum': {'literal_latin': 'scarlet embothrium', 'common_name': 'Chilean firebush', 'life_form': 'phanerophyte', 'specific_location': 'Chile', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'emilia coccinea': {'literal_latin': 'scarlet emilia', 'common_name': 'scarlet tassel flower', 'life_form': 'therophyte', 'general_location': 'Tropical Africa', 'hemisphere': 'both', 'source': 'natural'},
    'encephalartos altensteinii': {'literal_latin': 'Altenstein\'s bread-head', 'common_name': 'Eastern Cape blue cycad', 'life_form': 'phanerophyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'ensete ventricosum': {'literal_latin': 'swollen false banana', 'common_name': 'Ethiopian banana', 'life_form': 'phanerophyte', 'specific_location': 'Ethiopia', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'natural'},
    'ephedra sinica': {'literal_latin': 'Chinese ephedra', 'common_name': 'Chinese ephedra', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'epilobium angustifolium': {'literal_latin': 'narrow-leaved willowherb', 'common_name': 'fireweed', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'epipremnum aureum': {'literal_latin': 'golden pothos', 'common_name': 'pothos', 'life_form': 'epiphyte', 'specific_location': 'Solomon Islands', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'bred'},
    'equisetum arvense': {'literal_latin': 'field horsetail', 'common_name': 'field horsetail', 'life_form': 'geophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'eranthis hyemalis': {'literal_latin': 'winter flower', 'common_name': 'winter aconite', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'eremophila glabra': {'literal_latin': 'smooth desert-lover', 'common_name': 'tar bush', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'eremurus': {'literal_latin': 'solitary tail', 'common_name': 'foxtail lily', 'life_form': 'geophyte', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'erica carnea': {'literal_latin': 'flesh-colored heath', 'common_name': 'winter heath', 'life_form': 'chamaephyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'erica cinerea': {'literal_latin': 'grey heath', 'common_name': 'bell heather', 'life_form': 'chamaephyte', 'general_location': 'Western Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'erica tetralix': {'literal_latin': 'cross-leaved heath', 'common_name': 'cross-leaved heath', 'life_form': 'chamaephyte', 'general_location': 'Western Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'erigeron': {'literal_latin': 'early old man', 'common_name': 'fleabane', 'life_form': 'hemicryptophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'eriobotrya japonica': {'literal_latin': 'Japanese woolly cluster', 'common_name': 'loquat', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'eriophorum angustifolium': {'literal_latin': 'narrow-leaved cotton-bearer', 'common_name': 'common cottongrass', 'life_form': 'helophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'erodium cicutarium': {'literal_latin': 'hemlock-like heron\'s bill', 'common_name': 'redstem filaree', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'eruca sativa': {'literal_latin': 'cultivated rocket', 'common_name': 'arugula', 'life_form': 'therophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'eryngium maritimum': {'literal_latin': 'sea holly', 'common_name': 'sea holly', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'erysimum cheiri': {'literal_latin': 'hand-flower', 'common_name': 'wallflower', 'life_form': 'chamaephyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'erythrina crista-galli': {'literal_latin': 'cock\'s comb coral tree', 'common_name': 'cockspur coral tree', 'life_form': 'phanerophyte', 'specific_location': 'Argentina', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'erythronium': {'literal_latin': 'red flower', 'common_name': 'trout lily', 'life_form': 'geophyte', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'escallonia rubra': {'literal_latin': 'red escallonia', 'common_name': 'red escallonia', 'life_form': 'phanerophyte', 'specific_location': 'Chile', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'eschscholzia californica': {'literal_latin': 'Californian Eschscholz flower', 'common_name': 'California poppy', 'life_form': 'therophyte', 'specific_location': 'California', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'eucalyptus camaldulensis': {'literal_latin': 'Camaldoli eucalyptus', 'common_name': 'river red gum', 'life_form': 'phanerophyte', 'specific_location': 'Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'eucalyptus globulus': {'literal_latin': 'globular eucalyptus', 'common_name': 'Tasmanian blue gum', 'life_form': 'phanerophyte', 'specific_location': 'Tasmania', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'eucalyptus gunnii': {'literal_latin': 'Gunn\'s eucalyptus', 'common_name': 'cider gum', 'life_form': 'phanerophyte', 'specific_location': 'Tasmania', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'eucalyptus robusta': {'literal_latin': 'robust eucalyptus', 'common_name': 'swamp mahogany', 'life_form': 'phanerophyte', 'specific_location': 'Eastern Australia', 'general_location': 'Oceania', 'hemisphere': 'southern', 'source': 'natural'},
    'eugenia uniflora': {'literal_latin': 'one-flowered eugenia', 'common_name': 'Surinam cherry', 'life_form': 'phanerophyte', 'specific_location': 'Brazil', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'euonymus alatus': {'literal_latin': 'winged spindle tree', 'common_name': 'burning bush', 'life_form': 'phanerophyte', 'specific_location': 'East Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'euonymus europaeus': {'literal_latin': 'European spindle tree', 'common_name': 'European spindle', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'euonymus fortunei': {'literal_latin': 'Fortune\'s spindle tree', 'common_name': 'wintercreeper', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'eupatorium cannabinum': {'literal_latin': 'hemp-like eupatorium', 'common_name': 'hemp-agrimony', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'euphorbia characias': {'literal_latin': 'stake spurge', 'common_name': 'Mediterranean spurge', 'life_form': 'chamaephyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'natural'},
    'euphorbia milii': {'literal_latin': 'Des Moul\'s spurge', 'common_name': 'crown of thorns', 'life_form': 'chamaephyte', 'specific_location': 'Madagascar', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'euphorbia pulcherrima': {'literal_latin': 'most beautiful spurge', 'common_name': 'poinsettia', 'life_form': 'phanerophyte', 'specific_location': 'Mexico', 'general_location': 'Central America', 'hemisphere': 'northern', 'source': 'bred'},
    'euphorbia tirucalli': {'literal_latin': 'Malabar spurge', 'common_name': 'pencil tree', 'life_form': 'phanerophyte', 'general_location': 'Africa', 'hemisphere': 'both', 'source': 'natural'},
    'exochorda racemosa': {'literal_latin': 'racemed pearl bush', 'common_name': 'common pearlbush', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    
    # F
    'fagopyrum esculentum': {'literal_latin': 'edible beech-wheat', 'common_name': 'buckwheat', 'life_form': 'therophyte', 'general_location': 'Central Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'fagus grandifolia': {'literal_latin': 'large-leaved beech', 'common_name': 'American beech', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'fagus sylvatica': {'literal_latin': 'forest beech', 'common_name': 'European beech', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'fallopia japonica': {'literal_latin': 'Japanese Fallopia', 'common_name': 'Japanese knotweed', 'life_form': 'geophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'fatsia japonica': {'literal_latin': 'Japanese fatsia', 'common_name': 'Japanese aralia', 'life_form': 'phanerophyte', 'specific_location': 'Japan', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'felicia amelloides': {'literal_latin': 'aster-like felicia', 'common_name': 'blue marguerite', 'life_form': 'chamaephyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'natural'},
    'festuca glauca': {'literal_latin': 'blue fescue', 'common_name': 'blue fescue', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'festuca rubra': {'literal_latin': 'red fescue', 'common_name': 'red fescue', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus benghalensis': {'literal_latin': 'Bengal fig', 'common_name': 'banyan tree', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus benjamina': {'literal_latin': 'Benjamin\'s fig', 'common_name': 'weeping fig', 'life_form': 'phanerophyte', 'general_location': 'Southeast Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus carica': {'literal_latin': 'Carian fig', 'common_name': 'common fig', 'life_form': 'phanerophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'ficus elastica': {'literal_latin': 'elastic fig', 'common_name': 'rubber plant', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus lyrata': {'literal_latin': 'lyre-shaped fig', 'common_name': 'fiddle-leaf fig', 'life_form': 'phanerophyte', 'specific_location': 'West Africa', 'general_location': 'Africa', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus pumila': {'literal_latin': 'dwarf fig', 'common_name': 'creeping fig', 'life_form': 'phanerophyte', 'specific_location': 'East Asia', 'general_location': 'Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'ficus religiosa': {'literal_latin': 'sacred fig', 'common_name': 'sacred fig', 'life_form': 'phanerophyte', 'specific_location': 'India', 'general_location': 'South Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'filipendula ulmaria': {'literal_latin': 'elm-leaved dropwort', 'common_name': 'meadowsweet', 'life_form': 'hemicryptophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'fittonia albivenis': {'literal_latin': 'white-veined fittonia', 'common_name': 'nerve plant', 'life_form': 'hemicryptophyte', 'specific_location': 'Peru', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'foeniculum vulgare': {'literal_latin': 'common fennel', 'common_name': 'fennel', 'life_form': 'hemicryptophyte', 'general_location': 'Mediterranean', 'hemisphere': 'northern', 'source': 'bred'},
    'forsythia x intermedia': {'literal_latin': 'intermediate forsythia', 'common_name': 'border forsythia', 'life_form': 'phanerophyte', 'general_location': 'Hybrid origin', 'hemisphere': 'northern', 'source': 'bred'},
    'fortunella': {'literal_latin': 'Fortune\'s orange', 'common_name': 'kumquat', 'life_form': 'phanerophyte', 'specific_location': 'China', 'general_location': 'East Asia', 'hemisphere': 'northern', 'source': 'bred'},
    'fragaria vesca': {'literal_latin': 'small strawberry', 'common_name': 'wild strawberry', 'life_form': 'hemicryptophyte', 'general_location': 'Northern Hemisphere', 'hemisphere': 'northern', 'source': 'natural'},
    'fragaria x ananassa': {'literal_latin': 'pineapple strawberry', 'common_name': 'garden strawberry', 'life_form': 'hemicryptophyte', 'general_location': 'Hybrid origin', 'hemisphere': 'northern', 'source': 'bred'},
    'frangula alnus': {'literal_latin': 'alder buckthorn', 'common_name': 'alder buckthorn', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'franklinia alatamaha': {'literal_latin': 'Altamaha franklinia', 'common_name': 'Franklin tree', 'life_form': 'phanerophyte', 'specific_location': 'Georgia', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'fraxinus americana': {'literal_latin': 'American ash', 'common_name': 'white ash', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'fraxinus excelsior': {'literal_latin': 'tall ash', 'common_name': 'European ash', 'life_form': 'phanerophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'fraxinus ornus': {'literal_latin': 'flowering ash', 'common_name': 'manna ash', 'life_form': 'phanerophyte', 'general_location': 'Southern Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'fraxinus pennsylvanica': {'literal_latin': 'Pennsylvania ash', 'common_name': 'green ash', 'life_form': 'phanerophyte', 'specific_location': 'Eastern United States', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'freesia': {'literal_latin': 'Freese\'s flower', 'common_name': 'freesia', 'life_form': 'geophyte', 'specific_location': 'South Africa', 'general_location': 'Africa', 'hemisphere': 'southern', 'source': 'bred'},
    'fremontodendron californicum': {'literal_latin': 'Californian Fremont tree', 'common_name': 'California flannelbush', 'life_form': 'phanerophyte', 'specific_location': 'California', 'general_location': 'North America', 'hemisphere': 'northern', 'source': 'natural'},
    'fritillaria imperialis': {'literal_latin': 'imperial fritillary', 'common_name': 'crown imperial', 'life_form': 'geophyte', 'general_location': 'Western Asia', 'hemisphere': 'northern', 'source': 'natural'},
    'fritillaria meleagris': {'literal_latin': 'guinea-fowl fritillary', 'common_name': 'snake\'s head fritillary', 'life_form': 'geophyte', 'general_location': 'Europe', 'hemisphere': 'northern', 'source': 'natural'},
    'fuchsia magellanica': {'literal_latin': 'Magellan fuchsia', 'common_name': 'hardy fuchsia', 'life_form': 'phanerophyte', 'specific_location': 'Chile', 'general_location': 'South America', 'hemisphere': 'southern', 'source': 'natural'},
    'furcraea foetida': {'literal_latin': 'stinking furcraea', 'common_name': 'Mauritius hemp', 'life_form': 'chamaephyte', 'general_location': 'Caribbean', 'hemisphere': 'northern', 'source': 'natural'},
}

# Merge all data
plant_db.update(additional_data)

# Process each row with comprehensive data
for idx, row in df.iterrows():
    species = str(row['SPECIES']).lower().strip()
    
    if species and species != 'nan' and species in plant_db:
        data = plant_db[species]
        
        # Fill in all empty fields
        if pd.isna(row['LITERAL LATIN']) or row['LITERAL LATIN'] == '':
            df.at[idx, 'LITERAL LATIN'] = data.get('literal_latin', '')
        
        if pd.isna(row['COMMON NAME']) or row['COMMON NAME'] == '':
            df.at[idx, 'COMMON NAME'] = data.get('common_name', '')
        
        if pd.isna(row['LIFE FORM']) or row['LIFE FORM'] == '':
            df.at[idx, 'LIFE FORM'] = data.get('life_form', '')
        
        if pd.isna(row['SPECIFIC LOCATION']) or row['SPECIFIC LOCATION'] == '':
            df.at[idx, 'SPECIFIC LOCATION'] = data.get('specific_location', '')
        
        if pd.isna(row['GENERAL LOCATION']) or row['GENERAL LOCATION'] == '':
            df.at[idx, 'GENERAL LOCATION'] = data.get('general_location', '')
        
        if pd.isna(row['HEMISPHERE']) or row['HEMISPHERE'] == '':
            df.at[idx, 'HEMISPHERE'] = data.get('hemisphere', '')
        
        if pd.isna(row['SOURCE']) or row['SOURCE'] == '':
            df.at[idx, 'SOURCE'] = data.get('source', '')
        
        if pd.isna(row['NOTES']) or row['NOTES'] == '':
            df.at[idx, 'NOTES'] = data.get('notes', '')
        
        if pd.isna(row['IMAGE']) or row['IMAGE'] == '':
            df.at[idx, 'IMAGE'] = data.get('image', '')

# Clean up and ensure proper formatting
df = df.fillna('')

# For any remaining empty life forms, infer from growth form
for idx, row in df.iterrows():
    if row['LIFE FORM'] == '' and row['GROWTH FORM'] != '':
        growth_form = str(row['GROWTH FORM']).lower()
        if growth_form == 'tree':
            df.at[idx, 'LIFE FORM'] = 'phanerophyte'
        elif growth_form == 'shrub':
            df.at[idx, 'LIFE FORM'] = 'phanerophyte'
        elif growth_form == 'herb':
            df.at[idx, 'LIFE FORM'] = 'hemicryptophyte'
        elif growth_form == 'vine':
            df.at[idx, 'LIFE FORM'] = 'phanerophyte'

# Ensure growth form is standardized
for idx, row in df.iterrows():
    growth_form = str(row['GROWTH FORM']).lower()
    if growth_form in ['tree', 'shrub', 'herb', 'vine']:
        df.at[idx, 'GROWTH FORM'] = growth_form
    elif growth_form in ['na', 'nan', '']:
        df.at[idx, 'GROWTH FORM'] = 'unknown'

# Remove rows without species names
df = df[df['SPECIES'].notna() & (df['SPECIES'] != '')]

# Save the final comprehensive result
df.to_csv('data/enhanced_species_table_complete_final.csv', index=False)
print(f"Final processing complete: {len(df)} rows with comprehensive data")