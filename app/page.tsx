import Link from 'next/link';
import { getAllConnectorMetadata } from '@/lib/data';

export default function Home() {
  const connectors = getAllConnectorMetadata();
  const totalConnectors = connectors.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          French by Examples
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          Master French connectors and expressions through practical examples.
          Make your French more fluent and natural.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/connectors"
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Browse Connectors
          </Link>
          <Link
            href="/tests"
            className="px-8 py-3 bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Take a Test
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
            {totalConnectors}+
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            French Connectors
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
            A1-C2
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            All CEFR Levels
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
            100%
          </div>
          <div className="text-gray-600 dark:text-gray-300">
            Free & Open Source
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Practical Examples
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Learn from real-world usage with detailed examples in context, including English translations.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              CEFR Levels
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Every connector is tagged with its CEFR level (A1-C2) to match your learning stage.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Formality Levels
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Know when to use each expression with clear formality indicators (informal, neutral, formal).
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              Interactive Tests
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice what you learn with interactive tests and get instant feedback.
            </p>
          </div>
        </div>
      </div>

      {/* Open Source Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Open Source & Community Driven
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
          This project is open source and welcomes contributions. Help us grow the collection
          of French connectors and expressions by contributing on GitHub.
        </p>
        <a
          href="https://github.com/yourusername/french-by-examples"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
        >
          Contribute on GitHub
        </a>
      </div>
    </div>
  );
}
