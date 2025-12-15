'use client';

import { useState, useMemo } from 'react';
import { ConnectorCard } from './connector-card';
import { Connector, ConnectorType, CEFRLevel, FormalityLevel } from '@/types/connector';

interface ConnectorsListProps {
  connectors: Connector[];
}

export function ConnectorsList({ connectors }: ConnectorsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<ConnectorType | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel | 'all'>('all');
  const [selectedFormality, setSelectedFormality] = useState<FormalityLevel | 'all'>('all');

  const filteredConnectors = useMemo(() => {
    return connectors.filter((connector) => {
      const matchesSearch =
        searchTerm === '' ||
        connector.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        connector.translation.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === 'all' || connector.type.includes(selectedType);

      const matchesLevel =
        selectedLevel === 'all' || connector.cefrLevel === selectedLevel;

      const matchesFormality =
        selectedFormality === 'all' || connector.formality === selectedFormality;

      return matchesSearch && matchesType && matchesLevel && matchesFormality;
    });
  }, [connectors, searchTerm, selectedType, selectedLevel, selectedFormality]);

  const connectorTypes: (ConnectorType | 'all')[] = [
    'all',
    'cause',
    'consequence',
    'opposition',
    'addition',
    'time',
    'conclusion',
    'example',
    'emphasis',
    'condition',
    'comparison',
  ];

  const cefrLevels: (CEFRLevel | 'all')[] = ['all', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const formalityLevels: (FormalityLevel | 'all')[] = ['all', 'informal', 'neutral', 'formal'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          French Connectors
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Explore {connectors.length} French connectors and expressions with examples
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search connectors..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as ConnectorType | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {connectorTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* CEFR Level Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              CEFR Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as CEFRLevel | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {cefrLevels.map((level) => (
                <option key={level} value={level}>
                  {level === 'all' ? 'All Levels' : level}
                </option>
              ))}
            </select>
          </div>

          {/* Formality Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Formality
            </label>
            <select
              value={selectedFormality}
              onChange={(e) => setSelectedFormality(e.target.value as FormalityLevel | 'all')}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {formalityLevels.map((formality) => (
                <option key={formality} value={formality}>
                  {formality === 'all'
                    ? 'All Formality'
                    : formality.charAt(0).toUpperCase() + formality.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active filters count */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {filteredConnectors.length} of {connectors.length} connectors
          </p>
          {(searchTerm || selectedType !== 'all' || selectedLevel !== 'all' || selectedFormality !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedType('all');
                setSelectedLevel('all');
                setSelectedFormality('all');
              }}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Connectors Grid */}
      {filteredConnectors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConnectors.map((connector) => (
            <ConnectorCard key={connector.id} connector={connector} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No connectors found matching your filters.
          </p>
        </div>
      )}
    </div>
  );
}
