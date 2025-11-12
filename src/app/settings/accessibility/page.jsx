'use client';
import { useAccessibility } from '../../contexts/AccessibilityContext';

export default function AccessibilitySettings() {
  const { preferences, updatePreference } = useAccessibility();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
        Accessibility Settings
      </h1>

      <div className="space-y-6">
        {/* Reduced Motion */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Reduce Motion
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Minimize animations and transitions
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.reducedMotion}
              onChange={(e) => updatePreference('reducedMotion', e.target.checked)}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-slate-700 relative cursor-pointer appearance-none transition-colors checked:bg-uw-purple-600"
            />
          </label>
        </div>

        {/* High Contrast */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                High Contrast
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Increase contrast for better readability
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.highContrast}
              onChange={(e) => updatePreference('highContrast', e.target.checked)}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-slate-700 relative cursor-pointer appearance-none transition-colors checked:bg-uw-purple-600"
            />
          </label>
        </div>

        {/* Font Size */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Font Size
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {['sm', 'base', 'lg', 'xl'].map(size => (
              <button
                key={size}
                onClick={() => updatePreference('fontSize', size)}
                className={`
                  py-3 px-4 rounded-lg font-semibold transition-all
                  ${preferences.fontSize === size
                    ? 'bg-uw-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                  }
                `}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Outlines */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-gray-200 dark:border-slate-700">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Enhanced Focus Outlines
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Show prominent focus indicators for keyboard navigation
              </p>
            </div>
            <input
              type="checkbox"
              checked={preferences.focusOutlines}
              onChange={(e) => updatePreference('focusOutlines', e.target.checked)}
              className="w-12 h-6 rounded-full bg-gray-200 dark:bg-slate-700 relative cursor-pointer appearance-none transition-colors checked:bg-uw-purple-600"
            />
          </label>
        </div>
      </div>

      {/* Information Section */}
      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          About Accessibility Settings
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          These settings help make HuskyBids more accessible and comfortable for everyone.
          Your preferences are automatically saved and will persist across sessions.
        </p>
      </div>
    </div>
  );
}
