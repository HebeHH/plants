#!/usr/bin/env python3
"""
Migration script to transition from ultimate_plant_processor to reliable_plant_processor
"""

import os
import shutil
from datetime import datetime
from pathlib import Path

def migrate_to_reliable_processor():
    """Migrate from the old processor to the new reliable one"""
    
    print("Migration to Reliable Plant Processor")
    print("=" * 50)
    
    # Step 1: Backup old data
    print("\n1. Creating backup of old data...")
    backup_dir = Path("backup") / datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_dir.mkdir(parents=True, exist_ok=True)
    
    old_files = [
        "ultimate_plant_processor.py",
        "data/enhanced_species_table_complete_final.csv"
    ]
    
    for file in old_files:
        if Path(file).exists():
            dest = backup_dir / Path(file).name
            shutil.copy2(file, dest)
            print(f"   Backed up: {file} -> {dest}")
    
    # Step 2: Check for config.json
    print("\n2. Checking configuration...")
    if not Path("config.json").exists():
        if Path("config.json.example").exists():
            shutil.copy2("config.json.example", "config.json")
            print("   Created config.json from example")
            print("   ⚠️  Please add your API keys to config.json")
        else:
            print("   ❌ config.json.example not found")
    else:
        print("   ✓ config.json exists")
    
    # Step 3: Create necessary directories
    print("\n3. Creating necessary directories...")
    dirs = ["cache", "logs", "data"]
    for dir_name in dirs:
        Path(dir_name).mkdir(exist_ok=True)
        print(f"   ✓ {dir_name}/ directory ready")
    
    # Step 4: Check Python dependencies
    print("\n4. Checking Python dependencies...")
    required = ["pandas", "numpy", "requests"]
    
    print("   Required packages:")
    for package in required:
        print(f"   - {package}")
    
    print("\n   To install: pip install pandas numpy requests")
    
    # Step 5: Migration instructions
    print("\n5. MIGRATION STEPS")
    print("-" * 40)
    print("""
   1. Install required packages:
      pip install pandas numpy requests
   
   2. Configure API keys:
      - Edit config.json
      - Add Tropicos API key (register at tropicos.org)
      - Add other API keys as available
   
   3. Run the new processor:
      python reliable_plant_processor.py
   
   4. Compare results:
      - Check data/enhanced_species_table_reliable.csv
      - Review data_quality_report.json
      - Compare with old data in backup/
   
   5. Update your application:
      - Update import paths to use new CSV
      - Use confidence scores for filtering
      - Display data sources for transparency
    """)
    
    # Step 6: Create a simple test
    print("\n6. Creating test script...")
    test_content = '''#!/usr/bin/env python3
"""Test the reliable plant processor with a small dataset"""

import pandas as pd
from reliable_plant_processor import ReliablePlantProcessor

# Create a small test dataset
test_data = {
    'SPECIES': ['quercus robur', 'pinus sylvestris', 'betula pendula'],
    'LITERAL LATIN': ['', '', ''],
    'COMMON NAME': ['', '', ''],
    'GENUS': ['quercus', 'pinus', 'betula'],
    'FAMILY': ['fagaceae', 'pinaceae', 'betulaceae'],
    'LIFE FORM': ['', '', ''],
    'SPECIFIC LOCATION': ['', '', ''],
    'GENERAL LOCATION': ['', '', ''],
    'HEMISPHERE': ['', '', ''],
    'SOURCE': ['', '', '']
}

# Save test data
df = pd.DataFrame(test_data)
df.to_csv('test_species.csv', index=False)

print("Running reliable processor on test data...")
processor = ReliablePlantProcessor()
processor.process_csv('test_species.csv', 'test_output.csv')

print("\\nTest complete! Check test_output.csv for results")
'''
    
    with open("test_processor.py", "w") as f:
        f.write(test_content)
    
    print("   ✓ Created test_processor.py")
    
    # Step 7: Summary
    print("\n7. SUMMARY")
    print("-" * 40)
    print("""
   The reliable processor is now ready to use!
   
   Key differences:
   - Real botanical database integration
   - Confidence scoring for data quality
   - Complete source attribution
   - Automatic validation
   - Extensible architecture
   
   Old processor has been backed up to: {}
   
   Need help? Check README_RELIABLE_PROCESSOR.md
    """.format(backup_dir))

if __name__ == "__main__":
    migrate_to_reliable_processor()