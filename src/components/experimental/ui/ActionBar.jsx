/**
 * ActionBar - Keyboard shortcut hints bar
 * Displays available keyboard shortcuts at bottom of sections
 * 
 * @example
 * <ActionBar 
 *   actions={[
 *     { key: 'A', label: 'All games' },
 *     { key: 'N', label: 'New bet' },
 *   ]}
 *   helpKey="?"
 * />
 */
'use client';

import Kbd from './Kbd';

export default function ActionBar({ 
  actions = [],
  helpKey = '?',
  showHelp = true,
  className = '',
}) {
  return (
    <div className={`flex items-center justify-between text-xs text-zinc-600 ${className}`}>
      <div className="flex items-center gap-6">
        {actions.map((action) => (
          <span key={action.key}>
            <Kbd size="xs" className="inline-flex mr-2">{action.key}</Kbd>
            {action.label}
          </span>
        ))}
      </div>
      {showHelp && (
        <span className="text-zinc-700">
          <Kbd size="xs" className="inline-flex mr-2">{helpKey}</Kbd>
          Help
        </span>
      )}
    </div>
  );
}
