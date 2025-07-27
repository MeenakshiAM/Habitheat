import React, { useEffect, useMemo } from 'react';
import { Trophy, Star, Lock } from 'lucide-react';
import { Achievement, Habit } from '../types';
import { getAchievementsStatus, AchievementStatus, ACHIEVEMENT_DEFINITIONS } from '../utils/achievements';

interface AchievementsViewProps {
  achievements: Achievement[];
  allHabits: Habit[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements = [], allHabits = [] }) => {
  const achievementStatuses = useMemo(() => 
    getAchievementsStatus(allHabits, achievements), 
    [allHabits, achievements]
  );

  const unlockedAchievements = achievementStatuses.filter(status => status.unlockedAt);
  const lockedAchievements = achievementStatuses.filter(status => !status.unlockedAt);

  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievementStatuses.length;
  const progressPercentage = totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0;
  
  const AchievementCard = ({ achievement }: { achievement: AchievementStatus }) => {
    const isUnlocked = !!achievement.unlockedAt;
    
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border transition-all ${
        isUnlocked 
            ? 'border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20' 
            : 'border-gray-100 dark:border-gray-700'
        }`}>
        <div className="flex items-start gap-4">
            <div className={`text-4xl p-3 rounded-xl ${
            isUnlocked 
                ? 'bg-yellow-100 dark:bg-yellow-900' 
                : 'bg-gray-100 dark:bg-gray-700 grayscale'
            }`}>
            {achievement.icon}
            </div>
            
            <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
                <h3 className={`font-semibold ${
                isUnlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                }`}>
                {achievement.title}
                </h3>
                {isUnlocked && <Star className="w-4 h-4 text-yellow-500" />}
            </div>
            
            <p className={`text-sm ${
                isUnlocked ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
            }`}>
                {achievement.description}
            </p>
            
            {isUnlocked && achievement.unlockedAt && (
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                </div>
            )}
            
            {!isUnlocked && achievement.goal > 1 && (
                <div className="w-full mt-3">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(achievement.progress / achievement.goal) * 100}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 text-right mt-1">
                        {achievement.progress} / {achievement.goal}
                    </p>
                </div>
            )}
            </div>
        </div>
        </div>
    );
  }
  
  useEffect(()=>{
    document.title='Habit Heat - Achievements'
  },[])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Achievements
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Celebrate your habit-building milestones
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Progress Overview
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {unlockedCount} of {totalCount} achievements unlocked
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Complete
            </div>
          </div>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {unlockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Unlocked ({unlockedAchievements.length})
            </h3>
            <div className="grid gap-4">
              {unlockedAchievements.map((status) => (
                <AchievementCard key={status.id} achievement={status} />
              ))}
            </div>
          </div>
        )}

        {lockedAchievements.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-gray-400" />
              Locked ({lockedAchievements.length})
            </h3>
            <div className="grid gap-4">
              {lockedAchievements.map((status) => (
                <AchievementCard key={status.id} achievement={status} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};