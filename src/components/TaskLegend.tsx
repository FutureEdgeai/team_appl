import React from 'react';

const taskStatuses = [
  { emoji: '🚧', description: 'Task is still in progress' },
  { emoji: '✅', description: 'Task is completed' },
  { emoji: '🔴', description: 'Task is not completed (add reason)' },
  { emoji: '⏩', description: 'Rescheduled for Later' },
  { emoji: '🎯', description: 'On Track (within ClickUp Deadline)' },
];

export function TaskLegend() {
  return (
    <div className="glass-panel p-4 rounded-lg mb-6">
      <h3 className="text-yellow-400 font-medium mb-3">Task Status Guide</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {taskStatuses.map(({ emoji, description }) => (
          <div key={emoji} className="flex items-center gap-2 text-sm">
            <span className="text-xl">{emoji}</span>
            <span className="text-gray-300">{description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}