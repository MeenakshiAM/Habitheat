// src/components/widgets/DailyCompletionRateWidget.tsx

import React from 'react';

// Define the props interface for the component
interface DailyCompletionRateWidgetProps {
  completedHabitsToday: number;
  totalHabitsToday: number;
}

const DailyCompletionRateWidget: React.FC<DailyCompletionRateWidgetProps> = ({ completedHabitsToday, totalHabitsToday }) => {
  const completionPercentage = totalHabitsToday > 0 
    ? Math.round((completedHabitsToday / totalHabitsToday) * 100) 
    : 0; // Handle division by zero

  return (
    // Replaced inline style with Tailwind CSS classes
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-center shadow-md 
                flex flex-col justify-center items-center min-h-[150px]">
      <div className="text-5xl font-bold text-green-500 mb-1"> {/* Adjusted color to a green */}
        {completionPercentage}%
      </div>
      <div className="text-base text-gray-600 dark:text-gray-300">Daily Habits Completed</div>
      {totalHabitsToday > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          ({completedHabitsToday} of {totalHabitsToday})
        </div>
      )}
    </div>
  );
};

export default DailyCompletionRateWidget;