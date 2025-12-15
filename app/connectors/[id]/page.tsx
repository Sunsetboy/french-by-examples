import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllConnectorIds, getConnectorById } from '@/lib/data';
import { formatCEFRLevel, formatFormality, formatConnectorType } from '@/lib/utils';

interface ConnectorPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const ids = getAllConnectorIds();
  return ids.map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: ConnectorPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const connector = getConnectorById(id);
    return {
      title: `${connector.term} - ${connector.translation} | French by Examples`,
      description: `Learn how to use "${connector.term}" (${connector.translation}) in French. ${connector.description}`,
      keywords: `French, ${connector.term}, French connector, French expression, ${connector.type.join(', ')}`,
    };
  } catch {
    return {
      title: 'Connector Not Found | French by Examples',
    };
  }
}

export default async function ConnectorPage({ params }: ConnectorPageProps) {
  const { id } = await params;

  let connector;
  try {
    connector = getConnectorById(id);
  } catch {
    notFound();
  }

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm">
        <Link href="/connectors" className="text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to all connectors
        </Link>
      </nav>

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            {connector.term}
          </h1>
          <span
            className={`px-3 py-1 rounded text-sm font-semibold ${
              cefrColors[connector.cefrLevel]
            }`}
          >
            {formatCEFRLevel(connector.cefrLevel)}
          </span>
        </div>

        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-6 italic">
          {connector.translation}
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          {connector.type.map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
            >
              {formatConnectorType(type)}
            </span>
          ))}
          <span
            className={`px-3 py-1 rounded-md font-semibold ${
              formalityColors[connector.formality]
            }`}
          >
            {formatFormality(connector.formality)}
          </span>
        </div>

        <p className="text-lg text-gray-700 dark:text-gray-300">
          {connector.description}
        </p>
      </div>

      {/* Usage */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Usage
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {connector.usage}
        </p>
      </div>

      {/* Examples */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Examples
        </h2>
        <div className="space-y-6">
          {connector.examples.map((example, index) => (
            <div
              key={index}
              className="border-l-4 border-blue-500 pl-4 py-2"
            >
              <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {example.french}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                {example.english}
              </p>
              {example.context && (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic">
                  Context: {example.context}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Synonyms */}
      {connector.synonyms && connector.synonyms.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Synonyms & Alternatives
          </h2>
          <div className="flex flex-wrap gap-2">
            {connector.synonyms.map((synonym, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md"
              >
                {synonym}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Notes */}
      {connector.notes && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Important Notes
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            {connector.notes}
          </p>
        </div>
      )}
    </div>
  );
}
