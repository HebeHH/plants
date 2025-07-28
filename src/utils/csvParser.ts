import Papa from 'papaparse';
import { PlantSpecies } from '@/types';

export const parseCSV = (csvInput: string): Promise<PlantSpecies[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvInput, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        // Clean up headers (remove whitespace)
        const cleanedData = results.data.map((row: any) => {
          const cleanedRow: PlantSpecies = {};
          Object.keys(row).forEach(key => {
            const cleanKey = key.trim();
            cleanedRow[cleanKey] = row[key];
          });
          return cleanedRow;
        });
        
        resolve(cleanedData);
      },
      error: (error: Error) => {
        reject(error);
      }
    });
  });
};