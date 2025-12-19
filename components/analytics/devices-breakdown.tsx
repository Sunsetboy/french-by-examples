import type { DeviceStats } from '@/types/analytics';

interface DevicesBreakdownProps {
  devices: DeviceStats;
}

export function DevicesBreakdown({ devices }: DevicesBreakdownProps) {
  const totalBrowsers = devices.browsers.reduce((sum, b) => sum + b.count, 0);
  const totalDevices = devices.devices.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Devices & Browsers
      </h3>

      <div className="space-y-6">
        {/* Browsers */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Browsers
          </h4>
          <div className="space-y-2">
            {devices.browsers.slice(0, 5).map((browser) => {
              const percentage = totalBrowsers > 0 ? (browser.count / totalBrowsers) * 100 : 0;
              return (
                <div key={browser.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300">{browser.name}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {browser.count.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Device Types */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Device Types
          </h4>
          <div className="space-y-2">
            {devices.devices.map((device) => {
              const percentage = totalDevices > 0 ? (device.count / totalDevices) * 100 : 0;
              return (
                <div key={device.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700 dark:text-gray-300 capitalize">{device.type}</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {device.count.toLocaleString()} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 dark:bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Screen Resolutions */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Top Screen Resolutions
          </h4>
          <div className="space-y-1">
            {devices.screen_sizes.slice(0, 5).map((screen) => (
              <div key={screen.resolution} className="flex justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300 font-mono">{screen.resolution}</span>
                <span className="text-gray-500 dark:text-gray-400">{screen.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
