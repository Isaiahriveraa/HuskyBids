'use client';

import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, Button, Badge, LoadingSpinner } from '../Components/ui';
import BiscuitIcon from '../Components/BiscuitIcon';
import ErrorState from '../Components/ErrorState';
import { useUserContext } from '../contexts/UserContext';
import {
  CheckCircle,
  Circle,
  Flame,
  Trophy,
  Target,
  Calendar,
  TrendingUp
} from 'lucide-react';

const TasksPage = () => {
  const { user, isLoaded } = useUser();
  const { refreshUser } = useUserContext();
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState(null);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [claiming, setClaiming] = useState(false);

  const fetchTaskStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/rewards/status');
      if (!response.ok) {
        throw new Error('Failed to fetch task status');
      }
      const data = await response.json();
      setTasks(data.tasks);
      setSummary(data.summary);
      setStreak(data.streak);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && user) {
      fetchTaskStatus();
    }
  }, [isLoaded, user]);

  const handleClaimDailyLogin = async () => {
    try {
      setClaiming(true);
      const response = await fetch('/api/rewards/daily-login', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        // Refresh user data to update biscuit balance
        await refreshUser();
        // Refresh task status
        await fetchTaskStatus();

        alert(`Daily reward claimed! You earned ${data.reward} biscuits! 🎉\nCurrent streak: ${data.streak} days`);
      } else if (data.alreadyClaimed) {
        alert('You have already claimed your daily reward today. Come back tomorrow!');
      } else {
        throw new Error(data.error || 'Failed to claim reward');
      }
    } catch (err) {
      console.error('Error claiming daily login:', err);
      alert('Failed to claim daily reward. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" variant="uw" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <ErrorState
          title="Error Loading Tasks"
          error={error}
          onRetry={fetchTaskStatus}
        />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-uw-purple-900">Daily Tasks & Rewards</h1>
        <p className="text-gray-600 mt-1">Complete tasks to earn biscuits and build your streak</p>
      </div>

      {/* Streak and Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card variant="elevated" className="bg-gradient-to-br from-orange-400 to-red-500 text-white">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Current Streak</p>
                <p className="text-3xl font-bold">{streak?.current || 0} days</p>
              </div>
              <Flame className="w-12 h-12 opacity-80" />
            </div>
            <p className="text-xs opacity-75 mt-2">
              Keep logging in daily to maintain your streak!
            </p>
          </Card.Body>
        </Card>

        <Card variant="elevated">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tasks Completed</p>
                <p className="text-3xl font-bold text-uw-purple-900">
                  {summary?.tasksCompleted || 0}/{summary?.totalTasks || 0}
                </p>
              </div>
              <Trophy className="w-12 h-12 text-uw-gold-500" />
            </div>
          </Card.Body>
        </Card>

        <Card variant="elevated">
          <Card.Body>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earned Today</p>
                <p className="text-3xl font-bold text-green-600 flex items-center gap-1">
                  <BiscuitIcon size={28} />
                  {summary?.earnedRewards || 0}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {summary?.potentialRewards - summary?.earnedRewards || 0} more available
            </p>
          </Card.Body>
        </Card>
      </div>

      {/* Daily Tasks */}
      <div>
        <h2 className="text-2xl font-bold text-uw-purple-900 mb-4">Today's Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              variant="outline"
              className={task.completed ? 'border-green-500 bg-green-50' : ''}
            >
              <Card.Body>
                <div className="flex items-start justify-between mb-3">
                  {task.completed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <Circle className="w-8 h-8 text-gray-400" />
                  )}
                  <Badge variant={task.completed ? 'success' : 'warning'} size="sm">
                    <BiscuitIcon size={14} className="inline mr-1" />
                    +{task.reward}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{task.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{task.description}</p>

                {/* Progress Bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{task.progress}/{task.target}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        task.completed ? 'bg-green-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${Math.min((task.progress / task.target) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                {task.id === 'daily_login' && !task.completed && (
                  <Button
                    onClick={handleClaimDailyLogin}
                    disabled={claiming}
                    variant="primary"
                    size="sm"
                    className="w-full"
                  >
                    {claiming ? 'Claiming...' : 'Claim Reward'}
                  </Button>
                )}

                {task.completed && (
                  <div className="flex items-center justify-center text-green-600 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Completed
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <Card variant="outline" className="bg-purple-50 border-purple-200">
        <Card.Body>
          <div className="flex items-start gap-3">
            <Target className="w-6 h-6 text-purple-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">How to Earn More Biscuits</h3>
              <ul className="list-disc list-inside space-y-1 text-purple-800 text-sm">
                <li>Log in daily to maintain your streak and earn bonus multipliers</li>
                <li>Place strategic bets on UW games to complete daily tasks</li>
                <li>Win bets to earn the biggest daily rewards</li>
                <li>Check back every day - tasks reset at midnight!</li>
              </ul>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Streak Bonus Info */}
      <Card variant="outline" className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <Card.Body>
          <div className="flex items-start gap-3">
            <Flame className="w-6 h-6 text-orange-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-orange-900 mb-2">Streak Bonuses</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-sm">
                  <div className="font-semibold text-orange-800">3-Day Streak</div>
                  <div className="text-orange-700">1.5x daily login bonus</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-orange-800">7-Day Streak</div>
                  <div className="text-orange-700">2x daily login bonus</div>
                </div>
                <div className="text-sm">
                  <div className="font-semibold text-orange-800">Current Bonus</div>
                  <div className="text-orange-700 font-bold">
                    {streak?.current >= 7 ? '2x' : streak?.current >= 3 ? '1.5x' : '1x'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default TasksPage; 