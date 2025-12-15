import Link from 'next/link';
import { getAllTests } from '@/lib/data';
import { formatCEFRLevel } from '@/lib/utils';

export default function TestsPage() {
  const tests = getAllTests();

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
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Practice Tests
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Test your knowledge of French connectors with interactive quizzes
        </p>
      </div>

      {tests.length > 0 ? (
        <div className="space-y-6">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={`/tests/${test.id}`}
              className="block bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {test.title}
                </h2>
                <span
                  className={`px-3 py-1 rounded text-sm font-semibold ${
                    cefrColors[test.cefrLevel]
                  }`}
                >
                  {formatCEFRLevel(test.cefrLevel)}
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {test.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-2">
                  {test.types.map((type) => (
                    <span
                      key={type}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                    >
                      {type}
                    </span>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">
                  {test.questions.length} questions
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-12 rounded-lg shadow-md text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            No tests available yet.
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Check back soon for new practice tests!
          </p>
        </div>
      )}
    </div>
  );
}
