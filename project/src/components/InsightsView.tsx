import React from 'react';
import { TrendingUp, TrendingDown, Calendar, Target, Award, AlertTriangle } from 'lucide-react';
import { Habit } from '../types';
import { generateInsights } from '../utils/insights';

interface InsightsViewProps {
  habits: Habit[];
}

export const InsightsView: React.FC<InsightsViewProps> = ({ habits }) => {
  const insights = generateInsights(habits);

  const StatCard = ({ 
    icon: Icon, 
    title, 
    value, 
    subtitle, 
    trend, 
    color = 'blue' 
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: string;
  }) => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-${color}-100 dark:bg-${color}-900`}>
          <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${
            trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
          }`}>
            {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
             trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
        {title}
      </div>
      {subtitle && (
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          {subtitle}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Insights & Analytics
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Understand your habit patterns and progress over time
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={Target}
          title="Active Habits"
          value={insights.activeHabits}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Avg. Streak"
          value={`${Math.round(insights.averageStreak)}d`}
          color="green"
        />
        <StatCard
          icon={Calendar}
          title="Weekly Trend"
          value={`${insights.weeklyTrend > 0 ? '+' : ''}${Math.round(insights.weeklyTrend)}%`}
          trend={insights.weeklyTrend > 0 ? 'up' : insights.weeklyTrend < 0 ? 'down' : 'neutral'}
          color="purple"
        />
        <StatCard
          icon={Award}
          title="Consistency"
          value={`${Math.round(insights.consistencyScore)}%`}
          color="orange"
        />
      </div>

      {/* Performance Analysis */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Best Performing Habit */}
        {insights.bestPerformingHabit && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Top Performer
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{insights.bestPerformingHabit.habit.emoji}</span>
              <div>
                <div className="font-medium text-gray-900 dark:text-white">
                  {insights.bestPerformingHabit.habit.name}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(insights.bestPerformingHabit.stats.completionRate)}% completion rate
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Current streak: {insights.bestPerformingHabit.stats.currentStreak} days
            </div>
          </div>
        )}

        {/* Day Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Day Performance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Best day:</span>
              <span className="font-medium text-green-600 dark:text-green-400">{insights.bestDay}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Challenging day:</span>
              <span className="font-medium text-red-600 dark:text-red-400">{insights.worstDay}</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Based on last 30 days of activity
            </div>
          </div>
        </div>
      </div>

      {/* Struggling Habits */}
      {insights.strugglingHabits.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Habits That Need Attention
          </h3>
          <div className="grid gap-3">
            {insights.strugglingHabits.slice(0, 3).map((habit) => (
              <div key={habit.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                <span className="text-xl">{habit.emoji}</span>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {habit.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Consider adjusting your approach or setting smaller goals
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          Progress Trends
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Weekly Progress</div>
            <div className={`text-2xl font-bold ${
              insights.weeklyTrend > 0 ? 'text-green-600' : 
              insights.weeklyTrend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {insights.weeklyTrend > 0 ? '+' : ''}{Math.round(insights.weeklyTrend)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              vs. previous week
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Monthly Progress</div>
            <div className={`text-2xl font-bold ${
              insights.monthlyTrend > 0 ? 'text-green-600' : 
              insights.monthlyTrend < 0 ? 'text-red-600' : 'text-gray-600'
            }`}>
              {insights.monthlyTrend > 0 ? '+' : ''}{Math.round(insights.monthlyTrend)}%
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              vs. previous month
            </div>
          </div>
        </div>
      </div>

      {habits.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No insights yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            Start tracking habits to see detailed insights and analytics about your progress.
          </p>
        </div>
      )}
    </div>
  );
};