import React from 'react';
import { Moon, Sun, Flame, BarChart3, Trophy, Settings, Target, Smile, BookOpen } from 'lucide-react';
import { Theme, View } from '../types';

interface HeaderProps {
  theme: Theme;
  currentView: View;
  onThemeToggle: () => void;
  onViewChange: (view: View) => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, currentView, onThemeToggle, onViewChange }) => {
  const navItems = [
    { view: 'dashboard' as View, icon: Flame, label: 'Habits' },
    { view: 'insights' as View, icon: BarChart3, label: 'Insights' },
    { view: 'achievements' as View, icon: Trophy, label: 'Achievements' },
    { view: 'challenges' as View, icon: Target, label: 'Challenges' },
    { view: 'mood' as View, icon: Smile, label: 'Mood' },
    { view: 'templates' as View, icon: BookOpen, label: 'Templates' }
  ];

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-10xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Habit Heat
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Track your daily habits
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Navigation */}
            <nav className="hidden lg:flex items-center gap-1 mr-4">
              {navItems.map(({ view, icon: Icon, label }) => (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === view
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden xl:inline">{label}</span>
                </button>
              ))}
            </nav>

            {/* Mobile Navigation */}
            <nav className="flex lg:hidden items-center gap-1 mr-2 overflow-x-auto">
              {navItems.map(({ view, icon: Icon }) => (
                <button
                  key={view}
                  onClick={() => onViewChange(view)}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${
                    currentView === view
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </nav>
            
            <button
              onClick={onThemeToggle}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};