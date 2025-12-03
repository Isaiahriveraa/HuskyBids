'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  SectionLabel,
  DottedDivider,
  Kbd,
  StatCard,
  LoadingScreen,
} from '@/components/experimental';
import { useUserContext } from '../contexts/UserContext';
import { cn } from '@/shared/utils';

/**
 * Minimal Tasks Page
 * Simple checkbox-style daily tasks that award biscuits
 */
export default function TasksPage() {
  const { user, isLoaded } = useUser();
  const { refreshUser } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(null);

  const fetchTaskStatus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/status');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setTasks(data.tasks || []);
      setSummary(data.summary || {});
      setStreak(data.streak || { current: 0 });
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && user) {
      fetchTaskStatus();
    }
  }, [isLoaded, user, fetchTaskStatus]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key) - 1;
        if (tasks[index] && !tasks[index].completed && tasks[index].id === 'daily-login') {
          handleClaimTask(tasks[index]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tasks]);

  const handleClaimTask = async (task) => {
    if (task.completed || claiming) return;
    if (task.id !== 'daily-login') return;

    try {
      setClaiming(task.id);
      const response = await fetch('/api/rewards/daily-login', { method: 'POST' });
      const data = await response.json();

      if (data.success) {
        await refreshUser();
        await fetchTaskStatus();
      }
    } catch (err) {
      console.error('Error claiming task:', err);
    } finally {
      setClaiming(null);
    }
  };

  // Loading state
  if (!isLoaded || loading) {
    return <LoadingScreen message="tasks" />;
  }

  return (
    <div className="py-8 space-y-6 font-mono">
      {/* Header */}
      <div>
        <SectionLabel>Daily Tasks</SectionLabel>
        <p className="text-zinc-600 text-xs mt-1">
          Complete tasks to earn biscuits
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard
          label="Streak"
          value={streak?.current || 0}
          suffix=" days"
          size="sm"
        />
        <StatCard
          label="Completed"
          value={`${summary?.tasksCompleted || 0}/${summary?.totalTasks || 0}`}
          size="sm"
        />
        <StatCard
          label="Earned"
          value={summary?.earnedRewards || 0}
          suffix=" pts"
          size="sm"
        />
      </div>

      <DottedDivider />

      {/* Task List */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <TaskItem
            key={task.id}
            task={task}
            shortcut={String(index + 1)}
            onClaim={() => handleClaimTask(task)}
            claiming={claiming === task.id}
          />
        ))}
      </div>

      {tasks.length === 0 && (
        <div className="py-8 text-center border border-dotted border-zinc-800">
          <p className="text-zinc-600 text-sm">No tasks available</p>
        </div>
      )}

      <DottedDivider />

      {/* Streak Bonus Info */}
      <div className="border border-dotted border-zinc-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-orange-500">🔥</span>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Streak Bonuses</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg text-zinc-400">3+</div>
            <div className="text-[10px] text-zinc-600">days = 1.5x</div>
          </div>
          <div>
            <div className="text-lg text-zinc-400">7+</div>
            <div className="text-[10px] text-zinc-600">days = 2x</div>
          </div>
          <div>
            <div className="text-lg text-zinc-400">30+</div>
            <div className="text-[10px] text-zinc-600">days = 3x</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * TaskItem - Individual task row with checkbox
 */
function TaskItem({ task, shortcut, onClaim, claiming }) {
  const isClaimable = task.id === 'daily-login' && !task.completed;
  const hasProgress = task.target && task.target > 1;

  return (
    <div
      onClick={isClaimable ? onClaim : undefined}
      className={cn(
        'flex items-center gap-4 py-4 px-4 border border-dotted transition-colors',
        task.completed
          ? 'border-zinc-800 bg-zinc-900/30'
          : isClaimable
          ? 'border-zinc-700 hover:border-zinc-500 cursor-pointer'
          : 'border-zinc-800',
        claiming && 'opacity-50 pointer-events-none'
      )}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0">
        {task.completed ? (
          <div className="w-5 h-5 border border-green-600 bg-green-600/20 flex items-center justify-center">
            <span className="text-green-500 text-xs">✓</span>
          </div>
        ) : (
          <div className="w-5 h-5 border border-dotted border-zinc-700" />
        )}
      </div>

      {/* Task Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'text-sm',
            task.completed ? 'text-zinc-600 line-through' : 'text-zinc-300'
          )}>
            {task.name}
          </span>
          {isClaimable && <Kbd size="xs">{shortcut}</Kbd>}
        </div>
        
        {/* Progress bar for multi-step tasks */}
        {hasProgress && !task.completed && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-zinc-600 transition-all"
                style={{ width: `${Math.min(100, (task.progress / task.target) * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-zinc-600 tabular-nums">
              {task.progress}/{task.target}
            </span>
          </div>
        )}
      </div>

      {/* Reward */}
      <div className={cn(
        'flex items-center gap-1 text-sm tabular-nums',
        task.completed ? 'text-zinc-700' : 'text-zinc-400'
      )}>
        <span></span>
        <span>{task.reward} pts</span>
      </div>
    </div>
  );
} 