import { Habit, Achievement } from '../types';
import { calculateHabitStats } from './habitStats';

export const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'first-habit',
    title: 'Getting Started',
    description: 'Created your first habit',
    icon: '🌱',
    check: (habits: Habit[]) => habits.length >= 1
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Completed a habit for 7 days straight',
    icon: '🔥',
    check: (habits: Habit[]) => habits.some(h => calculateHabitStats(h).currentStreak >= 7)
  },
  {
    id: 'month-master',
    title: 'Month Master',
    description: 'Completed a habit for 30 days straight',
    icon: '👑',
    check: (habits: Habit[]) => habits.some(h => calculateHabitStats(h).currentStreak >= 30)
  },
  {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Achieved 100% completion rate for a habit',
    icon: '💎',
    check: (habits: Habit[]) => habits.some(h => calculateHabitStats(h).completionRate === 100)
  },
  {
    id: 'habit-collector',
    title: 'Habit Collector',
    description: 'Created 5 different habits',
    icon: '📚',
    check: (habits: Habit[]) => habits.length >= 5
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Restarted a habit after missing days',
    icon: '💪',
    check: (habits: Habit[]) => {
      return habits.some(habit => {
        const stats = calculateHabitStats(habit);
        return stats.currentStreak > 0 && stats.missedDays > 0;
      });
    }
  }
];

export const checkAchievements = (habits: Habit[], existingAchievements: Achievement[]): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const existingIds = new Set(existingAchievements.map(a => a.id));

  for (const def of ACHIEVEMENT_DEFINITIONS) {
    if (!existingIds.has(def.id) && def.check(habits)) {
      newAchievements.push({
        id: def.id,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlockedAt: new Date().toISOString()
      });
    }
  }

  return newAchievements;
};