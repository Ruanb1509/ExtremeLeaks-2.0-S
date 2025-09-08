import React, { useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import type { FilterOptions } from '../../types';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClose?: () => void;
  isOpen?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ 
  filters, 
  onFiltersChange, 
  onClose,
  isOpen = true 
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    ethnicity: true,
    physical: false,
    age: false
  });

  const ethnicities = [
    { value: 'arab', label: 'Arab' },
    { value: 'asian', label: 'Asian' },
    { value: 'ebony', label: 'Ebony' },
    { value: 'indian', label: 'Indian' },
    { value: 'latina', label: 'Latina' },
    { value: 'white', label: 'White' }
  ];

  const hairColors = [
    'Blonde', 'Brunette', 'Black', 'Red', 'Auburn', 'Gray', 'Other'
  ];

  const eyeColors = [
    'Blue', 'Brown', 'Green', 'Hazel', 'Gray', 'Amber', 'Other'
  ];

  const bodyTypes = [
    'Slim', 'Athletic', 'Average', 'Curvy', 'Plus Size', 'Muscular'
  ];

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof FilterOptions] !== undefined && 
    filters[key as keyof FilterOptions] !== ''
  );

  if (!isOpen) return null;

  return (
    <div className="bg-dark-200 rounded-lg shadow-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Filter size={18} className="mr-2 text-primary-500" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Clear All
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Ethnicity Filter */}
      <div className="border-b border-dark-100 pb-4">
        <button
          onClick={() => toggleSection('ethnicity')}
          className="flex items-center justify-between w-full text-left text-white font-medium mb-2"
        >
          <span>Ethnicity</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.ethnicity ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.ethnicity && (
          <div className="grid grid-cols-2 gap-2">
            {ethnicities.map(({ value, label }) => (
              <label key={value} className="flex items-center">
                <input
                  type="radio"
                  name="ethnicity"
                  value={value}
                  checked={filters.ethnicity === value}
                  onChange={(e) => updateFilter('ethnicity', e.target.value)}
                  className="mr-2 text-primary-500 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-300">{label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Age Filter */}
      <div className="border-b border-dark-100 pb-4">
        <button
          onClick={() => toggleSection('age')}
          className="flex items-center justify-between w-full text-left text-white font-medium mb-2"
        >
          <span>Age Range</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.age ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.age && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Min Age</label>
              <input
                type="number"
                min="18"
                max="65"
                value={filters.minAge || ''}
                onChange={(e) => updateFilter('minAge', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-white text-sm"
                placeholder="18"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Max Age</label>
              <input
                type="number"
                min="18"
                max="65"
                value={filters.maxAge || ''}
                onChange={(e) => updateFilter('maxAge', e.target.value ? parseInt(e.target.value) : undefined)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-white text-sm"
                placeholder="65"
              />
            </div>
          </div>
        )}
      </div>

      {/* Physical Attributes */}
      <div>
        <button
          onClick={() => toggleSection('physical')}
          className="flex items-center justify-between w-full text-left text-white font-medium mb-2"
        >
          <span>Physical Attributes</span>
          <ChevronDown 
            size={16} 
            className={`transition-transform ${expandedSections.physical ? 'rotate-180' : ''}`}
          />
        </button>
        
        {expandedSections.physical && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hair Color</label>
              <select
                value={filters.hairColor || ''}
                onChange={(e) => updateFilter('hairColor', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-white text-sm"
              >
                <option value="">Any</option>
                {hairColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Eye Color</label>
              <select
                value={filters.eyeColor || ''}
                onChange={(e) => updateFilter('eyeColor', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-white text-sm"
              >
                <option value="">Any</option>
                {eyeColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm text-gray-300 mb-1">Body Type</label>
              <select
                value={filters.bodyType || ''}
                onChange={(e) => updateFilter('bodyType', e.target.value || undefined)}
                className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-white text-sm"
              >
                <option value="">Any</option>
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilterPanel;