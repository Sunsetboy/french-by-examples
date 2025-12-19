'use client';

export default function AnalyticsDebugPage() {
  const handleTestAuth = async () => {
    const endpoint = process.env.NEXT_PUBLIC_STATS_API_ENDPOINT;
    const apiKey = process.env.NEXT_PUBLIC_ANALYTICS_API_KEY;

    console.log('=== Analytics Debug Info ===');
    console.log('Endpoint:', endpoint || 'NOT SET');
    console.log('API Key:', apiKey ? `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}` : 'NOT SET');
    console.log('API Key Length:', apiKey?.length || 0);

    if (!endpoint || !apiKey) {
      alert('Environment variables not configured!');
      return;
    }

    try {
      const response = await fetch(`${endpoint}/overview`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const text = await response.text();
        console.error('Error Response:', text);
        alert(`Error ${response.status}: ${text}`);
      } else {
        const data = await response.json();
        console.log('Success! Data:', data);
        alert('Authentication successful! Check console for data.');
      }
    } catch (error) {
      console.error('Fetch Error:', error);
      alert(`Fetch failed: ${error}`);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Analytics Debug Tool
        </h1>

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Environment Variables
            </h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 font-mono text-sm">
              <div>
                <strong>STATS_API_ENDPOINT:</strong>{' '}
                {process.env.NEXT_PUBLIC_STATS_API_ENDPOINT ||
                  <span className="text-red-600 dark:text-red-400">NOT SET</span>}
              </div>
              <div>
                <strong>API_KEY:</strong>{' '}
                {process.env.NEXT_PUBLIC_ANALYTICS_API_KEY
                  ? `${process.env.NEXT_PUBLIC_ANALYTICS_API_KEY.substring(0, 8)}...(${process.env.NEXT_PUBLIC_ANALYTICS_API_KEY.length} chars)`
                  : <span className="text-red-600 dark:text-red-400">NOT SET</span>}
              </div>
              <div>
                <strong>ANALYTICS_ENABLED:</strong>{' '}
                {process.env.NEXT_PUBLIC_ANALYTICS_ENABLED || 'NOT SET'}
              </div>
            </div>
          </div>

          <button
            onClick={handleTestAuth}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Test API Authentication
          </button>

          <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">
              Troubleshooting Steps:
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800 dark:text-yellow-300">
              <li>Click "Test API Authentication" and check browser console (F12)</li>
              <li>Verify the API key matches the one set in Cloudflare Worker</li>
              <li>Check that environment variables are set in GitHub repository secrets</li>
              <li>Ensure you rebuilt and redeployed after setting environment variables</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
