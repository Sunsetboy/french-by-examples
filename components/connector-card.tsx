import Link from 'next/link';
import { ConnectorMetadata } from '@/types/connector';
import { formatCEFRLevel, formatFormality, formatConnectorType } from '@/lib/utils';

interface ConnectorCardProps {
  connector: ConnectorMetadata;
}

export function ConnectorCard({ connector }: ConnectorCardProps) {
  const formalityColors = {
    informal: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    neutral: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    formal: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  };

  const cefrColors = {
    A1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    A2: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    B1: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    B2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    C1: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    C2: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };

  return (
    <Link
      href={`/connectors/${connector.id}`}
      className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {connector.term}
        </h3>
        <span
          className={`px-2 py-1 rounded text-xs font-semibold ${
            cefrColors[connector.cefrLevel]
          }`}
        >
          {formatCEFRLevel(connector.cefrLevel)}
        </span>
      </div>

      <p className="text-gray-600 dark:text-gray-300 mb-3 italic">
        {connector.translation}
      </p>

      <div className="flex flex-wrap gap-2 mb-3">
        {connector.type.map((type) => (
          <span
            key={type}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
          >
            {formatConnectorType(type)}
          </span>
        ))}
      </div>

      <div>
        <span
          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
            formalityColors[connector.formality]
          }`}
        >
          {formatFormality(connector.formality)}
        </span>
      </div>
    </Link>
  );
}
