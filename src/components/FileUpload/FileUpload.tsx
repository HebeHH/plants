import React, { useState } from 'react';
import { Upload, Leaf } from 'lucide-react';
import { PlantSpecies, TaxonomyValidation } from '@/types';
import { parseCSV } from '@/utils/csvParser';

interface FileUploadProps {
  onDataLoaded: (data: PlantSpecies[]) => void;
  taxonomyValidation?: TaxonomyValidation;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, taxonomyValidation }) => {
  const [csvInput, setCsvInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCsvInput(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleSubmit = async () => {
    if (!csvInput.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await parseCSV(csvInput);
      onDataLoaded(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <Leaf className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Plant Species Dashboard</h1>
            <p className="text-gray-600">Upload your CSV data to explore botanical diversity</p>
          </div>

          {taxonomyValidation && (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Taxonomy Validation Report</h3>
              
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Data Completeness</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600">
                      {taxonomyValidation.completeRecords}
                    </div>
                    <div className="text-xs text-gray-600">Complete Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {taxonomyValidation.missingData.clade}
                    </div>
                    <div className="text-xs text-gray-600">Missing Clade</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {taxonomyValidation.missingData.order}
                    </div>
                    <div className="text-xs text-gray-600">Missing Order</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {taxonomyValidation.missingData.family}
                    </div>
                    <div className="text-xs text-gray-600">Missing Family</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {taxonomyValidation.missingData.genus}
                    </div>
                    <div className="text-xs text-gray-600">Missing Genus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-500">
                      {taxonomyValidation.missingData.species}
                    </div>
                    <div className="text-xs text-gray-600">Missing Species</div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-3">Hierarchy Validation</h4>
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`px-4 py-2 rounded-lg font-medium ${
                    taxonomyValidation.isValid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {taxonomyValidation.isValid ? '✓ Hierarchy Valid' : '✗ Hierarchy Issues Found'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {taxonomyValidation.hierarchyViolations.length} violation(s) detected
                  </div>
                </div>
              </div>

              {taxonomyValidation.hierarchyViolations.length > 0 && (
                <div>
                  <h4 className="font-medium text-red-700 mb-3">Hierarchy Violations</h4>
                  <div className="bg-red-50 rounded-lg p-4 max-h-64 overflow-y-auto">
                    <div className="space-y-2">
                      {taxonomyValidation.hierarchyViolations.map((violation, index) => (
                        <div key={index} className="border-b border-red-200 pb-2 last:border-b-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="bg-red-200 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              {violation.type}
                            </span>
                            <span className="font-medium text-red-900">{violation.item}</span>
                          </div>
                          <div className="text-sm text-red-700 ml-2">
                            {violation.issue}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {taxonomyValidation.isValid && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-green-800">
                    ✅ All taxonomic relationships are consistent! Every species belongs to exactly one genus, 
                    every genus to one family, every family to one order, and every order to one clade.
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
                >
                  Choose CSV file
                </label>
                <p className="text-gray-500 text-sm mt-1">or drag and drop your file here</p>
              </div>
            </div>

            <div className="text-center text-gray-500">or</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paste CSV Data
              </label>
              <textarea
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                placeholder="Paste your CSV data here..."
                className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!csvInput.trim() || isLoading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isLoading ? 'Processing...' : 'Create Dashboard'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};