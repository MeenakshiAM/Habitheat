import { useState, useEffect, useCallback } from 'react';
import { Habit, Achievement, Challenge, Mood, HabitTemplate } from '../types';
import { saveHabits, loadHabits, saveAchievements, loadAchievements } from '../utils/storage';
import { checkAchievements } from '../utils/achievements';
import { formatDate } from '../utils/dateUtils';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [moods, setMoods] = useState<Record<string, Mood>>({});
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);

  useEffect(() => {
    const savedHabits = loadHabits();
    const savedAchievements = loadAchievements();
    const savedChallenges = JSON.parse(localStorage.getItem('habit-heat-challenges') || '[]');
    const savedMoods = JSON.parse(localStorage.getItem('habit-heat-moods') || '{}');
    const savedTemplates = JSON.parse(localStorage.getItem('habit-heat-templates') || '[]');
    
    setHabits(savedHabits);
    setAchievements(savedAchievements);
    setChallenges(savedChallenges);
    setMoods(savedMoods);
    setTemplates(savedTemplates);
  }, []);

  const saveToStorage = useCallback((updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    
    // Check for new achievements
    const newAchievs = checkAchievements(updatedHabits, achievements);
    if (newAchievs.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievs];
      setAchievements(updatedAchievements);
      setNewAchievements(newAchievs);
      saveAchievements(updatedAchievements);
      
      // Clear new achievements after 5 seconds
      setTimeout(() => setNewAchievements([]), 5000);
    }
  }, [achievements]);

  const addHabit = useCallback((habitData: Omit<Habit, 'id' | 'createdAt' | 'logs'>) => {
    const newHabit: Habit = {
      ...habitData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      logs: {},
      category: habitData.category || 'General',
      difficulty: habitData.difficulty || 'medium',
      isArchived: false
    };
    
    const updatedHabits = [...habits, newHabit];
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const addHabitFromTemplate = useCallback((template: HabitTemplate) => {
    const newHabit: Habit = {
      id: crypto.randomUUID(),
      name: template.name,
      emoji: template.emoji,
      color: template.color,
      createdAt: new Date().toISOString(),
      logs: {},
      category: template.category,
      difficulty: template.difficulty,
      isArchived: false,
      targetDays: template.targetDays,
      estimatedTime: template.estimatedTime,
      motivationalQuote: template.motivationalQuote
    };
    
    const updatedHabits = [...habits, newHabit];
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  //adding template
  const addTemplate = useCallback((template: HabitTemplate) => {
     const updatedTemplates = [...templates, template];
    setTemplates(updatedTemplates);
    localStorage.setItem('habit-heat-templates', JSON.stringify(updatedTemplates));
  }, [templates]);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    const updatedHabits = habits.map(habit =>
      habit.id === id ? { ...habit, ...updates } : habit
    );
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const deleteHabit = useCallback((id: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== id);
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const archiveHabit = useCallback((id: string, shouldArchive?: boolean) => {
    setHabits(prev => {
      const updated = prev.map(habit =>
        habit.id === id
          ? { ...habit, isArchived: shouldArchive !== undefined ? shouldArchive : !habit.isArchived }
          : habit
      );
      saveHabits(updated);
      return updated;
    });
  }, []);

  const toggleHabitCompletion = useCallback((habitId: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const currentStatus = habit.logs[date];
        let newStatus: boolean | undefined;
        
        if (currentStatus === undefined) {
          newStatus = true; // No log -> completed
        } else if (currentStatus === true) {
          newStatus = false; // Completed -> missed
        } else {
          newStatus = undefined; // Missed -> no log
        }
        
        const updatedLogs = { ...habit.logs };
        if (newStatus === undefined) {
          delete updatedLogs[date];
        } else {
          updatedLogs[date] = newStatus;
        }
        
        return { ...habit, logs: updatedLogs };
      }
      return habit;
    });
    
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const markTodayComplete = useCallback((habitId: string) => {
    const today = formatDate(new Date());
    const habit = habits.find(h => h.id === habitId);
    
    if (habit && habit.logs[today] !== true) {
      toggleHabitCompletion(habitId, today);
    }
  }, [habits, toggleHabitCompletion]);

  const addNote = useCallback((habitId: string, date: string, note: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const updatedNotes = { ...habit.notes };
        if (note.trim()) {
          updatedNotes[date] = note.trim();
        } else {
          delete updatedNotes[date];
        }
        return { ...habit, notes: updatedNotes };
      }
      return habit;
    });
    saveToStorage(updatedHabits);
  }, [habits, saveToStorage]);

  const startChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, isActive: true } : challenge
    );
    setChallenges(updatedChallenges);
    localStorage.setItem('habit-heat-challenges', JSON.stringify(updatedChallenges));
  }, [challenges]);

  const completeChallenge = useCallback((challengeId: string) => {
    const updatedChallenges = challenges.map(challenge =>
      challenge.id === challengeId ? { ...challenge, isActive: false } : challenge
    );
    setChallenges(updatedChallenges);
    localStorage.setItem('habit-heat-challenges', JSON.stringify(updatedChallenges));
  }, [challenges]);

  const addMood = useCallback((mood: Mood) => {
    const updatedMoods = { ...moods, [mood.date]: mood };
    setMoods(updatedMoods);
    localStorage.setItem('habit-heat-moods', JSON.stringify(updatedMoods));
  }, [moods]);

  const dismissAchievement = useCallback((achievementId: string) => {
    setNewAchievements(prev => prev.filter(a => a.id !== achievementId));
  }, []);

  return {
    habits,
    achievements,
    newAchievements,
    challenges,
    moods,
    templates,
    addHabit,
    addHabitFromTemplate,
    addTemplate,
    updateHabit,
    deleteHabit,
    archiveHabit,
    toggleHabitCompletion,
    markTodayComplete,
    addNote,
    startChallenge,
    completeChallenge,
    addMood,
    dismissAchievement
  };
};