import React, { useState } from 'react';
import { Plus, Filter, Search, Archive } from 'lucide-react';
import { Habit, SortOption, FilterOption } from '../types';
import { HabitCard } from './HabitCard';
import { QuickActions } from './QuickActions';

interface DashboardProps {
  habits: Habit[];
  onAddHabit: () => void;
  onHabitClick: (habit: Habit) => void;
  onMarkToday: (habitId: string) => void;
  onArchiveHabit: (habitId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  habits,
  onAddHabit,
  onHabitClick,
  onMarkToday,
  onArchiveHabit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showArchived, setShowArchived] = useState(false);

  const activeHabits = habits.filter(h => !h.isArchived);
  const archivedHabits = habits.filter(h => h.isArchived);
  const displayHabits = showArchived ? archivedHabits : activeHabits;

  const filteredAndSortedHabits = displayHabits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchTerm.toLowerCase());
      if (!matchesSearch) return false;

      if (filterBy === 'all') return true;
      
      const today = new Date().toISOString().split('T')[0];
      const completedToday = habit.logs[today] === true;
      const hasLogs = Object.keys(habit.logs).length > 0;
      
      switch (filterBy) {
        case 'active':
          return hasLogs && !completedToday;
        case 'struggling':
          return hasLogs && Object.values(habit.logs).filter(Boolean).length / Object.keys(habit.logs).length < 0.5;
        case 'perfect':
          return hasLogs && Object.values(habit.logs).every(Boolean);
        case 'priority-high':
          return habit.priority === 'high';
        case 'quick':
          return (habit.estimatedTime || 0) <= 15;
        case 'long':
          return (habit.estimatedTime || 0) > 30;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority || 'medium'] || 2) - (priorityOrder[a.priority || 'medium'] || 2);
        case 'time':
          return (a.estimatedTime || 0) - (b.estimatedTime || 0);
        case 'streak':
        case 'completion':
          return 0; // Would need streak/completion calculation
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Quick Actions */}
      {!showArchived && (
        <QuickActions 
          habits={activeHabits}
          onMarkToday={onMarkToday}
          onAddHabit={onAddHabit}
        />
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showArchived ? 'Archived Habits' : 'Your Habits'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {displayHabits.length === 0
              ? showArchived ? 'No archived habits' : 'Start building great habits today'
              : `${displayHabits.length} habit${displayHabits.length !== 1 ? 's' : ''}`
            }
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`p-2 rounded-full transition-colors ${
              showArchived 
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
            title={showArchived ? 'Show active habits' : 'Show archived habits'}
          >
            <Archive className="w-5 h-5" />
          </button>
          
          {!showArchived && (
            <button
              onClick={onAddHabit}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium shadow-sm hover:shadow transition-all"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Habit</span>
            </button>
          )}
        </div>
      </div>

      {!showArchived && displayHabits.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search habits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="created">Sort by Created</option>
            <option value="priority">Sort by Priority</option>
            <option value="time">Sort by Time</option>
            <option value="streak">Sort by Streak</option>
            <option value="completion">Sort by Completion</option>
          </select>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Habits</option>
            <option value="active">Active Today</option>
            <option value="struggling">Struggling</option>
            <option value="perfect">Perfect</option>
            <option value="priority-high">High Priority</option>
            <option value="quick">Quick (≤15min)</option>
            <option value="long">Long (30min)</option>
          </select>
        </div>
      )}

      {filteredAndSortedHabits.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            {showArchived ? (
              <Archive className="w-8 h-8 text-gray-400" />
            ) : (
              <Plus className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {showArchived ? 'No archived habits' : searchTerm ? 'No habits found' : 'No habits yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {showArchived 
              ? 'Archived habits will appear here when you archive them.'
              : searchTerm 
                ? 'Try adjusting your search or filters.'
                : 'Create your first habit to start tracking your daily progress and building consistency.'
            }
          </p>
          {!showArchived && !searchTerm && (
            <button
              onClick={onAddHabit}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium transition-colors"
            >
              Create Your First Habit
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredAndSortedHabits.map((habit) => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onClick={() => onHabitClick(habit)}
              onMarkToday={() => onMarkToday(habit.id)}
              onArchive={() => onArchiveHabit(habit.id)}
              showArchiveButton={!showArchived}
            />
          ))}
        </div>
      )}
    </div>
  );
};