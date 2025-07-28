import React, { useState } from 'react';
import { Leaf, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { TaxonomyValidation } from '@/types';

interface HeaderProps {
  totalSpecies: number;
  onUploadNew?: () => void;
  taxonomyValidation?: TaxonomyValidation;
}

export const Header: React.FC<HeaderProps> = ({ totalSpecies, onUploadNew, taxonomyValidation }) => {
  const [showValidation, setShowValidation] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Leaf className="w-8 h-8 text-green-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Plant Species Dashboard</h1>
            <p className="text-gray-600">{totalSpecies} species loaded</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {taxonomyValidation && (
            <button
              onClick={() => setShowValidation(!showValidation)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                taxonomyValidation.isValid 
                  ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                  : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
              }`}
            >
              {taxonomyValidation.isValid ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertTriangle className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                Data Validation
              </span>
              {showValidation ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
          {onUploadNew && (
            <button
              onClick={onUploadNew}
              className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
            >
              Upload New Data
            </button>
          )}
        </div>
      </div>

      {/* Validation Report Dropdown */}
      {showValidation && taxonomyValidation && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
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

          {taxonomyValidation.hierarchyViolations.length > 0 && (
            <div className="bg-orange-50 rounded-lg p-4 max-h-40 overflow-y-auto">
              <h4 className="font-medium text-orange-700 mb-2">
                Hierarchy Issues ({taxonomyValidation.hierarchyViolations.length})
              </h4>
              <div className="space-y-2 text-sm">
                {taxonomyValidation.hierarchyViolations.slice(0, 5).map((violation, index) => (
                  <div key={index} className="text-orange-600">
                    <span className="font-medium">{violation.type}:</span> {violation.issue}
                  </div>
                ))}
                {taxonomyValidation.hierarchyViolations.length > 5 && (
                  <div className="text-orange-500 italic">
                    ... and {taxonomyValidation.hierarchyViolations.length - 5} more issues
                  </div>
                )}
              </div>
            </div>
          )}

          {taxonomyValidation.isValid && (
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-green-800 text-sm">
                ✅ All taxonomic relationships are consistent!
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};